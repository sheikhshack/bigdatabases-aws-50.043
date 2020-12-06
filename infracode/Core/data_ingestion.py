import os
import boto3
from botocore.exceptions import ClientError
import paramiko

##################################################################################

# This file is responsible for handling data ingestion from the production
# databases, both MySQQ and MongoDB, to the analytics cluster

##################################################################################


# This function is responsible for obtaining the IP address of the Master Node of 
# the analytics cluster. Uses boto3 to query the aws profile for the instance that
# acts as the Master Node
# Input(s): boto3 ec2 resource
# Output(s): String of Public IPv4 address of the Master Node

def get_master_node_IP(ec2_res):

    Master_node = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5Analytics-master']}])

    return Master_node.public_ip_address

# This function is responsible for obtaining the IP address of the Master Node of 
# the analytics cluster. Uses boto3 to query the aws profile for the database 
# instances 
# Input(s): boto3 ec2 resource
# Output(s): Dictionary containing IPv4 address for both MySQL and MongoDB

def get_databases_IP(ec2_res):

    MySQL_instance = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5MySQL']}])
    
    Mongo_instance = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5Mongo']}])

    database_IPs = {
        'MySQL': MySQL_instance.public_ip_address,
        'Mongo': Mongo_instance.public_ip_address
    }
    return database_IPs


# This function is responsible for setting up an ssh connection to an 
# instance at a given IP address. Uses paramiko with the RSA key and the 
# IP address to begin a SSH connection 
# Input(s): RSA .pem key file, IPv4 address of instance
# Output(s): paramiko SSHClient object

def setup_ssh_client(key_file, IP_address):
    retry = True
    pem = paramiko.RSAKey.from_private_key_file(key_file)
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    while retry:
        try:
            ssh_client.connect(hostname=IP_address, username='ubuntu', pkey=pem)
            print('Success connect')
            break
        except:
            retry = True

    return ssh_client


# This function is responsible for obtaining the IP address of the Master Node of 
# the analytics cluster. Uses boto3 to query the aws profile for the database 
# instances 
# Input(s): RSA .pem key file, master node IP address, MySQL database IP address, Mongo database IP address
# Output(s): NIL

def cluster_data_ingestion(key_file,Master_node_IP,MySQL_IP,Mongo_IP):
    # TODO: Prep data ingestion and move to dropbox
    data_ingestion_routine = "wget -qO - https://www.dropbox.com/s/2c7gpdj1v9b6wkj/data_ingestion.sh | bash -s {0} {1}".format(MySQL_IP,Mongo_IP)
    
    master_client = setup_ssh_client(key_file,Master_node_address)
    stdin, stdout, stderr = master_client.exec_command(data_ingestion_routine)
    stdout.read().decode('utf=8')
    error = stderr.read().decode('utf=8')
    master_client.close()
    print('Data ingestion complete')
    print('Analytics cluster ready for use')


# This function puts together all the helper functions above into an accessible function for export
# Input(s): RSA .pem key file
# Output(s): NIL

def ingest_data(key_file):

    ec2_res = boto3.resource('ec2')  # TODO: Johnson this one is the high level API version

    master_node_IP = get_master_node_IP(ec2_res)
    database_IPs = get_databases_IP(ec2_res)

    cluster_data_ingestion(key_file,master_node_IP,database_IPs['MySQL'],database_IPs['Mongo'])
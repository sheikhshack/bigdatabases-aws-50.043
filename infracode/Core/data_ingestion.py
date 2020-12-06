import os
import boto3
from botocore.exceptions import ClientError
import paramiko


##################################################################################

# This file is responsible for handling data ingestion from the production
# databases, both MySQQ and MongoDB, to the analytics cluster

##################################################################################

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


# This function is responsible for obtaining the IP address of the Master Node of
# the analytics cluster. Uses boto3 to query the aws profile for the instance that
# acts as the Master Node
# Input(s): boto3 ec2 resource
# Output(s): String of Public IPv4 address of the Master Node

def get_master_node_IP(ec2_res):
    Master_node = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5Analytics-master']}])

    master_ip = list(map(lambda x: x.public_ip_address, Master_node))
    master_ip = [i for i in master_ip if i]
    master_ip = master_ip[0]
    print(bcolors.HEADER + 'Master Node found at {}'.format(master_ip) + bcolors.ENDC)

    return master_ip


# This function is responsible for obtaining the IP address of the Master Node of
# the analytics cluster. Uses boto3 to query the aws profile for the database 
# instances 
# Input(s): boto3 ec2 resource
# Output(s): Dictionary containing IPv4 address for both MySQL and MongoDB

def get_databases_IP(ec2_res):
    MySQL_instance = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5MySQL']}])

    mysql_ip = list(map(lambda x: x.private_ip_address, MySQL_instance))
    mysql_ip = [i for i in mysql_ip if i]
    mysql_ip = mysql_ip[0]

    print(bcolors.HEADER + 'MySQL server found at {}'.format(mysql_ip) + bcolors.ENDC)

    Mongo_instance = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5Mongo']}])

    mongo_ip = list(map(lambda x: x.private_ip_address, Mongo_instance))
    mongo_ip = [i for i in mongo_ip if i]
    mongo_ip = mongo_ip[0]
    print(bcolors.HEADER + 'Mongo server found at {}'.format(mongo_ip) + bcolors.ENDC)

    database_IPs = {
        'MySQL': mysql_ip,
        'Mongo': mongo_ip
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
            ssh_client.connect(hostname=IP_address, username='ec2-user', pkey=pem)
            print('Success connect')
            break
        except:
            retry = True
    print("SSHed in successfully into node")
    return ssh_client


# This function is responsible for obtaining the IP address of the Master Node of 
# the analytics cluster. Uses boto3 to query the aws profile for the database 
# instances 
# Input(s): RSA .pem key file, master node IP address, MySQL database IP address, Mongo database IP address
# Output(s): NIL

def cluster_data_ingestion(key_file, master_node_ip, mysql_ip, mongo_ip):
    # TODO: Prep data ingestion and move to dropbox
    print('Ingesting mysql', mysql_ip, 'and mongo', mongo_ip)
    data_ingestion_routine = "wget -qO - https://www.dropbox.com/s/0bbjoroaaij57oy/data_ingestion.sh| bash -s {0} {1}".format(
        mysql_ip, mongo_ip)

    print(bcolors.HEADER + "Data ingestion in progress \n" + bcolors.ENDC)
    master_client = setup_ssh_client(key_file, master_node_ip)
    stdin, stdout, stderr = master_client.exec_command(data_ingestion_routine)
    stdout.read().decode('utf=8')
    error = stderr.read().decode('utf=8')
    master_client.close()
    print(bcolors.HEADER + "Data ingestion job completed\n" + bcolors.ENDC)


# This function puts together all the helper functions above into an accessible function for export
# Input(s): RSA .pem key file
# Output(s): NIL

def ingest_data(key_file):
    ec2_res = boto3.resource('ec2')

    master_node_IP = get_master_node_IP(ec2_res)
    database_IPs = get_databases_IP(ec2_res)

    cluster_data_ingestion(key_file, master_node_IP, database_IPs['MySQL'], database_IPs['Mongo'])

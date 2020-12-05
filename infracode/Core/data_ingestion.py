import os
import boto3
from botocore.exceptions import ClientError
import paramiko


def get_master_node_IP():

    Master_node = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5Analytics-master']}])

    return Master_node.public_ip_address


def get_databases_IP():

    MySQL_instance = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5MySQL']}])
    
    Mongo_instance = ec2_res.instances.filter(
        Filters=[{'Name': 'tag:Name', 'Values': ['GP5Mongo']}])

    database_IPs = {
        'MySQL': MySQL_instance.public_ip_address,
        'Mongo': Mongo_instance.public_ip_address
    }
    return database_IPs


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

def ingest_data(key_file):

    master_node_IP = get_master_node_IP()
    database_IPs = get_databases_IP()

    cluster_data_ingestion(key_file,master_node_IP,database_IPs['MySQL'],database_IPs['Mongo'])
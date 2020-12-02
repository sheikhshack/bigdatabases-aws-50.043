import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import sys
from time import sleep

cluster_name =sys.argv[1]

# TODO: Sheikh, should we give a sleep here to ensure that all the instances are in a running state.
# Not too sure if we should since flintrock installs Spark and stuff, so I assume it will be running for sure.


ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2')

def get_masternode_IP(master_name):
    filters = [{  
        'Name': 'tag:Name',
        'Values': [master_name]
        }]
    reservations = ec2.describe_instances(Filters=filters)
    # print(filtered_nodes['Reservations']['Instances'])

    for reservation in reservations['Reservations']:                # This gives a list
        # if len(reservation['Instances']):
        if len(reservation['Instances']) == 1:
            master_node_IP = reservation['Instances'][0]['PublicIpAddress']
            master_node_key_name = reservation['Instances'][0]['KeyName']
            print("Master node found running on {}".format(master_node_IP))
            print("Master node using {} key file".format(master_node_key_name))
            return {
                "IP":master_node_IP, 
                "KeyName":master_node_key_name
                }
        elif len(reservation['Instances']) == 0: 
            print("No master node was created\nPossbile errors are:\n1.Incorrect instance name\n2.Incorrect JSON handling")
            exit()
        elif len(reservation['Instances']) >= 1:
            print("More than one master node found. Please terminate all previous instances and re-run analytics")
            exit()

def setup_ssh_client(key_file, IP_address):
    print('Using key file ', key_file)
    pem = paramiko.RSAKey.from_private_key_file(key_file)
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh_client.connect(hostname=IP_address, username='ec2-user', pkey=pem)
    print("SSH connection successful, client connection ready for use")
    return ssh_client

############## Phase 0: Sorting out master node name ##################
master_node_name = cluster_name+"-master"
print(master_node_name)

############## Phase 1: Searching for master node and obtaining respective IP address ##################
print("Attempting to obtain Master Node's IP address")
master_node_details = get_masternode_IP(master_node_name)
# print("Master node details obtained")
# print("Master node IP: {} \nMaster key usedd: {}".format(master_node_details["IP"],master_node_details["KeyName"]))

############## Phase 2: Attempting to establish ssh connection to master node ##################
master_ssh_client = setup_ssh_client(master_node_details["KeyName"]+'.pem',master_node_details["IP"])

# Closing connection for safety
master_ssh_client.close()
print("closing ssh conneciton for safety")

############## Phase 3: Ingest data from SQL database ##################

# stdin , stdout, stderr = master_ssh_client.exec_command('wget -O - https://www.dropbox.com/s/dv8rsslh47eynfd/SQL_Ingestion.sh | bash')
# print(stdout.read().decode('utf=8'))
# print( "Errors")
# print(stderr.read().decode('utf=8'))

############## Phase 4: Ingest data from Mongo database ##################

# TODO: Continue with sqoop data ingestion here.
# Thinking of using the instance name to get MySQL and Mongo IP addresses for ingestion
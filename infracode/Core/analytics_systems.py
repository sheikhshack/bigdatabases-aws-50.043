import os
import boto3
from botocore.exceptions import ClientError
import paramiko


# Aesthetics
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

    return ssh_client


def perform_analytics(key_file, master_node_IP, analyse_mode, vocab_size):
    data_analytics_routine = "wget -qO - https://www.dropbox.com/s/5s3nrwgrduxt72v/run_analytics.sh | bash -s {0} {1}".format(
        analyse_mode, vocab_size)

    print(bcolors.HEADER + "Executing analytics scripts with the following configs\n"
                           "   - Analytics mode : {0}\n"
                           "   - Vocab size : {1}\n".format(analyse_mode, vocab_size) + bcolors.ENDC)

    analytics_client = setup_ssh_client(key_file, master_node_IP)
    stdin, stdout, stderr = analytics_client.exec_command(data_analytics_routine)
    stdout.read().decode('utf=8')
    error = stderr.read().decode('utf=8')
    print(stdout.read().decode('utf=8'))
    print(error)
    analytics_client.close()
    print(bcolors.HEADER + "Data analytics job completed\n" + bcolors.ENDC)
    print(bcolors.OKBLUE + "Access data via SSH with key {0} using ec2-user@{1}\n".format(key_file, master_node_IP) + bcolors.ENDC)
    print(bcolors.OKBLUE + "Directory of results is /home/ec2-user/analytics_output/".format(key_file, master_node_IP) + bcolors.ENDC)


def analyse_data(key_file, analyse_mode, vocab_size=20):
    ec2_res = boto3.resource('ec2')
    master_node_IP = get_master_node_IP(ec2_res)

    perform_analytics(key_file, master_node_IP, analyse_mode, vocab_size)


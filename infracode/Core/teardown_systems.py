import os
import boto3
from botocore.exceptions import ClientError
import paramiko
import os
from time import sleep


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


# Inits the session via hidden aws file
ec2 = boto3.client('ec2')
ec2_res = boto3.resource('ec2')  # TODO: Johnson this one is the high level API version
response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')


def get_related_instances(key_name):
    instances = ec2_res.instances.filter(
        Filters=[{'Name': 'instance-state-name', 'Values': ['running', 'pending']},
                 {'Name': 'key-name', 'Values': [key_name]}])

    verified_instance = list(map(lambda x: x.id, instances))
    return verified_instance


def teardown_production_systems(active_instances):
    ec2_res.instances.filter(InstanceIds=active_instances).terminate()
    return True


def main_full(SSH_KEY_NAME):
    # Tearing down based on keyname
    print(bcolors.HEADER + '-- GP5 Teardown Script: Retrieving production related instances' + bcolors.ENDC)
    related_instances = get_related_instances(SSH_KEY_NAME)
    print('Found the following instances: ', related_instances)
    print('Torn down status: ', teardown_production_systems(related_instances))
    print(bcolors.HEADER + '-- GP5 Teardown Script: Torn down all production instances' + bcolors.ENDC)

def main_analytics_only():
    pass


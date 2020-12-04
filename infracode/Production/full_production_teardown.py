import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os
from time import sleep



# Inits the session via hidden aws file
ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2')  # TODO: Johnson this one is the high level API version
response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')


def get_related_instances(key_name):
    instances = ec2_res.instances.filter(
        Filters=[{'Name': 'instance-state-name', 'Values': ['running', 'pending']}, {'Name': 'key-name', 'Values': [key_name]}])

    verified_instance = list(map(lambda x: x.id, instances))
    return verified_instance


def teardown_production_systems(active_instances):
    ec2_res.instances.filter(InstanceIds=active_instances).terminate()
    return True


def main(SSH_KEY_NAME):
    # Tearing down based on keyname
    related_instances = get_related_instances(SSH_KEY_NAME)
    print(related_instances)
    print(teardown_production_systems(related_instances))



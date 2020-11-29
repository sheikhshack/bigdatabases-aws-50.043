import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import sys

given_key_name ='Grp5cluster_1'

ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2')

def init_ssh_key(key_name):
    # Key Pairs - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-key-pairs.html
    try:
        curr_key = ec2.describe_key_pairs(KeyNames=[key_name])
        print('\nKey Pair found. Moving Forwards .....')

    except ClientError:  # means it doesnt exit
        print('\nKey Pair not found. Creating .....')
        curr_key = ec2_res.create_key_pair(KeyName=key_name)
        with open('{}.pem'.format(key_name), 'w') as keywriter:
            keywriter.write(curr_key.key_material)
        os.chmod(key_name + '.pem', 0o400)
        print('Key Created with fingerprint: ', curr_key.key_fingerprint)

init_ssh_key(given_key_name)
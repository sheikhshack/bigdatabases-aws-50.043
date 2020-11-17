import os
import boto3
import botostubs
import boto3_type_annotations

# Inits the session via hidden aws file
session = boto3.Session(profile_name='default')
ec2 = boto3.client('ec2')
iam = boto3.client('iam')
# Security group
# https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
def init_security_groups():
    pass

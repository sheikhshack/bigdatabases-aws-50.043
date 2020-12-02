import os
import boto3
from botocore.exceptions import ClientError
import paramiko
import os, sys, threading
from time import sleep

SECURITY_DEFAULTS = {
    'FLINTROCK': {
        'Policy': [
            {'IpProtocol': 'tcp',
             'FromPort': 9000,
             'ToPort': 9000,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
            {'IpProtocol': 'tcp',
             'FromPort': 9864,
             'ToPort': 9871,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
        ],
        'Description': '50.043 GP5: flintrock configurations',
        'Name': 'flintrock'
    }
}

ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2')
response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')


def create_security_groups_aws(security_detail):
    # Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
    security_group_id = None
    try:
        response_sec = ec2.create_security_group(GroupName=security_detail['Name'],
                                                 Description=security_detail['Description'],
                                                 VpcId=vpc_id)
        security_group_id = response_sec['GroupId']
        print('Security Group Created %s for group %s.' % (security_group_id, security_detail['Name']))

        # Ingress security group
        data = ec2.authorize_security_group_ingress(GroupId=security_group_id,
                                                    IpPermissions=security_detail['Policy'])
        print('Ingress Successfully Set %s' % data)
        return security_group_id

    except ClientError as e:
        print(e)
        return security_group_id

############## Phase 1: Sorting out security groups ##################
create_security_groups_aws(SECURITY_DEFAULTS['FLINTROCK'])

############## Phase 2: Run flintrock command for cluster bringup ##################

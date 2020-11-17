import os
import botostubs
import boto3
from botocore.exceptions import ClientError

# Defaults
UBUNTU_AMI_ID = 'ami-0f82752aa17ff8f5d' # Default Ubuntu 16.04 for US-East region
SECURITY_PERMISSIONS = {
    'Server': [
        {'IpProtocol': 'tcp',
         'FromPort': 80,
         'ToPort': 80,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        {'IpProtocol': 'tcp',
         'FromPort': 22,
         'ToPort': 22,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
    ],
    'Mongo': [
        {'IpProtocol': 'tcp',
         'FromPort': 27017,
         'ToPort': 27017,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        {'IpProtocol': 'tcp',
         'FromPort': 22,
         'ToPort': 22,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
    ],
    'MySQL': [
            {'IpProtocol': 'tcp',
             'FromPort': 3306,
             'ToPort': 3306,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
            {'IpProtocol': 'tcp',
             'FromPort': 22,
             'ToPort': 22,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
        ]
}
SERVER_GROUP = 'SECURITY_GROUP_SERVER'




############## Phase 1: Sorting out secuirity groups ##################
# Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
# def init_security_groups():
# Inits the session via hidden aws file
# session = boto3.Session(profile_name='default')
ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2')
# response = ec2.describe_vpcs()
# vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')
#
# try:
#     response = ec2.create_security_group(GroupName=SERVER_GROUP,
#                                          Description='For the React App + Server Deployment',
#                                          VpcId=vpc_id)
#     security_group_id = response['GroupId']
#     print('Security Group Created %s in vpc %s.' % (security_group_id, vpc_id))
#
#     # Ingress security group
#     data = ec2.authorize_security_group_ingress(GroupId=security_group_id,
#                                                 IpPermissions=SECURITY_PERMISSIONS['Server'])
#     print('Ingress Successfully Set %s' % data)
#
# except ClientError as e:
#     print(e)

############## Phase 2: Sorting out key pairs for SSH ##################
# Key Pairs - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-key-pairs.html
key_name_provided = 'BOTO_TEST_RUN'
try:
    print('\nKey Pair found. Moving Forwards .....')
    curr_key = ec2.describe_key_pairs(KeyNames=[key_name_provided])
except ClientError:  # means it doesnt exit
    print('\nKey Pair not found. Creating .....')
    curr_key = ec2.create_key_pair(KeyName=key_name_provided)
    with open('{}.pem'.format(key_name_provided), 'w') as keywriter:
        keywriter.write(curr_key.key_material)
    print('Key Created with fingerprint: ', curr_key.key_fingerprint)


############## Phase 3: Firing off the instances ##################
# Managing EC2 Instances - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-managing-instances.html
# Additonal Docs - https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Subnet.create_instances
# The following are Subnet class instances for provisioning (from docs)
webserver_instance = ec2_res.create_instances(
    ImageId=UBUNTU_AMI_ID,
    InstanceType='t2.medium',
    SecurityGroups=[SERVER_GROUP],
    MaxCount=1,
    MinCount=1,
    KeyName=key_name_provided
)

print('{}: Provisioning and setting up instance'.format(webserver_instance[0].id))
webserver_instance[0].wait_until_exists()
print('{}: Server setted up and provisioned. Awaiting Run'.format(webserver_instance[0].id))
webserver_instance[0].wait_until_running()
print('{}: Success! Server running and ready!'.format(webserver_instance[0].id))

############## Phase 4: Allocating and Assigning Elastic IPs (asked prof) ##################





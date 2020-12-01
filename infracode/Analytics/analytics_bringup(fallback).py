import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os
from time import sleep

# Defaults
UBUNTU_AMI_ID = 'ami-00ddb0e5626798373'  # Default Ubuntu 18.04 for US-East region
SECURITY_PERMISSIONS = {
    'AnalyticsSecurity': [
            {'IpProtocol': 'tcp',
             'FromPort': 80,
             'ToPort': 80,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
             {'IpProtocol': 'tcp',
             'FromPort': 9000,
             'ToPort': 9000,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
             {'IpProtocol': 'tcp',
             'FromPort': 50070,
             'ToPort': 50070,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
             {'IpProtocol': '-1',
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
            {'IpProtocol': 'tcp',
             'FromPort': 22,
             'ToPort': 22,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
             {'IpProtocol': 'tcp',
             'FromPort': 3306,
             'ToPort': 3306,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}

        ]
}

instance_configs = {
    "Type": "t2.medium", # t2.xlarge
    "SecurityGroup":"HadoopSecurity",
    "Storage": [{"DeviceName": "/dev/sda1","Ebs" : { "VolumeSize" : 32 }}]
}

SSH_KEY_NAME = 'ANALYTICSTESTKEY'

# Change session variables according to educate creds.
# session = boto3.Session(
#     aws_access_key_id="ASIA4GA3HFDIHPBM6YN5",
#     aws_secret_access_key="d00nebDEuwVeqe7c/Yqz9xqUQHShcOGZxsLInHeM",
#     aws_session_token="FwoGZXIvYXdzECgaDDreuhrhVngcW0czbiLNAaxBDgkSIScb0HKsTISTfpx6WK/btFiS2o28zJsh8dGGVU8rusLUyN6j3bwRmmVFDTwLs5b5HhioC1M+UJuPcnL0ySMU7/UrULfCweoDN0Kye503QYvBOWV8pSCr6TsANQcqau/ujo7rFmGty1IUD97puaGa6TDas5YfU/lJE/whJkKvYsMqk5mLeolEN4g58ZZnANAEBUEovg9zwE8MBsMGfh3BsKLo1r1qM7xxHDsrOBUQmnirh1tQmkbj9Hsv0qifmWpSr+JTqHerwFso6crk/QUyLWzwvRDIqVOQQXrIbL9FW9BqKUABzJG4eP4TcgbsFXt4n5wxB3lcxPIUZLmRIA==",
#     region_name="us-east-1"
# )
# ec2 = session.client('ec2')
# ec2_res = session.resource('ec2')

# Inits the session via hidden aws file
ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2')  # TODO: Johnson this one is the high level API version
response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')


########## Helper functions ##########
# From https://gist.github.com/batok/2352501
def setup_ssh_client(key_file, IP_address):
    print('Using key file ', key_file)
    pem = paramiko.RSAKey.from_private_key_file(key_file)
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh_client.connect(hostname=IP_address, username='ubuntu', pkey=pem)
    return ssh_client


def create_security_groups_aws(group_name, description):
    # Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
    security_group_id = None
    try:
        response_sec = ec2.create_security_group(GroupName=group_name,
                                             Description=description,
                                             VpcId=vpc_id)
        security_group_id = response_sec['GroupId']
        print('Security Group Created %s for group %s.' % (security_group_id, group_name))

        # Ingress security group

        data = ec2.authorize_security_group_ingress(GroupId=security_group_id,
                                                    IpPermissions=SECURITY_PERMISSIONS[group_name])
        print('Ingress Successfully Set %s' % data)
        return security_group_id

    except ClientError as e:
        print(e)
        return security_group_id

def get_existing_subnet():
#     subnet = ec2_res.create_subnet(CidrBlock = '172.31.64.0/20', VpcId= vpc_id)
    response = ec2.describe_subnets()
    subnet = response.get('Subnets', [{}])[0].get('SubnetId', '')
    return subnet



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

def fire_off_instances(subnet_id, key_name, num_slaves):
    # Managing EC2 Instances - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-managing-instances.html
    # Additional Docs - https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Subnet.create_instances
    # Using create_instances with ec2_res allows all instances to be deployed in the same subnet by default
    initiated_instances = []
    for instances in range(num_slaves+1):
        curr_instance = ec2_res.create_instances(
            ImageId=UBUNTU_AMI_ID,
            InstanceType=instance_configs['Type'],  # 't2.small'
            SecurityGroups=instance_configs['SecurityGroup'],
            BlockDeviceMappings=instance_configs['Storage'],
            MaxCount=1,
            MinCount=1,
            KeyName=key_name
        )
        initiated_instances.append(curr_instance[0])
    return initiated_instances

def report_instances(instances):
    for instance in instances:
        print('{}: Provisioning and setting up instance'.format(instance.id))
        instance.wait_until_exists()
        print('{}: Server setted up and provisioned. Awaiting Run'.format(instance.id))
        instance.wait_until_running()
        print('{}: Success! Server running and ready!'.format(instance.id))
        instance.load()
        print('{0}: Success! Server currently on IP address {1}'.format(instance.id,instance.public_dns_name))
    return instances

############## Phase 0: Gather creds and number of slaves ##################
num_data_nodes = 3


############## Phase 1: Sorting out security groups ##################
# TODO: Test --------- Done, NO ISSUES
# Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
main_subnet = get_existing_subnet()
sgid_webserver = create_security_groups_aws('AnalyticsSecurity', 'For analytics server')


############## Phase 2: Provisioning SSH Key (Single) ##################
init_ssh_key(SSH_KEY_NAME)


############## Phase 3: Firing off the instances ##################
instances  = fire_off_instances(main_subnet, SSH_KEY_NAME,num_data_nodes)
instances = report_instances(instances)

############## Phase 4: Assign Master and Data nodes ##################
master_node = instances[0]
child_nodes = instances[1:]
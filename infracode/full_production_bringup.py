import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os, sys, threading
from time import sleep
import scp

# Default configurations for full bringup
UBUNTU_AMI_ID = 'ami-00ddb0e5626798373'  # Default Ubuntu 18.04 for US-East region
SECURITY_PERMISSIONS = {
    'WebserverSecurity': [
        {'IpProtocol': 'tcp',
         'FromPort': 80,
         'ToPort': 80,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        {'IpProtocol': 'tcp',
         'FromPort': 22,
         'ToPort': 22,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        {'IpProtocol': 'tcp',
         'FromPort': 5000,
         'ToPort': 5000,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
    ],
    'MongoSecurity': [
        {'IpProtocol': 'tcp',
         'FromPort': 27017,
         'ToPort': 27017,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        {'IpProtocol': 'tcp',
         'FromPort': 22,
         'ToPort': 22,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
    ],
    'MySQLSecurity': [
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

instance_configs = [
    {'SecurityGroup': ['WebserverSecurity'], 'Type':'t2.small'},
    {'SecurityGroup': ['MongoSecurity'], 'Type':'t2.medium'},
    {'SecurityGroup': ['MySQLSecurity'], 'Type':'t2.medium'}]


webserver_routine = [
    "cd ~; wget https://www.dropbox.com/s/8luth3csksbsbct/buildimage.tar.gz?dl=1 -O - | tar -xz ",
    "sed -i 's_<SQLIP>_54.205.94.117_g;s_<MONGODBURI>_1.1.1.1_g' server/.env",
    "wget -O - https://www.dropbox.com/s/cuu04w8mtmt5yc5/server_init.sh | bash"
]

# User set configs here
SSH_KEY_NAME = 'ENGTESTKEY'

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

def fire_off_instance(subnet_id, key_name):
    # Managing EC2 Instances - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-managing-instances.html
    # Additional Docs - https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Subnet.create_instances
    # Using create_instances with ec2_res allows all instances to be deployed in the same subnet by default
    initiated_instances = []
    for inst_cfg in instance_configs:
        tag_purpose_test = {"Key": "Grade", "Value": "Test"}

        curr_instance = ec2_res.create_instances(
            ImageId=UBUNTU_AMI_ID,
            InstanceType=inst_cfg['Type'],  # 't2.small'
            SecurityGroups=inst_cfg['SecurityGroup'],
            MaxCount=1,
            MinCount=1,
            KeyName=key_name,
            TagSpecifications=[{'ResourceType': 'instance',
                                'Tags': [tag_purpose_test]}]
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





############## Phase 1: Sorting out security groups ##################
# TODO: Test --------- Done, NO ISSUES
# Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
main_subnet = get_existing_subnet()
sgid_webserver = create_security_groups_aws('WebserverSecurity', 'For webapp and backend server')
sgid_mongo = create_security_groups_aws('MongoSecurity', 'For MongoDB database server')
sgid_mysql = create_security_groups_aws('MySQLSecurity', 'For MySQL database server')

############## Phase 2: Provisioning SSH Key (Single) ##################
init_ssh_key(SSH_KEY_NAME)
############## Phase 3: Firing off the instances ##################
instances  = fire_off_instance(main_subnet, SSH_KEY_NAME)
instances = report_instances(instances)

############## Phase 4: Setting up within the instance ##################
sleep(20) # Sanity sleep for ec2

mysql_routine = [
    "cd ~",
    "wget --output-document=setup_sql_instance.sh https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/setup_sql_instance.sh?token=AKXRJGLFQQ5HVYZMWJ2VRAS7YJFXO",
    "chmod +x setup_sql_instance.sh",
    "./setup_sql_instance.sh",
    "sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf",
    "sudo systemctl restart mysql"
]

mongo_routine = [
    "wget https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/mongoScripts/mongo_setup.sh?token=AG2OQBXOZT3DK7QDQM5KV6S7Y2OHU -O mongo_setup.sh",
    "chmod +x mongo_setup.sh",
    "./mongo_setup.sh"
]

webserver_routine = [
    "cd ~; wget https://www.dropbox.com/s/kz8jz3irepuzw10/buildimage.tar.gz?dl=1  -O - | tar -xz ",
    "sed -i 's_<SQLIP>_{0}_g;s_<MONGODBURI>_{1}_g' server/.env".format(instances[2].private_dns_name, instances[1].private_dns_name),
    "wget -O - https://www.dropbox.com/s/cuu04w8mtmt5yc5/server_init.sh | bash"

]


c1 = setup_ssh_client(SSH_KEY_NAME+'.pem', instances[1].public_dns_name)
c2 = setup_ssh_client(SSH_KEY_NAME+'.pem', instances[2].public_dns_name)
c3 = setup_ssh_client(SSH_KEY_NAME+'.pem', instances[0].public_dns_name)


for command in mongo_routine:
    print("Executing {}".format( command ))
    stdin , stdout, stderr = c1.exec_command(command)
    print(stdout.read().decode('utf=8'))
    print( "Errors")
    print(stderr.read().decode('utf=8'))
c1.close()

for command in mysql_routine:
    print("Executing {}".format( command ))
    stdin , stdout, stderr = c2.exec_command(command)
    print(stdout.read().decode('utf=8'))
    print( "Errors")
    print(stderr.read().decode('utf=8'))
c2.close()

for command in webserver_routine:
    print("Executing {}".format( command ))
    stdin , stdout, stderr = c3.exec_command(command)
    print(stdout.read().decode('utf=8'))
    print( "Errors")
    print(stderr.read().decode('utf=8'))
c3.close()
import os
# import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os, sys, threading
from time import sleep

# Default configurations for full production bring-up
UBUNTU_AMI_ID = 'ami-00ddb0e5626798373'  # Default Ubuntu 18.04 for US-East region

SECURITY_DEFAULTS = {
    'WEBSERVER': {
        'Policy': [
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
        'Description': '50.043 GP5: WebApp + Server Security Configurations',
        'Name': 'WebserverGroup5'
    },
    'MONGODB': {
        'Policy': [
            {'IpProtocol': 'tcp',
             'FromPort': 27017,
             'ToPort': 27017,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
            {'IpProtocol': 'tcp',
             'FromPort': 22,
             'ToPort': 22,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
        ],
        'Description': '50.043 GP5: MongoDB Security Configurations',
        'Name': 'MongoDBGroup5'
    },
    'MYSQLDB': {
        'Policy': [
            {'IpProtocol': 'tcp',
             'FromPort': 3306,
             'ToPort': 3306,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
            {'IpProtocol': 'tcp',
             'FromPort': 22,
             'ToPort': 22,
             'IpRanges': [{'CidrIp': '0.0.0.0/0'}]}
        ],
        'Description': '50.043 GP5: MySQL Security Configurations',
        'Name': 'MySQLGroup5'
    }
}

INSTANCE_DEFAULTS = [
    {'SecurityGroup': [SECURITY_DEFAULTS['WEBSERVER']['Name']], 'Type': 't2.small', 'ContainerName': 'GP5Webserver'},
    {'SecurityGroup': [SECURITY_DEFAULTS['MONGODB']['Name']], 'Type': 't2.small', 'ContainerName': 'GP5Mongo'},
    {'SecurityGroup': [SECURITY_DEFAULTS['MYSQLDB']['Name']], 'Type': 't2.small', 'ContainerName': 'GP5MySQL'}]


# User set configs here
SSH_KEY_NAME = 'ENGTESTKEY'

# Inits the session via hidden aws file
ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2')
response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')


########## Helper functions ##########
# From https://gist.github.com/batok/2352501
def setup_ssh_client(key_file, IP_address):
    retry = True
    print('Using key file ', key_file)
    pem = paramiko.RSAKey.from_private_key_file(key_file)
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    while retry:
        try:
            ssh_client.connect(hostname=IP_address, username='ubuntu', pkey=pem)
            print('Success connect')
            break
        except:
            retry = True

    return ssh_client


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


# TODO: TO BE REMOVED
# def get_existing_subnet():
#     #     subnet = ec2_res.create_subnet(CidrBlock = '172.31.64.0/20', VpcId= vpc_id)
#     response = ec2.describe_subnets()
#     subnet = response.get('Subnets', [{}])[0].get('SubnetId', '')
#     return subnet


# TODO : DONE
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


def fire_off_instance(key_name, instance_configs):
    # Managing EC2 Instances - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-managing-instances.html
    # Additional Docs - https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Subnet.create_instances
    # Using create_instances with ec2_res allows all instances to be deployed in the same subnet by default
    initiated_instances = []
    for inst_cfg in instance_configs:
        tag_purpose_test = {"Key": "Name", "Value": inst_cfg['ContainerName']}

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
        print('{0}: Success! Server currently on IP address {1}'.format(instance.id, instance.public_dns_name))
    return instances


def init_common_placement():
    res = ec2_res.get_all_placement_groups(groupnames=['50043_team5_placement'], filters=None, dry_run=False)
    if len(res) == 0:
        ec2_res.create_placement_group('50043_team5_placement', strategy='cluster', dry_run=False)


############## Phase 1: Sorting out security groups ##################
# TODO: Test --------- Done, NO ISSUES
# Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html

sgid_webserver = create_security_groups_aws(SECURITY_DEFAULTS['WEBSERVER'])
sgid_mongo = create_security_groups_aws(SECURITY_DEFAULTS['MONGODB'])
sgid_mysql = create_security_groups_aws(SECURITY_DEFAULTS['MYSQLDB'])

############## Phase 2: Provisioning SSH Key (Single) ##################
init_ssh_key(SSH_KEY_NAME)
############## Phase 3: Firing off the instances ##################
instances = fire_off_instance(SSH_KEY_NAME, INSTANCE_DEFAULTS)
instances = report_instances(instances)

############## Phase 4: Setting up within the instance ##################
# sleep(20)  # Sanity sleep for ec2


def ssh_routes(routine_details, key):
    c = setup_ssh_client(key, routine_details['ip'])
    for command in routine_details['routine']:
        print("Executing {}".format(command))
        stdin, stdout, stderr = c.exec_command(command)
        print(stdout.read().decode('utf=8'))
        print("Errors")
        print(stderr.read().decode('utf=8'))

    c.close()


# TODO: Modify code for webserver so that it can be threaded too
mysql_routine = [
    "cd ~",
    "wget --output-document=setup_sql_instance.sh https://www.dropbox.com/s/2c7gpdj1v9b6wkj/setup_sql_instance.sh",
    "chmod +x setup_sql_instance.sh",
    "./setup_sql_instance.sh"
    # "sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf",
    # "sudo systemctl restart mysql"
]



# TODO: Suggested truncation to wget https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/mongoScripts/mongo_setup.sh?token=AG2OQBXOZT3DK7QDQM5KV6S7Y2OHU -O mongo_setup.sh" | bash
mongo_routine = [
    "wget https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/mongoScripts/mongo_setup.sh?token=AG2OQBXOZT3DK7QDQM5KV6S7Y2OHU -O mongo_setup.sh",
    "chmod +x mongo_setup.sh",
    "./mongo_setup.sh"
]

# TODO: Fix into single command
webserver_routine = [
    "cd ~; wget https://www.dropbox.com/s/kz8jz3irepuzw10/buildimage.tar.gz?dl=1  -O - | tar -xz ",
    "sed -i 's_<SQLIP>_{0}_g;s_<MONGODBURI>_{1}_g' server/.env".format(instances[2].private_dns_name,
                                                                       instances[1].private_dns_name),
    "wget -O - https://www.dropbox.com/s/cuu04w8mtmt5yc5/server_init.sh | bash"

]
# threaders = [{
#     'routine': mysql_routine,
#     'ip': instances[2].public_dns_name},
#     {'routine': mongo_routine,
#      'ip': instances[1].public_dns_name}]

threaders = [{
    'routine': mysql_routine,
    'ip': instances[2].public_dns_name}]


threads = []
for h in threaders:
    t = threading.Thread(target=ssh_routes, args=(h, SSH_KEY_NAME + '.pem',))
    t.start()
    threads.append(t)
for t in threads:
    t.join()

c3 = setup_ssh_client(SSH_KEY_NAME + '.pem', instances[0].public_dns_name)

for command in webserver_routine:
    print("Executing {}".format(command))
    stdin, stdout, stderr = c3.exec_command(command)
    print(stdout.read().decode('utf=8'))
    print("Errors")
    print(stderr.read().decode('utf=8'))
c3.close()
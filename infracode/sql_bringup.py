import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os
from time import sleep
# import scp

# Defaults
UBUNTU_AMI_ID = 'ami-0f82752aa17ff8f5d'  # Default Ubuntu 16.04 for US-East region
SECURITY_PERMISSIONS = {
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
SERVER_GROUP = 'SECURITY_GROUP_SERVER_TESTTESTTEST'


########## Helper functions ##########
# From https://gist.github.com/batok/2352501
def setup_ssh_client(key_file, IP_address):
    print('Using key file ', key_file)
    pem = paramiko.RSAKey.from_private_key_file(key_file)
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh_client.connect(hostname=IP_address, username='ubuntu', pkey=pem)
    return ssh_client

############## Phase 0: Instantiating BOTO ##################

session = boto3.session.Session(
    aws_access_key_id="ASIA4DOD5SYHGTDUC4FL",
    aws_secret_access_key="+yD29gum10xa3M/RZw/avopZdzwBHVJIslV8GNKR",
    aws_session_token="FwoGZXIvYXdzEB8aDOGWUnCAY4kY53ITaCLNAUKrnvQueHI7r8fG6f2j/+eyGd2hb0n/2iJQs9oM7a4hfqv1jaJ0+nUQv+08F5U7kvMiDvtv6GUa+JELhJecbFPeEH8N2UU//FgHKdcmqX/I+xWjCRUgtZ1dfrb5cVGAXk1mgLXLvYAQATGAkwiQoH5n8rFrbkitHTYIKrSl8jPCDzjhV1VbTyK6t22VSFERpopzdzEdKymPC1Ojon3ezR+XY17rSy1dnoOJB9BxP1uR7593MJDYWEbfc5cIo/ste25kq1BMdj5JwdUCTY8o7NXi/QUyLeLGowZ9Ayr68NrzgfQNQpWJ/uTdWRXDLM3ql/IMKxzYduYfMNFLW1o1gWmOQw==",
    region_name="us-east-1"
)

ec2 = session.client('ec2')
ec2_res = session.resource('ec2')

# ec2 = boto3.client('ec2')  # type: botostubs.EC2
# ec2_res = boto3.resource('ec2') # TODO: Johnson this one is the high level API version

############## Phase 1: Sorting out secuirity groups ##################
# Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
# Inits the session via hidden aws file

response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')

try:
    response = ec2.create_security_group(GroupName=SERVER_GROUP,
                                         Description='For SQL Database',
                                         VpcId=vpc_id)
    security_group_id = response['GroupId']
    print('Security Group Created %s in vpc %s.' % (security_group_id, vpc_id))

    # Ingress security group
    data = ec2.authorize_security_group_ingress(GroupId=security_group_id,
                                                IpPermissions=SECURITY_PERMISSIONS['MySQL'])
    print('Ingress Successfully Set %s' % data)

except ClientError as e:
    print(e)

############## Phase 2: Sorting out key pairs for SSH ##################
# Key Pairs - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-key-pairs.html
key_name_provided = 'BOTO_TEST_RUN_SQL'
try:
    curr_key = ec2.describe_key_pairs(KeyNames=[key_name_provided])
    print('\nKey Pair found. Moving Forwards .....')

except ClientError:  # means it doesnt exit
    print('\nKey Pair not found. Creating .....')
    curr_key = ec2_res.create_key_pair(KeyName=key_name_provided)
    with open('{}.pem'.format(key_name_provided), 'w') as keywriter:
        keywriter.write(curr_key.key_material)
    os.chmod(key_name_provided+'.pem', 0o400)
    print('Key Created with fingerprint: ', curr_key.key_fingerprint)


############## Phase 3: Firing off the instances ##################
# Managing EC2 Instances - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-managing-instances.html
# Additonal Docs - https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ec2.html#EC2.Subnet.create_instances
# The following are Subnet class instances for provisioning (from docs)
mysql_instance = ec2_res.create_instances(
    ImageId=UBUNTU_AMI_ID,
    InstanceType='t2.small',
    SecurityGroups=[SERVER_GROUP],
    MaxCount=1,
    MinCount=1,
    KeyName=key_name_provided
)

print('{}: Provisioning and setting up instance'.format(mysql_instance[0].id))
mysql_instance[0].wait_until_exists()
print('{}: Server setted up and provisioned. Awaiting Run'.format(mysql_instance[0].id))
mysql_instance[0].wait_until_running()
print('{}: Success! Server running and ready!'.format(mysql_instance[0].id))


############## Phase 4: Setting up MySQL instance ##################
mysql_instance[0].load()
print('{0}: Success! Server currently on IP address {1}'.format(mysql_instance[0].id,mysql_instance[0].public_dns_name))
sleep(50)

# Command for settling ssh nonsenses
mysql_routine = [
    "cd ~",
    "echo Updating system packages .....",
    "sudo apt update",
    "echo Install MySQL .....",
    "sudo apt-get install mysql-server -y",
    "mkdir data",
    "cd data/",
    "echo Downloading data .....",
    "wget https://www.dropbox.com/s/mg2b09plxocrgi6/kindle_Users.csv",
    "wget https://www.dropbox.com/s/2ph07tvq6jcijo8/kindle_Review_User_Reduced.csv",
    "cd ..",
    "echo Downloading data migration SQL scripts .....",
    "wget https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/create_admin_user.sql?token=AKXRJGP5RTEIOHROWCMKZXK7YHA2A",
    "wget https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/create_tables.sql?token=AKXRJGIYFYKIUIOZAJM7JT27YHA3C",
    "wget https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/load_data.sql?token=AKXRJGNZP6VRDC5LODINHF27YHA4E",
    "echo Executing data migration SQL scripts .....",
    "sudo mysql -u root < create_admin_user.sql"
    "sudo mysql -u root < create_tables.sql"
    "sudo mysql -u root < load_data.sql"


]

# "echo Open instance connection to all IP address .....",
# "sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf "

c = setup_ssh_client(key_name_provided+'.pem', mysql_instance[0].public_dns_name)


for command in mysql_routine:
    print("Executing {}".format( command ))
    stdin , stdout, stderr = c.exec_command(command)
    print(stdout.read().decode('utf=8'))
    print( "Errors")
    print(stderr.read().decode('utf=8'))
c.close()

print('(+) ---- Successfully deployed server at: {0}:5000'.format(mysql_instance[0].public_dns_name))





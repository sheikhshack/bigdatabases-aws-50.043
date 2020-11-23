import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os
from time import sleep
# import scp

# Defaults
UBUNTU_AMI_ID = 'ami-00ddb0e5626798373'  # Default Ubuntu 16.04 for US-East region
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
# Change session variables according to educate creds.
# session = boto3.Session(
#     aws_access_key_id="ASIA4GA3HFDIHPBM6YN5",
#     aws_secret_access_key="d00nebDEuwVeqe7c/Yqz9xqUQHShcOGZxsLInHeM",
#     aws_session_token="FwoGZXIvYXdzECgaDDreuhrhVngcW0czbiLNAaxBDgkSIScb0HKsTISTfpx6WK/btFiS2o28zJsh8dGGVU8rusLUyN6j3bwRmmVFDTwLs5b5HhioC1M+UJuPcnL0ySMU7/UrULfCweoDN0Kye503QYvBOWV8pSCr6TsANQcqau/ujo7rFmGty1IUD97puaGa6TDas5YfU/lJE/whJkKvYsMqk5mLeolEN4g58ZZnANAEBUEovg9zwE8MBsMGfh3BsKLo1r1qM7xxHDsrOBUQmnirh1tQmkbj9Hsv0qifmWpSr+JTqHerwFso6crk/QUyLWzwvRDIqVOQQXrIbL9FW9BqKUABzJG4eP4TcgbsFXt4n5wxB3lcxPIUZLmRIA==",
#     region_name="us-east-1"
# )

# ec2 = session.client('ec2')
# ec2_res = session.resource('ec2')


# TODO: Uncomment this and comment out the next 2 'session' lines if you running with config file instead
ec2 = boto3.client('ec2')
ec2_res = boto3.resource('ec2')


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
except InvalidGroup.Duplicate as e:
    print(e)


############## Phase 2: Sorting out key pairs for SSH ##################
# Key Pairs - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-key-pairs.html
key_name_provided = 'TEST_KEY1'
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
sleep(25)

# Command for settling ssh nonsenses
mysql_routine = [
    "cd ~",
    "wget --output-document=setup_sql_instance.sh https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/setup_sql_instance.sh?token=AKXRJGLFQQ5HVYZMWJ2VRAS7YJFXO",
    "chmod +x setup_sql_instance.sh",
    "./setup_sql_instance.sh",
    "sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf",
    "sudo systemctl restart mysql"

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





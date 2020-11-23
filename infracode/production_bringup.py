import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os
from time import sleep
# import scp

# Defaults
# UBUNTU_AMI_ID = 'ami-0f82752aa17ff8f5d'  # Default Ubuntu 16.04 for US-East region

UBUNTU_AMI_ID = 'ami-00ddb0e5626798373'  # Default Ubuntu 18.04 for US-East region

SECURITY_PERMISSIONS = {
    'Server': [
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

ec2 = boto3.client('ec2')  # type: botostubs.EC2
ec2_res = boto3.resource('ec2') # TODO: Johnson this one is the high level API version

############## Phase 1: Sorting out secuirity groups ##################
# Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
# Inits the session via hidden aws file

response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')

try:
    response = ec2.create_security_group(GroupName=SERVER_GROUP,
                                         Description='For the React App + Server Deployment',
                                         VpcId=vpc_id)
    security_group_id = response['GroupId']
    print('Security Group Created %s in vpc %s.' % (security_group_id, vpc_id))

    # Ingress security group
    data = ec2.authorize_security_group_ingress(GroupId=security_group_id,
                                                IpPermissions=SECURITY_PERMISSIONS['Server'])
    print('Ingress Successfully Set %s' % data)

except ClientError as e:
    print(e)

############## Phase 2: Sorting out key pairs for SSH ##################
# Key Pairs - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-key-pairs.html
key_name_provided = 'BOTO_TEST_RUN_v11'
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
webserver_instance = ec2_res.create_instances(
    ImageId=UBUNTU_AMI_ID,
    InstanceType='t2.small',
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


############## Phase 4: Setting up within the instance ##################
webserver_instance[0].load()
print('{0}: Success! Server currently on IP address {1}'.format(webserver_instance[0].id,webserver_instance[0].public_dns_name))
sleep(50)

# Command for settling ssh nonsenses
# get_repo_access_routine = [
#     "touch ~/.ssh/id_ed25519 ",
#     "echo -e \"Host github.com-repo-0\n\tHostname github.com\n\tIdentityFile=/home/ubuntu/.ssh/id_ed25519\" > ~/.ssh/config",
#     "echo -e \"-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACDGXyBqutfc5SYhs1wx5jNNFaYJ654wQDcuO2aT2TR/6wAAAJjxK4M58SuD\nOQAAAAtzc2gtZWQyNTUxOQAAACDGXyBqutfc5SYhs1wx5jNNFaYJ654wQDcuO2aT2TR/6w\nAAAEDfEJz1pkNo/+PCoKmWkBJ3A/yLWCfDLhwEVXqKHsir6sZfIGq619zlJiGzXDHmM00V\npgnrnjBANy47ZpPZNH/rAAAAFHJlZGZyZWFrOTdAZ21haWwuY29tAQ==\n-----END OPENSSH PRIVATE KEY-----\" > ~/.ssh/id_ed25519",
#     "cd ~; git clone -b master --depth 1 git@github.com-repo-0:sheikhshack/bigdatabases-aws-50.043.git"
#
# ]
webserver_routine = [
    "cd ~; wget https://www.dropbox.com/s/8luth3csksbsbct/buildimage.tar.gz?dl=1 -O - | tar -xz ",
    "sed -i 's_<SQLIP>_'54.205.94.117'_g;s_<MONGODBURI>_'mongodb+srv://jeroee:jerokok97@testdb.cpfwr.mongodb.net/testDb?retryWrites=true'_g;s_<MONGODBURILOG>_'mongodb+srv://jeroee:jerokok97@testdb.cpfwr.mongodb.net/testDb?retryWrites=true'_g' server/.env",
    "wget -O - https://www.dropbox.com/s/cuu04w8mtmt5yc5/server_init.sh | bash"

]
c = setup_ssh_client(key_name_provided+'.pem', webserver_instance[0].public_dns_name)


for command in webserver_routine:
    print("Executing {}".format( command ))
    stdin , stdout, stderr = c.exec_command(command)
    print(stdout.read().decode('utf=8'))
    print( "Errors")
    print(stderr.read().decode('utf=8'))
c.close()

print('(+) ---- Successfully deployed server at: {0}:5000'.format(webserver_instance[0].public_dns_name))





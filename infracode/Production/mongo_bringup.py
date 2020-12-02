import os
import botostubs
import boto3
from botocore.exceptions import ClientError
import paramiko
import os
from time import sleep

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
SERVER_GROUP = 'SECURITY_GROUP_SERVER_MONGO'

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
                                         Description='For the Mongo DB',
                                         VpcId=vpc_id)
    security_group_id = response['GroupId']
    print('Security Group Created %s in vpc %s.' % (security_group_id, vpc_id))

    # Ingress security group
    data = ec2.authorize_security_group_ingress(GroupId=security_group_id,
                                                IpPermissions=SECURITY_PERMISSIONS['Mongo'])
    print('Ingress Successfully Set %s' % data)

except ClientError as e:
    print(e)

############## Phase 2: Sorting out key pairs for SSH ##################
# Key Pairs - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-key-pairs.html
key_name_provided = 'TEST_KEY_MONGO'
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
mongo_instance = ec2_res.create_instances(
    ImageId=UBUNTU_AMI_ID,
    InstanceType='t2.large',
    SecurityGroups=[SERVER_GROUP],
    MaxCount=1,
    MinCount=1,
    KeyName=key_name_provided
)

print('{}: Provisioning and setting up instance'.format(mongo_instance[0].id))
mongo_instance[0].wait_until_exists()
print('{}: Server setted up and provisioned. Awaiting Run'.format(mongo_instance[0].id))
mongo_instance[0].wait_until_running()
print('{}: Success! Server running and ready!'.format(mongo_instance[0].id))


############## Phase 4: Setting up within the instance ##################
mongo_instance[0].load()
print('{0}: Success! Server currently on IP address {1}'.format(mongo_instance[0].id,mongo_instance[0].public_dns_name))
sleep(20)

mongo_routine = [
    "wget https://www.dropbox.com/s/fucvpkhbzhwrlun/mongo_setup.sh?dl=0 -O mongo_setup.sh",
    "chmod +x mongo_setup.sh",
    "./mongo_setup.sh"

]
c = setup_ssh_client(key_name_provided+'.pem', mongo_instance[0].public_dns_name)


for command in mongo_routine:
    print("Executing {}".format( command ))
    stdin , stdout, stderr = c.exec_command(command)
    print(stdout.read().decode('utf=8'))
    print( "Errors")
    print(stderr.read().decode('utf=8'))
c.close()

print('(+) ---- Successfully deployed server at: {0}:27017'.format(mongo_instance[0].public_dns_name))
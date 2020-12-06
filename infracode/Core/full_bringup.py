import os
import boto3
from botocore.exceptions import ClientError
import paramiko
import os, sys, threading
import time
from threading import Thread

##################################################################################

# This file is responsible for handling the bringup of needed instances via BOTO, both production and analytics

##################################################################################

# Aesthetics
class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


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
    },
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
            'Name': 'FlintRockGroup5'
        }
}


# Inits the session via hidden aws file
ec2 = boto3.client('ec2')
ec2_res = boto3.resource('ec2')
response = ec2.describe_vpcs()
vpc_id = response.get('Vpcs', [{}])[0].get('VpcId', '')


########## Helper functions ##########
# From https://gist.github.com/batok/2352501
def setup_ssh_client(key_file, IP_address):
    retry = True
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
        instance.wait_until_running()
        print('{}: Success! Server running and ready!'.format(instance.id))
        instance.load()
        print('{0}: Success! Server currently on IP address {1}'.format(instance.id, instance.public_dns_name))
    return instances


def ssh_run_batched_commands(routine_details, key):
    c = setup_ssh_client(key, routine_details['ip'])
    print('Executing: ', routine_details['description'])
    for single_command in routine_details['routine']:
        stdin, stdout, stderr = c.exec_command(single_command)
        stdout.read().decode('utf=8')
        error = stderr.read().decode('utf=8')
        # # if error and len(error) != 0:
        #     print(bcolors.WARNING + 'Error executing command: {0} with len {1}'.format(error, len(error)))
    print('Successfully executed: ', routine_details['description'])
    c.close()

def launch_flintrock(instance_type, node_count, key):
    print('Running Flintrock')
    os.system('''flintrock launch GP5Analytics --num-slaves {0} --spark-version 3.0.1 --hdfs-version 3.2.1 \
              --ec2-security-group FlintRockGroup5 --ec2-key-name {1} --ec2-identity-file {1}.pem --ec2-ami ami-04d29b6f966df1537 \
              --ec2-instance-type {2} --ec2-user ec2-user --install-hdfs --install-spark'''.format(node_count, key, instance_type))


def main(SSH_KEY_NAME, instance_type, flint_type=None, node_count=None, mode=None):
    flint_thread = None
    ############## USER SET CONFIGS #######################
    INSTANCE_DEFAULTS = [
        {'SecurityGroup': [SECURITY_DEFAULTS['WEBSERVER']['Name']], 'Type': 't2.medium','ContainerName': 'GP5Webserver'},
        {'SecurityGroup': [SECURITY_DEFAULTS['MONGODB']['Name']], 'Type': instance_type, 'ContainerName': 'GP5Mongo'},
        {'SecurityGroup': [SECURITY_DEFAULTS['MYSQLDB']['Name']], 'Type': instance_type, 'ContainerName': 'GP5MySQL'}]


    ############## Phase 1: Sorting out security groups ##################
    start_time = time.perf_counter()
    # Security Policies - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-security-group.html
    print(bcolors.HEADER + '-- GP5 Bringup Script: Creating necessary security configurations' + bcolors.ENDC)
    sgid_webserver = create_security_groups_aws(SECURITY_DEFAULTS['WEBSERVER'])
    sgid_mongo = create_security_groups_aws(SECURITY_DEFAULTS['MONGODB'])
    sgid_mysql = create_security_groups_aws(SECURITY_DEFAULTS['MYSQLDB'])


    ############## Phase 2: Provisioning SSH Key (Single) ##################
    print(bcolors.HEADER + '-- GP5 Bringup Script: Creating SSH-Key based on preferred name provided' + bcolors.ENDC)

    init_ssh_key(SSH_KEY_NAME)

    ############## Phase 3.0: Running flint (if required) ##################
    if flint_type:
        sgid_flintrock = create_security_groups_aws(SECURITY_DEFAULTS['FLINTROCK'])
        if mode == 'parallel':
            print(bcolors.HEADER + '-- GP5 Bringup Script: Initiating Analytics Bringup' + bcolors.ENDC)
            # proceed to immediately subprocess the function
            flint_thread = Thread(target=launch_flintrock, args= (flint_type, node_count, SSH_KEY_NAME, ))
            flint_thread.start()


    ############## Phase 3.1: Firing off the instances ##################

    print(bcolors.HEADER + '-- GP5 Bringup Script: Firing Instances x3 for Production' + bcolors.ENDC)
    instances = fire_off_instance(SSH_KEY_NAME, INSTANCE_DEFAULTS)
    instances = report_instances(instances)


    ############## Phase 4: Setting up within the instance ##################

    mysql_routine = ["wget -qO - https://www.dropbox.com/s/2c7gpdj1v9b6wkj/setup_sql_instance.sh | bash -"]
    mongo_routine = ["wget -qO - https://www.dropbox.com/s/fucvpkhbzhwrlun/mongo_setup.sh | bash -"]
    webserver_routine = ["wget -qO - https://www.dropbox.com/s/cuu04w8mtmt5yc5/server_init.sh | bash -s {0} {1}".format(instances[2].private_dns_name, instances[1].private_dns_name)]
    webserver_routine_final = ["sudo pm2 restart index"]

    command_threaders = [{
        'routine': mysql_routine,
        'ip': instances[2].public_dns_name,
        'description':'Mysql Database bringup script '},
        {'routine': mongo_routine,
         'ip': instances[1].public_dns_name,
         'description': 'Mongo Database bringup script'},
        {'routine': webserver_routine,
         'ip': instances[0].public_dns_name,
         'description': 'Webserver bringup script'}
    ]

    print(bcolors.HEADER + '-- GP5 Bringup Script: Running Parallel Scripts' + bcolors.ENDC)

    threads = []
    for h in command_threaders:
        t = threading.Thread(target=ssh_run_batched_commands, args=(h, SSH_KEY_NAME + '.pem',))
        t.start()
        threads.append(t)
    for t in threads:
        t.join()

    # PM2 startup once the dbs are up and running
    final_thread  = {
        'routine': webserver_routine_final,
         'ip': instances[0].public_dns_name,
         'description': 'Webserver Finalised script'}

    ssh_run_batched_commands(final_thread, SSH_KEY_NAME + '.pem')


    # Results and aesthetics printing
    print(bcolors.HEADER + '-- GP5 Bringup Script: Finished Production Deployment' + bcolors.ENDC)

    print('-' * 30)
    print(bcolors.OKCYAN + 'Credentials used for Database as such\nUsername: jeroe\nPassword: HelloWorld1!' + bcolors.ENDC)
    print('-' * 30)


    print('-' * 30)
    print(bcolors.OKGREEN + 'MYSQL Database deployed in server: {0}\nMongo Database deployed in server: {1}\nWebserver '
                            'deployed over at : http://{2}:5000'.format(instances[2].public_dns_name, instances[1].public_dns_name, instances[0].public_dns_name) + bcolors.ENDC)

    print('-' * 30)

    end_time = time.perf_counter()
    print('Total time taken for production: ', end_time - start_time)

    if flint_type and mode == "sequential":
        print('-- GP5 Bringup Script: Waiting for Analystics Bringup thread to finish...')
        launch_flintrock(flint_type, node_count, SSH_KEY_NAME)
        print(bcolors.HEADER + '-- GP5 Bringup Script: Finished AnalyticsDeployment. See the line before this for master address' + bcolors.ENDC)

    if flint_type and mode == 'parallel':
        print('-- GP5 Bringup Script: Waiting for Analystics Bringup thread to finish...')
        flint_thread.join()
        print(bcolors.HEADER + '-- GP5 Bringup Script: Finished AnalyticsDeployment. See the line before this for master address' + bcolors.ENDC)
        print('-' * 30)




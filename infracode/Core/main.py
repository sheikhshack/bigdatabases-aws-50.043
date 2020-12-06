import argparse
import subprocess
import full_bringup
import teardown_systems
import os
import data_ingestion
import analytics_systems


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


MASTER_KEY = 'GP5_GRANDMASTERKEY'


def bringup(args):
    current_config = (bcolors.BOLD + "Running with the following configs: \n"
                                     "   - Production instance type: {0}\n"
                                     "   - Analytics instance type: {1}\n"
                                     "   - Number of datanodes: {2}\n"
                                     "   - Mode : {3}\n" + bcolors.ENDC).format(args.instance_type_prod,
                                                                                args.instance_type_node,
                                                                                args.init_nodes,
                                                                                args.mode)
    print(current_config)
    if args.mode == 'production-only':
        full_bringup.main(MASTER_KEY, args.instance_type_prod, mode=args.run_mode)
    else:
        full_bringup.main(MASTER_KEY, args.instance_type_prod, args.instance_type_node, args.init_nodes, mode=args.run_mode)


def modify(args):
    current_config = (bcolors.BOLD + "Modifying cluster with the following configs: \n"
                                     "   - Analytics instance type: {0}\n"
                                     "   - Number of datanodes: {1}\n" + bcolors.ENDC).format(args.mod_instance_type,
                                                                                              args.mod_nodes)
    print(current_config)
    print(bcolors.HEADER + 'Begin Analytics cluster teardown' + bcolors.ENDC)
    os.system('echo "y" | flintrock destroy GP5Analytics')
    print(bcolors.HEADER + 'Bring up Analytics cluster with new nodes' + bcolors.ENDC)
    # TODO: Need to change this key file
    os.system('''flintrock launch GP5Analytics --num-slaves {0} --spark-version 3.0.1 --hdfs-version 3.2.1 \
              --ec2-security-group FlintRockGroup5 --ec2-key-name {1} --ec2-identity-file {1}.pem --ec2-ami ami-04d29b6f966df1537 \
              --ec2-instance-type {2} --ec2-user ec2-user --install-hdfs --install-spark'''.format(args.mod_nodes,
                                                                                                   MASTER_KEY,
                                                                                                   args.mod_instance_type))

    print("Clusters brought up, please remember to re-run ingestion at runtime for updated ingestion :)")
    print(bcolors.HEADER + 'Analytics Cluster bring up successful' + bcolors.ENDC)


def ingest(args):
    current_config = (bcolors.BOLD + "Beginning data ingestion \n" + bcolors.ENDC)
    print(current_config)
    data_ingestion.ingest_data(MASTER_KEY + '.pem')


def analytics(args):
    current_config = (bcolors.BOLD + "Beginning data analytics \n" + bcolors.ENDC)
    print(current_config)
    # TODO: Need to push the analytics to dropbox
    analytics_systems.analyse_data(MASTER_KEY + '.pem', args.actions, args.vocab)


def teardown(args):
    current_config = (bcolors.BOLD + "Teardown with the following configs: \n"
                                     "   - Type of teardown: {0}\n" + bcolors.ENDC).format(args.mode)
    print(current_config)
    if args.mode == 'full':
        teardown_systems.main_full(MASTER_KEY)
        print(bcolors.HEADER + '-- GP5 Teardown Script: Begin Analytics cluster teardown' + bcolors.ENDC)
        os.system('echo "y" | flintrock destroy GP5Analytics')
        print(bcolors.HEADER + '-- GP5 Teardown Script: Analytics cluster teardown complete' + bcolors.ENDC)
    else:
        print(bcolors.HEADER + '-- GP5 Teardown Script: Begin Analytics cluster teardown' + bcolors.ENDC)
        os.system('echo "y" | flintrock destroy GP5Analytics')
        print(bcolors.HEADER + '-- GP5 Teardown Script: Analytics cluster teardown complete' + bcolors.ENDC)


if __name__ == "__main__":
    # Prof like this can give extra credit
    description_art = bcolors.OKBLUE + r"""
   _____ _____  _____   _____  ___   ___  _  _  ____  
  / ____|  __ \| ____| | ____|/ _ \ / _ \| || ||___ \ 
 | |  __| |__) | |__   | |__ | | | | | | | || |_ __) |
 | | |_ |  ___/|___ \  |___ \| | | | | | |__   _|__ < 
 | |__| | |     ___) |  ___) | |_| | |_| |  | | ___) |
  \_____|_|    |____/  |____/ \___/ \___/   |_||____/ 
 
 GP5's Ultimate Script for 50.043 DB Project 
 The following is an all-in-one script capable of 
 1. Bringup
 2. Teardown
 3. Rescaling and Running analystics                                                                                              
 """ + bcolors.ENDC

    # Top level Parser
    parser = argparse.ArgumentParser(formatter_class=argparse.RawDescriptionHelpFormatter,
                                     description=description_art,
                                     epilog='Visit our readme :https://github.com/sheikhshack/bigdatabases-aws-50.043')
    subparsers = parser.add_subparsers(help='sub-command help')

    # Sub command - bringup
    bringup_parser = subparsers.add_parser('bringup',
                                           description='This command will allow specific bringup of the entire system / subsystems')
    bringup_parser.add_argument('-m', dest='mode', help='Mode: Specify the type of bring-up desired',
                                choices=["production-only", "full"], default="full")
    bringup_parser.add_argument('-n', dest='init_nodes', help='Enter number of (worker) nodes for Analytics system',
                                type=int, required=True)
    bringup_parser.add_argument('-tp', dest='instance_type_prod', help='Enter type of nodes for Production system',
                                choices=["t2.small", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium"],
                                default="t2.large")
    bringup_parser.add_argument('-tn', dest='instance_type_node',
                                help='Enter type of (worker) nodes for Analytics system',
                                choices=["t2.small", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium"],
                                default='t2.xlarge')
    bringup_parser.add_argument('-c', dest='run_mode',
                                help='Enter this to control parallelism',
                                choices=["parallel", "sequential"],
                                default='parallel')
    bringup_parser.set_defaults(func=bringup)

    # Sub command - modify
    modify_parser = subparsers.add_parser('modify',
                                          description='This command will allow you to modify the analytics system, such as reclustering and adjusting node types')
    modify_parser.add_argument('-n', dest='mod_nodes', help='Enter number of (worker) nodes to rescale to', type=int,
                               required=True, default=4)
    modify_parser.add_argument('-t', dest='mod_instance_type', help='Enter type of (worker) nodes for Analytics system',
                               choices={"t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium"}, default="t2.medium")
    modify_parser.set_defaults(func=modify)

    # Sub command - ingest current state
    ingest_parser = subparsers.add_parser('ingest',
                                          description='This command will trigger ingestion from mongo/mysql at runtime into the HDFS')
    ingest_parser.set_defaults(func=ingest)

    # Sub command - run analytics task
    analytics_parser = subparsers.add_parser('analytics',
                                             description='This command will trigger ingestion from mongo/mysql at runtime into the HDFS')
    analytics_parser.add_argument('-a', dest='actions', help='Actions: Run special analytics scripts',
                                  choices=["tfidf", "pearson", "both"], default="both")
    analytics_parser.add_argument('-v', dest='vocab', help='Enter a vocab size for tf-idf',
                                  type=int, default="20")
    analytics_parser.set_defaults(func=analytics)

    # Sub command - teardown
    teardown_parser = subparsers.add_parser('teardown')
    teardown_parser.add_argument('-m', dest='mode', help='Mode: Specify what to teardown',
                                 choices=["analytics-only", "full"], default="full")
    teardown_parser.set_defaults(func=teardown)

    # Sub command - run scripts
    args = parser.parse_args()
    args.func(args)

import argparse
import subprocess
import full_bringup
import teardown_systems
import os
import data_ingestion

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

KEY_NAME = 'GP5_Master_Key'

def bringup(args):

    current_config = (bcolors.BOLD + "Running with the following configs: \n"
                      "   - Production instance type: {0}\n"
                      "   - Analytics instance type: {1}\n"
                      "   - Number of datanodes: {2}\n"
                      "   - Mode : {3}\n"
                      "   - Also Running: {4}\n" + bcolors.ENDC).format(args.instance_type_prod, args.instance_type_node, args.nodes,
                                                       args.mode, args.actions)
    print(current_config)
    if args.mode == 'production-only':
        full_bringup.main('BATCHMODE', args.instance_type_prod)
    else:
        full_bringup.main('BATCHMODE', args.instance_type_prod, args.instance_type_node, args.nodes)



def modify():
    print('Tearing down analytics cluster')
    os.system('flintrock destroy GP5Analytics')
    print('Teardown complete')
    print('Rebuilding cluster with new nodes')
    os.system('./analytics_bringup.sh {0} {1}'.format(mod_nodes,'GP5_MasterKey'))
    print("Clusters brought up, next to ingestion")

    data_ingestion.ingest_data(KEY_NAME)

def teardown(args):
    current_config = (bcolors.BOLD + "Teardown with the following configs: \n"
                                     "   - Type of teardown: {0}\n" + bcolors.ENDC).format(args.mode)
    print(current_config)
    if args.mode == 'full':
        teardown_systems.main_full('BATCHMODE')


if __name__ == "__main__":
    # Prof like this can give extra credit
    description_art =  bcolors.OKBLUE + r"""
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
                                     description= description_art,
                                     epilog='Visit our readme :https://github.com/sheikhshack/bigdatabases-aws-50.043')
    subparsers = parser.add_subparsers(help='sub-command help')

    # Sub command - bringup
    bringup_parser = subparsers.add_parser('bringup')
    bringup_parser.add_argument('-n', dest='init_nodes', help='Enter number of (worker) nodes for Analytics system',
                                type=int, required=True)
    bringup_parser.add_argument('-tp', dest='instance_type_prod', help='Enter type of nodes for Production system',
                                choices={"t2.small", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium"}, default="t2.medium")
    bringup_parser.add_argument('-tn', dest='instance_type_node',
                                help='Enter type of (worker) nodes for Analytics system',
                                choices={"t2.small", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium"}, default='t2.xlarge')
    bringup_parser.add_argument('-a', dest='actions', help='Actions: Run special analytics scripts',
                                choices={"tfidf", "pearson", "both"})
    bringup_parser.add_argument('-m', dest='mode', help='Mode: Specify the type of bring-up desired',
                                choices={"production-only", "full"}, default="full-ecosystem")
    bringup_parser.set_defaults(func=bringup)

    # Sub command - modify
    modify_parser = subparsers.add_parser('modify')
    modify_parser.add_argument('-n', dest='mod_nodes', help='Enter number of (worker) nodes to rescale to', type=int,
                               required=True, default=4)
    modify_parser.add_argument('-t', dest='instance_type', help='Enter type of (worker) nodes for Analytics system',
                               choices={"t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium"}, default="t2.medium")

    # Sub command - teardown
    teardown_parser = subparsers.add_parser('teardown')
    teardown_parser.add_argument('-m', dest='mode', help='Mode: Specify what to teardown',
                                 choices=["analytics-only", "full"], default="full")
    teardown_parser.set_defaults(func=teardown)

    # Sub command - run scripts

    args = parser.parse_args()
    args.func(args)

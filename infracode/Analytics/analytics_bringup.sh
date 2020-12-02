# sudo pip3 install flintrock

read -p "How many data nodes would you like for the cluster (e.g. 4)" NUM_CHILD
read -p "Please enter a name for your cluster. Do not use whitespaces (e.g. Grp5_cluster)" CLUSTER_NAME
# read -p "Please enter the name of your key: " KEY_NAME
# read -p "Please enter the path of your key file: " KEY_FILE_PATH

# wget the python file to verify key
# wget ....

python3 verify_key.py Grp5clusters_$NUM_CHILD

echo "Beginning cluster bring up"
flintrock --debug launch $CLUSTER_NAME --num-slaves $NUM_CHILD --spark-version 3.0.1 --hdfs-version 3.3.0 --ec2-key-name Grp5cluster_$NUM_CHILD --ec2-identity-file Grp5cluster_$NUM_CHILD.pem --ec2-ami ami-04d29b6f966df1537 --ec2-instance-type t2.medium --ec2-user ec2-user --install-hdfs --install-spark
# flintrock --debug launch $CLUSTER_NAME --num-slaves $NUM_CHILD --spark-version 2.4.7 --hdfs-version 2.10.1 --ec2-key-name Grp5cluster_$NUM_CHILD --ec2-identity-file Grp5cluster_$NUM_CHILD.pem --ec2-ami ami-04d29b6f966df1537 --ec2-instance-type t2.medium --ec2-user ec2-user --install-hdfs --install-spark
echo "Proceeding to data ingestion"
# wget the python file to ingest data
# wget ....

# SSH into master node 
python3 data_ingestion.py $CLUSTER_NAME

# Execute data ingestion

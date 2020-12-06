python3 verify_key.py GP5_MasterKey

# echo "Beginning cluster bring up"
flintrock --debug launch GP5Analytics --num-slaves $1 --spark-version 3.0.1 --hdfs-version 3.2.1 --ec2-security-group FlintRockGroup5 --ec2-key-name GP5_MasterKey --ec2-identity-file GP5_MasterKey.pem --ec2-ami ami-04d29b6f966df1537 --ec2-instance-type $2 --ec2-user ec2-user --install-hdfs --install-spark

# flintrock --debug launch GP5SGAddTest --num-slaves 1 --spark-version 3.0.1 --hdfs-version 3.2.1 --ec2-security-group FlintRockGroup5 --ec2-key-name Grp5child_1 --ec2-identity-file Grp5child_1.pem --ec2-ami ami-04d29b6f966df1537 --ec2-instance-type t2.medium --ec2-user ec2-user --install-hdfs --install-spark
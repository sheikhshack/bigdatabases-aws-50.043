# First we install the sqoop ala lab 10
echo "First we install sqoop ala lab 10"
mkdir ~/download_sqoop
cd ~/download_sqoop
wget https://apachemirror.sg.wuchna.com/sqoop/1.4.7/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
tar zxvf sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
cp sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env-template.sh sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh

export HD="\/home\/ec2-user\/hadoop"
sed -i "s@#export HADOOP_COMMON_HOME=.*@export HADOOP_COMMON_HOME=/home/ec2-user/hadoop@g" sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh
sed -i "s@#export HADOOP_MAPRED_HOME=.*@export HADOOP_MAPRED_HOME=/home/ec2-user/hadoop@g" sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh

wget https://repo1.maven.org/maven2/commons-lang/commons-lang/2.6/commons-lang-2.6.jar
cp commons-lang-2.6.jar sqoop-1.4.7.bin__hadoop-2.6.0/lib/
cp commons-lang-2.6.jar $SQOOP_HOME/lib/

sudo cp -rf sqoop-1.4.7.bin__hadoop-2.6.0 /opt/sqoop-1.4.7
# for fedora
sudo yum install mysql-connector-java
sudo ln -snvf /usr/share/java/mysql-connector-java.jar /opt/sqoop-1.4.7/lib/mysql-connector-java.jar
# wget https://downloads.mysql.com/archives/get/p/3/file/mysql-connector-java-8.0.21.tar.gz
# tar -xvf mysql-connector-java-8.0.21.tar.gz
#mv mysql-connector-java-8.0.21/mysql-connector-java-8.0.21.jar  /$SQOOP_HOME/lib


# After install everything, add path vars and make sure all working
echo "After install everything, add path vars and make sure all working"
#export PATH=$PATH:/home/ec2-user/hadoop/bin
#export PATH=$PATH:/home/ec2-user/hadoop/sbin
export PATH=$PATH:/opt/sqoop-1.4.7/bin
sqoop version | grep 'Sqoop [0-9].*'
sudo yum install java-1.8.0-openjdk-devel

# then we do import as per normal
#  TODO: needs to be dynamic
sqoop import --connect jdbc:mysql://3.235.224.219:3306/kindleReviews --table kindle_Review_Data --username jeroe --password Helloworld1! --as-parquetfile
# First we install the sqoop ala lab 10
echo "First we install sqoop ala lab 10"
mkdir ~/download_sqoop
cd ~/download_sqoop
wget https://apachemirror.sg.wuchna.com/sqoop/1.4.7/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
tar zxvf sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
cp sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env-template.sh sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh

export HD="\/opt\/hadoop-3.3.0"
sed -i "s/#export HADOOP_COMMON_HOME=.*/export HADOOP_COMMON_HOME=${HD}/g" sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh
sed -i "s/#export HADOOP_MAPRED_HOME=.*/export HADOOP_MAPRED_HOME=${HD}/g" sqoop-1.4.7.bin__hadoop-2.6.0/conf/sqoop-env.sh

wget https://repo1.maven.org/maven2/commons-lang/commons-lang/2.6/commons-lang-2.6.jar
cp commons-lang-2.6.jar sqoop-1.4.7.bin__hadoop-2.6.0/lib/
sudo cp -rf sqoop-1.4.7.bin__hadoop-2.6.0 /opt/sqoop-1.4.7
# for fedora
sudo yum install mysql-connector-java
sudo ln -snvf /usr/share/java/mysql-connector-java.jar /opt/sqoop-1.4.7/lib/mysql-connector-java.jar

# After install everything, add path vars and make sure all working
echo "After install everything, add path vars and make sure all working"
export PATH=$PATH:/opt/hadoop-3.3.0/bin
export PATH=$PATH:/opt/hadoop-3.3.0/sbin
export PATH=$PATH:/opt/sqoop-1.4.7/bin
sqoop version | grep 'Sqoop [0-9].*'

# then we do import as per normal
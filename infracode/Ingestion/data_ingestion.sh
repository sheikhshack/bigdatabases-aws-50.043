# $1 - MySQL public IP address
# $2 - Mongo public IP address

# Install pip for numpy
sudo yum -y install python-pip

#Install numpy for analytics
sudo pip install numpy

# # Add mysql connectors
cd spark/jars/
wget https://www.dropbox.com/s/qutz5se7gykrsnb/mysql-connector-java-5.1.49.jar?dl=0 -O mysql-connector-java-5.1.49.jar

wget https://www.dropbox.com/s/uszfbsj21jeldbt/mysql-connector-java-5.1.49-bin.jar?dl=0 -O mysql-connector-java-5.1.49-bin.jar

cd ~

# Write spark config for SQL ingestion
cd spark/conf/
printf "%s\n" "spark.driver.memory 4g" "spark.executor.memory 4g" > spark-defaults.conf
cd ~

# #wget sql ingestion file
wget https://www.dropbox.com/s/2upe5hv20ag2v2e/ingest_sql.py?dl=0 -O sql_ingestion.py


# run sql ingestion as spark job
spark-submit sql_ingestion.py $1

# download mongodb database tools rpm package
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-amazon2-x86_64-100.2.1.rpm 

# install tools to use mongoexport
sudo yum install -y mongodb-database-tools-*-100.2.1.rpm

set +H

# get contents of mongo database to local memory as json
mongoexport --uri="mongodb://jeroe:Helloworld1!@$2:27017/metadata?authsource=admin" --collection=kindle_Metadata --out=meta.json
# mongoexport --uri="mongodb://jeroe:Helloworld1!@18.212.132.162:27017/metadata?authsource=admin" --collection=kindle_Metadata --out=meta.json

# wget mongo ingestion file
wget https://www.dropbox.com/s/vwf6yxad9k7x1ha/ingest_json.py?dl=0 -O ingest_json.py

# write json from local memory to hdfs as spark job
spark-submit ingest_json.py
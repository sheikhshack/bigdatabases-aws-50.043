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

# wget the jarfiles for spark
# wget https://www.dropbox.com/s/mz54svi0k0wvin2/mongo-spark-connector_2.12-3.0.0.jar?dl=0 -O mongo-spark-connector_2.12-3.0.0.jar

cd ~

# Write spark config for SQL ingestion
cd spark/conf/
printf "%s\n" "spark.driver.memory 4g" "spark.executor.memory 4g" > spark-defaults.conf
cd ~
# #wget sql ingestion file
wget https://www.dropbox.com/s/zs8ldjcc271f75u/injest_sql.py?dl=0 -O sql_ingestion.py


# run sql ingestion as spark job
spark-submit sql_ingestion.py $1

# #Display location of data
# echo "Data from SQL stored in hdfs directory ...."

# #wget mongo ingestion file
# wget https://www.dropbox.com/s/eh26qt2fe0rna8c/injest_mongo.py?dl=0 -O mongo_ingestion.py

# #run mongo ingestion as spark job
# spark-submit mongo_ingestion.py

# #Display location of mongo data
# echo "Data from Mongo stored in hdfs directory ...."

# wget <Get analytics python file from dropbox>

# spark-submit analytics.py

sudo yum install -y mysql

mysqldump -h 3.91.250.152 -u jeroe -pHelloworld1! kindleReviews  > sql_ingested2.csv
mysqldump -h 3.91.250.152 -u jeroe -pHelloworld1! --no-create-info  kindleReviews kindle_Review_Data > sql_reviews_only.csv
mysqldump -h 3.91.250.152 -u jeroe -pHelloworld1! --no-create-info --compact --extended-insert kindleReviews kindle_Review_Data | sed 's$),($),\n($g' > reviews_only2.csv

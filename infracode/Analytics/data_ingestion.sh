# Install pip for numpy
sudo yum -y install python-pip

#Install numpy for analytics
sudo pip install numpy

#wget sql ingestion file
wget https://www.dropbox.com/s/zs8ldjcc271f75u/injest_sql.py?dl=0 -O sql_ingestion.py

#need to specify the path that it is being written to 

#run sql ingestion as spark job
spark-submit sql_ingestion.py

#Display location of data
echo "Data from SQL stored in hdfs directory ...."

#wget mongo ingestion file
wget https://www.dropbox.com/s/eh26qt2fe0rna8c/injest_mongo.py?dl=0 -O mongo_ingestion.py

#run mongo ingestion as spark job
spark-submit mongo_ingestion.py

#Display location of mongo data
echo "Data from Mongo stored in hdfs directory ...."

# Group 5 50.043 Project

## Instructions

### How to run
Since we will be running on a test environment base image of Ubuntu 16.04, our installation script takes care of installing the necessary dependencies for our automation scripts to work. Our installation script is also responsible for setting the AWS credentials for the session.

Obtain our installation script and execute it with the command below.
```
git clone https://github.com/sheikhshack/bigdatabases-aws-50.043.git
cd bigdatabases-aws-50.043/infracode/Core/
chmod +x install_kiat.sh
./install_kiat.sh
```

The installation script should prompt you to enter you AWS credentials and download the necessary dependencies,

Once done, you can navigate to your `core` directory to see our ~~init.py~~ `main.py` file. 

This `main.py` file is responsible for 5 main functions
1. [Bringing up all necessary EC2 instances](#bringing-up-all-ec2-instances)
2. Ingesting data from Production databases
3. Rescaling Analytics cluster
4. Running analytics tasks on cluster
5. [Tearing down all instances](#tearing-down-all-instances)

Check the documentation for the script on the terminal with
```
python3 main.py --help
```


#### Bringing up all EC2 instances
Our script allow you the liberty to choose which systems you would like to bring up. You are also given the option to bring up all instances at once.
**Note: Please adjust mode to sequential via `-c sequential` if the script doesn't run properly or running on cheap instance**

```
python3 main.py bringup [-n numWorkerNodes] [-tp productionInstanceType] [-tn analyticsInstanceType] [-a analyticsScripts] [-m modeOfBringUp] [-c enableThreading]

-n                Number of worker nodes for the analytics cluster
                  Any integer numbers (default: 4)


-tp               Instance type of productions servers
                  Choices: "t2.small", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium" (default: "t2.medium")
                  

-tn               Instance type of analytics servers
                  Choices: "t2.small", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium" (default: "t2.xlarge")
                  
                  
-a                Execute analytics scripts after instances are brought up
                  Choices: "tfidf", "pearson", "both"
                  
                  
-m                Specify the type of bringup desired
                  Choices: "production-only", "full" (default: "full")
                  
                  
-c                Enable threading execution
                  Choices: "parallel", "sequential" (default: "parallel")
```

**NOTE**: If your system has any issues running the script, please run the bringup in sequential mode by using the command below
```
python3 main.py bringup -a full -c sequential
```

Example usage: To bring up all instances at once, without running any analytics scripts with default instance types, use this command
```
python3 main.py bringup -a full
```

#### Ingesting data from Production databases
You can use the script to ingest data from the production database to the analytics cluster once they are provisioned and running. To run the ingestion task, use this command

```
python3 main.py ingest
```


#### Rescaling Analytics cluster
Our script also allow you to rescale the analytics cluster once they are provisioned and running.

```
python3 main.py modify [-n newNumWorkerNodes] [-t newAnalyticsInstanceType] 

-n                Number of worker nodes for the analytics cluster
                  Choices: Any integer numbers (default: 4)


-t                Instance type of analytics servers
                  Choices: "t2.small", "t2.2xlarge", "t2.xlarge", "t2.large", "t2.medium" (default: "t2.xlarge")

```

Example usage: To rescale an existing cluster to 3 worker nodes with a t2.medium instance type, use this command
```
python3 main.py modify -n 3 -t t2.medium
```

After rescaling, we have opted not to make a copy of the ingested data and redistribute to the new clusters. The user can opt to run an ingest command to populate the cluster. This is to ensure that the latest data from the databases are ingested whenever rescaling takes place.

#### Running analytics task on cluster
You can use the script to run the analytics task on the analytics cluster once they are provisioned and running. Please see the documentation in [bringup](#bringing-up-all-ec2-instances)

```
python3 main.py analytics [-a analyticsTask] [-v vocabSize] 

-a                Type of analytics scripts to run
                  Choice: "tfidf", "pearson", "both" (default: "both")


-v                Vocab size for tf-idf
                  Choices: Any positive integer (default: 20)

```

Example usage: To run both analytics task on the cluster with vocab size of 20, use this command
```
python3 main.py analytics -a both 20
```

The output of the analytics task is stored in both hdfs and the local storage of the master node.
```
tf_idf storage location(local): /home/ec2-user/analytics_output/tf_idf
tf_idf storage location(hdfs): /tf_idf 

pearson storage location(local): /home/ec2-user/analytics_output/pearson_correlation
 pearson storage location(hdfs): /pearson_correlation
```

You can SSH into the server with the command below. Make sure to edit the master node IP address.
```
ssh -i GP5_GRANDMASTERKEY.pem ec2-user@<master_node_IP>
```

#### Tearing down instances
Our script also allow you to tear down the system of instances according to your preference.

```
python3 main.py teardown [-m modeOfTearDown]

-m                Specify which systems to teardown
                  Choices: "analytics-only", "full" (default: "full")

```

Example usage: To tear down **all** system of instances, use this command
```
python3 init.py teardown
```

## Dataset
### Dataset Inspection and Cleaning
We were provided with 2 public datasets from Amazon.
1. Amazon Kindle’s reviews, available from [Kaggle website](https://www.kaggle.com/bharadwaj6/kindle-reviews). Dataset has 982,619 entries (about 700MB). 
2. Amazon Kindle metadata, available from [UCSD website](http://jmcauley.ucsd.edu/data/amazon/). Dataset has 434,702 products (about 450MB)

Upon inspection of the datasets, we observed that many columns had missing data. To ensure that our website would be well populated, we scraped the missing data from datasets we found on kaggle. 

We took data from these two datasets:
1. https://www.kaggle.com/ucffool/amazon-sales-rank-data-for-print-and-kindle-books
2. https://www.kaggle.com/snathjr/kindle-books-dataset

To populate the missing data, we used a Jupyter notebook. To use, open Kindle Database Cleaner.ipynb. The Jupyter notebook is annotated with instructions and explanations. All other files used in the Jupyter notebook are included in this folder (except for original metadata file as file > 100mb). In total, we managed to scrape around 12000+ clean entries. 

## Production System
### Frontend
A front-end with at least the following functionalities:
1. Add a new book
2. Search for existing book by author and by title.
3. Add a new review
4. Sort books by reviews, gernes.

**Framework**
For the front-end, we utilised a series of libraries along with the React Framework to emulate a simple book reading website

**Features**
We have implemented all the following
- All the requirements
- Added logging page for monitoring the logs of the entire system (sensitive content has been redacted)
- Added user login system for submitting reviews and other user related controls
**Preview**

### Backend

**Framework**
For the backend, we utilised the NodeJS environment with ExpressJS to server the api. In this fashion, we were able to seamlessly integrate both the front and back, such that we can serve both api endpoints and the static html webpages from a single server instance

**Features**
We have implememnted all the following
- All the requirements
- Added redacted and sesitiivty based logging via `winsonJS` to redact any endpoints with sensitive data (such as passwords) form the logs
- Added an additional health monitoring logging feature (`collection_name: syshealth`) which tracks the health state of the entire production server
- Added secure password management etc using `bcrypt` and proper auth protocols such as `jwt`

## Database Schema
### Schema (SQL)
```
DB - kindleReview

Table - kindle_Review_Data
id: INT, PRIMARY KEY
asin: VARCHAR
helpful: VARCHAR
OVERALL: INT
reviewText: TEXT
reviewTime: VARCHAR
reviewerID: VARCHAR, FOREIGN KEY
summary: TEXT
unixReview: BIGINT

Table - kindle_Users
reviewerID: VARCHAR, PRIMARY KEY
reviewerName: VARCHAR
email: VARCHAR, UNIQUE 
passwordHash: VARCHAR
```
### Schema (MongoDB)
```
DB - metadata

Collection - kindle_Metadata
_id: ObjectId
asin: String
description: String
price: Double
imUrl: String
related: Object
categories: Array
title: String
author: String
salesRank: Object
brand: Null

DB - logger 

Colllection - logs
_id: ObjectId
timestamp: Date
level: String
message: String
meta: Object

Collection - syshealth
_id: ObjectId
timestamp: Date
level: String
message: String
meta: Object
hostname: String
```

## Analytics Systems
### Data Ingestion
Our setup is constructed in a way that data ingestion from Mongo and MySQL DB can be triggered upon user's request. This is done so as we anticipate changes to be made in the databases right after production. Hence data ingestion is not automate immedidately after production set up and only upon request. 

#### Book Metadata from MongoDB
To move our data from one or more sources to a destination where it can be stored and further analyzed, we made use of mongoexport. mongoexport is a command-line tool that produces a JSON or CSV export of data stored in a MongoDB instance.

1. Installation Steps
```
# Install Mongo Database Tools Package which mongoexport belongs to
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-amazon2-x86_64-100.2.1.rpm 
sudo yum install -y mongodb-database-tools-*-100.2.1.rpm
# Turn off history substitution
set +H
```
2. Move the data using mongoexport
```
mongoexport --uri="mongodb://jeroe:Helloworld1!@18.212.132.162:27017/metadata?authsource=admin" --collection=kindle_Metadata --out=meta.json
```
3. Download python file ingest_json.py for set up of spark session
```
# initialise spark session
def init_spark(name="HelloWorld"):
    spark = SparkSession.builder.appName("HelloWorld").getOrCreate()
    sc = spark.sparkContext
    return spark,sc

df=spark.read.json('file:////home/ec2-user/meta.json')

path = 'mongo_ingestion'
df.write.save(path,format='json',mode='overwrite')
```
4. Ingest Data
```
spark-submit ingest_json.py
```
#### Book Reviews from SQL
To read and store our book review data from our MySQL database into the HDFS, we utilised SparkSQL with the JDBC driver. JDBC is a driver which can read data from other databases into a Spark Dataframe. It is then further saved as a CSV file and stored in HDFS.

1. Installation Steps
Install mysql-connector jar files and store them in spark jar folders "$SPARK_HOME/jar".
```
mysql-connector-java-5.1.49 and mysql-connector-java-5.1.49-bin
```
2. Configurations
Allocate sufficient spark driver memory and executor memory to read the files. This allocation is done in "$SPARK_HOME/conf/spark-defaults.conf". We have allocated 6g of memory for both.

In $SPARK_HOME/conf/spark-defaults.conf folder:
```
spark.driver.memory 6g
spark.executor.memory 6g
```

3. Ingest Data with ingest_sql.py
```
spark-submit ingest_sql.py
```

After ingesting the book data and reviews from Mongo and MySQL DB respectively, we are then able to proceed on with our analytics tasks to compute Pearson Correlation and TF-IDF scores as required.


### Pearson Correlation
To get the Pearson Correlation score between the average reviewText length of each book and its price. 
1. Cleaning of data. 
Get the average reviews for each book in the reviews df and then followed by merging it with the books df where it contains the price
```
df_review = df1.withColumn("reviewTextLength", length(df1.reviewText))
# group by book asin
df_rev_avg = df_review.groupBy("asin").agg(mean("reviewTextLength").alias("averageReviewLength"))

df_combine = df_rev_avg.join(df2, ['asin'])
df_combine = df_combine.drop('asin').select('price', 'averageReviewLength')
```
2. Pearson Correlation formula used for calculation. It is a restructured formula where it will allow us to implement the computation via map reduce.
```
Pearson Correclation Restructured Formula = (SumToN(Xi*Yi) - n(Xmean*Ymean)) / ((Sqrt(SumToN(Xi^2 - n*Xmean^2) * (Sqrt(SumToN(Yi^2 - n*Ymean^2))
referenced from: https://suvirjain.com/pearsons-correlation-coefficient-using-apache-spark-and-map-reduce/
```
3. Using Map Reduce, assign required values (x, y, x^2, y^2, x*y) for computation
```
# For each row, calculate values to be used for later on
    flat_data = data.flatMap(lambda row: (
        ("x", row[0]),
        ("y", row[1]),
        ("x_square", row[0] * row[0]),
        ("y_square", row[1] * row[1]),
        ("xy", row[0] * row[1])))

# Sum up all the individual values for all items in the list
reduced_data = flat_data.reduceByKey(lambda i, j: i + j).sortByKey()

# Retrieving our terms required for calculating the correlation
summed_data = reduced_data.take(5)
x_sum = summed_data[0][1]
x_square_sum = summed_data[1][1]
xy_sum = summed_data[2][1]
y_sum = summed_data[3][1]
y_square_sum = summed_data[4][1]
```
4. Complete calculation based on formula
```
# numerator = (SumToN(Xi*Yi) - n(Xmean*Ymean))
num = xy_sum - (x_sum * y_sum) / count
# denominator = ((Sqrt(SumToN(Xi^2 - n*Xmean^2) * (Sqrt(SumToN(Yi^2 - n*Ymean^2))
den = math.sqrt(x_square_sum - (x_sum * x_sum) / count) * math.sqrt(y_square_sum - (y_sum * y_sum) / count)
correlation = num / den
final_Statement = "Pearson Correlation between average review length and price: " + str(correlation)
print(final_Statement)
# saving output file  (change output path when doing automation)
output = [{'Pearson Correlation between average review length and price':str(correlation)}]
df_output = spark.createDataFrame(output)
# df_output.write.format('json').save(pc_output_path).mode('overwrite')
```
### TF-IDF
To compute the term frequency inverse document frequency metric on the review text. Every review is treated as a document and a metric will be assigned to each word in the document.
1. Tokenize each review which converts the each review string into a list of words
```
tokenizer = Tokenizer(inputCol="reviewText", outputCol="words")
wordsData = tokenizer.transform(df)
```

2. Use CountVectorizer to retrieve TF vectors and apply IDF. We chose to use CountVectorizer instead of HashingTF as it allows us to map the index in the results back to its original input word. vocab_size selected is the top number of words stored in the vocabulary ordered by term frequency. 
```
cv = CountVectorizer(inputCol="words", outputCol="rawFeatures", vocabSize=vocab_size)
model = cv.fit(wordsData)
featurizedData = model.transform(wordsData)
idf = IDF(inputCol="rawFeatures", outputCol="features")
idfModel = idf.fit(featurizedData)
rescaledData = idfModel.transform(featurizedData)
```
3. Build Vocabulary from model. This is a list which houses the different words from all documents. The size of it is determined by the vocab_size 
```
vocab = model.vocabulary
```
4. Transform and map index back to the word in the document and output results. Results will be in the form of "word: tf_idf score"
```
def row_transform(row):
        mapping = {}
        array = row.toArray()
        for i in range(len(vocab)):  # looping through vocab
            if (array[i] != 0):  # if there is a word in the document present in the word vocab
                word = vocab[i].encode('utf-8')  # add word vocab
                score = array[i]  # add word score
                mapping[word] = score  # insert to dictionary as a word: score
        return str(mapping)

transform = udf(lambda row: row_transform(row))    #perform transformation on each row
final_df = rescaledData.withColumn('tf_idf', transform(rescaledData.features))
final_df = final_df.select('id', 'tf_idf')
print('saving output file')
final_df.write.format('csv').mode('overwrite').save(tf_idf_output_path)
print('TF_IDF complete')
print('Time taken to completed TF_IDF: {} seconds'.format(time.time()-time_tf_idf))
```
## Automation
### Design
EC2 Instance Map

![](https://i.imgur.com/umE6X7H.png)

All IP addresses will be provided by the bring up script
| Instance | Holdings                                                  | Extra information                                                                                                                                             |
|----------|-----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1        | Frontend: React Backend: Node.js/Express.js               | Frontend and backend is hosted at port 5000.  Website can be accessed via <IP address>:5000.                                                                  |
| 2        | KindleReviews: MySQL                                      | Access data via backend and namenode at <IP address>:3306.                                                                                                    |
| 3        | kindle_Metadata: MongoDB logs: MongoDB syshealth: MongoDB |  Access data via backend and namenode at <IP address>:27017.                                                                                                  |
| 4        | Namenode: HDFS Driver: Spark                              | Datanodes public DNS are stored on the Namenode. HDFS  cluster can be accessed at <Master IP>:9000.    |
| 5...n    | Node X: HDFS Worker: Spark                                | Tasks are assigned to worker by driver.                                                                                                                       |

### How we made it work
To set up and tear down the clusters we used flintrock
Flintrock library - https://github.com/nchammas/flintrock
Flintrock is a command-line tool for launching Apache Spark Clusters

1. Configure security groups for namenode and datanode. This is because flintrock is originally configured for Hadoop 2 and Spark 3. The change in Hadoop 3 that affects us is the change in the ports used. Therefore we have to configure a new security group to allow for these ports to be in use.
```
SECURITY_DEFAULTS = {
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
```

2. Set up Clusters. Install HDFS and Spark inside clusters. Hand over pem key and other configurations. Bring up analytics. 
``` 
flintrock --debug launch GP5Analytics --num-slaves 2 --spark-version 3.0.1 --hdfs-version 3.2.1 --ec2-security-group FlintRockGroup5 --ec2-key-name GP5_MasterKey --ec2-identity-file GP5_MasterKey.pem --ec2-security-group FlintRockGroup5 --ec2-ami ami-04d29b6f966df1537 --ec2-instance-type t2.large --ec2-user ec2-user --install-hdfs --install-spark
```

3. Tear down cluster
```
flintrock destory <name of cluster>
```

## Future Improvements
1. Use a better data ingestion tool for mongoDB. MongoExport had slower than expected performance and if we had written our own specific tool, we might have produced faster results

2. Obtaining the results from our analytics tasks and displaying in a reader-friendly manner is a challenge. In the future, we can look into retrieving the analysed data from the instance and displaying then in a more readable manner.
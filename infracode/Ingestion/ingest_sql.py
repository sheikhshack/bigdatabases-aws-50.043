import pyspark
from pyspark.sql import SparkSession, Row, DataFrame
from pyspark.sql.types import * # Import all from `sql.types`
from pyspark.sql import functions as F
from pyspark.sql.window import Window
from pyspark.ml.feature import HashingTF, IDF, Tokenizer, CountVectorizer
from pyspark.ml.linalg import Vectors
from pyspark.ml.stat import Correlation
import os
import numpy as np
from datetime import datetime, timedelta
from functools import reduce
from time import time
from pyspark.sql import SQLContext
import sys

spark = SparkSession.builder.getOrCreate()

url = "jdbc:mysql://{}:3306/kindleReviews".format(sys.argv[1])
table = "kindle_Review_Data"
user = "jeroe"
password = "Helloworld1!"

df = spark.read \
    .format("jdbc") \
    .option("url", url) \
    .option("driver", "com.mysql.jdbc.Driver")\
    .option("dbtable", table) \
    .option("user", user) \
    .option("password", password) \
    .load()\
# df=spark.read.csv(r'C:\Users\jeroe\Desktop\Term 6\50.043 DB\project stuffz\kindle_Review_User_Reduced.csv', header=True)

# df.printSchema()
# df.show(5)
# df.show(1)
#pls input your own path
path = '/sql_ingestion'
df.write.mode('overwrite').format('csv').save(path, header=True)
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


# initialise spark session
def init_spark(name="HelloWorld"):
    spark = SparkSession.builder.appName("HelloWorld").getOrCreate()
    sc = spark.sparkContext
    return spark,sc
spark, sc = init_spark(name='SparkTest')

df=spark.read.json('file:////home/ec2-user/meta.json')

path = '/mongo_ingestion'
df.write.save(path,format='json',mode='overwrite')
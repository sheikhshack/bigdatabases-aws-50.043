import pyspark
from pyspark.sql import SparkSession, Row, DataFrame
from pyspark.sql.types import * # Import all from `sql.types`
from pyspark.sql.functions import *
from pyspark.sql.window import Window
from pyspark.ml.feature import HashingTF, IDF, Tokenizer, CountVectorizer
from pyspark.ml.linalg import Vectors
from pyspark.ml.stat import Correlation
import os
import numpy as np
from datetime import datetime, timedelta
from functools import reduce
import time
import math
import argparse


# input paths for data I/O
sql_input_path="/sql_ingestion"
mongo_input_path="/mongo_ingestion"

# hdfs and master node output paths
tf_idf_output_path="/tf_idf"
pc_output_path = "/pearson_correlation"
tf_idf_local = "file:////home/ec2-user/analytics_output/tf_idf"
pc_local = "file:////home/ec2-user/analytics_output/pearson_correlation"

#including arguments
parser = argparse.ArgumentParser()
parser.add_argument("--tf_idf", help="Run tf-idf analytics task", action='store_true')
parser.add_argument("--pearson", help='Run pearson-correlation analytics task', action='store_true')
parser.add_argument("--vocab_size", type=int, help='Choose vocab size for tf_idf')
args = parser.parse_args()


# initialise spark session
def init_spark(name="HelloWorld"):
    spark = SparkSession.builder.appName("HelloWorld").getOrCreate()
    sc = spark.sparkContext
    return spark,sc

# calculating TF-IDF score for every word in all reviews
def TF_IDF(df):
    print('starting TF_IDF')
    time_tf_idf = time.time()
    tokenizer = Tokenizer(inputCol="reviewText", outputCol="words")
    wordsData = tokenizer.transform(df)  # gets an additional column which gives u a list of words
    if args.vocab_size is None:
        vocab_size = 20
    else:
        vocab_size=args.vocab_size
    print('Considering only top {} terms ordered by term frequency for TF-IDF computation'.format(vocab_size))
    cv = CountVectorizer(inputCol="words", outputCol="rawFeatures", vocabSize=vocab_size)
    model = cv.fit(wordsData)
    featurizedData = model.transform(wordsData)
    idf = IDF(inputCol="rawFeatures", outputCol="features")
    idfModel = idf.fit(featurizedData)
    tf_idf_output = idfModel.transform(featurizedData)

    # getting model vocabulary
    vocab = model.vocabulary

    transform = udf(lambda row: row_transform(row))
    def row_transform(row):
        mapping = {}
        array = row.toArray()
        for i in range(len(vocab)):  # looping through vocab
            if (array[i] != 0):  # if there is a word in the document present in the word vocab
                word = vocab[i].encode('utf-8')  # add word vocab
                score = array[i]  # add word score
                mapping[word] = score  # insert to dictionary as a word: score
        return str(mapping)

    final_df = tf_idf_output.withColumn('tf_idf', transform(tf_idf_output.features))
    final_df = final_df.select('id', 'tf_idf')
    print('saving output file')
    #save in hdfs
    final_df.repartition(1).write.format('csv').mode('overwrite').save(tf_idf_output_path, header=True)
    #save in master node
    final_df.repartition(1).write.format('csv').mode('overwrite').save(tf_idf_local, header=True)
    print('TF_IDF complete')
    print('Time taken to completed TF_IDF: {} seconds'.format(time.time()-time_tf_idf))

# calculating Pearson Correlation between average review length and price for book
def PearsonCorrelation(df1,df2):  #df1=review df2=meta
    print('starting Pearson Correlation')
    time_pc = time.time()
    df_review = df1.withColumn("reviewTextLength", length(df1.reviewText))
    # group by book asin
    df_rev_avg = df_review.groupBy("asin").agg(mean("reviewTextLength").alias("averageReviewLength"))

    df_combine = df_rev_avg.join(df2, ['asin'])
    df_combine = df_combine.drop('asin').select('price', 'averageReviewLength')

    # map data in combined_df into a nested list containing (price,averageReviewLength)
    data = df_combine.rdd.map(list)
    count = data.count()

    '''
    Pearson Correlation modified formula
    = (SumToN(Xi*Yi) - n(Xmean*Ymean)) / ((Sqrt(SumToN(Xi^2 - n*Xmean^2) * (Sqrt(SumToN(Yi^2 - n*Ymean^2))
    Referenced from: https://suvirjain.com/pearsons-correlation-coefficient-using-apache-spark-and-map-reduce/
    '''

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

    # numerator = (SumToN(Xi*Yi) - n(Xmean*Ymean))
    num = xy_sum - (x_sum * y_sum) / count
    # denominator = ((Sqrt(SumToN(Xi^2 - n*Xmean^2) * (Sqrt(SumToN(Yi^2 - n*Ymean^2))
    den = math.sqrt(x_square_sum - (x_sum * x_sum) / count) * math.sqrt(y_square_sum - (y_sum * y_sum) / count)
    correlation = num / den
    final_Statement = "Pearson Correlation between average review length and price: " + str(correlation)
    print(final_Statement)
    # saving output file
    output = [{'Pearson Correlation between average review length and price':str(correlation)}]
    df_output = spark.createDataFrame(output)
    print('saving output file')
    #save in hdfs
    df_output.repartition(1).write.format('json').mode('overwrite').save(pc_output_path)
    #save in master node
    df_output.repartition(1).write.format('json').mode('overwrite').save(pc_local)
    print('Pearson Correlation complete')
    print('Time taken to completed PC: {} seconds'.format(time.time()-time_pc))



if __name__ == '__main__':
    if not args.tf_idf and not args.pearson:
        print("please add in arguments '--tf_idf' or/and '--pearson' to start running analytics tasks. You may choose to include '--vocab_size <int value>' argument with tf-idf to specify vocab size in tf-idf task, if not default size is 20")
    else:
        spark, sc = init_spark(name='SparkTest')
        spark.sparkContext.setLogLevel("ERROR")
        print('Starting Analytics Task')
        time_start = time.time()
        print('ingesting data into spark')
        # reading data from hdfs
        df_meta = spark.read.json(mongo_input_path)
        df_review = spark.read.option("header", True).csv(sql_input_path)
        print('data pre-processing')
        df_meta = df_meta.select(df_meta.asin, df_meta.price)  # only want asin and price from metadata
        df_meta = df_meta.filter(df_meta.price.isNotNull()).filter(
            df_meta.price > 0)  # remove rows where price is null or 0
        df_review = df_review.filter(df_review.reviewText.isNotNull())  # remove rows where reviewText is null
        df_review = df_review.select(df_review.id, df_review.asin, df_review.reviewText)
        if args.tf_idf:
            TF_IDF(df_review)
        if args.pearson:
            PearsonCorrelation(df_review,df_meta)
        print('Analytics Task Completed. Total time elapsed: {} seconds'.format(time.time()-time_start))

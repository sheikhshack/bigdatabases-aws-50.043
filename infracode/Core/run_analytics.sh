# $1 - analytics task to be performed
# $2 - vocab size

cd ~

FILE=analytics.py

if [ ! -f "$FILE" ];
then 
    # TODO: do this dropbox link
    wget https://www.dropbox.com/s/5o3jaqaczeb7ln1/analytics.py -O analytics.py
fi

if [ $1 = "pearson" ]
then 
    spark-submit analytics.py --pearson

fi 

if [ $1 = "tfidf" ]
then
    spark-submit analytics.py --tf_idf --vocab_size $2
fi

if [ $1 = "both" ]
then
    spark-submit analytics.py --tf_idf --pearson --vocab_size $2
fi
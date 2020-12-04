USE kindleReviews;

# Load data from local file to Users table
LOAD DATA LOCAL INFILE '/home/ubuntu/data/kindle_Users.csv' INTO TABLE kindle_Users FIELDS TERMINATED BY ',' IGNORE 1 ROWS;

# Load data from local file to Reviews table
LOAD DATA LOCAL INFILE '/home/ubuntu/data/kindle_Review_User_Reduced.csv' INTO TABLE kindle_Review_Data FIELDS TERMINATED BY ',' ENCLOSED BY '"' IGNORE 1 ROWS;
CREATE DATABASE kindleReviews;

USE kindleReviews;

CREATE TABLE kindle_Users (
reviewerID varchar(255) NOT NULL,
reviewerName varchar(255) NOT NULL,
email varchar(255) NOT NULL,
passwordHash varchar(255) DEFAULT "$2b$10$gWG5pJVIqHcVO5Ch1u6dsOdpPUlvC2eJTJxOshjbUojxqewiK8Cwm",
PRIMARY KEY (reviewerID),
UNIQUE KEY(email)
);

CREATE TABLE kindle_Review_Data ( 
id int(11) NOT NULL AUTO_INCREMENT, 
asin varchar(255) DEFAULT NULL, 
helpful varchar(255) DEFAULT NULL, 
overall int(11) DEFAULT NULL, 
reviewText text, 
reviewTime varchar(255) DEFAULT NULL, 
reviewerID varchar(255) DEFAULT NULL, 
summary text, unixReviewTime bigint(11) 
DEFAULT NULL, PRIMARY KEY(id), 
FOREIGN KEY (reviewerID) REFERENCES kindle_Users(reviewerID) 
);
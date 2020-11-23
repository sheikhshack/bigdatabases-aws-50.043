#!/bin/bash

echo "---Setting Up MongoDB--- "

# Download mongo
{
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
} || {
    # catch
    echo "ERROR: installing mongodb"
}

# Download data
{
    wget https://www.dropbox.com/s/pcs7b9x70cwiki8/meta_Compiled_Count_haveTitle.json?dl=1 -O metadata.json
} || {
    # catch
    echo "ERROR: downloading data"
}

{
    sudo service mongod start
} || {
    sudo systemctl enable mongod
    sudo service mongod start
}

# Set up admin

while :
do
    if mongo localhost:27017/admin --eval 'db.createUser({ user: "jeroe", pwd: "Helloworld1!", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]})' ; then
        break
    else
        echo "Command failed, retrying..."
    fi
done

# Allow access from everywhere
echo "Changing mongd.conf"
sudo sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf
sudo sh -c 'echo "security:\n  authorization : enabled" >> /etc/mongod.conf'
sudo service mongod restart

# import dataset
{
    echo "Importing dataset"
    mongoimport --db metadata --collection kindle_Metadata --file metadata.json --authenticationDatabase admin --username 'jeroe' --password 'Helloworld!'
    # mongoimport -d isit_database_mongo -c kindle_metadata --file meta_Kindle_Store.json --authenticationDatabase admin --username 'admin' --password 'password' --legacy
    # mongoimport -d isit_database_mongo -c categories --drop --file categories.json --authenticationDatabase admin --username 'admin' --password 'password'
} || {
    echo "ERROR: importing data to mongo"
}

echo "---MongoDB Set Up Finish---"
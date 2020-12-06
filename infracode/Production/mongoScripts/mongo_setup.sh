#!/bin/bash
echo "Install Mongo ....."
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
echo "Updating system packages ....."
sudo apt-get update
sudo apt-get install -y mongodb-org
echo "Downloading data ....."
wget https://www.dropbox.com/s/uh7mwjfy6ur8tg0/meta_Compiled_Count_trueTitle.json?dl=1 -O metadata1.json
wget https://www.dropbox.com/s/vt9s3gqp5tsakqn/meta_Compiled_Count_falseTitle.json?dl=1 -O metadata2.json
echo "Starting mongo ....."
{
    sudo service mongod start
} || {
    sudo systemctl enable mongod
    sudo service mongod start
}
echo "Create new user"
while :
do
    if mongo localhost:27017/admin --eval 'db.createUser({ user: "jeroe", pwd: "Helloworld1!", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]})' ; then
        break
    else
        echo "Command failed, retrying ....."
    fi
done
echo "Executing data migration Mongo scripts ....."
mongoimport --db metadata --collection kindle_Metadata --file metadata1.json --authenticationDatabase admin --username 'jeroe' --password 'Helloworld1!'
mongoimport --db metadata --collection kindle_Metadata --file metadata2.json --authenticationDatabase admin --username 'jeroe' --password 'Helloworld1!'
sudo sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf
sudo sh -c 'echo "security:\n  authorization : enabled" >> /etc/mongod.conf'
sudo service mongod restart

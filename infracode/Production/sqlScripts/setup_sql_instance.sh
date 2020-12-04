echo Updating system packages .....
sudo apt-get update
echo Install MySQL .....
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password 50043'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password 50043'
sudo apt-get -y install mysql-server
mkdir data
cd data/
echo Downloading data .....
wget https://www.dropbox.com/s/mg2b09plxocrgi6/kindle_Users.csv
wget https://www.dropbox.com/s/2ph07tvq6jcijo8/kindle_Review_User_Reduced.csv
cd ..
echo Downloading data migration SQL scripts .....
wget --output-document=create_admin_user.sql https://www.dropbox.com/s/uu3bk0mkmcy5y9j/create_admin_user.sql
wget --output-document=create_tables.sql https://www.dropbox.com/s/l6fvlra9w7hx4oe/create_tables.sql
wget --output-document=load_data.sql https://www.dropbox.com/s/tqgx8wnn3r4nb7o/load_data.sql
echo Executing data migration SQL scripts .....
echo Create new user
sudo mysql -u root -p50043 < create_admin_user.sql
echo Create relevant -p tables
sudo mysql -u root -p50043 < create_tables.sql
echo Load data from sources
sudo mysql -u root -p50043 < load_data.sql
sudo sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql
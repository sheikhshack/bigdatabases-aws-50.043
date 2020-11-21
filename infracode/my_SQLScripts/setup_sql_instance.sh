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
wget --output-document=create_admin_user.sql https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/create_admin_user.sql?token=AKXRJGP5RTEIOHROWCMKZXK7YHA2A
wget --output-document=create_tables.sql https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/create_tables.sql?token=AKXRJGIYFYKIUIOZAJM7JT27YHA3C
wget --output-document=load_data.sql https://raw.githubusercontent.com/sheikhshack/bigdatabases-aws-50.043/infra/infracode/my_SQLScripts/load_data.sql?token=AKXRJGNZP6VRDC5LODINHF27YHA4E
echo Executing data migration SQL scripts .....
echo Create new user
sudo mysql -u root -p50043 < create_admin_user.sql
echo Create relevant -p tables
sudo mysql -u root -p50043 < create_tables.sql
echo Load data from sources
sudo mysql -u root -p50043 < load_data.sql
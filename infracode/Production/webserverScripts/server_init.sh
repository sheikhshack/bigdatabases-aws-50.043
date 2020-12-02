
# This script is for the webserver bring-up. Take note that script accepts 2 positional arguments:
# 1. SQLIP after provisioning
# 2. MongoDB IP after provisioning


# Fetching built nodeJS app for deployment and fixing vars
echo "Setting up and installing server requirements"
cd "$HOME"
wget https://www.dropbox.com/s/kz8jz3irepuzw10/buildimage.tar.gz?dl=1  -O - | tar -xz
sed -i "s_<SQLIP>_$1_g;s_<MONGODBURI>_$2_g" server/.env

# Setting up and Installing node environment and PM2 for persistence
sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash - && sudo apt-get install -y nodejs
sudo npm install pm2 -g

# Proceeds to run the server using PM2
echo "Deploying server to port 5000"
cd server && npm install && sudo pm2 start index.js && sudo pm2 startup
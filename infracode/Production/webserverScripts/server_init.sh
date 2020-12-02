# This script is for the webserver bring-up. Take note that script accepts 2 positional arguments:
# 1. SQLIP after provisioning
# 2. MongoDB IP after provisioning
# shellcheck disable=SC2164
cd "$HOME"; wget https://www.dropbox.com/s/kz8jz3irepuzw10/buildimage.tar.gz?dl=1  -O - | tar -xz
sed -i "s_<SQLIP>_$1_g;s_<MONGODBURI>_$2_g" server/.env
sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash - && sudo apt-get install -y nodejs && \
sudo npm install pm2 -g && \
cd server && \
npm install &&\
sudo pm2 start index.js && sudo pm2 startup
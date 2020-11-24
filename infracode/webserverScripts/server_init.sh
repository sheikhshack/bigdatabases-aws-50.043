sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash - && sudo apt-get install -y nodejs && \
sudo npm install pm2 -g && \
cd server && \
npm install &&\
sudo pm2 start index.js && sudo pm2 startup
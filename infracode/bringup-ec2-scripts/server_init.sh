# first ssh into the instance
ssh ubuntu@54.237.41.57 -i BOTO_TEST_RUN_v2.pem
# proceeds to generate compatible sha256 key for github access
ssh-keygen -t ed25519 -C "redfreak97@gmail.com"
ssh-add ~/.ssh/id_ed25519

echo "Host github.com-repo-0
        Hostname github.com
        IdentityFile=/home/ubuntu/.ssh/id_ed25519
" > ~/.ssh/config

echo "-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACDGXyBqutfc5SYhs1wx5jNNFaYJ654wQDcuO2aT2TR/6wAAAJjxK4M58SuD
OQAAAAtzc2gtZWQyNTUxOQAAACDGXyBqutfc5SYhs1wx5jNNFaYJ654wQDcuO2aT2TR/6w
AAAEDfEJz1pkNo/+PCoKmWkBJ3A/yLWCfDLhwEVXqKHsir6sZfIGq619zlJiGzXDHmM00V
pgnrnjBANy47ZpPZNH/rAAAAFHJlZGZyZWFrOTdAZ21haWwuY29tAQ==
-----END OPENSSH PRIVATE KEY-----
" > ~/.ssh/id_ed25519


curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && sudo apt-get install -y nodejs && \
sudo npm install pm2 -g && \
mkdir app && cd app && \
git clone git@github.com-repo-0:sheikhshack/bigdatabases-aws-50.043.git && \
cd bigdatabases-aws-50.043/server/ && \
npm install && npm run build:front &&\
sudo pm2 start index.js && sudo pm2 startup &&\






chmod 600 ~/.ssh/config


git clone https://<Personal Access Token>@github.com/<Org name>/<Repo_name>.git


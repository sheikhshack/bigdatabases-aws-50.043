curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs && \
npm install pm2 -g && \
mkdir app && cd app && \
git clone  && \
cd bigdatabases-aws-50.043/server/ && \
npm install && npm run build:front &&\
pm2 start index.js && pm2 startup
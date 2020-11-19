FROM ubuntu:16.04
RUN apt-get update && apt install -y git
RUN apt install curl
COPY server-test.sh ./script/server-test.sh
WORKDIR /script
RUN chmod 777 server-test.sh
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs

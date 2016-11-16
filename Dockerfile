FROM ubuntu:14.04

RUN apt-get update && apt-get upgrade -y

RUN apt-get install curl -y

RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN apt-get install -y nodejs && apt-get clean

WORKDIR /app

ADD package.json /app/package.json
ADD index.js /app/index.js

RUN npm install

CMD ["node", "index.js"]

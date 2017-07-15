FROM node:8.1.2

# Prepare the environment
RUN apt-get update && \
    apt-get install -y build-essential python && \
    rm -rf /var/lib/apt/lists/* && \
    npm install yarn -g

RUN mkdir -p /app && \
    chown -R node /app && \
    chown -R node /home/node

ENV PATH "$PATH:/app/node_modules/.bin"

# npm install
COPY package.json /tmp/
RUN cd /tmp && \
    yarn install && \
    yarn cache clean && \
    mv /tmp/node_modules /app/

WORKDIR /app

COPY . /app/
#
#RUN ls
#
#RUN gulp build
#
#WORKDIR /app/build

ENV PORT=3000
EXPOSE $PORT

CMD yarn start

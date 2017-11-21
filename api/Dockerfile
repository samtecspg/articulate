FROM node:7.5.0

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app/

# Install app dependencies
RUN npm install -g yarn
RUN yarn install

EXPOSE 8000

ENTRYPOINT [ "node", "start.js" ]
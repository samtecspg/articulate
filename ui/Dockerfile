FROM node:10.5.0
# Needed for running yarn build
# ENV API_HOST=$API_HOST

WORKDIR /reactapp

RUN npm install -g yarn
COPY package.json yarn.lock ./
COPY internals ./internals

RUN yarn install
ADD . .

# read the arg from docker-compose and set the env for building AND runtime
ARG AUTH_ENABLED
ENV AUTH_ENABLED=${AUTH_ENABLED:-false}
RUN yarn build
CMD ["yarn", "start:prod"]
#CMD ["yarn", "start"]

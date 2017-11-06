FROM node:7.5.0

RUN apt-get update && apt-get install libpng12-0

WORKDIR /reactapp

ADD . .
RUN npm install
RUN npm run build
RUN npm run build:dll

EXPOSE 3000

CMD ["npm", "run", "start"]
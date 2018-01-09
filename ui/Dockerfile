FROM node:7.5.0

RUN apt-get update && apt-get install libpng12-0

WORKDIR /reactapp
RUN npm install -g yarn
COPY package.json ./
RUN npm install
ADD . .
RUN npm run build
RUN npm run build:dll

EXPOSE 3000

CMD ["npm", "run", "start"]

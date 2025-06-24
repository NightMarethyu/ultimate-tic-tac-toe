FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["nodemon", "--legacy-watch", "./bin/www"]
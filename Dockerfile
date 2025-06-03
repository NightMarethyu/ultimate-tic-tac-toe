# Use the official Node.js image as the base image
FROM node:latest

# Create a work directory and copy the current directory contents to it
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install nodemon
RUN npm install -g nodemon

# Copy package.json to the working directory
COPY package.json /usr/src/app

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . /usr/src/app

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
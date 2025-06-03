# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
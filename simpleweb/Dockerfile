# Specify a base image
FROM node:alpine

WORKDIR /usr/app

# Copy external files needed by container
COPY ./package.json .

# Install some dependencies
RUN npm install
COPY ./index.js .

# Default command
CMD ["npm","start"]
FROM node:12

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /tmp/package.json
# If you are building your code for production
# RUN npm ci --only=production
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app # TODO use /usr/app instead

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

EXPOSE 4000
CMD [ "npm", "run", "start" ]
FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY ./install_openalpr.sh ./
RUN chmod +x ./install_openalpr.sh && ./install_openalpr.sh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install 
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8124
CMD [ "npm", "run", "start"]
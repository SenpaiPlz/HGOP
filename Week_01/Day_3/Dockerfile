#what image to use
FROM node:carbon
#set the working directory
WORKDIR /code
#copy the following file to the container
COPY package.json package.json
COPY app.js app.js
#runs the npm install command on the image
RUN npm install
#when executing the container, use node app.js command
CMD node app.js

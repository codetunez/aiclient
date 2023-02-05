FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install typescript && npm install
COPY . ./
RUN npm run build
CMD [ "node", "index.js"]
EXPOSE 3000
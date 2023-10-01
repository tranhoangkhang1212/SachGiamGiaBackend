FROM node:18

# Create app directory, this is in our container/in our image
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

ENV NODE_ENV=production
ENV CORS_ALLOWED_ORIGINS=https://sachgiamgia.vn,https://sachgiamgia.online

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 3001
CMD [ "node", "dist/main" ]
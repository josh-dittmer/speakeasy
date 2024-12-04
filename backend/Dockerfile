FROM node:22-alpine

RUN mkdir -p /home/node/app/node_modules/models

RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
COPY models ./node_modules/models

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 42069

USER node

CMD [ "npm", "run", "start" ]
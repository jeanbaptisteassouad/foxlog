FROM node:8.16.0

RUN touch /var/log/access.log

WORKDIR /workdir

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

ENTRYPOINT ["yarn", "start"]
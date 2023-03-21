FROM node:alpine

RUN apk add --no-cache

USER node
WORKDIR /home/node/app
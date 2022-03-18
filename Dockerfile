FROM node:16-alpine
WORKDIR /app
COPY . .
RUN apk add --no-cache make gcc g++ python3 py3-pip
RUN npm install --production
CMD ["npm", "start"]

EXPOSE ${PORT}

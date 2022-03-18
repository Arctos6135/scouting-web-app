FROM node:16-alpine
WORKDIR /app
RUN apk add --no-cache make gcc g++ python3 py3-pip
COPY . .
RUN npm install --production
RUN npm run build
CMD ["npm", "start"]

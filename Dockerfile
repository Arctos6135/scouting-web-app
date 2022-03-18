FROM node:16-alpine
ARG PORT=8080
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["npm", "start"]

EXPOSE ${PORT}
ENV PORT=${PORT}

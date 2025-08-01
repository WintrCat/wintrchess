FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm i
RUN npm run build -w shared
RUN npm run build -w server

EXPOSE 8080

CMD ["sh", "-c", "npm run build -w client; npm start"]
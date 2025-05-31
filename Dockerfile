FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npx", "webpack", "serve", "--hot", "--mode", "development", "--port", "8080"]

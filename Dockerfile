FROM node:18-alpine

RUN apk add --no-cache python3 make g++ gcc libc-dev

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i --legacy-peer-deps

COPY . .

RUN npm run build:win

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]
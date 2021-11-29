FROM node:14.17-alpine AS builder

WORKDIR /app

COPY package.json package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14.17-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD ["npm", "run", "start:prod"]
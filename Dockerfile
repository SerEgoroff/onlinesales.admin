FROM node:lts-alpine AS buildAdmin
WORKDIR /app
COPY . .
RUN npm install && npm run build

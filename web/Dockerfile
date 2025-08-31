FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY web/package.json web/package.json
RUN npm ci

COPY web web
RUN npm -w web run build

FROM nginx:alpine
COPY --from=builder /app/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



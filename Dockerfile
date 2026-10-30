FROM node:22-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/firebase-config.sh /docker-entrypoint.d/40-firebase-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-firebase-config.sh \
  && chmod +x /docker-entrypoint.d/40-firebase-config.sh

ENV API_UPSTREAM=http://backend:5000
ENV NGINX_ENVSUBST_FILTER=API_UPSTREAM

EXPOSE 80

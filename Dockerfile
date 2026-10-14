# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA fallback for React Router + notification-service proxy.
# The nginx image runs envsubst on /etc/nginx/templates/*.template at startup,
# so NOTIFICATION_API_TARGET / NOTIFICATION_API_KEY are read from the container env.
RUN mkdir -p /etc/nginx/templates && rm -f /etc/nginx/conf.d/default.conf && printf '%s
'   'server {'   '  listen 80;'   '  server_name _;'   '  root /usr/share/nginx/html;'   '  index index.html;'   ''   '  location /notification-api/ {'   '    proxy_pass ${NOTIFICATION_API_TARGET}/notification/;'   '    proxy_set_header api-key "${NOTIFICATION_API_KEY}";'   '    proxy_set_header Host $proxy_host;'   '  }'   ''   '  location / {'   '    try_files $uri $uri/ /index.html;'   '  }'   '}' > /etc/nginx/templates/default.conf.template

ENV NOTIFICATION_API_TARGET=http://notification-service:8080     NOTIFICATION_API_KEY=
ENV NGINX_ENVSUBST_FILTER=^NOTIFICATION_

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

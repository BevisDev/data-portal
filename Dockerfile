FROM node:24-alpine AS builder
WORKDIR /app

# Install deps first so this layer is cached until package*.json changes.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .

RUN npm run build

# ---------- Runtime stage ----------
# Unprivileged nginx: runs as uid 101 and listens on 8080, so it fits runAsNonRoot.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# The image's entrypoint renders /etc/nginx/templates/*.template into /etc/nginx/conf.d at start.
COPY --chown=101:101 nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder --chown=101:101 /app/dist /usr/share/nginx/html
# At start: renders the declared keys from the pod env into /tmp/config.js (served as /config.js, read by AppConfig).
COPY docker/config.js.template /etc/data-portal/config.js.template
COPY --chmod=755 docker/15-config-js.sh /docker-entrypoint.d/15-config-js.sh

# All config is injected as env vars (k8s env / envFrom).
# NGINX_ENTRYPOINT_LOCAL_RESOLVERS exports NGINX_LOCAL_RESOLVERS (cluster DNS) for the proxy resolver;
# the filter limits envsubst to the variables the nginx template uses.
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1 \
    NGINX_ENVSUBST_FILTER="^(NOTIFICATION_|NGINX_LOCAL_RESOLVERS)"

USER 101
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# Unprivileged nginx: runs as uid 101 on port 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --from=builder --chown=101:101 /app/dist /usr/share/nginx/html

EXPOSE 8080

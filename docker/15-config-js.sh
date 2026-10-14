#!/bin/sh
# Run by the nginx image's /docker-entrypoint.sh at container start.
# Renders config.js.template with the pod env into /tmp/config.js (served as /config.js, read by AppConfig).
# envsubst only fills the ${VAR}s written in the template, so no other env var reaches the browser.
set -eu

TEMPLATE=/etc/data-portal/config.js.template
envsubst < "$TEMPLATE" > /tmp/config.js
echo "15-config-js: rendered $TEMPLATE -> /tmp/config.js"

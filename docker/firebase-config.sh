#!/bin/sh
# Runs from the nginx image's /docker-entrypoint.d/ at container start.
# Writes the Firebase web config from env vars, so no key is baked into the
# image or committed to the repository.
set -eu

escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat > "${FIREBASE_CONFIG_OUT:-/usr/share/nginx/html/config.js}" <<CONFIG
window.__FIREBASE_CONFIG__ = {
  apiKey: "$(escape "${FIREBASE_API_KEY:-}")",
  authDomain: "$(escape "${FIREBASE_AUTH_DOMAIN:-}")",
  projectId: "$(escape "${FIREBASE_PROJECT_ID:-}")",
  appId: "$(escape "${FIREBASE_APP_ID:-}")"
};
CONFIG

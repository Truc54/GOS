#!/bin/sh
set -e

./node_modules/.bin/prisma migrate deploy

if [ "${AUTO_SEED:-false}" = "true" ] && [ -n "${CSV_FILE_PATH:-}" ] && [ -f "${CSV_FILE_PATH}" ]; then
  node dist/prisma/seed.js
fi

exec node dist/server.js

#!/usr/bin/env bash
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'SQL'
CREATE TABLE IF NOT EXISTS app_migrations (
 filename text PRIMARY KEY,
 checksum text NOT NULL,
 applied_at timestamptz NOT NULL DEFAULT now()
);
SQL

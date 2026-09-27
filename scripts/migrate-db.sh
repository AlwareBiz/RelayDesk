#!/usr/bin/env bash
set -euo pipefail

: "${MIGRATION_DIR:=/migrations}"
: "${PGHOST:=postgres}"
: "${PGPORT:=5432}"
: "${PGDATABASE:=relaydesk}"
: "${PGUSER:=relaydesk_user}"

for migration in "$MIGRATION_DIR"/*.sql; do
 [ -f "$migration" ] || continue
 filename=$(basename "$migration")
 checksum=$(sha256sum "$migration" | awk '{print $1}')
 applied=$(psql -tAc "SELECT checksum FROM app_migrations WHERE filename = '$filename'")
 if [ -n "$applied" ]; then
  [ "$applied" = "$checksum" ] || { echo "Checksum mismatch: $filename" >&2; exit 1; }
  continue
 fi
 echo "Applying $filename"
 psql -v ON_ERROR_STOP=1 -f "$migration"
 psql -v ON_ERROR_STOP=1 -c "INSERT INTO app_migrations (filename, checksum) VALUES ('$filename', '$checksum')"
done

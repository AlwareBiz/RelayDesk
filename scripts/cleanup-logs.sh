#!/usr/bin/env bash
set -euo pipefail

: "${PGHOST:=localhost}"
: "${PGPORT:=5432}"
: "${PGDATABASE:=relaydesk}"
: "${PGUSER:=relaydesk_user}"

psql -v ON_ERROR_STOP=1 -c 'CALL delete_old_logs();'

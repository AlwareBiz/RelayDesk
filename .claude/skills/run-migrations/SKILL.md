---
name: run-migrations
description: Write, apply and verify a PostgreSQL migration against the local Docker database, and reset the local databases when needed. Use when changing the database schema or when local data is broken.
---

# Run migrations

## Write one
1. Name it `migrations/<YYYYMMDDHHMMSS>_<snake_case_description>.sql`, with a timestamp later than every existing file.
2. Write plain SQL. The runner applies each file with `ON_ERROR_STOP=1`, so it stops at the first failing statement, but statements before it stay applied. Wrap the file in `BEGIN;` ... `COMMIT;` when a partial run would leave the schema broken.
3. Update the matching types in `package/common/src/db` in the same change.

## Apply it
```sh
docker compose up -d postgres
npm run db:migrate
```
The runner prints `Applying <file>` for each new file and skips files it has already applied.

## Verify it
```sh
docker compose exec postgres psql -U relaydesk_user -d relaydesk -c "\d <table>"
docker compose exec postgres psql -U relaydesk_user -d relaydesk -c "SELECT filename FROM app_migrations ORDER BY filename"
```

## Problems
| Symptom                                     | Cause and fix                                                                                                           |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `Checksum mismatch: <file>`                 | An applied migration was edited. Revert the edit and add a new migration instead.                                       |
| `relation "app_migrations" does not exist`  | The database volume was created without the init script (usually after a failed first start). Reset the volumes, below. |
| Postgres exits with code 127 on first start | `scripts/init-db.sh` has CRLF line endings. Check `git ls-files --eol scripts/`, restore LF, then reset the volumes.    |

## Reset local databases
This deletes all local data in both stores:
```sh
docker compose down -v
docker compose up -d --wait postgres mongo
npm run db:migrate
```

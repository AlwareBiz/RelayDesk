---
paths:
 - "docker-compose.yml"
 - "Dockerfile"
 - "migrations/**"
 - "scripts/**"
 - "infra/**"
 - ".github/**"
 - ".husky/**"
---

# Infrastructure and operations

## Local stack
- `docker-compose.yml` defines `postgres`, `mongo` and the `migrate` runner. Dependent services wait on healthchecks.
- Local credentials live only in Compose and the gitignored `.env`. Never put a production credential in either.
- Shell scripts run inside Linux containers. `.gitattributes` forces LF line endings; never commit a script with CRLF.

## Migrations
- File names are `YYYYMMDDHHMMSS_<description>.sql` and apply in name order with `ON_ERROR_STOP=1`.
- The runner records each file's checksum. Never edit an applied migration; add a new one.
- Update the matching `Database` type in `package/common/src/db` in the same change.
- MongoDB has no migrations. Indexes are created in `scripts/init-mongo.js`, which runs only on an empty volume; changing it requires `docker compose down -v` locally.
- Conversation messages moved from `ticket_message` to `conversation_message`, with `ticket_id` renamed to `conversation_id`. `npm run db:backfill-conversation-messages` copies the old documents and creates the new index on an existing volume. It never changes `ticket_message` or overwrites a copied document, so it is safe to re-run; it prints `{"source":N,"copied":N,"alreadyPresent":N,"missing":N}` and exits non-zero while `missing` is not 0. Both go away in #12.

## CI and hooks
- `.github/workflows/ci.yml` runs the same checks as the pre-commit hook. Keep the two lists identical.
- Pin every third-party action to a full commit SHA with the release in a comment, and keep workflow `permissions` at the minimum.
- `.github/workflows/issue-format.yml` checks each opened or edited issue against its form in `.github/ISSUE_TEMPLATE/` and labels it `needs-format` when a section is missing. The forms are the only definition of the sections; to change the format, change a form, never the check.
- Text from an event (issue and pull request titles, bodies, comments) is untrusted. Pass it to a step through `env` and quote the variable; never put `${{ github.event... }}` text inside `run`.

## Terraform
- Commit `.terraform.lock.hcl`; never commit `.terraform/`, state, plans, or a real `terraform.tfvars`.
- Real secrets live in the secrets manager and are injected at runtime.
- Run `terraform fmt -check`, `terraform validate` and a reviewed `terraform plan` before any apply.

# RelayDesk

A multi-tenant customer-support helpdesk. Teams create workspaces, log customer conversations, and reply to them from a shared queue. These instructions are for every contributor, human or agent; `README.md` points here instead of repeating them.

## Layout

| Path               | Owns                                                                                              |
|--------------------|---------------------------------------------------------------------------------------------------|
| `package/common`   | Shared Yup schemas and types, database contracts, route constants, service interfaces, utilities. |
| `package/server`   | Express API, middleware, PostgreSQL and MongoDB implementations, environment parsing.             |
| `package/frontend` | React 19, MUI, TanStack Query and Router.                                                         |
| `migrations`       | Ordered PostgreSQL migrations.                                                                    |
| `eslint`           | Local lint rules that enforce the conventions below.                                              |
| `docs/decisions`   | Decision records that later work must follow.                                                     |
| `scripts`          | Migration runner, log-ID sync, dependency pin check, issue format check, Mongo init.              |

Data lives in two stores. PostgreSQL holds relational data: profiles, workspaces, members, conversations, logs. MongoDB holds document data: a conversation's messages, in the `conversation_message` collection, the only one the server reads. Messages written before the rename are in `ticket_message` until two one-off scripts run, in this order: `npm run db:backfill-conversation-messages` copies them over, then `npm run db:drop-ticket-messages` drops `ticket_message` once every message in it has a copy. There is no transaction across the two stores.

## Commands

| Task                                 | Command                                                                                                 |
|--------------------------------------|---------------------------------------------------------------------------------------------------------|
| Install                              | `npm install`                                                                                           |
| Start databases                      | `docker compose up -d postgres mongo`                                                                   |
| Apply migrations                     | `npm run db:migrate`                                                                                    |
| Copy old messages (until #13)        | `npm run db:backfill-conversation-messages`                                                             |
| Drop copied old messages (until #13) | `npm run db:drop-ticket-messages`                                                                       |
| Run API and web app                  | `npm run dev:server` and `npm run dev:frontend`                                                         |
| Check everything CI checks           | `npm run check:pinned-deps && npm run check:log-uuids && npm run lint && npm run typecheck && npm test` |
| Fix lint and import formatting       | `npm run lint:fix`                                                                                      |
| Check an issue body against its form | `npm run -s check:issue-format -- --form task < body.md` (or `--form epic`)                             |

Run lint, typecheck and the relevant tests before finishing any change. The pre-commit hook and CI run the full list.

## Conventions for every file

These apply everywhere. Path-specific conventions live in `.claude/rules/` and load when you edit matching files.

### Structure
- Open each file's main block with the 84-character separator, then mark sections with `// == Name ===` and subsections with `// -- name ---`, padded to 84 characters. Copy them from a neighbouring file. Omit empty sections.
- Order object keys, type members, class members, and React handlers alphabetically, unless a different order carries meaning.

### Imports
- Write each import on one line. Group third-party, then `@relaydesk/common`, then relative imports, with a blank line between groups.
- Import values and types from the same module in one statement with inline `type` specifiers.
- Never add file extensions to relative imports in `package/common` or `package/server`.

### Names and values
- Use shared constants and enums instead of string literals: `ResponseStatus`, `ReqResHeader`, `RequestMethod`, `backendRoutes`, `frontendRoute`, table and column constants, collection and field constants.
- Prefer published standards to invented codes: BCP 47 locale tags (`en`, `es`), ISO 8601 timestamps, HTTP status codes and header names from their RFCs.

### Control flow
- Every `if` without an `else` uses braces and closes with a comment that says what continuing *means*, not the inverse of the condition:

  ```ts
  if (count % SNAPSHOT_INTERVAL !== 0) {
   return;
  } /* else -- this count needs a snapshot */
  ```

  Lint checks that the comment exists. Only you can make it meaningful: "count is divisible by the interval" restates the code; "this count needs a snapshot" explains it.
- Use `async`/`await` with `try`/`catch`. Never chain `.then()`, `.catch()` or `.finally()`.

### Readability
- Write for the next human reader, even when a model could explain dense code. Name intermediate values instead of nesting expressions.
- Comment only what the code cannot say: a non-obvious decision, a boundary, a reason.

### Logging and dependencies
- The pre-commit hook gives every `console.*` and `logger.*` call a unique eight-character ID prefix, so a log line can be traced to its source by searching the ID. Never write or reuse an ID by hand. Never log passwords, tokens or reset links.
- Pin every dependency to an exact version (`npm install --save-exact`).

### Markdown
- Pad Markdown tables so the pipes line up in the raw file.

## Enforced by tooling

Instructions are guidance; these are checked on every commit and in CI.

| Convention                                    | Enforced by                                                   |
|-----------------------------------------------|---------------------------------------------------------------|
| Single-line imports                           | `local/single-line-import` (auto-fix)                         |
| `/* else -- */` after every `if` without else | `local/explicit-else-comment`                                 |
| Summary comment above every route handler     | `local/route-handler-summary`                                 |
| Alphabetical class and type members           | `@typescript-eslint/member-ordering`                          |
| `await` instead of promise chains             | `promise/prefer-await-to-then`                                |
| Unique log IDs                                | `npm run sync:log-uuids` (pre-commit), `check:log-uuids` (CI) |
| Exact dependency versions                     | `npm run check:pinned-deps`                                   |
| Agents never read or edit `.env` files        | `.claude/settings.json` permission rules                      |
| Same keys in `en.json` and `es.json`          | `npm test` (`dictionary.test.ts`)                             |
| Every issue has its form's sections           | `Issue format` workflow (labels the issue `needs-format`)     |

When a new convention can be checked by a tool, add the check instead of more prose here.

## Rules and skills

`.claude/settings.json` holds the shared agent permissions: the check commands run without prompting, and `.env` files are off limits. `AGENTS.md` points agents that do not read this file back to it.

| Rule (`.claude/rules/`) | Loads for                                           |
|-------------------------|-----------------------------------------------------|
| `common.md`             | `package/common/**`                                 |
| `server.md`             | `package/server/**`                                 |
| `frontend.md`           | `package/frontend/**`                               |
| `localization.md`       | Dictionaries and frontend components                |
| `auth-security.md`      | Auth routes, middleware and browser auth code       |
| `testing.md`            | Test files and the test config                      |
| `infrastructure.md`     | Compose, Docker, migrations, scripts, Terraform, CI |

| Skill (`.claude/skills/`) | Use it to                                                         |
|---------------------------|-------------------------------------------------------------------|
| `add-entity`              | Add a PostgreSQL entity or a MongoDB collection end to end.       |
| `add-api-route`           | Add an API endpoint and call it from the frontend.                |
| `run-migrations`          | Write, apply and verify a migration locally.                      |
| `local-setup`             | Get RelayDesk running from a fresh clone, and fix setup problems. |
| `write-issue`             | Turn a need into issues through a discussion with the engineer.   |
| `implement-issue`         | Build one issue: post a plan, wait for approval, then open a PR.  |

## Planning work

Work starts as a GitHub issue. The forms in `.github/ISSUE_TEMPLATE/` are the only definition of what an issue contains: naming, lifecycle, dependencies and constraints, besides the goal, criteria, scope and verification. `docs/decisions/0001-issue-format.md` explains why.

- To turn a need into issues, use `write-issue`. Changes that need no discussion, such as a typo or a broken link, need no issue.
- To build an issue, use `implement-issue`. Post a plan on the issue and wait for the engineer's approval before writing code.
- Decisions that later work must follow live in `docs/decisions/`. Read the records an issue links before planning, and add a record when an issue settles a decision.

## Pull requests

Every pull request description follows `.github/pull_request_template.md`: the issue link, Description, Testing, and the AI summary's What and Why. `gh pr create --body` does not fill the template in, so write those sections yourself.

## Keeping this true

A change that contradicts these instructions updates them in the same pull request. Reviews check that the instructions still match the code.

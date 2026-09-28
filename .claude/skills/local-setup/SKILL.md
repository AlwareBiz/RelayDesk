---
name: local-setup
description: Get RelayDesk running locally from a fresh clone, and diagnose setup problems such as Docker not starting, databases failing to initialize, or the app failing to boot. Use for first-time setup or when the local stack is broken.
---

# Local setup

## Requirements
- Node.js 22 or later (CI uses 22).
- Docker with Compose. On Windows, Docker Desktop on WSL 2.
- Git configured to keep LF line endings in this repo (the repo's `.gitattributes` does this).

## From a fresh clone
```sh
npm install
cp package/server/.env.example package/server/.env    # then replace both JWT secrets with long random values
docker compose up -d --wait postgres mongo
npm run db:migrate
npm run dev:server      # API on http://localhost:5174
npm run dev:frontend    # web app on http://localhost:5173
```
Open `http://localhost:5173`, create an account, then a workspace.

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Check it works
```sh
curl http://localhost:5173/api/health     # {"ok":true}, through the Vite proxy
npm run lint && npm run typecheck && npm test
```

## Problems
| Symptom                                                                 | Cause and fix                                                                                                                                     |
|-------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `docker: Error response from daemon: Docker Desktop is unable to start` | Docker Desktop started before WSL was ready. Run `wsl --status`, then quit and restart Docker Desktop.                                            |
| Postgres container exits with code 127                                  | A script mounted into the container has CRLF line endings. Run `git ls-files --eol`, restore LF, then reset the volumes (`run-migrations` skill). |
| Server exits at startup with a validation error                         | `package/server/.env` is missing or a value is invalid. Compare it with `.env.example`; JWT secrets need 32 characters or more.                   |
| A file rename that changes only letter case is not picked up            | Windows and macOS file systems ignore case. Rename with `git mv -f <old> <new>` so Linux (CI, containers) sees it.                                |
| Frontend shows `Request failed: 500` everywhere                         | The API cannot reach a database. Check `docker compose ps` and the `dev:server` output.                                                           |
| `npm install` warns about install scripts                               | npm lists packages whose install scripts are not yet approved. The app, tests and build run without them.                                         |

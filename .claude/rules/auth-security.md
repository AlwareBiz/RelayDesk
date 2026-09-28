---
paths:
 - "package/server/src/route/auth.ts"
 - "package/server/src/middleware/**"
 - "package/server/src/service/env.ts"
 - "package/frontend/src/service/AuthService.ts"
 - "package/frontend/src/util/auth.ts"
---

# Authentication and security

## Sessions
- Passwords are hashed with bcrypt on the server. Never return or log a hash.
- Access tokens are short-lived JWTs held in browser memory only (`AuthService`). Never put a token in `localStorage`, `sessionStorage`, a URL, a log, or an error message.
- Refresh tokens live in an HTTP-only, `SameSite=strict` cookie, `Secure` in production.
- Logout clears the cookie on the server and the in-memory token in the browser, even when the network call fails.

## Requests
- Validate credentials with the shared schema at the route.
- Answer every failed login with the same message, `Invalid email or password`, whether the email exists or not.
- Authentication (`authenticateUser`) and authorization (`requireWorkspaceMember`, role checks) are separate middleware.
- Every resource lookup is scoped by the authenticated profile or its workspace membership, unless the route is explicitly public.

## Secrets
- Secrets come from validated environment variables in `env.ts`. Never commit a real value; `.env` is gitignored and `.env.example` holds placeholders only.

## Tests
Changes here need tests for missing, malformed, expired and unauthorized credentials, and for access across workspaces.

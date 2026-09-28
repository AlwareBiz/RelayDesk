---
paths:
 - "package/server/**"
---

# Server package

## Routes
- One `Router()` per resource under `src/route/`, registered with a `backendRoutes` constant and mounted in `src/index.ts`.
- Put a one-line summary directly above each registration, lowercase and in the imperative: `// fetch a specific conversation within a workspace`.
- Validate at the boundary with the shared schema: `schema.validateSync(req.body, { abortEarly: false, stripUnknown: true })`. Validate path params too; an id that is not a UUID answers 404 before any query runs.
- Respond with `ResponseStatus` values. Catch errors at the route, log the detail with `logger.error`, and answer with a stable public message. Never send an error's own message to the client.
- Keep business logic in services. Handlers parse, authorize, call services, and respond.

## Middleware
- `authenticateUser` answers "who is this?". Authorization is separate middleware, such as `requireWorkspaceMember`, which answers "may this profile use this workspace?".
- Any route under a workspace uses `requireWorkspaceMember` and reads the workspace id from `req.workspaceMember`, never from the raw param.
- A profile outside the workspace gets 404, not 403, so workspace ids do not leak.

## Environment
- Every variable is declared, validated and defaulted in `src/service/env.ts`, with keys in alphabetical order. The server must fail at startup on an invalid value.

## Services
- One class per role and store: `Pg<Entity>Finder`, `Pg<Entity>Lifecycle`, `Mongo<Entity>Finder`, `Mongo<Entity>Lifecycle`. Each implements the interface from `@relaydesk/common` and exports a singleton (`conversationFinder`). No service barrels.

### PostgreSQL
- Use the shared pool from `src/client/pgPool.ts`. Parameterize every value; build identifiers only from table and column constants.
- Use `RETURNING *` on insert and update, and check that the row came back.
- Use `pgPool.connect()` only for an explicit transaction: `BEGIN`, `COMMIT`, `ROLLBACK` in `catch`, and `client.release()` in `finally`. When several services join one transaction, pass the client as an optional trailing `executor` argument that defaults to the pool.

### MongoDB
- Use `mongoDb` from `src/client/mongoClient.ts` and the collection and field constants from `@relaydesk/common`.
- Documents use a UUID string `_id` from `randomUUID()` and snake_case fields, matching PostgreSQL.
- Store dates as `Date`; convert to ISO strings in a mapper (`toConversationMessage`) before anything leaves the service.
- Every query filters by `workspace_id` as well as the parent id, so one workspace can never read another's documents.
- Writes that touch both stores are not atomic. Write PostgreSQL first, then MongoDB, so a failure leaves a record without its documents rather than documents without a record.

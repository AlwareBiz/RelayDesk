---
name: add-api-route
description: Add an API endpoint to RelayDesk and call it from the frontend, from the shared route constant to the page. Use when a feature needs the browser to read or change data.
---

# Add an API route

`package/server/src/route/dashboard/ticket.ts` and `package/frontend/src/route/dashboard/workspace/ticket.tsx` are the reference pair.

1. **Path**: add it to `backendRoutes` in `package/common/src/route/backend.ts`, keys alphabetical. Use `:param` segments (`/api/dashboard/workspace/:workspaceId/widget/:widgetId`).
2. **Contract**: in the entity's `api/` folder, add the request schema, its inferred type, a keys map if a form uses it, and the response type (`FetchWidgetResponseData`). Export it through the barrels.
3. **Handler** in the resource's router under `package/server/src/route/`:
   - a one-line summary comment directly above the registration;
   - `authenticateUser`, then `requireWorkspaceMember` for anything inside a workspace;
   - validate the body, query and path params with the shared schema;
   - call services, respond with `ResponseStatus`, and catch at the boundary with a logged error and a stable public message.
4. **Mount** a new router in `package/server/src/index.ts`, keeping the `app.use` lines alphabetical.
5. **Frontend call**: `ApiClient.get<FetchWidgetResponseData>(RouteUtil.fill(backendRoutes..., { workspaceId }))` inside a TanStack `useQuery` whose key includes every input; mutations invalidate the queries they affect.
6. **Page**: if it needs a new page, add a `frontendRoute` constant, a file under `package/frontend/src/route/` that mirrors the URL, and its `createRoute` entry in `router.tsx`. Add every new label to both dictionaries.
7. **Tests**: add tests for authorization and validation branches in new middleware or services.

## Done when

- [ ] A non-member of the workspace gets 404.
- [ ] Invalid input gets 400, and a malformed id gets 404, without reaching the database.
- [ ] The frontend never hardcodes the path or the visible text.
- [ ] `npm run lint`, `npm run typecheck` and `npm test` pass.

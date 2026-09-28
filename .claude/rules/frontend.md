---
paths:
 - "package/frontend/**"
---

# Frontend package

## Boundaries
- Import shared contracts from `@relaydesk/common`, never server code. No barrel files in the frontend; import concrete modules. Prefer named exports.
- Call the API only through `ApiClient` (authenticated) or `HttpService`; never call `fetch` from a component. Build paths with `RouteUtil.fill(backendRoutes...)` and `RouteUtil.query(...)`.

## Structure
- `route/` mirrors the URL, one file per page (`route/dashboard/workspace/ticket.tsx` serves `/dashboard/workspace/$workspaceId/ticket/$ticketId`). Page-specific dialogs go in a folder named after the page.
- `router.tsx` wires each page to a `frontendRoute` constant with `requireAuth` or `redirectIfAuthenticated`.
- `ui/` holds reusable pieces (`container/`, `form/`, `constant/`, `page/`), `hook/` shared hooks, `context/` providers.
- Signed-in pages render inside `DashboardPageLayout` and `DashboardPageContentContainer`; signed-out pages use `AuthPagesLayout`.

## Component shape
Components and hooks are arrow functions with sections in this order, omitting empty ones:

```tsx
// ********************************************************************************
// == Type ========================================================================
// == Constant ====================================================================
// == Component ===================================================================
// -- State -----------------------------------------------------------------------
// -- Query -----------------------------------------------------------------------
// -- Effect ----------------------------------------------------------------------
// -- Handler ---------------------------------------------------------------------
// -- UI --------------------------------------------------------------------------
```

- Hooks and context reads go first. Declarations inside `-- Handler` are alphabetical.
- Props and `sx` keys are alphabetical; spreads go last.

## Data and forms
- Server state goes through TanStack Query. Query keys include every input the query reads (`['dashboard', 'workspace', workspaceId, 'tickets', status]`). Use the query's own loading and error state, not extra booleans.
- Forms use Formik with the shared Yup schema and its keys map (`getTextFieldProps(formik, createTicketSchemaKeys.subject, ...)`).
- Mutation feedback goes to `successSnackbar` and `errorSnackbar`; `Alert` is for errors that block the page.
- Keep list state and dialog visibility in the parent page; dialogs own their form state.

## Display
- Use MUI components and `sx`, not inline `style` or utility classes.
- Format dates with `toLocaleString(currentLocale)` from `useLocale`, never the browser default.
- Wide tables sit in a container with `overflowX: 'auto'`, and the table uses `minWidth: 'max-content'`.

---
paths:
 - "package/common/**"
---

# Shared package

`package/common` is the only package both the server and the browser import. Everything in it must run in both.

## What belongs here
- `src/route/`: `backendRoutes` (API paths, Express `:param` syntax) and `frontendRoute` (page paths, TanStack `$param` syntax).
- `src/schema/`: Yup schemas with their inferred types, entity types derived from `Database`, table and column constants, collection and field constants.
- `src/service/`: provider-neutral service interfaces. Never import `pg`, `mongodb`, Express, or any provider type here.
- `src/db/`: the `Database` type that mirrors the PostgreSQL schema.
- `src/util/`: pure helpers with no I/O.

## Imports and barrels
- Inside `package/common/src`, import with relative paths only; importing `@relaydesk/common` from inside the package creates a cycle.
- Every folder has an `index.ts` that re-exports only its direct children. Never re-export a grandchild (`export * from './entity/ticket'` from `schema/index.ts` is wrong; `schema/entity/index.ts` re-exports it).
- `src/index.ts` is the public surface. Export new symbols through the barrels so they reach it.

## Schemas
Define a schema and its type together, and export a keys map when a form uses the schema:

```ts
// ********************************************************************************
// == Schema ======================================================================
export const createWorkspaceSchema = yup.object({
 name: yup.string().trim().min(2).max(80).required(),
});

// == Type ========================================================================
export type CreateWorkspaceData = yup.InferType<typeof createWorkspaceSchema>;

// == Constant ====================================================================
export const createWorkspaceSchemaKeys: { [key in keyof CreateWorkspaceData]: key } = {
 name: 'name',
};
```

- Normalize input in the schema (`trim`, `lowercase` for emails), so every caller gets the same value.
- Enum-like fields use `oneOf(Object.values(<constant map>))` built from the shared union, never a hand-written list.

## Database types
- Keep row keys and `OptionalOnInsert` keys alphabetical, and mirror the migration exactly: `timestamptz` is `string`, nullable columns include `null`, enums use the shared union from `db/enum.ts`.
- Update the matching type in the same change as the migration.

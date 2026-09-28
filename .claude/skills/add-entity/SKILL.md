---
name: add-entity
description: Add a new database-backed entity to RelayDesk end to end, either a PostgreSQL table or a MongoDB collection, with shared contracts and server services. Use when a feature needs to store a new kind of record.
---

# Add an entity

Pick the store first. Relational data that other rows reference, filter or join on (workspaces, conversations, assignments) goes in **PostgreSQL**. Document data that is read as a whole, grows over time, or varies in shape (a conversation's messages, raw inbound payloads, activity timelines) goes in **MongoDB**. Conversations and conversation messages are the reference examples of each; they are stored as `ticket` (renamed in #10) and `ticket_message` (renamed in #11).

Replace `widget` / `Widget` below with the entity name.

## PostgreSQL entity

1. **Migration**: add `migrations/<YYYYMMDDHHMMSS>_create_widget_table.sql` (see the `run-migrations` skill). Use `UUID ... DEFAULT gen_random_uuid()` ids, `TIMESTAMPTZ` timestamps, `workspace_id UUID NOT NULL REFERENCES workspace (id) ON DELETE CASCADE` if it belongs to a workspace, and an index for every column list you filter by.
2. **Row type**: `package/common/src/db/table/widget.ts` with `WidgetRow`, `OptionalOnInsert` and `WidgetTableTypes = TableTypes<WidgetRow, OptionalOnInsert>`. Add it to `db/table/index.ts`, register it in `Database['public']['Tables']` in `db/type.ts`, and add any new enum to `db/enum.ts` and `Database['public']['Enums']`.
3. **Entity folder** `package/common/src/schema/entity/widget/`:
   - `type.ts`: `Widget`, `WidgetInsert`, `WidgetUpdate` derived from `Database`, plus a value map for each enum (`widgetStatuses`).
   - `constant.ts`: `widgetTable` and `widgetColumns`.
   - `api/`: one file per endpoint with its Yup schema, inferred type, keys map and response type.
   - `index.ts`: re-export `api`, `constant`, `type`. Add the folder to `schema/entity/index.ts`.
4. **Service interfaces**: `package/common/src/service/entity/widget.ts` with `WidgetFinderService` and `WidgetLifecycleService`, methods alphabetical. Add it to `service/entity/index.ts`.
5. **Implementations**: `package/server/src/service/entity/widget/PgWidgetFinder.ts` and `PgWidgetLifecycle.ts`, each implementing its interface and exporting a singleton. Scope every query by `workspace_id`.
6. **Routes**: follow the `add-api-route` skill.

## MongoDB collection

1. **Document type** in `package/common/src/schema/entity/widget/type.ts`: `WidgetDocument` (stored shape: `_id: string`, snake_case fields, `created_at: Date`, `workspace_id`), `Widget` (API shape: `id`, ISO string dates) and `WidgetInsert`.
2. **Constants** in `constant.ts`: `widgetCollection` and `widgetFields`.
3. **Indexes** in `scripts/init-mongo.js`, starting with `workspace_id` and the parent id. Recreate the local volume to apply them (`docker compose down -v`, then start again).
4. **Service interfaces** in `package/common/src/service/entity/widget.ts`, as above.
5. **Implementations** `MongoWidgetFinder.ts` and `MongoWidgetLifecycle.ts`, plus a `mapper.ts` that turns a `WidgetDocument` into a `Widget`. Generate ids with `randomUUID()`.
6. **Routes**: follow the `add-api-route` skill.

## Done when

- [ ] The migration applies cleanly (`npm run db:migrate`), or the Mongo index exists.
- [ ] The `Database` type matches the migration.
- [ ] Every query filters by workspace.
- [ ] No `pg`, `mongodb` or Express type is imported in `package/common`.
- [ ] Tests cover any logic beyond passing values through.
- [ ] `npm run lint`, `npm run typecheck` and `npm test` pass.

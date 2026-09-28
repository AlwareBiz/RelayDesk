-- Drops the compatibility aliases added by 20260928000001_rename_ticket_to_conversation.sql
-- (docs/decisions/0002-conversation-not-ticket.md). No running code uses them, and
-- conversation_counter alone allocates conversation numbers from here on.
BEGIN;

-- == Counter =====================================================================
DROP TRIGGER workspace_sync_conversation_counter ON workspace;
DROP FUNCTION workspace_sync_conversation_counter();

-- == Compatibility alias =========================================================
DROP VIEW ticket;
DROP DOMAIN ticket_status;
DROP DOMAIN ticket_priority;

ALTER TABLE workspace DROP COLUMN ticket_counter;

COMMIT;

-- Renames ticket to conversation (docs/decisions/0002-conversation-not-ticket.md).
-- The ticket view, the ticket_* domains, workspace.ticket_counter and its sync trigger are
-- compatibility aliases for code merged before this migration. They are removed in #13.
BEGIN;

-- == Rename ======================================================================
ALTER TYPE ticket_status RENAME TO conversation_status;
ALTER TYPE ticket_priority RENAME TO conversation_priority;

ALTER TABLE ticket RENAME TO conversation;
ALTER TABLE conversation RENAME CONSTRAINT ticket_pkey TO conversation_pkey;
ALTER TABLE conversation RENAME CONSTRAINT ticket_workspace_id_number_key TO conversation_workspace_id_number_key;
ALTER TABLE conversation RENAME CONSTRAINT ticket_workspace_id_fkey TO conversation_workspace_id_fkey;
ALTER TABLE conversation RENAME CONSTRAINT ticket_assignee_profile_id_fkey TO conversation_assignee_profile_id_fkey;
ALTER INDEX ticket_workspace_status_idx RENAME TO conversation_workspace_status_idx;

-- == Compatibility alias =========================================================
-- a value cast to a domain is accepted by a column of the domain's base enum
CREATE DOMAIN ticket_status AS conversation_status;
CREATE DOMAIN ticket_priority AS conversation_priority;
COMMENT ON DOMAIN ticket_status IS 'Compatibility alias for conversation_status, removed in #13';
COMMENT ON DOMAIN ticket_priority IS 'Compatibility alias for conversation_priority, removed in #13';

-- a simple view is auto-updatable, and an insert that omits a column gets the table's default
CREATE VIEW ticket AS
 SELECT id, workspace_id, number, subject, requester_email, status, priority, assignee_profile_id, created_at, updated_at
 FROM conversation;
COMMENT ON VIEW ticket IS 'Compatibility alias for conversation, removed in #13';

-- == Counter =====================================================================
ALTER TABLE workspace ADD COLUMN conversation_counter INTEGER NOT NULL DEFAULT 0;
UPDATE workspace SET conversation_counter = ticket_counter;
COMMENT ON COLUMN workspace.ticket_counter IS 'Compatibility alias for conversation_counter, kept equal by workspace_sync_conversation_counter, removed in #13';

-- runs under the row lock of the UPDATE that allocates a number, so the sync is serialized with it
CREATE FUNCTION workspace_sync_conversation_counter() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
 IF NEW.ticket_counter IS DISTINCT FROM OLD.ticket_counter THEN
  NEW.conversation_counter := NEW.ticket_counter;
 ELSIF NEW.conversation_counter IS DISTINCT FROM OLD.conversation_counter THEN
  NEW.ticket_counter := NEW.conversation_counter;
 END IF;
 RETURN NEW;
END
$$;
COMMENT ON FUNCTION workspace_sync_conversation_counter() IS 'Compatibility alias: keeps workspace.ticket_counter and conversation_counter equal, removed in #13';

CREATE TRIGGER workspace_sync_conversation_counter
 BEFORE UPDATE ON workspace
 FOR EACH ROW EXECUTE FUNCTION workspace_sync_conversation_counter();

COMMIT;

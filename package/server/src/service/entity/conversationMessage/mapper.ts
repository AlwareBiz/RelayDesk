import type { ConversationMessage, ConversationMessageDocument } from '@relaydesk/common';

// ********************************************************************************
// == Util ========================================================================
/** the stored `ticket_id` leaves the service as `conversation_id` (until #11 renames the field), in the position it had in the document */
export const toConversationMessage = ({ _id, author_email, author_profile_id, author_type, body, created_at, ticket_id, workspace_id }: ConversationMessageDocument): ConversationMessage => ({
 author_email,
 author_profile_id,
 author_type,
 body,
 conversation_id: ticket_id, // stored field, renamed to conversation_id in #11
 workspace_id,
 created_at: created_at.toISOString(),
 id: _id,
});

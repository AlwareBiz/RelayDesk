import type { ConversationMessage, ConversationMessageDocument } from '@relaydesk/common';

// ********************************************************************************
// == Util ========================================================================
/** the /ticket aliases rename `conversation_id` in place, so this key order is what old clients receive */
export const toConversationMessage = ({ _id, author_email, author_profile_id, author_type, body, conversation_id, created_at, workspace_id }: ConversationMessageDocument): ConversationMessage => ({
 author_email,
 author_profile_id,
 author_type,
 body,
 conversation_id,
 workspace_id,
 created_at: created_at.toISOString(),
 id: _id,
});

import type { ConversationMessageDocument, LegacyTicketMessageDocument } from './type';

// ********************************************************************************
// == Collection ==================================================================
export const conversationMessageCollection = 'conversation_message';

/** the collection used before the rename; read only by the dual read, removed in #12 */
export const legacyTicketMessageCollection = 'ticket_message';

// == Field =======================================================================
export const conversationMessageFields: { [key in keyof ConversationMessageDocument]: key } = {
 _id: '_id',
 author_email: 'author_email',
 author_profile_id: 'author_profile_id',
 author_type: 'author_type',
 body: 'body',
 conversation_id: 'conversation_id',
 created_at: 'created_at',
 workspace_id: 'workspace_id',
};

/** the fields of `legacyTicketMessageCollection`, removed in #12 */
export const legacyTicketMessageFields: { [key in keyof LegacyTicketMessageDocument]: key } = {
 _id: '_id',
 author_email: 'author_email',
 author_profile_id: 'author_profile_id',
 author_type: 'author_type',
 body: 'body',
 created_at: 'created_at',
 ticket_id: 'ticket_id',
 workspace_id: 'workspace_id',
};

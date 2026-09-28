import type { ConversationMessageDocument } from './type';

// ********************************************************************************
// == Collection ==================================================================
export const conversationMessageCollection = 'ticket_message'; // stored name, renamed to conversation_message in #11

// == Field =======================================================================
export const conversationMessageFields: { [key in keyof ConversationMessageDocument]: key } = {
 _id: '_id',
 author_email: 'author_email',
 author_profile_id: 'author_profile_id',
 author_type: 'author_type',
 body: 'body',
 created_at: 'created_at',
 ticket_id: 'ticket_id', // stored name, renamed to conversation_id in #11
 workspace_id: 'workspace_id',
};

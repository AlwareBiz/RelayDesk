import type { ConversationMessageDocument } from './type';

// ********************************************************************************
// == Collection ==================================================================
export const conversationMessageCollection = 'conversation_message';

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

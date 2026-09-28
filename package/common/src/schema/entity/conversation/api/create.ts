import * as yup from 'yup';

import { conversationPriorities, type Conversation } from '../type';

// ********************************************************************************
// == Schema ======================================================================
export const createConversationSchema = yup.object({
 body: yup.string().trim().min(1).max(20000).required(),
 priority: yup.string().oneOf(Object.values(conversationPriorities)).default(conversationPriorities.normal),
 requester_email: yup.string().trim().lowercase().email().required(),
 subject: yup.string().trim().min(1).max(200).required(),
});

// == Type ========================================================================
export type CreateConversationData = yup.InferType<typeof createConversationSchema>;

export type CreateConversationResponseData = {
 conversation: Conversation;
};

// == Constant ====================================================================
export const createConversationSchemaKeys: { [key in keyof CreateConversationData]: key } = {
 body: 'body',
 priority: 'priority',
 requester_email: 'requester_email',
 subject: 'subject',
};

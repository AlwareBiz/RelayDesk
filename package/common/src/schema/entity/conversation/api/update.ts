import * as yup from 'yup';

import { conversationPriorities, conversationStatuses, type Conversation } from '../type';

// ********************************************************************************
// == Schema ======================================================================
export const updateConversationSchema = yup.object({
 assignee_profile_id: yup.string().uuid().nullable().optional(),
 priority: yup.string().oneOf(Object.values(conversationPriorities)).optional(),
 status: yup.string().oneOf(Object.values(conversationStatuses)).optional(),
});

// == Type ========================================================================
export type UpdateConversationData = yup.InferType<typeof updateConversationSchema>;

export type UpdateConversationResponseData = {
 conversation: Conversation;
};

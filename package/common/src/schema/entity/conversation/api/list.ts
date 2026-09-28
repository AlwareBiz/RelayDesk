import * as yup from 'yup';

import { paginationSchema } from '../../../misc/pagination';
import { conversationStatuses, type Conversation } from '../type';

// ********************************************************************************
// == Schema ======================================================================
export const listConversationsQuerySchema = paginationSchema.shape({
 status: yup.string().oneOf(Object.values(conversationStatuses)).optional(),
});

// == Type ========================================================================
export type ListConversationsQuery = yup.InferType<typeof listConversationsQuerySchema>;

export type ListConversationsResponseData = {
 conversations: Conversation[];
 total: number;
};

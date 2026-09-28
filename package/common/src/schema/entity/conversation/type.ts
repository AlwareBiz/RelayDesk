import type { Database } from '../../../db/type';
import type { conversationTable } from './constant';

// ********************************************************************************
// == Type ========================================================================
export type Conversation = Database['public']['Tables'][typeof conversationTable]['Row'];
export type ConversationInsert = Database['public']['Tables'][typeof conversationTable]['Insert'];
export type ConversationUpdate = Database['public']['Tables'][typeof conversationTable]['Update'];

// == Enum ========================================================================
export type ConversationPriority = Database['public']['Enums']['conversation_priority'];
export type ConversationStatus = Database['public']['Enums']['conversation_status'];

// == Constant ====================================================================
export const conversationPriorities: { [key in ConversationPriority]: key } = {
 high: 'high',
 low: 'low',
 normal: 'normal',
 urgent: 'urgent',
};

export const conversationStatuses: { [key in ConversationStatus]: key } = {
 closed: 'closed',
 open: 'open',
 pending: 'pending',
 solved: 'solved',
};

import type { Database } from '../../../db/type';
import type { conversationTable } from './constant';

// ********************************************************************************
// == Type ========================================================================
export type Conversation = Database['public']['Tables'][typeof conversationTable]['Row'];
export type ConversationInsert = Database['public']['Tables'][typeof conversationTable]['Insert'];
export type ConversationUpdate = Database['public']['Tables'][typeof conversationTable]['Update'];

// == Enum ========================================================================
export type ConversationPriority = Database['public']['Enums']['ticket_priority']; // stored name, renamed to conversation_priority in #10
export type ConversationStatus = Database['public']['Enums']['ticket_status']; // stored name, renamed to conversation_status in #10

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

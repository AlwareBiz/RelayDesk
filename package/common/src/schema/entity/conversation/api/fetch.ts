import type { ConversationMessage } from '../../conversationMessage/type';
import type { Conversation } from '../type';

// ********************************************************************************
// == Type ========================================================================
export type FetchConversationResponseData = {
 conversation: Conversation;
 messages: ConversationMessage[];
};

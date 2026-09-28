import type { ConversationMessage, ConversationMessageInsert } from '../../schema/entity/conversationMessage';

// ********************************************************************************
// == Interface ===================================================================
export interface ConversationMessageFinderService {
 listForConversation(workspaceId: ConversationMessage['workspace_id'], conversationId: ConversationMessage['conversation_id']): Promise<ConversationMessage[]>;
}

export interface ConversationMessageLifecycleService {
 create(data: ConversationMessageInsert): Promise<ConversationMessage>;
}

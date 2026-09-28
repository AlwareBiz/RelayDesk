import type { Conversation, ConversationInsert, ConversationUpdate, ListConversationsQuery } from '../../schema/entity/conversation';

// ********************************************************************************
// == Type ========================================================================
export type ConversationCreateData = Omit<ConversationInsert, 'number'>;
export type ConversationPatch = Pick<ConversationUpdate, 'assignee_profile_id' | 'priority' | 'status'>;

// == Interface ===================================================================
export interface ConversationFinderService {
 findById(workspaceId: Conversation['workspace_id'], id: Conversation['id']): Promise<Conversation | null>;
 list(workspaceId: Conversation['workspace_id'], query: ListConversationsQuery): Promise<{ conversations: Conversation[]; total: number }>;
}

export interface ConversationLifecycleService {
 /** allocates the next per-workspace conversation number and inserts the conversation */
 create(data: ConversationCreateData): Promise<Conversation>;
 update(workspaceId: Conversation['workspace_id'], id: Conversation['id'], patch: ConversationPatch): Promise<Conversation | null>;
}

import type { TableTypes } from '../tableTypes';
import type { ConversationPriorityEnum, ConversationStatusEnum } from '../enum';

// ********************************************************************************
// == Type ========================================================================
export type ConversationRow = {
 assignee_profile_id: string | null;
 created_at: string;
 id: string;
 number: number;
 priority: ConversationPriorityEnum;
 requester_email: string;
 status: ConversationStatusEnum;
 subject: string;
 updated_at: string;
 workspace_id: string;
};

type OptionalOnInsert = 'assignee_profile_id' | 'created_at' | 'id' | 'priority' | 'status' | 'updated_at';

export type ConversationTableTypes = TableTypes<ConversationRow, OptionalOnInsert>;

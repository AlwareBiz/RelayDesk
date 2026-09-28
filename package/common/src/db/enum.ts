// ********************************************************************************
// == Type ========================================================================
export type LogLevelEnum = 'debug' | 'info' | 'warn' | 'error';

export type ConversationPriorityEnum = 'low' | 'normal' | 'high' | 'urgent';
export type ConversationStatusEnum = 'open' | 'pending' | 'solved' | 'closed';

export type WorkspaceRoleEnum = 'owner' | 'admin' | 'agent';

export type DatabaseEnums = {
 conversation_priority: ConversationPriorityEnum;
 conversation_status: ConversationStatusEnum;
 log_level: LogLevelEnum;
 workspace_role: WorkspaceRoleEnum;
};

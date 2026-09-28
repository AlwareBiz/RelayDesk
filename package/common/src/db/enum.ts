// ********************************************************************************
// == Type ========================================================================
export type LogLevelEnum = 'debug' | 'info' | 'warn' | 'error';

export type ConversationPriorityEnum = 'low' | 'normal' | 'high' | 'urgent';
export type ConversationStatusEnum = 'open' | 'pending' | 'solved' | 'closed';

export type WorkspaceRoleEnum = 'owner' | 'admin' | 'agent';

export type DatabaseEnums = {
 log_level: LogLevelEnum;
 ticket_priority: ConversationPriorityEnum; // stored name, renamed to conversation_priority in #10
 ticket_status: ConversationStatusEnum; // stored name, renamed to conversation_status in #10
 workspace_role: WorkspaceRoleEnum;
};

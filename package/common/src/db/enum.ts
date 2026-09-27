// ********************************************************************************
// == Type ========================================================================
export type LogLevelEnum = 'debug' | 'info' | 'warn' | 'error';

export type TicketPriorityEnum = 'low' | 'normal' | 'high' | 'urgent';
export type TicketStatusEnum = 'open' | 'pending' | 'solved' | 'closed';

export type WorkspaceRoleEnum = 'owner' | 'admin' | 'agent';

export type DatabaseEnums = {
 log_level: LogLevelEnum;
 ticket_priority: TicketPriorityEnum;
 ticket_status: TicketStatusEnum;
 workspace_role: WorkspaceRoleEnum;
};

import type { LogLevelEnum, TicketPriorityEnum, TicketStatusEnum, WorkspaceRoleEnum } from './enum';
import type { LogTableTypes } from './table/log';
import type { ProfileTableTypes } from './table/profile';
import type { TicketTableTypes } from './table/ticket';
import type { WorkspaceTableTypes } from './table/workspace';
import type { WorkspaceMemberTableTypes } from './table/workspaceMember';

// ********************************************************************************
// == Type ========================================================================
export type Database = {
 public: {
  Enums: {
   log_level: LogLevelEnum;
   ticket_priority: TicketPriorityEnum;
   ticket_status: TicketStatusEnum;
   workspace_role: WorkspaceRoleEnum;
  };
  Tables: {
   log: LogTableTypes;
   profile: ProfileTableTypes;
   ticket: TicketTableTypes;
   workspace: WorkspaceTableTypes;
   workspace_member: WorkspaceMemberTableTypes;
  };
 };
};

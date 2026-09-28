import type { ConversationPriorityEnum, ConversationStatusEnum, LogLevelEnum, WorkspaceRoleEnum } from './enum';
import type { ConversationTableTypes } from './table/conversation';
import type { LogTableTypes } from './table/log';
import type { ProfileTableTypes } from './table/profile';
import type { WorkspaceTableTypes } from './table/workspace';
import type { WorkspaceMemberTableTypes } from './table/workspaceMember';

// ********************************************************************************
// == Type ========================================================================
export type Database = {
 public: {
  Enums: {
   log_level: LogLevelEnum;
   ticket_priority: ConversationPriorityEnum; // stored name, renamed to conversation_priority in #10
   ticket_status: ConversationStatusEnum; // stored name, renamed to conversation_status in #10
   workspace_role: WorkspaceRoleEnum;
  };
  Tables: {
   log: LogTableTypes;
   profile: ProfileTableTypes;
   ticket: ConversationTableTypes; // stored name, renamed to conversation in #10
   workspace: WorkspaceTableTypes;
   workspace_member: WorkspaceMemberTableTypes;
  };
 };
};

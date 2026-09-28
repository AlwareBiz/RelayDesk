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
   conversation_priority: ConversationPriorityEnum;
   conversation_status: ConversationStatusEnum;
   log_level: LogLevelEnum;
   workspace_role: WorkspaceRoleEnum;
  };
  Tables: {
   conversation: ConversationTableTypes;
   log: LogTableTypes;
   profile: ProfileTableTypes;
   workspace: WorkspaceTableTypes;
   workspace_member: WorkspaceMemberTableTypes;
  };
 };
};

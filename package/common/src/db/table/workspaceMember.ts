import type { TableTypes } from '../tableTypes';
import type { WorkspaceRoleEnum } from '../enum';

// ********************************************************************************
// == Type ========================================================================
export type WorkspaceMemberRow = {
 created_at: string;
 profile_id: string;
 role: WorkspaceRoleEnum;
 workspace_id: string;
};

type OptionalOnInsert = 'created_at' | 'role';

export type WorkspaceMemberTableTypes = TableTypes<WorkspaceMemberRow, OptionalOnInsert>;

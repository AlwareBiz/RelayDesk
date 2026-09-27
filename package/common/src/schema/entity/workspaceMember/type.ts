import type { Database } from '../../../db/type';

// ********************************************************************************
// == Type ========================================================================
export type WorkspaceMember = Database['public']['Tables']['workspace_member']['Row'];
export type WorkspaceMemberInsert = Database['public']['Tables']['workspace_member']['Insert'];
export type WorkspaceMemberUpdate = Database['public']['Tables']['workspace_member']['Update'];

// == Enum ========================================================================
export type WorkspaceRole = Database['public']['Enums']['workspace_role'];

// == Constant ====================================================================
export const workspaceRoles: { [key in WorkspaceRole]: key } = {
 admin: 'admin',
 agent: 'agent',
 owner: 'owner',
};

import type { Database } from '../../../db/type';
import type { WorkspaceMember } from './type';

// ********************************************************************************
// == Table =======================================================================
export const workspaceMemberTable: Extract<keyof Database['public']['Tables'], 'workspace_member'> = 'workspace_member';

// == Column ======================================================================
export const workspaceMemberColumns: { [key in keyof WorkspaceMember]: key } = {
 created_at: 'created_at',
 profile_id: 'profile_id',
 role: 'role',
 workspace_id: 'workspace_id',
};

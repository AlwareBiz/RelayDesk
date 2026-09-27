import type { Database } from '../../../db/type';
import type { Workspace } from './type';

// ********************************************************************************
// == Table =======================================================================
export const workspaceTable: Extract<keyof Database['public']['Tables'], 'workspace'> = 'workspace';

// == Column ======================================================================
export const workspaceColumns: { [key in keyof Workspace]: key } = {
 created_at: 'created_at',
 id: 'id',
 name: 'name',
 ticket_counter: 'ticket_counter',
 updated_at: 'updated_at',
};

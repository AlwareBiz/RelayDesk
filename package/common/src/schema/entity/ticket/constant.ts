import type { Database } from '../../../db/type';
import type { Ticket } from './type';

// ********************************************************************************
// == Table =======================================================================
export const ticketTable: Extract<keyof Database['public']['Tables'], 'ticket'> = 'ticket';

// == Column ======================================================================
export const ticketColumns: { [key in keyof Ticket]: key } = {
 assignee_profile_id: 'assignee_profile_id',
 created_at: 'created_at',
 id: 'id',
 number: 'number',
 priority: 'priority',
 requester_email: 'requester_email',
 status: 'status',
 subject: 'subject',
 updated_at: 'updated_at',
 workspace_id: 'workspace_id',
};

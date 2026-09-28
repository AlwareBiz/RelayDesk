import type { Database } from '../../../db/type';
import type { Conversation } from './type';

// ********************************************************************************
// == Table =======================================================================
export const conversationTable: Extract<keyof Database['public']['Tables'], 'conversation'> = 'conversation';

// == Column ======================================================================
export const conversationColumns: { [key in keyof Conversation]: key } = {
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

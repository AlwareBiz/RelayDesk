import type { TicketMessageDocument } from './type';

// ********************************************************************************
// == Collection ==================================================================
export const ticketMessageCollection = 'ticket_message';

// == Field =======================================================================
export const ticketMessageFields: { [key in keyof TicketMessageDocument]: key } = {
 _id: '_id',
 author_email: 'author_email',
 author_profile_id: 'author_profile_id',
 author_type: 'author_type',
 body: 'body',
 created_at: 'created_at',
 ticket_id: 'ticket_id',
 workspace_id: 'workspace_id',
};

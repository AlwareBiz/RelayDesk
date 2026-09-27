import type { Database } from '../../../db/type';

// ********************************************************************************
// == Type ========================================================================
export type Ticket = Database['public']['Tables']['ticket']['Row'];
export type TicketInsert = Database['public']['Tables']['ticket']['Insert'];
export type TicketUpdate = Database['public']['Tables']['ticket']['Update'];

// == Enum ========================================================================
export type TicketPriority = Database['public']['Enums']['ticket_priority'];
export type TicketStatus = Database['public']['Enums']['ticket_status'];

// == Constant ====================================================================
export const ticketPriorities: { [key in TicketPriority]: key } = {
 high: 'high',
 low: 'low',
 normal: 'normal',
 urgent: 'urgent',
};

export const ticketStatuses: { [key in TicketStatus]: key } = {
 closed: 'closed',
 open: 'open',
 pending: 'pending',
 solved: 'solved',
};

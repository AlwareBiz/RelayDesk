import * as yup from 'yup';

import { ticketPriorities, ticketStatuses, type Ticket } from '../type';

// ********************************************************************************
// == Schema ======================================================================
export const updateTicketSchema = yup.object({
 assignee_profile_id: yup.string().uuid().nullable().optional(),
 priority: yup.string().oneOf(Object.values(ticketPriorities)).optional(),
 status: yup.string().oneOf(Object.values(ticketStatuses)).optional(),
});

// == Type ========================================================================
export type UpdateTicketData = yup.InferType<typeof updateTicketSchema>;

export type UpdateTicketResponseData = {
 ticket: Ticket;
};

import * as yup from 'yup';

import { ticketPriorities, type Ticket } from '../type';

// ********************************************************************************
// == Schema ======================================================================
export const createTicketSchema = yup.object({
 body: yup.string().trim().min(1).max(20000).required(),
 priority: yup.string().oneOf(Object.values(ticketPriorities)).default(ticketPriorities.normal),
 requester_email: yup.string().trim().lowercase().email().required(),
 subject: yup.string().trim().min(1).max(200).required(),
});

// == Type ========================================================================
export type CreateTicketData = yup.InferType<typeof createTicketSchema>;

export type CreateTicketResponseData = {
 ticket: Ticket;
};

// == Constant ====================================================================
export const createTicketSchemaKeys: { [key in keyof CreateTicketData]: key } = {
 body: 'body',
 priority: 'priority',
 requester_email: 'requester_email',
 subject: 'subject',
};

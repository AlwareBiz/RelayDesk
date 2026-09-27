import * as yup from 'yup';

import { paginationSchema } from '../../../misc/pagination';
import { ticketStatuses, type Ticket } from '../type';

// ********************************************************************************
// == Schema ======================================================================
export const listTicketsQuerySchema = paginationSchema.shape({
 status: yup.string().oneOf(Object.values(ticketStatuses)).optional(),
});

// == Type ========================================================================
export type ListTicketsQuery = yup.InferType<typeof listTicketsQuerySchema>;

export type ListTicketsResponseData = {
 tickets: Ticket[];
 total: number;
};

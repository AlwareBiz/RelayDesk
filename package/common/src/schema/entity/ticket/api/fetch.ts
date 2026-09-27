import type { TicketMessage } from '../../ticketMessage/type';
import type { Ticket } from '../type';

// ********************************************************************************
// == Type ========================================================================
export type FetchTicketResponseData = {
 messages: TicketMessage[];
 ticket: Ticket;
};

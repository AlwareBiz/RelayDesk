import type { TicketMessage, TicketMessageInsert } from '../../schema/entity/ticketMessage';

// ********************************************************************************
// == Interface ===================================================================
export interface TicketMessageFinderService {
 listForTicket(workspaceId: TicketMessage['workspace_id'], ticketId: TicketMessage['ticket_id']): Promise<TicketMessage[]>;
}

export interface TicketMessageLifecycleService {
 create(data: TicketMessageInsert): Promise<TicketMessage>;
}

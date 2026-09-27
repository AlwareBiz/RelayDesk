import type { ListTicketsQuery, Ticket, TicketInsert, TicketUpdate } from '../../schema/entity/ticket';

// ********************************************************************************
// == Type ========================================================================
export type TicketCreateData = Omit<TicketInsert, 'number'>;
export type TicketPatch = Pick<TicketUpdate, 'assignee_profile_id' | 'priority' | 'status'>;

// == Interface ===================================================================
export interface TicketFinderService {
 findById(workspaceId: Ticket['workspace_id'], id: Ticket['id']): Promise<Ticket | null>;
 list(workspaceId: Ticket['workspace_id'], query: ListTicketsQuery): Promise<{ tickets: Ticket[]; total: number }>;
}

export interface TicketLifecycleService {
 /** allocates the next per-workspace ticket number and inserts the ticket */
 create(data: TicketCreateData): Promise<Ticket>;
 update(workspaceId: Ticket['workspace_id'], id: Ticket['id'], patch: TicketPatch): Promise<Ticket | null>;
}

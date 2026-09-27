import { ticketMessageCollection, ticketMessageFields, type TicketMessage, type TicketMessageDocument, type TicketMessageFinderService } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { toTicketMessage } from './mapper';

// ********************************************************************************
// == Class =======================================================================
export class MongoTicketMessageFinder implements TicketMessageFinderService {
 async listForTicket(workspaceId: TicketMessage['workspace_id'], ticketId: TicketMessage['ticket_id']): Promise<TicketMessage[]> {
  const documents = await mongoDb
   .collection<TicketMessageDocument>(ticketMessageCollection)
   .find({ [ticketMessageFields.workspace_id]: workspaceId, [ticketMessageFields.ticket_id]: ticketId })
   .sort({ [ticketMessageFields.created_at]: 1 })
   .toArray();
  return documents.map(toTicketMessage);
 }
}

// == Export ======================================================================
export const ticketMessageFinder = new MongoTicketMessageFinder();

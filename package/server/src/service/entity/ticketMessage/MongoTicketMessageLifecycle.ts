import { randomUUID } from 'node:crypto';

import { ticketMessageCollection, type TicketMessage, type TicketMessageDocument, type TicketMessageInsert, type TicketMessageLifecycleService } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { toTicketMessage } from './mapper';

// ********************************************************************************
// == Class =======================================================================
export class MongoTicketMessageLifecycle implements TicketMessageLifecycleService {
 async create(data: TicketMessageInsert): Promise<TicketMessage> {
  const document: TicketMessageDocument = { ...data, _id: randomUUID(), created_at: new Date() };
  await mongoDb.collection<TicketMessageDocument>(ticketMessageCollection).insertOne(document);
  return toTicketMessage(document);
 }
}

// == Export ======================================================================
export const ticketMessageLifecycle = new MongoTicketMessageLifecycle();

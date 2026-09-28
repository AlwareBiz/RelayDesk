import { randomUUID } from 'node:crypto';

import { conversationMessageCollection, type ConversationMessage, type ConversationMessageDocument, type ConversationMessageInsert, type ConversationMessageLifecycleService } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { toConversationMessage } from './mapper';

// ********************************************************************************
// == Class =======================================================================
export class MongoConversationMessageLifecycle implements ConversationMessageLifecycleService {
 async create(data: ConversationMessageInsert): Promise<ConversationMessage> {
  const { conversation_id, ...rest } = data;
  // the document keeps the stored `ticket_id` field until #11 renames it
  const document: ConversationMessageDocument = { ...rest, _id: randomUUID(), created_at: new Date(), ticket_id: conversation_id };
  await mongoDb.collection<ConversationMessageDocument>(conversationMessageCollection).insertOne(document);
  return toConversationMessage(document);
 }
}

// == Export ======================================================================
export const conversationMessageLifecycle = new MongoConversationMessageLifecycle();

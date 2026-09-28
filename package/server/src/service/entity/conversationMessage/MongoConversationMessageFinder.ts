import { conversationMessageCollection, conversationMessageFields, type ConversationMessage, type ConversationMessageDocument, type ConversationMessageFinderService } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { toConversationMessage } from './mapper';

// ********************************************************************************
// == Class =======================================================================
export class MongoConversationMessageFinder implements ConversationMessageFinderService {
 async listForConversation(workspaceId: ConversationMessage['workspace_id'], conversationId: ConversationMessage['conversation_id']): Promise<ConversationMessage[]> {
  const documents = await mongoDb
   .collection<ConversationMessageDocument>(conversationMessageCollection)
   .find({ [conversationMessageFields.workspace_id]: workspaceId, [conversationMessageFields.ticket_id]: conversationId }) // stored field, renamed to conversation_id in #11
   .sort({ [conversationMessageFields.created_at]: 1 })
   .toArray();
  return documents.map(toConversationMessage);
 }
}

// == Export ======================================================================
export const conversationMessageFinder = new MongoConversationMessageFinder();

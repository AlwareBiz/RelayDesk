import { conversationMessageCollection, conversationMessageFields, type ConversationMessage, type ConversationMessageDocument, type ConversationMessageFinderService } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { toConversationMessage } from './mapper';

// ********************************************************************************
// == Class =======================================================================
export class MongoConversationMessageFinder implements ConversationMessageFinderService {
 /** oldest first; `_id` keeps messages created in the same instant in a stable order */
 async listForConversation(workspaceId: ConversationMessage['workspace_id'], conversationId: ConversationMessage['conversation_id']): Promise<ConversationMessage[]> {
  const documents = await mongoDb
   .collection<ConversationMessageDocument>(conversationMessageCollection)
   .find({ [conversationMessageFields.workspace_id]: workspaceId, [conversationMessageFields.conversation_id]: conversationId })
   .sort({ [conversationMessageFields.created_at]: 1, [conversationMessageFields._id]: 1 })
   .toArray();

  return documents.map(toConversationMessage);
 }
}

// == Export ======================================================================
export const conversationMessageFinder = new MongoConversationMessageFinder();

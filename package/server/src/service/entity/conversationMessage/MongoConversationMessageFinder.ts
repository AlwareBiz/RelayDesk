import { conversationMessageCollection, conversationMessageFields, legacyTicketMessageCollection, legacyTicketMessageFields, type ConversationMessage, type ConversationMessageDocument, type ConversationMessageFinderService, type LegacyTicketMessageDocument } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { fromLegacyTicketMessageDocument, toConversationMessage } from './mapper';

// ********************************************************************************
// == Util ========================================================================
const byCreatedAtThenId = (a: ConversationMessageDocument, b: ConversationMessageDocument): number => {
 const createdAtDifference = a.created_at.getTime() - b.created_at.getTime();
 if (createdAtDifference !== 0) {
  return createdAtDifference;
 } /* else -- same instant, so the id keeps the order stable */

 return a._id.localeCompare(b._id);
};

// == Class =======================================================================
export class MongoConversationMessageFinder implements ConversationMessageFinderService {
 /**
  * reads both collections until #12: code from #10 may still write `ticket_message`, and the backfill
  * copies old messages into `conversation_message`, so a copied message is kept only once
  */
 async listForConversation(workspaceId: ConversationMessage['workspace_id'], conversationId: ConversationMessage['conversation_id']): Promise<ConversationMessage[]> {
  const [documents, legacyDocuments] = await Promise.all([
   mongoDb
    .collection<ConversationMessageDocument>(conversationMessageCollection)
    .find({ [conversationMessageFields.workspace_id]: workspaceId, [conversationMessageFields.conversation_id]: conversationId })
    .toArray(),
   mongoDb
    .collection<LegacyTicketMessageDocument>(legacyTicketMessageCollection)
    .find({ [legacyTicketMessageFields.workspace_id]: workspaceId, [legacyTicketMessageFields.ticket_id]: conversationId })
    .toArray(),
  ]);

  const copiedIds = new Set(documents.map(({ _id }) => _id));
  const notYetCopied = legacyDocuments.filter(({ _id }) => !copiedIds.has(_id)).map(fromLegacyTicketMessageDocument);
  return [...documents, ...notYetCopied].sort(byCreatedAtThenId).map(toConversationMessage);
 }
}

// == Export ======================================================================
export const conversationMessageFinder = new MongoConversationMessageFinder();

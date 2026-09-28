import { beforeEach, describe, expect, it, vi } from 'vitest';

import { conversationMessageCollection, legacyTicketMessageCollection, type ConversationMessageDocument, type LegacyTicketMessageDocument } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { conversationMessageFinder } from './MongoConversationMessageFinder';

// ********************************************************************************
// == Mock ========================================================================
const { documentsByCollection, find } = vi.hoisted(() => {
 const documentsByCollection = new Map<string, unknown[]>();
 const find = vi.fn();
 return { documentsByCollection, find };
});
vi.mock('../../../client/mongoClient', () => ({
 mongoDb: {
  collection: vi.fn((name: string) => ({
   find: (filter: unknown) => {
    find(name, filter);
    return { toArray: async () => documentsByCollection.get(name) ?? [] };
   },
  })),
 },
}));

// == Constant ====================================================================
const CONVERSATION_ID = '3e963725-1a6a-40cc-bf3f-fd1539b68d66';
const WORKSPACE_ID = '187f0909-43fd-43fa-8539-c4a44671e345';

// == Util ========================================================================
const newDocument = (id: string, createdAt: string): ConversationMessageDocument => ({ _id: id, author_email: 'jane@example.com', author_profile_id: null, author_type: 'customer', body: `message ${id}`, conversation_id: CONVERSATION_ID, created_at: new Date(createdAt), workspace_id: WORKSPACE_ID });

const legacyDocument = (id: string, createdAt: string): LegacyTicketMessageDocument => {
 const { conversation_id, ...rest } = newDocument(id, createdAt);
 return { ...rest, ticket_id: conversation_id };
};

// == Test ========================================================================
describe('MongoConversationMessageFinder', () => {
 beforeEach(() => {
  vi.clearAllMocks();
  documentsByCollection.clear();
 });

 describe('listForConversation', () => {
  it('filters both collections by workspace_id and the conversation', async () => {
   await conversationMessageFinder.listForConversation(WORKSPACE_ID, CONVERSATION_ID);

   expect(mongoDb.collection).toHaveBeenCalledWith(conversationMessageCollection);
   expect(mongoDb.collection).toHaveBeenCalledWith(legacyTicketMessageCollection);
   expect(find).toHaveBeenCalledWith(conversationMessageCollection, { conversation_id: CONVERSATION_ID, workspace_id: WORKSPACE_ID });
   expect(find).toHaveBeenCalledWith(legacyTicketMessageCollection, { ticket_id: CONVERSATION_ID, workspace_id: WORKSPACE_ID });
  });

  it('returns old messages with conversation_id', async () => {
   documentsByCollection.set(legacyTicketMessageCollection, [legacyDocument('a', '2026-09-27T10:00:00.000Z')]);

   const [message] = await conversationMessageFinder.listForConversation(WORKSPACE_ID, CONVERSATION_ID);

   expect(message?.conversation_id).toBe(CONVERSATION_ID);
   expect(message).not.toHaveProperty('ticket_id');
  });

  // after the backfill every old message is in both collections
  it('shows a copied message once', async () => {
   documentsByCollection.set(conversationMessageCollection, [newDocument('a', '2026-09-27T10:00:00.000Z')]);
   documentsByCollection.set(legacyTicketMessageCollection, [legacyDocument('a', '2026-09-27T10:00:00.000Z'), legacyDocument('b', '2026-09-27T11:00:00.000Z')]);

   const messages = await conversationMessageFinder.listForConversation(WORKSPACE_ID, CONVERSATION_ID);

   expect(messages.map(({ id }) => id)).toEqual(['a', 'b']);
  });

  it('orders messages from both collections by created_at, then id', async () => {
   documentsByCollection.set(conversationMessageCollection, [newDocument('d', '2026-09-27T12:00:00.000Z'), newDocument('b', '2026-09-27T11:00:00.000Z')]);
   documentsByCollection.set(legacyTicketMessageCollection, [legacyDocument('c', '2026-09-27T11:00:00.000Z'), legacyDocument('a', '2026-09-27T10:00:00.000Z')]);

   const messages = await conversationMessageFinder.listForConversation(WORKSPACE_ID, CONVERSATION_ID);

   expect(messages.map(({ id }) => id)).toEqual(['a', 'b', 'c', 'd']);
  });
 });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { conversationMessageCollection, type ConversationMessageDocument } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { conversationMessageFinder } from './MongoConversationMessageFinder';

// ********************************************************************************
// == Mock ========================================================================
const { documents, find, sort } = vi.hoisted(() => {
 const documents: unknown[] = [];
 const sort = vi.fn(() => ({ toArray: async () => documents }));
 const find = vi.fn(() => ({ sort }));
 return { documents, find, sort };
});
vi.mock('../../../client/mongoClient', () => ({ mongoDb: { collection: vi.fn(() => ({ find })) } }));

// == Constant ====================================================================
const CONVERSATION_ID = '3e963725-1a6a-40cc-bf3f-fd1539b68d66';
const WORKSPACE_ID = '187f0909-43fd-43fa-8539-c4a44671e345';

// == Util ========================================================================
const newDocument = (id: string, createdAt: string): ConversationMessageDocument => ({ _id: id, author_email: 'jane@example.com', author_profile_id: null, author_type: 'customer', body: `message ${id}`, conversation_id: CONVERSATION_ID, created_at: new Date(createdAt), workspace_id: WORKSPACE_ID });

// == Test ========================================================================
describe('MongoConversationMessageFinder', () => {
 beforeEach(() => {
  vi.clearAllMocks();
  documents.length = 0;
 });

 describe('listForConversation', () => {
  it('reads only conversation_message, filtered by workspace_id and the conversation', async () => {
   await conversationMessageFinder.listForConversation(WORKSPACE_ID, CONVERSATION_ID);

   expect(mongoDb.collection).toHaveBeenCalledTimes(1);
   expect(mongoDb.collection).toHaveBeenCalledWith(conversationMessageCollection);
   expect(find).toHaveBeenCalledWith({ conversation_id: CONVERSATION_ID, workspace_id: WORKSPACE_ID });
  });

  it('sorts by created_at, then _id', async () => {
   await conversationMessageFinder.listForConversation(WORKSPACE_ID, CONVERSATION_ID);

   const [order] = sort.mock.calls[0] as unknown as [Record<string, number>];
   expect(Object.entries(order)).toEqual([['created_at', 1], ['_id', 1]]);
  });

  it('returns the documents as messages, in the order MongoDB gives', async () => {
   documents.push(newDocument('a', '2026-09-27T10:00:00.000Z'), newDocument('b', '2026-09-27T11:00:00.000Z'));

   const messages = await conversationMessageFinder.listForConversation(WORKSPACE_ID, CONVERSATION_ID);

   expect(messages.map(({ id }) => id)).toEqual(['a', 'b']);
   expect(messages[0]?.conversation_id).toBe(CONVERSATION_ID);
  });
 });
});

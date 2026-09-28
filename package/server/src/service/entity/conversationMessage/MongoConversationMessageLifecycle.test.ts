import { beforeEach, describe, expect, it, vi } from 'vitest';

import { conversationMessageCollection } from '@relaydesk/common';

import { mongoDb } from '../../../client/mongoClient';
import { conversationMessageLifecycle } from './MongoConversationMessageLifecycle';

// ********************************************************************************
// == Mock ========================================================================
const { insertOne } = vi.hoisted(() => ({ insertOne: vi.fn() }));
vi.mock('../../../client/mongoClient', () => ({ mongoDb: { collection: vi.fn(() => ({ insertOne })) } }));

// == Constant ====================================================================
const CONVERSATION_ID = '3e963725-1a6a-40cc-bf3f-fd1539b68d66';
const WORKSPACE_ID = '187f0909-43fd-43fa-8539-c4a44671e345';

// == Test ========================================================================
describe('MongoConversationMessageLifecycle', () => {
 beforeEach(() => {
  vi.clearAllMocks();
 });

 describe('create', () => {
  it('inserts only into conversation_message, with conversation_id', async () => {
   await conversationMessageLifecycle.create({ author_email: 'jane@example.com', author_profile_id: null, author_type: 'customer', body: 'Hi', conversation_id: CONVERSATION_ID, workspace_id: WORKSPACE_ID });

   expect(mongoDb.collection).toHaveBeenCalledTimes(1);
   expect(mongoDb.collection).toHaveBeenCalledWith(conversationMessageCollection);
   expect(conversationMessageCollection).toBe('conversation_message');
   const document = insertOne.mock.calls[0]?.[0] as Record<string, unknown>;
   expect(Object.keys(document).sort()).toEqual(['_id', 'author_email', 'author_profile_id', 'author_type', 'body', 'conversation_id', 'created_at', 'workspace_id']);
   expect(document.conversation_id).toBe(CONVERSATION_ID);
   expect(document.workspace_id).toBe(WORKSPACE_ID);
  });

  it('returns the message with conversation_id', async () => {
   const message = await conversationMessageLifecycle.create({ author_email: 'jane@example.com', author_profile_id: null, author_type: 'customer', body: 'Hi', conversation_id: CONVERSATION_ID, workspace_id: WORKSPACE_ID });

   expect(Object.keys(message).sort()).toEqual(['author_email', 'author_profile_id', 'author_type', 'body', 'conversation_id', 'created_at', 'id', 'workspace_id']);
   expect(message.conversation_id).toBe(CONVERSATION_ID);
  });
 });
});

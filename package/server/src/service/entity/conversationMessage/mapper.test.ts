import { describe, expect, it } from 'vitest';

import type { ConversationMessageDocument } from '@relaydesk/common';

import { toConversationMessage } from './mapper';

// ********************************************************************************
// == Constant ====================================================================
const DOCUMENT: ConversationMessageDocument = {
 _id: '49465fcf-afe1-4476-a47c-1a52450cf086',
 author_email: 'jane@example.com',
 author_profile_id: null,
 author_type: 'customer',
 body: 'I cannot sign in.',
 conversation_id: '3e963725-1a6a-40cc-bf3f-fd1539b68d66',
 created_at: new Date('2026-09-27T22:37:46.248Z'),
 workspace_id: '187f0909-43fd-43fa-8539-c4a44671e345',
};

// == Test ========================================================================
describe('toConversationMessage', () => {
 it('turns _id into id and created_at into an ISO string', () => {
  const message = toConversationMessage(DOCUMENT);

  expect(message.id).toBe(DOCUMENT._id);
  expect(message.created_at).toBe('2026-09-27T22:37:46.248Z');
  expect(message).not.toHaveProperty('_id');
 });

 // the /ticket aliases rename the key in place, so this order is what old clients receive
 it('keeps the key order old clients receive', () => {
  expect(Object.keys(toConversationMessage(DOCUMENT))).toEqual(['author_email', 'author_profile_id', 'author_type', 'body', 'conversation_id', 'workspace_id', 'created_at', 'id']);
 });
});

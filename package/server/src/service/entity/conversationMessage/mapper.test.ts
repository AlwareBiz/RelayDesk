import { describe, expect, it } from 'vitest';

import type { ConversationMessageDocument, LegacyTicketMessageDocument } from '@relaydesk/common';

import { fromLegacyTicketMessageDocument, toConversationMessage } from './mapper';

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

const LEGACY_DOCUMENT: LegacyTicketMessageDocument = {
 _id: DOCUMENT._id,
 author_email: DOCUMENT.author_email,
 author_profile_id: DOCUMENT.author_profile_id,
 author_type: DOCUMENT.author_type,
 body: DOCUMENT.body,
 created_at: DOCUMENT.created_at,
 ticket_id: DOCUMENT.conversation_id,
 workspace_id: DOCUMENT.workspace_id,
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

describe('fromLegacyTicketMessageDocument', () => {
 it('renames ticket_id to conversation_id and keeps every other field', () => {
  const document = fromLegacyTicketMessageDocument(LEGACY_DOCUMENT);

  expect(document).toEqual(DOCUMENT);
  expect(document).not.toHaveProperty('ticket_id');
 });

 it('maps to the same message as the copied document', () => {
  expect(toConversationMessage(fromLegacyTicketMessageDocument(LEGACY_DOCUMENT))).toEqual(toConversationMessage(DOCUMENT));
 });
});

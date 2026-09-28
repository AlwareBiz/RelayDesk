import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { backendRoutes, ResponseStatus, type Conversation, type ConversationMessage } from '@relaydesk/common';

import { dashboardConversationRouter } from './conversation';
import { dashboardLegacyTicketRouter, legacyTicketBody, toLegacyCreateBody, toLegacyFetchBody, toLegacyListBody, toLegacyMessageBody, toLegacyUpdateBody } from './legacyTicket';

// ********************************************************************************
// == Mock ========================================================================
vi.mock('../../client/mongoClient', () => ({ mongoDb: {} }));
vi.mock('../../client/pgPool', () => ({ pgPool: {} }));
vi.mock('../../service/env', () => ({ env: {} }));
vi.mock('../../service/logger/DatabaseLogger', () => ({ logger: { error: vi.fn(), info: vi.fn() } }));

// == Constant ====================================================================
const CONVERSATION: Conversation = {
 id: '3e963725-1a6a-40cc-bf3f-fd1539b68d66',
 workspace_id: '187f0909-43fd-43fa-8539-c4a44671e345',
 number: 1,
 subject: 'Cannot sign in',
 requester_email: 'jane@example.com',
 status: 'open',
 priority: 'normal',
 assignee_profile_id: null,
 created_at: '2026-09-27T22:37:46.248Z',
 updated_at: '2026-09-27T22:37:46.248Z',
};

const MESSAGE: ConversationMessage = {
 author_email: 'jane@example.com',
 author_profile_id: null,
 author_type: 'customer',
 body: 'I cannot sign in.',
 conversation_id: CONVERSATION.id,
 workspace_id: CONVERSATION.workspace_id,
 created_at: '2026-09-27T22:37:46.248Z',
 id: '49465fcf-afe1-4476-a47c-1a52450cf086',
};

// the bodies exactly as the /ticket routes sent them before the rename
const LEGACY_TICKET = '{"id":"3e963725-1a6a-40cc-bf3f-fd1539b68d66","workspace_id":"187f0909-43fd-43fa-8539-c4a44671e345","number":1,"subject":"Cannot sign in","requester_email":"jane@example.com","status":"open","priority":"normal","assignee_profile_id":null,"created_at":"2026-09-27T22:37:46.248Z","updated_at":"2026-09-27T22:37:46.248Z"}';
const LEGACY_MESSAGE = '{"author_email":"jane@example.com","author_profile_id":null,"author_type":"customer","body":"I cannot sign in.","ticket_id":"3e963725-1a6a-40cc-bf3f-fd1539b68d66","workspace_id":"187f0909-43fd-43fa-8539-c4a44671e345","created_at":"2026-09-27T22:37:46.248Z","id":"49465fcf-afe1-4476-a47c-1a52450cf086"}';

// == Util ========================================================================
type RouteLayer = { route?: { methods: Record<string, boolean>; path: string; stack: { handle: unknown }[] } };

/** the middleware and handler functions registered for one method and path */
const handlersOf = (router: unknown, method: string, path: string): unknown[] => {
 const layer = (router as { stack: RouteLayer[] }).stack.find(({ route }) => route?.path === path && route.methods[method]);
 if (!layer?.route) {
  throw new Error(`No ${method} route for ${path}`);
 } /* else -- the route is registered */

 return layer.route.stack.map(({ handle }) => handle);
};

const buildResponse = (statusCode: number) => {
 const json = vi.fn();
 return { json, res: { json, statusCode } as unknown as Response };
};

// == Test ========================================================================
describe('legacyTicket', () => {
 beforeEach(() => {
  vi.clearAllMocks();
 });

 describe('response mappers', () => {
  // old clients built before the rename parse these bodies; any difference can break them
  it('lists conversations as the pre-rename { tickets, total } body', () => {
   expect(JSON.stringify(toLegacyListBody({ conversations: [CONVERSATION], total: 1 }))).toBe(`{"tickets":[${LEGACY_TICKET}],"total":1}`);
  });

  it('fetches a conversation as the pre-rename { messages, ticket } body with ticket_id on each message', () => {
   expect(JSON.stringify(toLegacyFetchBody({ conversation: CONVERSATION, messages: [MESSAGE] }))).toBe(`{"messages":[${LEGACY_MESSAGE}],"ticket":${LEGACY_TICKET}}`);
  });

  it('answers create and update with the pre-rename { ticket } body', () => {
   expect(JSON.stringify(toLegacyCreateBody({ conversation: CONVERSATION }))).toBe(`{"ticket":${LEGACY_TICKET}}`);
   expect(JSON.stringify(toLegacyUpdateBody({ conversation: CONVERSATION }))).toBe(`{"ticket":${LEGACY_TICKET}}`);
  });

  it('answers a reply with ticket_id in place of conversation_id', () => {
   expect(JSON.stringify(toLegacyMessageBody({ message: MESSAGE }))).toBe(`{"message":${LEGACY_MESSAGE}}`);
  });
 });

 describe('legacyTicketBody', () => {
  it('reshapes a success body', () => {
   const { json, res } = buildResponse(ResponseStatus.Ok);
   const next = vi.fn() as NextFunction;

   legacyTicketBody(toLegacyUpdateBody)({} as Request, res, next);
   res.json({ conversation: CONVERSATION });

   expect(next).toHaveBeenCalledOnce();
   expect(json).toHaveBeenCalledWith({ ticket: CONVERSATION });
  });

  // error bodies are { message } text for people, and the mapper would fail on them
  it('passes an error body through unchanged', () => {
   const { json, res } = buildResponse(ResponseStatus.NotFound);

   legacyTicketBody(toLegacyUpdateBody)({} as Request, res, vi.fn() as NextFunction);
   res.json({ message: 'Conversation not found' });

   expect(json).toHaveBeenCalledWith({ message: 'Conversation not found' });
  });
 });

 describe('dashboardLegacyTicketRouter', () => {
  const routes = [
   ['get', backendRoutes.dashboard.workspace.legacyTicket.index, backendRoutes.dashboard.workspace.conversation.index],
   ['post', backendRoutes.dashboard.workspace.legacyTicket.index, backendRoutes.dashboard.workspace.conversation.index],
   ['get', backendRoutes.dashboard.workspace.legacyTicket.detail, backendRoutes.dashboard.workspace.conversation.detail],
   ['patch', backendRoutes.dashboard.workspace.legacyTicket.detail, backendRoutes.dashboard.workspace.conversation.detail],
   ['post', backendRoutes.dashboard.workspace.legacyTicket.message, backendRoutes.dashboard.workspace.conversation.message],
  ] as const;

  // an alias that skipped authenticateUser or requireWorkspaceMember would open another workspace's data
  it.each(routes)('runs the same authentication, membership check and handler for %s %s as its /conversation route', (method, legacyPath, path) => {
   const legacy = handlersOf(dashboardLegacyTicketRouter, method, legacyPath);
   const current = handlersOf(dashboardConversationRouter, method, path);

   expect(legacy).toHaveLength(current.length + 1);
   expect(legacy.slice(0, 2)).toEqual(current.slice(0, 2));
   expect(legacy.at(-1)).toBe(current.at(-1));
  });
 });
});

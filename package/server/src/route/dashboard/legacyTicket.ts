import { Router, type NextFunction, type Request, type Response } from 'express';

import { backendRoutes, ResponseStatus, type ConversationMessage, type CreateConversationMessageResponseData, type CreateConversationResponseData, type FetchConversationResponseData, type ListConversationsResponseData, type UpdateConversationResponseData } from '@relaydesk/common';

import { authenticateUser } from '../../middleware/authenticateUser';
import { requireWorkspaceMember } from '../../middleware/requireWorkspaceMember';
import { createConversation, createConversationMessage, fetchConversation, listConversations, updateConversation } from './conversation';

// Compatibility aliases for clients built before "ticket" was renamed to "conversation"
// (docs/decisions/0002-conversation-not-ticket.md). Each `/ticket` route runs the same
// middleware and handler as its `/conversation` route and answers in the pre-rename
// shape. Removed in #13, together with `backendRoutes.dashboard.workspace.legacyTicket`.
// ********************************************************************************
// == Type ========================================================================
type LegacyTicketMessage = Omit<ConversationMessage, 'conversation_id'> & { ticket_id: string };

// == Mapper ======================================================================
// each mapper rebuilds the body with the keys in their pre-rename order, so old clients get the same JSON byte for byte
const toLegacyTicketMessage = ({ author_email, author_profile_id, author_type, body, conversation_id, created_at, id, workspace_id }: ConversationMessage): LegacyTicketMessage => ({
 author_email,
 author_profile_id,
 author_type,
 body,
 ticket_id: conversation_id,
 workspace_id,
 created_at,
 id,
});

export const toLegacyCreateBody = ({ conversation }: CreateConversationResponseData) => ({ ticket: conversation });
export const toLegacyFetchBody = ({ conversation, messages }: FetchConversationResponseData) => ({ messages: messages.map(toLegacyTicketMessage), ticket: conversation });
export const toLegacyListBody = ({ conversations, total }: ListConversationsResponseData) => ({ tickets: conversations, total });
export const toLegacyMessageBody = ({ message }: CreateConversationMessageResponseData) => ({ message: toLegacyTicketMessage(message) });
export const toLegacyUpdateBody = ({ conversation }: UpdateConversationResponseData) => ({ ticket: conversation });

// == Middleware ==================================================================
/** reshapes a success body with `toLegacy`; error bodies (`{ message }`) pass through unchanged */
export const legacyTicketBody = <Body>(toLegacy: (body: Body) => unknown) => (_req: Request, res: Response, next: NextFunction): void => {
 const json = res.json.bind(res);
 res.json = (body: Body) => {
  if (res.statusCode >= ResponseStatus.BadRequest) {
   return json(body);
  } /* else -- a success body, which old clients parse by key */

  return json(toLegacy(body));
 };
 next();
};

// == Router ======================================================================
export const dashboardLegacyTicketRouter = Router();

// list conversations within a workspace in the pre-rename ticket shape
dashboardLegacyTicketRouter.get(backendRoutes.dashboard.workspace.legacyTicket.index, authenticateUser, requireWorkspaceMember, legacyTicketBody(toLegacyListBody), listConversations);

// create a new conversation within a workspace in the pre-rename ticket shape
dashboardLegacyTicketRouter.post(backendRoutes.dashboard.workspace.legacyTicket.index, authenticateUser, requireWorkspaceMember, legacyTicketBody(toLegacyCreateBody), createConversation);

// fetch a specific conversation within a workspace in the pre-rename ticket shape
dashboardLegacyTicketRouter.get(backendRoutes.dashboard.workspace.legacyTicket.detail, authenticateUser, requireWorkspaceMember, legacyTicketBody(toLegacyFetchBody), fetchConversation);

// update a specific conversation within a workspace in the pre-rename ticket shape
dashboardLegacyTicketRouter.patch(backendRoutes.dashboard.workspace.legacyTicket.detail, authenticateUser, requireWorkspaceMember, legacyTicketBody(toLegacyUpdateBody), updateConversation);

// post a new message to a specific conversation in the pre-rename ticket shape
dashboardLegacyTicketRouter.post(backendRoutes.dashboard.workspace.legacyTicket.message, authenticateUser, requireWorkspaceMember, legacyTicketBody(toLegacyMessageBody), createConversationMessage);

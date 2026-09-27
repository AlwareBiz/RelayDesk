import { Router, type Response } from 'express';
import * as yup from 'yup';

import { backendRoutes, createTicketMessageSchema, createTicketSchema, listTicketsQuerySchema, ResponseStatus, ticketMessageAuthorTypes, updateTicketSchema, type CreateTicketMessageResponseData, type CreateTicketResponseData, type FetchTicketResponseData, type ListTicketsResponseData, type UpdateTicketResponseData } from '@relaydesk/common';

import { authenticateUser } from '../../middleware/authenticateUser';
import { requireWorkspaceMember } from '../../middleware/requireWorkspaceMember';
import { profileFinder } from '../../service/entity/profile/PgProfileFinder';
import { ticketFinder } from '../../service/entity/ticket/PgTicketFinder';
import { ticketLifecycle } from '../../service/entity/ticket/PgTicketLifecycle';
import { ticketMessageFinder } from '../../service/entity/ticketMessage/MongoTicketMessageFinder';
import { ticketMessageLifecycle } from '../../service/entity/ticketMessage/MongoTicketMessageLifecycle';
import { workspaceMemberFinder } from '../../service/entity/workspaceMember/PgWorkspaceMemberFinder';
import { logger } from '../../service/logger/DatabaseLogger';
import type { WorkspaceRequest } from '../../type';

// ********************************************************************************
// == Constant ====================================================================
const ticketIdSchema = yup.string().uuid().required();

// == Router ======================================================================
export const dashboardTicketRouter = Router();

// list tickets for the authenticated user within a workspace
dashboardTicketRouter.get(backendRoutes.dashboard.workspace.ticket.index, authenticateUser, requireWorkspaceMember, async (req: WorkspaceRequest, res) => {
 let query: yup.InferType<typeof listTicketsQuerySchema>;
 try {
  query = listTicketsQuerySchema.validateSync(req.query, { abortEarly: false, stripUnknown: true });
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid ticket filters' });
  return;
 }

 try {
  const data: ListTicketsResponseData = await ticketFinder.list(workspaceIdOf(req), query);
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#be873d1e [dashboard.ticket] failed to list tickets: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not load tickets' });
 }
});

// create a new ticket within a workspace
dashboardTicketRouter.post(backendRoutes.dashboard.workspace.ticket.index, authenticateUser, requireWorkspaceMember, async (req: WorkspaceRequest, res) => {
 let input: yup.InferType<typeof createTicketSchema>;
 try {
  input = createTicketSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid ticket' });
  return;
 }

 try {
  const workspaceId = workspaceIdOf(req);
  const ticket = await ticketLifecycle.create({ priority: input.priority, requester_email: input.requester_email, subject: input.subject, workspace_id: workspaceId });
  await ticketMessageLifecycle.create({
   author_email: input.requester_email,
   author_profile_id: null,
   author_type: ticketMessageAuthorTypes.customer,
   body: input.body,
   ticket_id: ticket.id,
   workspace_id: workspaceId,
  });

  logger.info(`#ad215e3c [dashboard.ticket] created ticket ${ticket.id}`);
  const data: CreateTicketResponseData = { ticket };
  res.status(ResponseStatus.Created).json(data);
 } catch (error) {
  logger.error(`#b2bed4dd [dashboard.ticket] failed to create ticket: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not create the ticket' });
 }
});

// fetch a specific ticket within a workspace
dashboardTicketRouter.get(backendRoutes.dashboard.workspace.ticket.detail, authenticateUser, requireWorkspaceMember, async (req: WorkspaceRequest, res) => {
 const ticketId = req.params.ticketId;
 if (!ticketIdSchema.isValidSync(ticketId)) { respondTicketNotFound(res); return; }

 try {
  const workspaceId = workspaceIdOf(req);
  const ticket = await ticketFinder.findById(workspaceId, ticketId);
  if (!ticket) { respondTicketNotFound(res); return; }

  const data: FetchTicketResponseData = { messages: await ticketMessageFinder.listForTicket(workspaceId, ticket.id), ticket };
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#a1a24c80 [dashboard.ticket] failed to fetch ticket ${ticketId}: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not load the ticket' });
 }
});

// update a specific ticket within a workspace
dashboardTicketRouter.patch(backendRoutes.dashboard.workspace.ticket.detail, authenticateUser, requireWorkspaceMember, async (req: WorkspaceRequest, res) => {
 const ticketId = req.params.ticketId;
 if (!ticketIdSchema.isValidSync(ticketId)) { respondTicketNotFound(res); return; }

 let patch: yup.InferType<typeof updateTicketSchema>;
 try {
  patch = updateTicketSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid ticket update' });
  return;
 }

 try {
  const workspaceId = workspaceIdOf(req);
  if (patch.assignee_profile_id && !(await workspaceMemberFinder.find(workspaceId, patch.assignee_profile_id))) {
   res.status(ResponseStatus.BadRequest).json({ message: 'The assignee is not a member of this workspace' });
   return;
  }

  const ticket = await ticketLifecycle.update(workspaceId, ticketId, patch);
  if (!ticket) { respondTicketNotFound(res); return; }

  const data: UpdateTicketResponseData = { ticket };
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#bebe1db0 [dashboard.ticket] failed to update ticket ${ticketId}: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not update the ticket' });
 }
});

// post a new message to a specific ticket within a workspace
dashboardTicketRouter.post(backendRoutes.dashboard.workspace.ticket.message, authenticateUser, requireWorkspaceMember, async (req: WorkspaceRequest, res) => {
 const ticketId = req.params.ticketId;
 if (!ticketIdSchema.isValidSync(ticketId)) { respondTicketNotFound(res); return; }

 let body: string;
 try {
  ({ body } = createTicketMessageSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true }));
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid message' });
  return;
 }

 try {
  const workspaceId = workspaceIdOf(req);
  const ticket = await ticketFinder.findById(workspaceId, ticketId);
  if (!ticket) { respondTicketNotFound(res); return; }

  const profile = await profileFinder.findById(req.user?.sub ?? '');
  if (!profile) {
   res.status(ResponseStatus.NotFound).json({ message: 'Profile not found' });
   return;
  }

  const message = await ticketMessageLifecycle.create({
   author_email: profile.email,
   author_profile_id: profile.id,
   author_type: ticketMessageAuthorTypes.agent,
   body,
   ticket_id: ticket.id,
   workspace_id: workspaceId,
  });
  const data: CreateTicketMessageResponseData = { message };
  res.status(ResponseStatus.Created).json(data);
 } catch (error) {
  logger.error(`#f7c17aa0 [dashboard.ticket] failed to reply to ticket ${ticketId}: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not send the message' });
 }
});

// == Util ========================================================================
const respondTicketNotFound = (res: Response): void => {
 res.status(ResponseStatus.NotFound).json({ message: 'Ticket not found' });
};

/** `requireWorkspaceMember` guarantees the membership, so its workspace id is the validated one */
const workspaceIdOf = (req: WorkspaceRequest): string => {
 if (!req.workspaceMember) throw new Error('requireWorkspaceMember must run before this handler');
 return req.workspaceMember.workspace_id;
};

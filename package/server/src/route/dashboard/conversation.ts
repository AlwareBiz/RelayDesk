import { Router, type Response } from 'express';
import * as yup from 'yup';

import { backendRoutes, conversationMessageAuthorTypes, createConversationMessageSchema, createConversationSchema, listConversationsQuerySchema, ResponseStatus, updateConversationSchema, type CreateConversationMessageResponseData, type CreateConversationResponseData, type FetchConversationResponseData, type ListConversationsResponseData, type UpdateConversationResponseData } from '@relaydesk/common';

import { authenticateUser } from '../../middleware/authenticateUser';
import { requireWorkspaceMember } from '../../middleware/requireWorkspaceMember';
import { conversationFinder } from '../../service/entity/conversation/PgConversationFinder';
import { conversationLifecycle } from '../../service/entity/conversation/PgConversationLifecycle';
import { conversationMessageFinder } from '../../service/entity/conversationMessage/MongoConversationMessageFinder';
import { conversationMessageLifecycle } from '../../service/entity/conversationMessage/MongoConversationMessageLifecycle';
import { profileFinder } from '../../service/entity/profile/PgProfileFinder';
import { workspaceMemberFinder } from '../../service/entity/workspaceMember/PgWorkspaceMemberFinder';
import { logger } from '../../service/logger/DatabaseLogger';
import type { WorkspaceRequest } from '../../type';

// ********************************************************************************
// == Constant ====================================================================
const conversationIdSchema = yup.string().uuid().required();

// == Handler =====================================================================
// exported so the `/ticket` aliases in `legacyTicket.ts` run exactly these handlers
export const createConversation = async (req: WorkspaceRequest, res: Response): Promise<void> => {
 let input: yup.InferType<typeof createConversationSchema>;
 try {
  input = createConversationSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid conversation' });
  return;
 }

 try {
  const workspaceId = workspaceIdOf(req);
  const conversation = await conversationLifecycle.create({ priority: input.priority, requester_email: input.requester_email, subject: input.subject, workspace_id: workspaceId });
  await conversationMessageLifecycle.create({
   author_email: input.requester_email,
   author_profile_id: null,
   author_type: conversationMessageAuthorTypes.customer,
   body: input.body,
   conversation_id: conversation.id,
   workspace_id: workspaceId,
  });

  logger.info(`#ad215e3c [dashboard.conversation] created conversation ${conversation.id}`);
  const data: CreateConversationResponseData = { conversation };
  res.status(ResponseStatus.Created).json(data);
 } catch (error) {
  logger.error(`#b2bed4dd [dashboard.conversation] failed to create conversation: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not create the conversation' });
 }
};

export const createConversationMessage = async (req: WorkspaceRequest, res: Response): Promise<void> => {
 const conversationId = req.params.conversationId;
 if (!conversationIdSchema.isValidSync(conversationId)) {
  respondConversationNotFound(res);
  return;
 } /* else -- the conversation id is well formed */

 let body: string;
 try {
  ({ body } = createConversationMessageSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true }));
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid message' });
  return;
 }

 try {
  const workspaceId = workspaceIdOf(req);
  const conversation = await conversationFinder.findById(workspaceId, conversationId);
  if (!conversation) {
   respondConversationNotFound(res);
   return;
  } /* else -- the conversation belongs to this workspace */

  const profile = await profileFinder.findById(req.user?.sub ?? '');
  if (!profile) {
   res.status(ResponseStatus.NotFound).json({ message: 'Profile not found' });
   return;
  } /* else -- the reply has an author */

  const message = await conversationMessageLifecycle.create({
   author_email: profile.email,
   author_profile_id: profile.id,
   author_type: conversationMessageAuthorTypes.agent,
   body,
   conversation_id: conversation.id,
   workspace_id: workspaceId,
  });
  const data: CreateConversationMessageResponseData = { message };
  res.status(ResponseStatus.Created).json(data);
 } catch (error) {
  logger.error(`#f7c17aa0 [dashboard.conversation] failed to reply to conversation ${conversationId}: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not send the message' });
 }
};

export const fetchConversation = async (req: WorkspaceRequest, res: Response): Promise<void> => {
 const conversationId = req.params.conversationId;
 if (!conversationIdSchema.isValidSync(conversationId)) {
  respondConversationNotFound(res);
  return;
 } /* else -- the conversation id is well formed */

 try {
  const workspaceId = workspaceIdOf(req);
  const conversation = await conversationFinder.findById(workspaceId, conversationId);
  if (!conversation) {
   respondConversationNotFound(res);
   return;
  } /* else -- the conversation belongs to this workspace */

  const data: FetchConversationResponseData = { conversation, messages: await conversationMessageFinder.listForConversation(workspaceId, conversation.id) };
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#a1a24c80 [dashboard.conversation] failed to fetch conversation ${conversationId}: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not load the conversation' });
 }
};

export const listConversations = async (req: WorkspaceRequest, res: Response): Promise<void> => {
 let query: yup.InferType<typeof listConversationsQuerySchema>;
 try {
  query = listConversationsQuerySchema.validateSync(req.query, { abortEarly: false, stripUnknown: true });
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid conversation filters' });
  return;
 }

 try {
  const data: ListConversationsResponseData = await conversationFinder.list(workspaceIdOf(req), query);
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#be873d1e [dashboard.conversation] failed to list conversations: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not load conversations' });
 }
};

export const updateConversation = async (req: WorkspaceRequest, res: Response): Promise<void> => {
 const conversationId = req.params.conversationId;
 if (!conversationIdSchema.isValidSync(conversationId)) {
  respondConversationNotFound(res);
  return;
 } /* else -- the conversation id is well formed */

 let patch: yup.InferType<typeof updateConversationSchema>;
 try {
  patch = updateConversationSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid conversation update' });
  return;
 }

 try {
  const workspaceId = workspaceIdOf(req);
  if (patch.assignee_profile_id && !(await workspaceMemberFinder.find(workspaceId, patch.assignee_profile_id))) {
   res.status(ResponseStatus.BadRequest).json({ message: 'The assignee is not a member of this workspace' });
   return;
  } /* else -- the conversation stays unassigned or goes to a member */

  const conversation = await conversationLifecycle.update(workspaceId, conversationId, patch);
  if (!conversation) {
   respondConversationNotFound(res);
   return;
  } /* else -- the conversation belongs to this workspace */

  const data: UpdateConversationResponseData = { conversation };
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#bebe1db0 [dashboard.conversation] failed to update conversation ${conversationId}: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not update the conversation' });
 }
};

// == Router ======================================================================
export const dashboardConversationRouter = Router();

// list conversations for the authenticated user within a workspace
dashboardConversationRouter.get(backendRoutes.dashboard.workspace.conversation.index, authenticateUser, requireWorkspaceMember, listConversations);

// create a new conversation within a workspace
dashboardConversationRouter.post(backendRoutes.dashboard.workspace.conversation.index, authenticateUser, requireWorkspaceMember, createConversation);

// fetch a specific conversation within a workspace
dashboardConversationRouter.get(backendRoutes.dashboard.workspace.conversation.detail, authenticateUser, requireWorkspaceMember, fetchConversation);

// update a specific conversation within a workspace
dashboardConversationRouter.patch(backendRoutes.dashboard.workspace.conversation.detail, authenticateUser, requireWorkspaceMember, updateConversation);

// post a new message to a specific conversation within a workspace
dashboardConversationRouter.post(backendRoutes.dashboard.workspace.conversation.message, authenticateUser, requireWorkspaceMember, createConversationMessage);

// == Util ========================================================================
const respondConversationNotFound = (res: Response): void => {
 res.status(ResponseStatus.NotFound).json({ message: 'Conversation not found' });
};

/** `requireWorkspaceMember` guarantees the membership, so its workspace id is the validated one */
const workspaceIdOf = (req: WorkspaceRequest): string => {
 if (!req.workspaceMember) {
  throw new Error('requireWorkspaceMember must run before this handler');
 } /* else -- the middleware validated the workspace */

 return req.workspaceMember.workspace_id;
};

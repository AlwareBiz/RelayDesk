import { Router } from 'express';

import { backendRoutes, createWorkspaceSchema, ResponseStatus, type CreateWorkspaceResponseData, type ListWorkspacesResponseData } from '@relaydesk/common';

import { authenticateUser } from '../../middleware/authenticateUser';
import { workspaceFinder } from '../../service/entity/workspace/PgWorkspaceFinder';
import { workspaceLifecycle } from '../../service/entity/workspace/PgWorkspaceLifecycle';
import { logger } from '../../service/logger/DatabaseLogger';
import type { AuthenticatedRequest } from '../../type';

// ********************************************************************************
// == Router ======================================================================
export const dashboardWorkspaceRouter = Router();

// list workspaces for the authenticated user
dashboardWorkspaceRouter.get(backendRoutes.dashboard.workspace.index, authenticateUser, async (req: AuthenticatedRequest, res) => {
 try {
  const data: ListWorkspacesResponseData = { workspaces: await workspaceFinder.listForProfile(req.user?.sub ?? '') };
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#83530f59 [dashboard.workspace] failed to list workspaces: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not load workspaces' });
 }
});

// create a new workspace for the authenticated user
dashboardWorkspaceRouter.post(backendRoutes.dashboard.workspace.index, authenticateUser, async (req: AuthenticatedRequest, res) => {
 let name: string;
 try {
  ({ name } = createWorkspaceSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true }));
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid workspace' });
  return;
 }

 try {
  const workspace = await workspaceLifecycle.createWithOwner({ name }, req.user?.sub ?? '');
  logger.info(`#8cc7a99f [dashboard.workspace] created workspace ${workspace.id}`);
  const data: CreateWorkspaceResponseData = { workspace };
  res.status(ResponseStatus.Created).json(data);
 } catch (error) {
  logger.error(`#cefe5edc [dashboard.workspace] failed to create workspace: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not create the workspace' });
 }
});

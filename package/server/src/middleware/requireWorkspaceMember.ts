import type { NextFunction, Response } from 'express';
import * as yup from 'yup';

import { ResponseStatus } from '@relaydesk/common';

import { workspaceMemberFinder } from '../service/entity/workspaceMember/PgWorkspaceMemberFinder';
import { logger } from '../service/logger/DatabaseLogger';
import type { WorkspaceRequest } from '../type';

// ********************************************************************************
// == Constant ====================================================================
const workspaceIdSchema = yup.string().uuid().required();

// == Middleware ==================================================================
/** loads the membership of the signed-in profile in `:workspaceId`; responds 404 for non-members so workspace ids do not leak */
export const requireWorkspaceMember = async (req: WorkspaceRequest, res: Response, next: NextFunction): Promise<void> => {
 const workspaceId = req.params.workspaceId;
 if (!workspaceIdSchema.isValidSync(workspaceId)) {
  res.status(ResponseStatus.NotFound).json({ message: 'Workspace not found' });
  return;
 }

 try {
  const member = await workspaceMemberFinder.find(workspaceId, req.user?.sub ?? '');
  if (!member) {
   res.status(ResponseStatus.NotFound).json({ message: 'Workspace not found' });
   return;
  }

  req.workspaceMember = member;
  next();
 } catch (error) {
  logger.error(`#0789a155 [workspace] failed to load membership: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not load the workspace' });
 }
};

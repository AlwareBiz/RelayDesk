import { Router } from 'express';

import { backendRoutes, ResponseStatus, type FetchCurrentProfileResponseData } from '@relaydesk/common';

import { authenticateUser } from '../../middleware/authenticateUser';
import { profileFinder } from '../../service/entity/profile/PgProfileFinder';
import { logger } from '../../service/logger/DatabaseLogger';
import type { AuthenticatedRequest } from '../../type';

// ********************************************************************************
// == Router ======================================================================
export const dashboardProfileRouter = Router();

// fetch the current authenticated user's profile
dashboardProfileRouter.get(backendRoutes.dashboard.profile.index, authenticateUser, async (req: AuthenticatedRequest, res) => {
 try {
  const profile = await profileFinder.findById(req.user?.sub ?? '');
  if (!profile) {
   res.status(ResponseStatus.NotFound).json({ message: 'Profile not found' });
   return;
  } /* else -- the profile exists */

  const data: FetchCurrentProfileResponseData = {
   profile: { created_at: profile.created_at, email: profile.email, id: profile.id, updated_at: profile.updated_at },
  };
  res.status(ResponseStatus.Ok).json(data);
 } catch (error) {
  logger.error(`#7e1c0a45 [dashboard.profile] failed to fetch current profile: ${String(error)}`);
  res.status(ResponseStatus.InternalServerError).json({ message: 'Could not load the profile' });
 }
});

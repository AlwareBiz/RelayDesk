import { Router } from 'express';

import { backendRoutes, ResponseStatus } from '@relaydesk/common';

import { authenticateUser } from '../middleware/authenticateUser';
import { profileFinder } from '../service/entity/profile/PgProfileFinder';
import type { AuthenticatedRequest } from '../type';

// ********************************************************************************
// == Router ======================================================================
export const meRouter = Router();

// fetch the current authenticated user's profile
meRouter.get(backendRoutes.me, authenticateUser, async (req: AuthenticatedRequest, res) => {
 const profile = await profileFinder.findById(req.user?.sub ?? '');
 if (!profile) {
  res.status(ResponseStatus.NotFound).json({ message: 'Profile not found' });
  return;
 } /* else -- the profile exists */

 res.status(ResponseStatus.Ok).json({ id: profile.id, email: profile.email });
});

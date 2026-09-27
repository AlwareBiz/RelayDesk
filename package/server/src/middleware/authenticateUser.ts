import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ResponseStatus } from '@relaydesk/common';

import { env } from '../service/env';
import type { AuthenticatedRequest } from '../type';

type SubjectClaim = { sub: string };

// ********************************************************************************
// == Middleware ==================================================================
export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
 const authorization = req.headers.authorization;

 if (!authorization?.startsWith('Bearer ')) {
  res.status(ResponseStatus.Unauthorized).json({ message: 'Missing authorization header' });
  return;
 } /* else -- continue with token verification */

 try {
  const payload = jwt.verify(authorization.slice(7), env.JWT_SECRET) as SubjectClaim;
  req.user = { sub: payload.sub };
  next();
 } catch {
  res.status(ResponseStatus.Forbidden).json({ message: 'Invalid or expired token' });
 }
};

import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { backendRoutes, credentialsSchema, ResponseStatus } from '@relaydesk/common';

import { env } from '../service/env';
import { profileFinder } from '../service/entity/profile/PgProfileFinder';
import { profileLifecycle } from '../service/entity/profile/PgProfileLifecycle';
import { logger } from '../service/logger/DatabaseLogger';

// ********************************************************************************
// == Constant ====================================================================
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';
const REFRESH_COOKIE = 'refresh_token';
const BCRYPT_ROUNDS = 12;

type SubjectClaim = { sub: string };

// == Router ======================================================================
export const authRouter = Router();

// handle authentication routes (login, register, refresh, logout)
authRouter.post(backendRoutes.auth.login, async (req: Request, res: Response): Promise<void> => {
 try {
  const { email, password } = credentialsSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
  const profile = await profileFinder.findByEmail(email);

  if (!profile || !(await bcrypt.compare(password, profile.password_hash))) {
   logger.warn(`#36e35814 [auth] login failed: ${email}`);
   res.status(ResponseStatus.Unauthorized).json({ message: 'Invalid email or password' });
   return;
  }

  logger.info(`#96feb077 [auth] login success: ${profile.id}`);
  issueSession(res, profile.id);
 } catch {
  res.status(ResponseStatus.BadRequest).json({ message: 'Invalid credentials' });
 }
});

// register a new user
authRouter.post(backendRoutes.auth.register, async (req: Request, res: Response): Promise<void> => {
 try {
  const { email, password } = credentialsSchema.validateSync(req.body, { abortEarly: false, stripUnknown: true });
  const profile = await profileLifecycle.create({ email, password_hash: await bcrypt.hash(password, BCRYPT_ROUNDS) });
  logger.info(`#48bd05da [auth] registration success: ${profile.id}`);
  issueSession(res, profile.id, ResponseStatus.Created);
 } catch (error) {
  const duplicate = error instanceof Error && error.message.includes('duplicate key');
  res.status(duplicate ? ResponseStatus.Conflict : ResponseStatus.BadRequest).json({ message: duplicate ? 'Email already registered' : 'Invalid registration' });
 }
});

// refresh the access token using the refresh token
authRouter.post(backendRoutes.auth.refresh, (req, res) => {
 try {
  const payload = jwt.verify(req.cookies?.[REFRESH_COOKIE], env.JWT_REFRESH_SECRET) as SubjectClaim;
  issueSession(res, payload.sub);
 } catch {
  res.status(ResponseStatus.Unauthorized).json({ message: 'Invalid or expired refresh token' });
 }
});

// logout the user by clearing the refresh token cookie
authRouter.post(backendRoutes.auth.logout, (_req, res) => {
 res.clearCookie(REFRESH_COOKIE);
 res.status(ResponseStatus.NoContent).send();
});

// == Util ========================================================================
const issueSession = (res: Response, userId: string, status = ResponseStatus.Ok): void => {
 const accessToken = jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
 const refreshToken = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
 res.cookie(REFRESH_COOKIE, refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict', secure: env.NODE_ENV === 'production' });
 res.status(status).json({ accessToken });
};

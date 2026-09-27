import cookieParser from 'cookie-parser';
import express from 'express';

import { ReqResHeader, RequestMethod, ResponseStatus } from '@relaydesk/common';

import { env } from './service/env';
import { authRouter } from './route/auth';
import { dashboardProfileRouter } from './route/dashboard/profile';
import { dashboardTicketRouter } from './route/dashboard/ticket';
import { dashboardWorkspaceRouter } from './route/dashboard/workspace';
import { healthRouter } from './route/health';
import { meRouter } from './route/me';

// ********************************************************************************
// == Setup =======================================================================
const app = express();

// == Middleware ==================================================================
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
 res.header(ReqResHeader.AccessControlAllowOrigin, env.FRONTEND_URL);
 res.header(ReqResHeader.AccessControlAllowCredentials, 'true');
 res.header(ReqResHeader.AccessControlAllowHeaders, [ReqResHeader.ContentType, ReqResHeader.Authorization].join(', '));
 res.header(ReqResHeader.AccessControlAllowMethods, Object.values(RequestMethod).join(', '));
 if (req.method === RequestMethod.OPTIONS) { res.sendStatus(ResponseStatus.NoContent); return; }
 next();
});

// == Route =======================================================================
app.use(authRouter);
app.use(dashboardProfileRouter);
app.use(dashboardTicketRouter);
app.use(dashboardWorkspaceRouter);
app.use(healthRouter);
app.use(meRouter);

// == Listen ======================================================================
app.listen(env.APP_PORT, () => console.info(`#3c492060 API listening on ${env.APP_PORT}`));

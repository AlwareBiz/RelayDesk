import { Router } from 'express';

import { backendRoutes, ResponseStatus } from '@relaydesk/common';

// ********************************************************************************
// == Router ======================================================================
export const healthRouter = Router();

healthRouter.get(backendRoutes.health, (_req, res) => {
 res.status(ResponseStatus.Ok).json({ ok: true });
});

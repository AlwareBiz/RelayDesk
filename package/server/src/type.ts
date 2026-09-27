import type { Request } from 'express';

import type { WorkspaceMember } from '@relaydesk/common';

// ********************************************************************************
// == Type ========================================================================
export type AuthenticatedRequest = Request & { user?: { sub: string } };

/** a request that passed `requireWorkspaceMember`, which sets `workspaceMember` */
export type WorkspaceRequest = AuthenticatedRequest & { workspaceMember?: WorkspaceMember };

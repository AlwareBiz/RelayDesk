// ********************************************************************************
// == Constant ====================================================================
export const backendRoutes = {
 auth: {
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  register: '/api/auth/register',
 },
 dashboard: {
  profile: {
   index: '/api/dashboard/profile',
  },
  workspace: {
   index: '/api/dashboard/workspace',
   ticket: {
    detail: '/api/dashboard/workspace/:workspaceId/ticket/:ticketId',
    index: '/api/dashboard/workspace/:workspaceId/ticket',
    message: '/api/dashboard/workspace/:workspaceId/ticket/:ticketId/message',
   },
  },
 },
 health: '/api/health',
 me: '/api/me',
} as const;

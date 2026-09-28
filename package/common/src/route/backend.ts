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
   conversation: {
    detail: '/api/dashboard/workspace/:workspaceId/conversation/:conversationId',
    index: '/api/dashboard/workspace/:workspaceId/conversation',
    message: '/api/dashboard/workspace/:workspaceId/conversation/:conversationId/message',
   },
   index: '/api/dashboard/workspace',
  },
 },
 health: '/api/health',
 me: '/api/me',
} as const;

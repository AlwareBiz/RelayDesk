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
   // compatibility aliases for clients built before the rename, removed in #13
   legacyTicket: {
    detail: '/api/dashboard/workspace/:workspaceId/ticket/:conversationId',
    index: '/api/dashboard/workspace/:workspaceId/ticket',
    message: '/api/dashboard/workspace/:workspaceId/ticket/:conversationId/message',
   },
  },
 },
 health: '/api/health',
 me: '/api/me',
} as const;

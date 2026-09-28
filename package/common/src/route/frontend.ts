import { profileTable } from '../schema/entity/profile/constant';

// ********************************************************************************
// == Constant ====================================================================
export const frontendRoute = {
 dashboard: {
  conversation: '/dashboard/workspace/$workspaceId/conversation/$conversationId',
  index: '/dashboard',
  // compatibility redirect for links from before the rename, removed in #13
  legacyTicket: '/dashboard/workspace/$workspaceId/ticket/$conversationId',
  [profileTable]: `/dashboard/${profileTable}`,
  workspace: '/dashboard/workspace/$workspaceId',
 },
 landing: '/',
 login: '/login',
 register: '/register',
} as const;

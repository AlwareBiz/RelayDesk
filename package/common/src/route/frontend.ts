import { profileTable } from '../schema/entity/profile/constant';

// ********************************************************************************
// == Constant ====================================================================
export const frontendRoute = {
 dashboard: {
  conversation: '/dashboard/workspace/$workspaceId/conversation/$conversationId',
  index: '/dashboard',
  [profileTable]: `/dashboard/${profileTable}`,
  workspace: '/dashboard/workspace/$workspaceId',
 },
 landing: '/',
 login: '/login',
 register: '/register',
} as const;

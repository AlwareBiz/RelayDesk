import { profileTable } from '../schema/entity/profile/constant';

// ********************************************************************************
// == Constant ====================================================================
export const frontendRoute = {
 dashboard: {
  index: '/dashboard',
  [profileTable]: `/dashboard/${profileTable}`,
  ticket: '/dashboard/workspace/$workspaceId/ticket/$ticketId',
  workspace: '/dashboard/workspace/$workspaceId',
 },
 landing: '/',
 login: '/login',
 register: '/register',
} as const;

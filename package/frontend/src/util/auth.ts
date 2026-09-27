import { isRedirect, redirect } from '@tanstack/react-router';

import { frontendRoute } from '@relaydesk/common';

import { AuthService } from '../service/AuthService';

// ********************************************************************************
// == Guard =======================================================================
/** send the visitor to the dashboard when a valid session already exists */
export const redirectIfAuthenticated = async (): Promise<void> => {
 if (AuthService.getAccessToken()) throw redirect({ to: frontendRoute.dashboard.index });

 try {
  await AuthService.refresh();
  throw redirect({ to: frontendRoute.dashboard.index });
 } catch (error) {
  if (isRedirect(error)) throw error;
  // swallow refresh failures, the visitor is simply not logged in
 }
};

/** send the visitor to the login page when no valid session exists */
export const requireAuth = async (): Promise<void> => {
 if (AuthService.getAccessToken()) return;

 try {
  await AuthService.refresh();
 } catch {
  throw redirect({ to: frontendRoute.login });
 }
};

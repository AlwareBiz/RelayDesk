import { backendRoutes, ReqResHeader } from '@relaydesk/common';

import { HttpService } from './HttpService';

// ********************************************************************************
// == Constant ====================================================================
// the access token lives in module memory only. Never stored in localStorage
let accessToken: string | null = null;

// == Service =====================================================================
export const AuthService = {
 getAccessToken(): string | null {
  return accessToken;
 },

 getAuthHeader(): Record<string, string> {
  return accessToken ? { [ReqResHeader.Authorization]: `Bearer ${accessToken}` } : {};
 },

 async loginWithEmail(email: string, password: string): Promise<void> {
  const { accessToken: token } = await HttpService.post<{ accessToken: string; }>(backendRoutes.auth.login, { email, password });
  accessToken = token;
 },

 async logOut(): Promise<void> {
  try {
   await HttpService.post(backendRoutes.auth.logout);
  } finally {
   accessToken = null;
  }
 },

 async refresh(): Promise<void> {
  const { accessToken: token } = await HttpService.post<{ accessToken: string; }>(backendRoutes.auth.refresh);
  accessToken = token;
 },

 async register(email: string, password: string): Promise<void> {
  const { accessToken: token } = await HttpService.post<{ accessToken: string; }>(backendRoutes.auth.register, { email, password });
  accessToken = token;
 },
};

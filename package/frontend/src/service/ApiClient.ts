import { AuthService } from './AuthService';
import { HttpService } from './HttpService';

// ********************************************************************************
// == Service =====================================================================
export const ApiClient = {
 delete: <T>(path: string, body?: object) => HttpService.delete<T>(path, body, AuthService.getAuthHeader()),
 get: <T>(path: string) => HttpService.get<T>(path, AuthService.getAuthHeader()),
 patch: <T>(path: string, body?: object) => HttpService.patch<T>(path, body, AuthService.getAuthHeader()),
 post: <T>(path: string, body?: object) => HttpService.post<T>(path, body, AuthService.getAuthHeader()),
 put: <T>(path: string, body?: object) => HttpService.put<T>(path, body, AuthService.getAuthHeader()),
};

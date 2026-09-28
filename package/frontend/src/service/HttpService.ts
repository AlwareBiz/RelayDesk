import { ContentType, ReqResHeader, RequestMethod, ResponseStatus } from '@relaydesk/common';

// ********************************************************************************
// == Service =====================================================================
export const HttpService = {
 delete: <T>(path: string, body?: object, headers?: Record<string, string>) => execute<T>(RequestMethod.DELETE, path, body, headers),
 get: <T>(path: string, headers?: Record<string, string>) => execute<T>(RequestMethod.GET, path, undefined, headers),
 patch: <T>(path: string, body?: object, headers?: Record<string, string>) => execute<T>(RequestMethod.PATCH, path, body, headers),
 post: <T>(path: string, body?: object, headers?: Record<string, string>) => execute<T>(RequestMethod.POST, path, body, headers),
 put: <T>(path: string, body?: object, headers?: Record<string, string>) => execute<T>(RequestMethod.PUT, path, body, headers),
};

// == Util ========================================================================
const execute = async <T>(method: RequestMethod, path: string, body?: object, extraHeaders?: Record<string, string>): Promise<T> => {
 const response = await fetch(path, {
  body: body ? JSON.stringify(body) : undefined,
  credentials: 'include',
  headers: { [ReqResHeader.ContentType]: ContentType.ApplicationJson, ...extraHeaders },
  method,
 });

 if (!response.ok) {
  throw new Error(await getErrorMessage(response));
 } /* else -- the request succeeded */

 if (response.status === ResponseStatus.NoContent) {
  return undefined as T;
 } /* else -- the response carries a JSON body */
 return response.json() as Promise<T>;
};

const getErrorMessage = async (response: Response): Promise<string> => {
 const fallbackMessage = `Request failed: ${response.status}`;

 try {
  const json = (await response.json()) as { message?: unknown; };
  return typeof json.message === 'string' && json.message.trim() ? json.message.trim() : fallbackMessage;
 } catch {
  return fallbackMessage;
 }
};

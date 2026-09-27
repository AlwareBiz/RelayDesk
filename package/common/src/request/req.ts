// ********************************************************************************
// == Enum ========================================================================
export enum ContentType {
 ApplicationJson = 'application/json',
}

export enum ReqResHeader {
 AccessControlAllowCredentials = 'Access-Control-Allow-Credentials',
 AccessControlAllowHeaders = 'Access-Control-Allow-Headers',
 AccessControlAllowMethods = 'Access-Control-Allow-Methods',
 AccessControlAllowOrigin = 'Access-Control-Allow-Origin',
 Authorization = 'Authorization',
 ContentType = 'Content-Type',
}

export enum RequestMethod {
 DELETE = 'DELETE',
 GET = 'GET',
 OPTIONS = 'OPTIONS',
 PATCH = 'PATCH',
 POST = 'POST',
 PUT = 'PUT',
}

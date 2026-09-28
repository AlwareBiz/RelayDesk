// ********************************************************************************
// == Export ======================================================================
export const RouteUtil = {
 /** replaces `:param` segments of a backend route with URL-encoded values */
 fill(path: string, params: Record<string, string>): string {
  return path.replace(/:([A-Za-z]+)/g, (segment, name: string) => {
   const value = params[name];
   if (value === undefined) {
    throw new Error(`Missing route param: ${name}`);
   } /* else -- the caller supplied this param */

   return encodeURIComponent(value);
  });
 },

 /** serializes defined values into a query string, including the leading `?` */
 query(params: Record<string, number | string | undefined>): string {
  const entries = Object.entries(params).filter((entry): entry is [string, number | string] => entry[1] !== undefined);
  return entries.length ? `?${new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString()}` : '';
 },
};

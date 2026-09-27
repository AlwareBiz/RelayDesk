// ********************************************************************************
// == Export ======================================================================
export const ErrorUtil = {
 toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
 },
};

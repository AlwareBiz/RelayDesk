import type { Database } from '../../../db/type';

// ********************************************************************************
// == Type ========================================================================
export type Log = Database['public']['Tables']['log']['Row'];
export type LogInsert = Database['public']['Tables']['log']['Insert'];
export type LogUpdate = Database['public']['Tables']['log']['Update'];

// == Enum ========================================================================
export type LogLevel = Database['public']['Enums']['log_level'];

// == Constant ====================================================================
export const logLevels: { [key in LogLevel]: key } = {
 debug: 'debug',
 error: 'error',
 info: 'info',
 warn: 'warn',
};

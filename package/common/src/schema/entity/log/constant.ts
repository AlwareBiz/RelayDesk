import type { Database } from '../../../db/type';
import type { Log } from './type';

// ********************************************************************************
// == Table =======================================================================
export const logTable: Extract<keyof Database['public']['Tables'], 'log'> = 'log';

// == Column ======================================================================
export const logColumns: { [key in keyof Log]: key } = {
 content: 'content',
 created_at: 'created_at',
 id: 'id',
 log_level: 'log_level',
};

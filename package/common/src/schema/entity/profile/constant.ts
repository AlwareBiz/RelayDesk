import type { Database } from '../../../db/type';
import type { Profile } from './type';

// ********************************************************************************
// == Table =======================================================================
export const profileTable: Extract<keyof Database['public']['Tables'], 'profile'> = 'profile';

// == Column ======================================================================
export const profileColumns: { [key in keyof Profile]: key } = {
 created_at: 'created_at',
 email: 'email',
 id: 'id',
 password_hash: 'password_hash',
 updated_at: 'updated_at',
};

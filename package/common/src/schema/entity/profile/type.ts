import type { Database } from '../../../db/type';

// ********************************************************************************
// == Type ========================================================================
export type Profile = Database['public']['Tables']['profile']['Row'];
export type ProfileInsert = Database['public']['Tables']['profile']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profile']['Update'];

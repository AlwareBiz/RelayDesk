import type { Database } from '../../../db/type';

// ********************************************************************************
// == Type ========================================================================
export type Workspace = Database['public']['Tables']['workspace']['Row'];
export type WorkspaceInsert = Database['public']['Tables']['workspace']['Insert'];
export type WorkspaceUpdate = Database['public']['Tables']['workspace']['Update'];

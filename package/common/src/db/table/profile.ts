import type { TableTypes } from '../tableTypes';

// ********************************************************************************
// == Type ========================================================================
export type ProfileRow = {
 created_at: string;
 email: string;
 id: string;
 password_hash: string;
 updated_at: string;
};

type OptionalOnInsert = 'created_at' | 'id' | 'updated_at';

export type ProfileTableTypes = TableTypes<ProfileRow, OptionalOnInsert>;

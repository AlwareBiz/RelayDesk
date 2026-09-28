import type { TableTypes } from '../tableTypes';

// ********************************************************************************
// == Type ========================================================================
export type WorkspaceRow = {
 conversation_counter: number;
 created_at: string;
 id: string;
 name: string;
 updated_at: string;
};

type OptionalOnInsert = 'conversation_counter' | 'created_at' | 'id' | 'updated_at';

export type WorkspaceTableTypes = TableTypes<WorkspaceRow, OptionalOnInsert>;

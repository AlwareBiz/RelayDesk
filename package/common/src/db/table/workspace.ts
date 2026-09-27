import type { TableTypes } from '../tableTypes';

// ********************************************************************************
// == Type ========================================================================
export type WorkspaceRow = {
 created_at: string;
 id: string;
 name: string;
 ticket_counter: number;
 updated_at: string;
};

type OptionalOnInsert = 'created_at' | 'id' | 'ticket_counter' | 'updated_at';

export type WorkspaceTableTypes = TableTypes<WorkspaceRow, OptionalOnInsert>;

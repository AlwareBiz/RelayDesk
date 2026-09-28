import type { TableTypes } from '../tableTypes';

// ********************************************************************************
// == Type ========================================================================
export type WorkspaceRow = {
 created_at: string;
 id: string;
 name: string;
 ticket_counter: number; // stored name, renamed to conversation_counter in #10
 updated_at: string;
};

type OptionalOnInsert = 'created_at' | 'id' | 'ticket_counter' | 'updated_at'; // stored name, renamed to conversation_counter in #10

export type WorkspaceTableTypes = TableTypes<WorkspaceRow, OptionalOnInsert>;

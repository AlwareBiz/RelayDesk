import type { TableTypes } from '../tableTypes';
import type { TicketPriorityEnum, TicketStatusEnum } from '../enum';

// ********************************************************************************
// == Type ========================================================================
export type TicketRow = {
 assignee_profile_id: string | null;
 created_at: string;
 id: string;
 number: number;
 priority: TicketPriorityEnum;
 requester_email: string;
 status: TicketStatusEnum;
 subject: string;
 updated_at: string;
 workspace_id: string;
};

type OptionalOnInsert = 'assignee_profile_id' | 'created_at' | 'id' | 'priority' | 'status' | 'updated_at';

export type TicketTableTypes = TableTypes<TicketRow, OptionalOnInsert>;

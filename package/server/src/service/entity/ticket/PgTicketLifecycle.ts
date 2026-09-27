import { ticketColumns, ticketTable, workspaceColumns, workspaceTable, type Ticket, type TicketCreateData, type TicketLifecycleService, type TicketPatch } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Constant ====================================================================
const patchableColumns = [ticketColumns.assignee_profile_id, ticketColumns.priority, ticketColumns.status] as const;

// == Class =======================================================================
export class PgTicketLifecycle implements TicketLifecycleService {
 async create(data: TicketCreateData): Promise<Ticket> {
  const client = await pgPool.connect();
  try {
   await client.query('BEGIN');
   // the row lock on the workspace serializes concurrent ticket creation, so numbers never collide
   const counterResult = await client.query<{ ticket_counter: number }>(
    `UPDATE ${workspaceTable} SET ${workspaceColumns.ticket_counter} = ${workspaceColumns.ticket_counter} + 1 WHERE ${workspaceColumns.id} = $1 RETURNING ${workspaceColumns.ticket_counter}`,
    [data.workspace_id],
   );
   const number = counterResult.rows[0]?.ticket_counter;
   if (number === undefined) throw new Error('Workspace not found while allocating a ticket number');

   const result = await client.query<Ticket>(
    `INSERT INTO ${ticketTable} (${ticketColumns.workspace_id}, ${ticketColumns.number}, ${ticketColumns.subject}, ${ticketColumns.requester_email}, ${ticketColumns.priority}, ${ticketColumns.assignee_profile_id})
     VALUES ($1, $2, $3, $4, COALESCE($5, 'normal'::ticket_priority), $6) RETURNING *`,
    [data.workspace_id, number, data.subject, data.requester_email, data.priority ?? null, data.assignee_profile_id ?? null],
   );
   await client.query('COMMIT');

   const ticket = result.rows[0];
   if (!ticket) throw new Error('Expected inserted ticket row');
   return ticket;
  } catch (error) {
   await client.query('ROLLBACK');
   throw error;
  } finally {
   client.release();
  }
 }

 async update(workspaceId: Ticket['workspace_id'], id: Ticket['id'], patch: TicketPatch): Promise<Ticket | null> {
  const assignments: string[] = [];
  const params: unknown[] = [];
  for (const column of patchableColumns) {
   if (patch[column] === undefined) continue;
   params.push(patch[column]);
   assignments.push(`${column} = $${params.length}`);
  }
  assignments.push(`${ticketColumns.updated_at} = now()`);

  params.push(workspaceId, id);
  const result = await pgPool.query<Ticket>(
   `UPDATE ${ticketTable} SET ${assignments.join(', ')} WHERE ${ticketColumns.workspace_id} = $${params.length - 1} AND ${ticketColumns.id} = $${params.length} RETURNING *`,
   params,
  );
  return result.rows[0] ?? null;
 }
}

// == Export ======================================================================
export const ticketLifecycle = new PgTicketLifecycle();

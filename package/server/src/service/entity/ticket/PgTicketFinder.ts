import { ticketColumns, ticketTable, type ListTicketsQuery, type Ticket, type TicketFinderService } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgTicketFinder implements TicketFinderService {
 async findById(workspaceId: Ticket['workspace_id'], id: Ticket['id']): Promise<Ticket | null> {
  const result = await pgPool.query<Ticket>(
   `SELECT * FROM ${ticketTable} WHERE ${ticketColumns.workspace_id} = $1 AND ${ticketColumns.id} = $2 LIMIT 1`,
   [workspaceId, id],
  );
  return result.rows[0] ?? null;
 }

 async list(workspaceId: Ticket['workspace_id'], query: ListTicketsQuery): Promise<{ tickets: Ticket[]; total: number }> {
  const params: unknown[] = [workspaceId];
  let where = `${ticketColumns.workspace_id} = $1`;
  if (query.status) {
   params.push(query.status);
   where += ` AND ${ticketColumns.status} = $${params.length}`;
  }

  const countResult = await pgPool.query<{ count: string }>(`SELECT count(*) FROM ${ticketTable} WHERE ${where}`, params);
  const result = await pgPool.query<Ticket>(
   `SELECT * FROM ${ticketTable} WHERE ${where} ORDER BY ${ticketColumns.created_at} DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
   [...params, query.limit, query.offset],
  );
  return { tickets: result.rows, total: Number(countResult.rows[0]?.count ?? 0) };
 }
}

// == Export ======================================================================
export const ticketFinder = new PgTicketFinder();

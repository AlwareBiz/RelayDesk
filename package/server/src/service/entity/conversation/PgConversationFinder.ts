import { conversationColumns, conversationTable, type ListConversationsQuery, type Conversation, type ConversationFinderService } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgConversationFinder implements ConversationFinderService {
 async findById(workspaceId: Conversation['workspace_id'], id: Conversation['id']): Promise<Conversation | null> {
  const result = await pgPool.query<Conversation>(
   `SELECT * FROM ${conversationTable} WHERE ${conversationColumns.workspace_id} = $1 AND ${conversationColumns.id} = $2 LIMIT 1`,
   [workspaceId, id],
  );
  return result.rows[0] ?? null;
 }

 async list(workspaceId: Conversation['workspace_id'], query: ListConversationsQuery): Promise<{ conversations: Conversation[]; total: number }> {
  const params: unknown[] = [workspaceId];
  let where = `${conversationColumns.workspace_id} = $1`;
  if (query.status) {
   params.push(query.status);
   where += ` AND ${conversationColumns.status} = $${params.length}`;
  } /* else -- list conversations in every status */

  const countResult = await pgPool.query<{ count: string }>(`SELECT count(*) FROM ${conversationTable} WHERE ${where}`, params);
  const result = await pgPool.query<Conversation>(
   `SELECT * FROM ${conversationTable} WHERE ${where} ORDER BY ${conversationColumns.created_at} DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
   [...params, query.limit, query.offset],
  );
  return { conversations: result.rows, total: Number(countResult.rows[0]?.count ?? 0) };
 }
}

// == Export ======================================================================
export const conversationFinder = new PgConversationFinder();

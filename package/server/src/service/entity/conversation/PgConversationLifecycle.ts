import { conversationColumns, conversationTable, workspaceColumns, workspaceTable, type Conversation, type ConversationCreateData, type ConversationLifecycleService, type ConversationPatch } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Constant ====================================================================
const patchableColumns = [conversationColumns.assignee_profile_id, conversationColumns.priority, conversationColumns.status] as const;

// == Class =======================================================================
export class PgConversationLifecycle implements ConversationLifecycleService {
 async create(data: ConversationCreateData): Promise<Conversation> {
  const client = await pgPool.connect();
  try {
   await client.query('BEGIN');
   // the row lock on the workspace serializes concurrent conversation creation, so numbers never collide
   const counterResult = await client.query<{ conversation_counter: number }>(
    `UPDATE ${workspaceTable} SET ${workspaceColumns.conversation_counter} = ${workspaceColumns.conversation_counter} + 1 WHERE ${workspaceColumns.id} = $1 RETURNING ${workspaceColumns.conversation_counter}`,
    [data.workspace_id],
   );
   const number = counterResult.rows[0]?.conversation_counter;
   if (number === undefined) {
    throw new Error('Workspace not found while allocating a conversation number');
   } /* else -- the workspace reserved the next number */

   const result = await client.query<Conversation>(
    `INSERT INTO ${conversationTable} (${conversationColumns.workspace_id}, ${conversationColumns.number}, ${conversationColumns.subject}, ${conversationColumns.requester_email}, ${conversationColumns.priority}, ${conversationColumns.assignee_profile_id})
     VALUES ($1, $2, $3, $4, COALESCE($5, 'normal'::conversation_priority), $6) RETURNING *`,
    [data.workspace_id, number, data.subject, data.requester_email, data.priority ?? null, data.assignee_profile_id ?? null],
   );
   await client.query('COMMIT');

   const conversation = result.rows[0];
   if (!conversation) {
    throw new Error('Expected inserted conversation row');
   } /* else -- the insert returned the row */

   return conversation;
  } catch (error) {
   await client.query('ROLLBACK');
   throw error;
  } finally {
   client.release();
  }
 }

 async update(workspaceId: Conversation['workspace_id'], id: Conversation['id'], patch: ConversationPatch): Promise<Conversation | null> {
  const assignments: string[] = [];
  const params: unknown[] = [];
  for (const column of patchableColumns) {
   if (patch[column] === undefined) {
    continue;
   } /* else -- the patch changes this column */

   params.push(patch[column]);
   assignments.push(`${column} = $${params.length}`);
  }
  assignments.push(`${conversationColumns.updated_at} = now()`);

  params.push(workspaceId, id);
  const result = await pgPool.query<Conversation>(
   `UPDATE ${conversationTable} SET ${assignments.join(', ')} WHERE ${conversationColumns.workspace_id} = $${params.length - 1} AND ${conversationColumns.id} = $${params.length} RETURNING *`,
   params,
  );
  return result.rows[0] ?? null;
 }
}

// == Export ======================================================================
export const conversationLifecycle = new PgConversationLifecycle();

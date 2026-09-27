import { workspaceColumns, workspaceMemberColumns, workspaceMemberTable, workspaceRoles, workspaceTable, type Profile, type Workspace, type WorkspaceInsert, type WorkspaceLifecycleService, type WorkspaceWithRole } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgWorkspaceLifecycle implements WorkspaceLifecycleService {
 async createWithOwner(data: WorkspaceInsert, ownerProfileId: Profile['id']): Promise<WorkspaceWithRole> {
  const client = await pgPool.connect();
  try {
   await client.query('BEGIN');
   const result = await client.query<Workspace>(
    `INSERT INTO ${workspaceTable} (${workspaceColumns.name}) VALUES ($1) RETURNING *`,
    [data.name],
   );
   const workspace = result.rows[0];
   if (!workspace) throw new Error('Expected inserted workspace row');

   await client.query(
    `INSERT INTO ${workspaceMemberTable} (${workspaceMemberColumns.workspace_id}, ${workspaceMemberColumns.profile_id}, ${workspaceMemberColumns.role}) VALUES ($1, $2, $3)`,
    [workspace.id, ownerProfileId, workspaceRoles.owner],
   );
   await client.query('COMMIT');

   return { created_at: workspace.created_at, id: workspace.id, name: workspace.name, role: workspaceRoles.owner, updated_at: workspace.updated_at };
  } catch (error) {
   await client.query('ROLLBACK');
   throw error;
  } finally {
   client.release();
  }
 }
}

// == Export ======================================================================
export const workspaceLifecycle = new PgWorkspaceLifecycle();

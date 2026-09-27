import { workspaceColumns, workspaceMemberColumns, workspaceMemberTable, workspaceTable, type Profile, type Workspace, type WorkspaceFinderService, type WorkspaceWithRole } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgWorkspaceFinder implements WorkspaceFinderService {
 async findById(id: Workspace['id']): Promise<Workspace | null> {
  const result = await pgPool.query<Workspace>(
   `SELECT * FROM ${workspaceTable} WHERE ${workspaceColumns.id} = $1 LIMIT 1`,
   [id],
  );
  return result.rows[0] ?? null;
 }

 async listForProfile(profileId: Profile['id']): Promise<WorkspaceWithRole[]> {
  const result = await pgPool.query<WorkspaceWithRole>(
   `SELECT w.${workspaceColumns.id}, w.${workspaceColumns.name}, w.${workspaceColumns.created_at}, w.${workspaceColumns.updated_at}, m.${workspaceMemberColumns.role}
    FROM ${workspaceTable} w
    JOIN ${workspaceMemberTable} m ON m.${workspaceMemberColumns.workspace_id} = w.${workspaceColumns.id}
    WHERE m.${workspaceMemberColumns.profile_id} = $1
    ORDER BY w.${workspaceColumns.name}`,
   [profileId],
  );
  return result.rows;
 }
}

// == Export ======================================================================
export const workspaceFinder = new PgWorkspaceFinder();

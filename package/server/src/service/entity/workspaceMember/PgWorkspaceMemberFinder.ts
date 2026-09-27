import { workspaceMemberColumns, workspaceMemberTable, type WorkspaceMember, type WorkspaceMemberFinderService } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgWorkspaceMemberFinder implements WorkspaceMemberFinderService {
 async find(workspaceId: WorkspaceMember['workspace_id'], profileId: WorkspaceMember['profile_id']): Promise<WorkspaceMember | null> {
  const result = await pgPool.query<WorkspaceMember>(
   `SELECT * FROM ${workspaceMemberTable} WHERE ${workspaceMemberColumns.workspace_id} = $1 AND ${workspaceMemberColumns.profile_id} = $2 LIMIT 1`,
   [workspaceId, profileId],
  );
  return result.rows[0] ?? null;
 }
}

// == Export ======================================================================
export const workspaceMemberFinder = new PgWorkspaceMemberFinder();

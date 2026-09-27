import type { WorkspaceMember } from '../../schema/entity/workspaceMember';

// ********************************************************************************
// == Interface ===================================================================
export interface WorkspaceMemberFinderService {
 find(workspaceId: WorkspaceMember['workspace_id'], profileId: WorkspaceMember['profile_id']): Promise<WorkspaceMember | null>;
}

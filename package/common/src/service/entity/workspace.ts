import type { Profile } from '../../schema/entity/profile';
import type { Workspace, WorkspaceInsert, WorkspaceWithRole } from '../../schema/entity/workspace';

// ********************************************************************************
// == Interface ===================================================================
export interface WorkspaceFinderService {
 findById(id: Workspace['id']): Promise<Workspace | null>;
 listForProfile(profileId: Profile['id']): Promise<WorkspaceWithRole[]>;
}

export interface WorkspaceLifecycleService {
 /** creates the workspace and makes the given profile its owner */
 createWithOwner(data: WorkspaceInsert, ownerProfileId: Profile['id']): Promise<WorkspaceWithRole>;
}

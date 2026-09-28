import type { WorkspaceRole } from '../../workspaceMember/type';
import type { Workspace } from '../type';

// ********************************************************************************
// == Type ========================================================================
/** a workspace as seen by one member, including the role of that member */
export type WorkspaceWithRole = Omit<Workspace, 'conversation_counter'> & { role: WorkspaceRole };

export type ListWorkspacesResponseData = {
 workspaces: WorkspaceWithRole[];
};

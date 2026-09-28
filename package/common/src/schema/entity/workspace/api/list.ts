import type { WorkspaceRole } from '../../workspaceMember/type';
import type { Workspace } from '../type';

// ********************************************************************************
// == Type ========================================================================
/** a workspace as seen by one member, including the role of that member */
export type WorkspaceWithRole = Omit<Workspace, 'ticket_counter'> & { role: WorkspaceRole }; // stored name, renamed to conversation_counter in #10

export type ListWorkspacesResponseData = {
 workspaces: WorkspaceWithRole[];
};

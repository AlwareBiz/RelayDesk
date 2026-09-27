import * as yup from 'yup';

import type { WorkspaceWithRole } from './list';

// ********************************************************************************
// == Schema ======================================================================
export const createWorkspaceSchema = yup.object({
 name: yup.string().trim().min(2).max(80).required(),
});

// == Type ========================================================================
export type CreateWorkspaceData = yup.InferType<typeof createWorkspaceSchema>;

export type CreateWorkspaceResponseData = {
 workspace: WorkspaceWithRole;
};

// == Constant ====================================================================
export const createWorkspaceSchemaKeys: { [key in keyof CreateWorkspaceData]: key } = {
 name: 'name',
};

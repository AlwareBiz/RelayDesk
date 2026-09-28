import type { NextFunction, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ResponseStatus, type WorkspaceMember } from '@relaydesk/common';

import { workspaceMemberFinder } from '../service/entity/workspaceMember/PgWorkspaceMemberFinder';
import type { WorkspaceRequest } from '../type';
import { requireWorkspaceMember } from './requireWorkspaceMember';

// ********************************************************************************
// == Mock ========================================================================
vi.mock('../service/entity/workspaceMember/PgWorkspaceMemberFinder', () => ({ workspaceMemberFinder: { find: vi.fn() } }));
vi.mock('../service/logger/DatabaseLogger', () => ({ logger: { error: vi.fn() } }));

// == Constant ====================================================================
const PROFILE_ID = '8b1f9a52-0c2e-4d7a-9b3e-1f2a3b4c5d6e';
const WORKSPACE_ID = '3c9d1e2f-4a5b-4c6d-8e7f-9a0b1c2d3e4f';
const MEMBER: WorkspaceMember = { created_at: '2026-09-27T00:00:00.000Z', profile_id: PROFILE_ID, role: 'agent', workspace_id: WORKSPACE_ID };

// == Util ========================================================================
const buildRequest = (workspaceId: string): WorkspaceRequest => ({ params: { workspaceId }, user: { sub: PROFILE_ID } }) as unknown as WorkspaceRequest;

const buildResponse = () => {
 const res = { json: vi.fn(), status: vi.fn() };
 res.status.mockReturnValue(res);
 return res;
};

// == Test ========================================================================
describe('requireWorkspaceMember', () => {
 beforeEach(() => {
  vi.clearAllMocks();
 });

 it('lets a member through and exposes the membership to the handler', async () => {
  vi.mocked(workspaceMemberFinder.find).mockResolvedValue(MEMBER);
  const req = buildRequest(WORKSPACE_ID);
  const next = vi.fn() as NextFunction;

  await requireWorkspaceMember(req, buildResponse() as unknown as Response, next);

  expect(next).toHaveBeenCalledOnce();
  expect(req.workspaceMember).toEqual(MEMBER);
 });

 // answering 403 here would confirm to an outsider that the workspace exists
 it('answers 404, not 403, when the profile is not a member', async () => {
  vi.mocked(workspaceMemberFinder.find).mockResolvedValue(null);
  const res = buildResponse();
  const next = vi.fn() as NextFunction;

  await requireWorkspaceMember(buildRequest(WORKSPACE_ID), res as unknown as Response, next);

  expect(res.status).toHaveBeenCalledWith(ResponseStatus.NotFound);
  expect(next).not.toHaveBeenCalled();
 });

 // a malformed id would otherwise reach PostgreSQL and fail as a 500
 it('answers 404 without querying when the workspace id is not a UUID', async () => {
  const res = buildResponse();

  await requireWorkspaceMember(buildRequest('not-a-uuid'), res as unknown as Response, vi.fn() as NextFunction);

  expect(workspaceMemberFinder.find).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(ResponseStatus.NotFound);
 });

 it('answers 500 with a public message when the lookup fails', async () => {
  vi.mocked(workspaceMemberFinder.find).mockRejectedValue(new Error('connection refused'));
  const res = buildResponse();

  await requireWorkspaceMember(buildRequest(WORKSPACE_ID), res as unknown as Response, vi.fn() as NextFunction);

  expect(res.status).toHaveBeenCalledWith(ResponseStatus.InternalServerError);
  expect(res.json).toHaveBeenCalledWith({ message: 'Could not load the workspace' });
 });
});

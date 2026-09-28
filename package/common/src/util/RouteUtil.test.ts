import { describe, expect, it } from 'vitest';

import { RouteUtil } from './RouteUtil';

// ********************************************************************************
// == Test ========================================================================
describe('RouteUtil', () => {
 describe('fill', () => {
  it('replaces every :param segment with its value', () => {
   expect(RouteUtil.fill('/api/workspace/:workspaceId/conversation/:conversationId', { conversationId: 't1', workspaceId: 'w1' })).toBe('/api/workspace/w1/conversation/t1');
  });

  // a raw "/" or "?" in an id would silently hit a different route
  it('URL-encodes values so an id cannot change the path', () => {
   expect(RouteUtil.fill('/api/conversation/:conversationId', { conversationId: 'a/b?c' })).toBe('/api/conversation/a%2Fb%3Fc');
  });

  // a missing param would otherwise produce a request to a literal ":conversationId" path
  it('throws when a param has no value', () => {
   expect(() => RouteUtil.fill('/api/conversation/:conversationId', {})).toThrow('Missing route param: conversationId');
  });
 });

 describe('query', () => {
  it('drops undefined values so filters that are not set are not sent', () => {
   expect(RouteUtil.query({ limit: 25, status: undefined })).toBe('?limit=25');
  });

  it('returns an empty string when there is nothing to send', () => {
   expect(RouteUtil.query({ status: undefined })).toBe('');
  });
 });
});

import { describe, expect, it } from 'vitest';

import { createConversationSchema } from './create';

// ********************************************************************************
// == Constant ====================================================================
const VALIDATE_OPTIONS = { abortEarly: false, stripUnknown: true };

// == Test ========================================================================
describe('createConversationSchema', () => {
 // the same customer must match one requester regardless of how they typed their address
 it('trims and lowercases the requester email', () => {
  const data = createConversationSchema.validateSync({ body: 'Hi', requester_email: '  Jane@Example.COM ', subject: 'Help' }, VALIDATE_OPTIONS);
  expect(data.requester_email).toBe('jane@example.com');
 });

 it('defaults the priority to normal', () => {
  const data = createConversationSchema.validateSync({ body: 'Hi', requester_email: 'jane@example.com', subject: 'Help' }, VALIDATE_OPTIONS);
  expect(data.priority).toBe('normal');
 });

 it('rejects a priority outside the conversation priorities', () => {
  expect(() => createConversationSchema.validateSync({ body: 'Hi', priority: 'critical', requester_email: 'jane@example.com', subject: 'Help' }, VALIDATE_OPTIONS)).toThrow();
 });

 it('rejects a subject that is only whitespace', () => {
  expect(() => createConversationSchema.validateSync({ body: 'Hi', requester_email: 'jane@example.com', subject: '   ' }, VALIDATE_OPTIONS)).toThrow();
 });
});

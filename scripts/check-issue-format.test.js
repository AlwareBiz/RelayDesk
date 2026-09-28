import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

import { load } from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { findFormatProblems, readRequiredLabels } from './check-issue-format.mjs';

// ********************************************************************************
// == Util ========================================================================
const readForm = (name) => load(readFileSync(new URL(`../.github/ISSUE_TEMPLATE/${name}.yml`, import.meta.url), 'utf8'));

const writeBody = (labels, contentByLabel = {}) => labels.map((label) => `### ${label}\n\n${contentByLabel[label] ?? `Some ${label.toLowerCase()}.`}`).join('\n\n');

// == Test ========================================================================
describe('check-issue-format', () => {
 describe('readRequiredLabels', () => {
  it('reads every required field of the task form in form order, skipping the markdown intro', () => {
   const labels = readRequiredLabels(readForm('task'));

   expect(labels).toEqual(['Goal', 'Naming', 'Lifecycle', 'Dependencies', 'Constraints', 'Context', 'Acceptance criteria', 'Out of scope', 'How to verify', 'Feature flag']);
  });

  it('reads the epic form, which has sub-issues instead of acceptance criteria', () => {
   const labels = readRequiredLabels(readForm('epic'));

   expect(labels).toContain('Sub-issues');
   expect(labels).not.toContain('Acceptance criteria');
  });

  it('skips fields that are not required', () => {
   const form = { body: [{ attributes: { label: 'Goal' }, validations: { required: true } }, { attributes: { label: 'Notes' } }] };

   expect(readRequiredLabels(form)).toEqual(['Goal']);
  });
 });

 describe('findFormatProblems', () => {
  const labels = readRequiredLabels(readForm('task'));

  it('accepts a body with every section filled in', () => {
   expect(findFormatProblems(writeBody(labels), labels)).toEqual([]);
  });

  it('accepts Windows line endings', () => {
   expect(findFormatProblems(writeBody(labels).replaceAll('\n', '\r\n'), labels)).toEqual([]);
  });

  it('names each missing section', () => {
   const body = writeBody(labels.filter((label) => label !== 'Naming' && label !== 'Lifecycle'));

   expect(findFormatProblems(body, labels)).toEqual(['Missing section "### Naming"', 'Missing section "### Lifecycle"']);
  });

  // GitHub fills empty optional fields with a placeholder, which must not count as content
  it('treats a blank section and the "_No response_" placeholder as empty', () => {
   const body = writeBody(labels, { Constraints: '_No response_', Goal: '   ' });

   expect(findFormatProblems(body, labels)).toEqual(['Empty section "### Goal"', 'Empty section "### Constraints"']);
  });

  // an issue created with `gh issue create --body` may use other heading levels, which the form never produces
  it('does not accept a section written with a different heading level', () => {
   const body = writeBody(labels).replace('### Goal', '## Goal');

   expect(findFormatProblems(body, labels)).toEqual(['Missing section "### Goal"']);
  });

  it('keeps a heading that is not a form field inside the section above it', () => {
   const body = writeBody(labels, { Context: '### Notes\n\nThe old queue drops messages.' });

   expect(findFormatProblems(body, labels)).toEqual([]);
  });

  it('ignores text before the first section', () => {
   expect(findFormatProblems(`Written by the write-issue skill.\n\n${writeBody(labels)}`, labels)).toEqual([]);
  });
 });
});

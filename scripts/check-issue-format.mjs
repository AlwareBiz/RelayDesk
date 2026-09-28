import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { load } from 'js-yaml';

// ********************************************************************************
// == Constant ====================================================================
const FORM_NAMES = ['epic', 'task'];

// GitHub writes this into the issue body when a form field is left empty
const NO_RESPONSE = '_No response_';
const SECTION_HEADING_PATTERN = /^###\s+(.+?)\s*$/u;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// == Util ========================================================================
/** List the problems that keep an issue body from matching its form: missing or empty required sections */
export const findFormatProblems = (body, requiredLabels) => {
 const requiredLabelSet = new Set(requiredLabels);
 const sectionLines = new Map();

 // only headings that name a form field start a section, so other headings stay inside the content
 let currentLabel = undefined;
 for (const line of body.split(/\r?\n/u)) {
  const heading = SECTION_HEADING_PATTERN.exec(line);
  if (heading && requiredLabelSet.has(heading[1])) {
   currentLabel = heading[1];
   sectionLines.set(currentLabel, []);
   continue;
  } /* else -- the line is content, not the start of a section */

  if (currentLabel === undefined) {
   continue;
  } /* else -- the line belongs to the section above it */

  sectionLines.get(currentLabel).push(line);
 }

 return requiredLabels.flatMap((label) => {
  if (!sectionLines.has(label)) {
   return [`Missing section "### ${label}"`];
  } /* else -- the section is present */

  const content = sectionLines.get(label).join('\n').trim();
  if (content === '' || content === NO_RESPONSE) {
   return [`Empty section "### ${label}"`];
  } /* else -- the section has content */

  return [];
 });
};

/** List the labels of an issue form's required fields, in form order */
export const readRequiredLabels = (form) => form.body.filter((field) => field.validations?.required === true).map((field) => field.attributes.label);

// == Main ========================================================================
const main = () => {
 const { values } = parseArgs({ options: { form: { default: 'task', type: 'string' } } });
 if (!FORM_NAMES.includes(values.form)) {
  console.error(`#23ae8272 Unknown form "${values.form}". Use one of: ${FORM_NAMES.join(', ')}.`);
  process.exitCode = 2;
  return;
 } /* else -- the form exists */

 const form = load(readFileSync(path.join(repoRoot, '.github', 'ISSUE_TEMPLATE', `${values.form}.yml`), 'utf8'));
 const body = readFileSync(process.stdin.fd, 'utf8');
 const problems = findFormatProblems(body, readRequiredLabels(form));
 if (problems.length === 0) {
  console.log(`#9388db7e The issue has every section of the ${values.form} form.`);
  return;
 } /* else -- the issue does not match its form */

 console.error(`#1f53fd23 The issue does not match .github/ISSUE_TEMPLATE/${values.form}.yml:\n${problems.join('\n')}`);
 process.exitCode = 1;
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
 main();
} /* else -- imported by a test, which calls the exports directly */

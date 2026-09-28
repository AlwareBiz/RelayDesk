import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ********************************************************************************
// == Constant ====================================================================
const SOURCE_FILE_PATTERN = /\.(?:[cm]?[jt]sx?)$/u;
const UUID_PREFIX_PATTERN = /^#([0-9a-f]{8})(?=\b|\s|\[|$)/u;
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// == CLI ========================================================================
const args = new Set(process.argv.slice(2));
const isCheckMode = args.has('--check');
const isStageMode = args.has('--stage');

// == Main ========================================================================
const main = () => {
 const usedIds = new Set();
 const changes = [];

 for (const filePath of getTrackedSourceFiles()) {
  const value = readFileSync(filePath, 'utf8');
  const edits = planFileEdits(value, usedIds);
  if (edits.length > 0) {
   changes.push({ filePath, edits, value });
  } /* else -- every log in this file already has a unique id */
 }

 const totalEdits = changes.reduce((count, file) => count + file.edits.length, 0);
 if (totalEdits === 0) {
  console.log('#639cdfe8 Log UUID prefixes are already unique.');
  return;
 } /* else -- some logs need a new id */

 if (isCheckMode) {
  console.error(`#0d187a64 Found ${totalEdits} log UUID issue(s) across ${changes.length} file(s).`);
  process.exitCode = 1;
  return;
 } /* else -- fix mode: rewrite the files */

 for (const file of changes) {
  writeFileSync(file.filePath, applyEdits(file.value, file.edits), 'utf8');
 }

 if (isStageMode) {
  stageFiles(changes.map((file) => file.filePath));
 } /* else -- leave the edits unstaged */

 console.log(`#877c31cb Updated ${totalEdits} log UUID issue(s) across ${changes.length} file(s).`);
};

// == Util ========================================================================
const applyEdits = (value, edits) => edits
 .toSorted((left, right) => right.start - left.start)
 .reduce((result, edit) => result.slice(0, edit.start) + edit.replacement + result.slice(edit.end), value);

const buildUniqueId = (usedIds) => {
 let id = randomUUID().slice(0, 8);
 while (usedIds.has(id)) id = randomUUID().slice(0, 8);
 return id;
};

const getTrackedSourceFiles = () => execFileSync('git', ['ls-files'], { cwd: repoRoot, encoding: 'utf8' })
 .split(/\r?\n/u)
 .filter((filePath) => SOURCE_FILE_PATTERN.test(filePath))
 .map((filePath) => path.resolve(repoRoot, filePath));

const planFileEdits = (value, usedIds) => {
 const edits = [];
 let cursor = 0;

 while (cursor < value.length) {
  const character = value[cursor];
  const nextCharacter = value[cursor + 1];
  if (character === '\'' || character === '"' || character === '`') {
   cursor = skipString(value, cursor, character);
   continue;
  } /* else -- not inside a string literal */

  if (character === '/' && nextCharacter === '/') {
   cursor = skipLineComment(value, cursor);
   continue;
  } /* else -- not a line comment */

  if (character === '/' && nextCharacter === '*') {
   cursor = skipBlockComment(value, cursor);
   continue;
  } /* else -- not a block comment */

  const match = value.slice(cursor).match(/^(?:console|logger)\.(log|info|warn|error|debug|trace|fatal)\s*\(/u);
  if (!match) {
   cursor += 1;
   continue;
  } /* else -- a log call starts here */

  const openParen = cursor + match[0].lastIndexOf('(');
  const argumentStart = skipWhitespace(value, openParen + 1);
  if (value[argumentStart] === ')') {
   cursor = argumentStart + 1;
   continue;
  } /* else -- the call has arguments */

  const firstCharacter = value[argumentStart];
  if (firstCharacter === '\'' || firstCharacter === '"' || firstCharacter === '`') {
   const argumentEnd = skipString(value, argumentStart, firstCharacter);
   const currentContent = value.slice(argumentStart + 1, argumentEnd - 1);
   const prefix = currentContent.match(UUID_PREFIX_PATTERN);
   if (!prefix) {
    const id = buildUniqueId(usedIds);
    usedIds.add(id);
    edits.push({ start: argumentStart + 1, end: argumentStart + 1, replacement: `#${id} ` });
   } else if (usedIds.has(prefix[1])) {
    const id = buildUniqueId(usedIds);
    usedIds.add(id);
    edits.push({ start: argumentStart + 2, end: argumentStart + 10, replacement: id });
   } else {
    usedIds.add(prefix[1]);
   }
   cursor = argumentEnd;
   continue;
  } /* else -- the first argument is not a string, so prepend one */

  const id = buildUniqueId(usedIds);
  usedIds.add(id);
  edits.push({ start: argumentStart, end: argumentStart, replacement: `'#${id}', ` });
  cursor = argumentStart + 1;
 }

 return edits;
};

const skipString = (value, index, quote) => {
 let cursor = index + 1;
 while (cursor < value.length) {
  if (value[cursor] === '\\') {
   cursor += 2;
   continue;
  } /* else -- not an escape sequence */

  if (value[cursor] === quote) {
   return cursor + 1;
  } /* else -- still inside the string */

  cursor += 1;
 }
 return value.length;
};

const skipLineComment = (value, index) => {
 const end = value.indexOf('\n', index + 2);
 return end === -1 ? value.length : end;
};

const skipBlockComment = (value, index) => {
 const end = value.indexOf('*/', index + 2);
 return end === -1 ? value.length : end + 2;
};

const skipWhitespace = (value, index) => {
 let cursor = index;
 while (/\s/u.test(value[cursor] ?? '')) cursor += 1;
 return cursor;
};

const stageFiles = (filePaths) => {
 const relativePaths = filePaths.map((filePath) => path.relative(repoRoot, filePath).split(path.sep).join('/'));
 execFileSync('git', ['add', '--', ...relativePaths], { cwd: repoRoot, stdio: 'inherit' });
};

main();

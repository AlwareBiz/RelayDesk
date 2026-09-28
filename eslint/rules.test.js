import { RuleTester } from 'eslint';
import { afterAll, describe, it } from 'vitest';

import { explicitElseComment } from './explicitElseComment.js';
import { routeHandlerSummary } from './routeHandlerSummary.js';
import { singleLineImport } from './singleLineImport.js';

// ********************************************************************************
// == Setup =======================================================================
// the rules encode team conventions, so a broken rule silently stops enforcing one
RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } });

// == Test ========================================================================
ruleTester.run('explicit-else-comment', explicitElseComment, {
 invalid: [
  { code: 'if (a) { b(); }', errors: [{ messageId: 'missing' }] },
  { code: 'if (a) b();', errors: [{ messageId: 'braces' }] },
  { code: 'if (a) { b(); } // else -- nothing to do', errors: [{ messageId: 'missing' }] },
  { code: 'if (a) { b(); } /* else */', errors: [{ messageId: 'missing' }] },
 ],
 valid: [
  'if (a) { b(); } /* else -- no need to take a snapshot at this count */',
  'if (a) { b(); } else { c(); }',
  'if (a) { b(); } else if (c) { d(); } /* else -- neither case applies */',
 ],
});

ruleTester.run('route-handler-summary', routeHandlerSummary, {
 invalid: [
  { code: 'conversationRouter.get(path, handler);', errors: [{ messageId: 'missing' }] },
  { code: '// fetch conversations\n\nconversationRouter.get(path, handler);', errors: [{ messageId: 'missing' }] },
 ],
 valid: [
  '// fetch every conversation in a workspace\nconversationRouter.get(path, handler);',
  'app.get(path, handler);',
  'conversationRouter.use(middleware);',
 ],
});

ruleTester.run('single-line-import', singleLineImport, {
 invalid: [
  { code: 'import {\n a,\n b,\n} from \'x\';', errors: [{ messageId: 'multiline' }], output: 'import { a, b } from \'x\';' },
  { code: 'import {\n a, // keep\n b,\n} from \'x\';', errors: [{ messageId: 'multiline' }], output: null },
 ],
 valid: ['import { a, b } from \'x\';', 'import x from \'x\';'],
});

import eslint from '@eslint/js';
import promise from 'eslint-plugin-promise';
import tseslint from 'typescript-eslint';

import { explicitElseComment } from './eslint/explicitElseComment.js';
import { routeHandlerSummary } from './eslint/routeHandlerSummary.js';
import { singleLineImport } from './eslint/singleLineImport.js';

export default tseslint.config(
 eslint.configs.recommended,
 ...tseslint.configs.recommended,
 {
  plugins: {
   local: { rules: { 'explicit-else-comment': explicitElseComment, 'route-handler-summary': routeHandlerSummary, 'single-line-import': singleLineImport } },
   promise,
  },
  rules: {
   '@typescript-eslint/member-ordering': ['error', { default: { order: 'alphabetically' } }],
   'local/explicit-else-comment': 'error',
   'local/route-handler-summary': 'error',
   'local/single-line-import': 'error',
   // strict mode also flags .catch() and .finally(), so async code reads as try/catch
   'promise/prefer-await-to-then': ['error', { strict: true }],
  },
 },
 {
  files: ['eslint/**/*.js', 'scripts/**/*.{js,mjs}', '*.config.{js,ts}'],
  languageOptions: { globals: { console: 'readonly', process: 'readonly' } },
 },
 {
  // run inside mongosh: when the Mongo container initializes, and by db:backfill-conversation-messages and db:drop-ticket-messages
  files: ['scripts/backfill-conversation-message.js', 'scripts/drop-ticket-message.js', 'scripts/init-mongo.js'],
  languageOptions: { globals: { db: 'readonly', print: 'readonly', quit: 'readonly' } },
 },
 { ignores: ['**/dist/**', '**/node_modules/**', '**/.terraform/**'] },
);

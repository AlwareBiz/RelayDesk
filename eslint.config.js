import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import { singleLineImport } from './eslint/singleLineImport.js';

export default tseslint.config(
 eslint.configs.recommended,
 ...tseslint.configs.recommended,
 {
  plugins: { local: { rules: { 'single-line-import': singleLineImport } } },
  rules: { 'local/single-line-import': 'error' },
 },
 { ignores: ['**/dist/**', '**/node_modules/**', '**/.terraform/**'] },
);

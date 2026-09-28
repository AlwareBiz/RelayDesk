import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// ********************************************************************************
// == Export ======================================================================
export default defineConfig({
 // tests import the shared package from source, the same way the dev server does
 resolve: { alias: { '@relaydesk/common': fileURLToPath(new URL('./package/common/src/index.ts', import.meta.url)) } },
 test: {
  environment: 'node',
  include: ['eslint/**/*.test.js', 'package/common/src/**/*.test.ts', 'package/server/src/**/*.test.ts'],
 },
});

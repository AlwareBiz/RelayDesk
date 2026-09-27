import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// ********************************************************************************
// == Constant ====================================================================
const config = defineConfig({
 plugins: [react()],
 resolve: {
  alias: { '@relaydesk/common': fileURLToPath(new URL('../common/src', import.meta.url)) },
 },

 // forward API requests to the Express server in dev so the browser never issues
 // cross-origin requests. Local development only
 server: {
  port: 5173,
  proxy: { '/api': 'http://localhost:5174' },
 },
});

// == Export ======================================================================
export default config;

import pg from 'pg';

import { env } from '../service/env';

// ********************************************************************************
// == Export ======================================================================
export const pgPool = new pg.Pool({ connectionString: env.DATABASE_URL });

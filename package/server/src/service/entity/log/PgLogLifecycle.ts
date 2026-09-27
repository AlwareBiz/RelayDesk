import { logTable, type Log, type LogInsert, type LogLifecycleService } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgLogLifecycle implements LogLifecycleService {
 async create(data: LogInsert): Promise<Log> {
  const result = await pgPool.query<Log>(
   `INSERT INTO ${logTable} (content, log_level) VALUES ($1, $2) RETURNING *`,
   [data.content, data.log_level],
  );
  const row = result.rows[0];
  if (!row) throw new Error('Expected inserted log row');
  return row;
 }
}

// == Export ======================================================================
export const logLifecycle = new PgLogLifecycle();

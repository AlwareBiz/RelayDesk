import { profileColumns, profileTable, type Profile, type ProfileInsert, type ProfileLifecycleService } from '@relaydesk/common';

import type { PgExecutor } from '../../../client/pgExecutor';
import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgProfileLifecycle implements ProfileLifecycleService {
 // pass an executor to enlist this insert in a caller-owned transaction
 async create(data: ProfileInsert, executor: PgExecutor = pgPool): Promise<Profile> {
  const result = await executor.query<Profile>(
    `INSERT INTO ${profileTable} (${profileColumns.email}, ${profileColumns.password_hash}) VALUES ($1, $2) RETURNING *`,
   [data.email, data.password_hash],
  );
  const row = result.rows[0];
  if (!row) {
   throw new Error('Expected inserted user row');
  } /* else -- the insert returned the row */

  return row;
 }
}

export const profileLifecycle = new PgProfileLifecycle();

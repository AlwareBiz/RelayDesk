import { profileColumns, profileTable, type Profile, type ProfileFinderService } from '@relaydesk/common';

import { pgPool } from '../../../client/pgPool';

// ********************************************************************************
// == Class =======================================================================
export class PgProfileFinder implements ProfileFinderService {
 async findByEmail(email: Profile['email']): Promise<Profile | null> {
  const result = await pgPool.query<Profile>(
    `SELECT * FROM ${profileTable} WHERE ${profileColumns.email} = $1 LIMIT 1`,
   [email],
  );
  return result.rows[0] ?? null;
 }

 async findById(id: Profile['id']): Promise<Profile | null> {
    const result = await pgPool.query<Profile>(
     `SELECT * FROM ${profileTable} WHERE ${profileColumns.id} = $1 LIMIT 1`,
   [id],
  );
  return result.rows[0] ?? null;
 }
}

export const profileFinder = new PgProfileFinder();

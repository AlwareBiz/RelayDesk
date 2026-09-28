import { logLevels, type LogInsert, type LoggerService } from '@relaydesk/common';

import { logLifecycle } from '../entity/log/PgLogLifecycle';

// ********************************************************************************
// == Class =======================================================================
export class DatabaseLogger implements LoggerService {
 debug(content: string): void {
  this.write({ content, log_level: logLevels.debug });
 }

 error(content: string): void {
  this.write({ content, log_level: logLevels.error });
 }

 info(content: string): void {
  this.write({ content, log_level: logLevels.info });
 }

 warn(content: string): void {
  this.write({ content, log_level: logLevels.warn });
 }

 // -- Util -----------------------------------------------------------------------
 // a failed insert must never break the request that logged, so errors stop here
 private async persist(data: LogInsert): Promise<void> {
  try {
   await logLifecycle.create(data);
  } catch (error) {
   console.error('#7e4796b4 [DatabaseLogger] Insert failed:', error);
  }
 }

 private write(data: LogInsert): void {
  if (process.env.NODE_ENV !== 'production') {
   console.log(`#c041f3fb [${data.log_level}] ${data.content}`);
  } /* else -- production logs only go to the database */

  void this.persist(data);
 }
}

// == Export ======================================================================
export const logger = new DatabaseLogger();

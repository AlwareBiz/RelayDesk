import type pg from 'pg';

// ********************************************************************************
// == Type ========================================================================
/** the pool itself or a single client checked out for an explicit transaction */
export type PgExecutor = Pick<pg.Pool, 'query'>;

import type { TableTypes } from '../tableTypes';
import type { LogLevelEnum } from '../enum';

// ********************************************************************************
// == Type ========================================================================
export type LogRow = {
 content: string;
 created_at: string;
 id: string;
 log_level: LogLevelEnum;
};

type OptionalOnInsert = 'created_at' | 'id' | 'log_level';

export type LogTableTypes = TableTypes<LogRow, OptionalOnInsert>;

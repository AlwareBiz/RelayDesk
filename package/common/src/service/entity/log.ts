import type { Log, LogInsert } from '../../schema/entity/log';

// ********************************************************************************
// == Interface ===================================================================
export interface LogLifecycleService {
 create(data: LogInsert): Promise<Log>;
}

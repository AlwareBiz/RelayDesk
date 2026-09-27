// ********************************************************************************
// == Interface ===================================================================
export interface LoggerService {
 debug(content: string): void;
 error(content: string): void;
 info(content: string): void;
 warn(content: string): void;
}

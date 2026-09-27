import * as yup from 'yup';

import { logLevels } from './type';

// ********************************************************************************
// == Schema ======================================================================
export const logSchema = yup.object({
 content: yup.string().required(),
 log_level: yup.string().oneOf(Object.values(logLevels)).required(),
});

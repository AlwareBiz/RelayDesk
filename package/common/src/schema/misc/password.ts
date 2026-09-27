import * as yup from 'yup';

// ********************************************************************************
// == Constant ====================================================================
const PASSWORD_MIN_LENGTH = 12;

// == Schema ======================================================================
export const passwordSchema = yup.string().min(PASSWORD_MIN_LENGTH).required();

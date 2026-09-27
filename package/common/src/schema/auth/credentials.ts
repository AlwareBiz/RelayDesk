import * as yup from 'yup';

// ********************************************************************************
// == Schema ======================================================================
export const credentialsSchema = yup.object({
 email: yup.string().email().required(),
 password: yup.string().min(12).required(),
});

// == Type ========================================================================
export type Credentials = yup.InferType<typeof credentialsSchema>;

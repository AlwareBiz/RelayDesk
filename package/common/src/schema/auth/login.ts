import * as yup from 'yup';

import { emailSchema } from '../misc/email';
import { passwordSchema } from '../misc/password';

// ********************************************************************************
// == Schema ======================================================================
export const loginSchema = yup.object({
 email: emailSchema,
 password: passwordSchema,
});

// == Type ========================================================================
export type LoginData = yup.InferType<typeof loginSchema>;

// == Constant ====================================================================
export const loginSchemaKeys: { [key in keyof LoginData]: key } = {
 email: 'email',
 password: 'password',
};

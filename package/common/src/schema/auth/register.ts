import * as yup from 'yup';

import { emailSchema } from '../misc/email';
import { passwordSchema } from '../misc/password';

// ********************************************************************************
// == Schema ======================================================================
export const registerSchema = yup.object({
 email: emailSchema,
 password: passwordSchema,
 passwordConfirmation: yup.string().oneOf([yup.ref('password')]).required(),
});

// == Type ========================================================================
export type RegisterData = yup.InferType<typeof registerSchema>;

// == Constant ====================================================================
export const registerSchemaKeys: { [key in keyof RegisterData]: key } = {
 email: 'email',
 password: 'password',
 passwordConfirmation: 'passwordConfirmation',
};

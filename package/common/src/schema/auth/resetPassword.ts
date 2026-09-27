import * as yup from 'yup';

import { passwordSchema } from '../misc/password';

// ********************************************************************************
// == Schema ======================================================================
export const resetPasswordSchema = yup.object({
 password: passwordSchema,
 passwordConfirmation: yup.string().oneOf([yup.ref('password')]).required(),
 token: yup.string().min(32).required(),
});

// == Type ========================================================================
export type ResetPasswordData = yup.InferType<typeof resetPasswordSchema>;

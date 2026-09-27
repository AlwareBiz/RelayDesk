import * as yup from 'yup';

import { emailSchema } from '../misc/email';

// ********************************************************************************
// == Schema ======================================================================
export const recoverPasswordSchema = yup.object({ email: emailSchema });

// == Type ========================================================================
export type RecoverPasswordData = yup.InferType<typeof recoverPasswordSchema>;

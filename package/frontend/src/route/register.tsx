import { Alert, Link, Paper, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { useState } from 'react';

import { ErrorUtil, frontendRoute, registerSchema, registerSchemaKeys, type RegisterData } from '@relaydesk/common';

import { useLocale } from '../hook/useLocale';
import { AuthService } from '../service/AuthService';
import { Center } from '../ui/container/Center';
import { Flex } from '../ui/container/Flex';
import { SubmitFormikButton } from '../ui/form/button';
import { getTextFieldProps } from '../ui/form/field';
import { AuthPagesLayout } from '../ui/page/AuthPagesLayout';

// ********************************************************************************
// == Component ===================================================================
export const RegisterPage = () => {
 const navigate = useNavigate();
 const { t } = useLocale();

 // -- State ---------------------------------------------------------------------
 const [error, setError] = useState('');

 // -- Handler -------------------------------------------------------------------
 const formik = useFormik<RegisterData>({
  initialValues: { email: '', password: '', passwordConfirmation: '' },
  validateOnBlur: false,
  validateOnChange: true,
  validationSchema: registerSchema,
  onSubmit: async (data) => {
   try {
    setError('');
    await AuthService.register(data.email, data.password);
    await navigate({ to: frontendRoute.dashboard.index });
   } catch (err) {
    setError(ErrorUtil.toMessage(err));
   }
  },
 });

 // -- UI ------------------------------------------------------------------------
 return (
  <AuthPagesLayout>
   <Paper sx={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', padding: '2em', width: '100%' }}>
    <form onSubmit={formik.handleSubmit}>
     <Flex flexDirection='column' width='100%'>
      <Typography sx={{ fontSize: '2em', fontWeight: 'bold' }}>{t('auth.register.title')}</Typography>
      {error && <Alert severity='error'>{error}</Alert>}
      <TextField {...getTextFieldProps(formik, registerSchemaKeys.email, t('auth.field.email'))} />
      <TextField {...getTextFieldProps(formik, registerSchemaKeys.password, t('auth.field.password'))} />
      <TextField {...getTextFieldProps(formik, registerSchemaKeys.passwordConfirmation, t('auth.field.passwordConfirmation'))} />
      <SubmitFormikButton formik={formik}>
       <Typography>{t('auth.register.submit')}</Typography>
      </SubmitFormikButton>
      <Center flexDirection='column' gap='0.5em'>
       <Link component={RouterLink} sx={{ textDecoration: 'none' }} to={frontendRoute.login}>
        <Typography sx={{ color: 'text.secondary' }}>{t('auth.register.hasAccount')}</Typography>
       </Link>
      </Center>
     </Flex>
    </form>
   </Paper>
  </AuthPagesLayout>
 );
};

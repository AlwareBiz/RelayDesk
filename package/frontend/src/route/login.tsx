import { Alert, Link, Paper, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { useState } from 'react';

import { ErrorUtil, frontendRoute, loginSchema, loginSchemaKeys, type LoginData } from '@relaydesk/common';

import { useLocale } from '../hook/useLocale';
import { AuthService } from '../service/AuthService';
import { Center } from '../ui/container/Center';
import { Flex } from '../ui/container/Flex';
import { SubmitFormikButton } from '../ui/form/button';
import { getTextFieldProps } from '../ui/form/field';
import { AuthPagesLayout } from '../ui/page/AuthPagesLayout';

// ********************************************************************************
// == Component ===================================================================
export const LoginPage = () => {
 const navigate = useNavigate();
 const { t } = useLocale();

 // -- State ---------------------------------------------------------------------
 const [error, setError] = useState('');

 // -- Handler -------------------------------------------------------------------
 const formik = useFormik<LoginData>({
  initialValues: { email: '', password: '' },
  validateOnBlur: false,
  validateOnChange: true,
  validationSchema: loginSchema,
  onSubmit: async (data) => {
   try {
    setError('');
    await AuthService.loginWithEmail(data.email, data.password);
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
      <Typography sx={{ fontSize: '2em', fontWeight: 'bold' }}>{t('auth.login.title')}</Typography>
      {error && <Alert severity='error'>{error}</Alert>}
      <TextField {...getTextFieldProps(formik, loginSchemaKeys.email, t('auth.field.email'))} />
      <TextField {...getTextFieldProps(formik, loginSchemaKeys.password, t('auth.field.password'))} />
      <SubmitFormikButton formik={formik}>
       <Typography>{t('auth.login.submit')}</Typography>
      </SubmitFormikButton>
      <Center flexDirection='column' gap='0.5em'>
       <Link component={RouterLink} sx={{ textDecoration: 'none' }} to={frontendRoute.register}>
        <Typography sx={{ color: 'text.secondary' }}>{t('auth.login.noAccount')}</Typography>
       </Link>
      </Center>
     </Flex>
    </form>
   </Paper>
  </AuthPagesLayout>
 );
};

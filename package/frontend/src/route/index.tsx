import { Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from '@tanstack/react-router';

import { frontendRoute } from '@relaydesk/common';

import { useLocale } from '../hook/useLocale';
import { Flex } from '../ui/container/Flex';
import { AuthPagesLayout } from '../ui/page/AuthPagesLayout';

// ********************************************************************************
// == Component ===================================================================
export const LandingPage = () => {
 const { t } = useLocale();

 // -- UI ------------------------------------------------------------------------
 return (
  <AuthPagesLayout>
   <Paper sx={{ display: 'flex', flexDirection: 'column', maxWidth: '520px', padding: '2.5em', width: '100%' }}>
    <Flex flexDirection='column' width='100%'>
     <Typography sx={{ fontSize: '2.25em', fontWeight: 'bold' }}>{t('landing.title')}</Typography>
     <Typography color='text.secondary'>{t('landing.description')}</Typography>
     <Flex gap='0.75em'>
      <Button component={RouterLink} to={frontendRoute.login} variant='contained'>{t('landing.login')}</Button>
      <Button component={RouterLink} to={frontendRoute.register} variant='outlined'>{t('landing.register')}</Button>
     </Flex>
    </Flex>
   </Paper>
  </AuthPagesLayout>
 );
};

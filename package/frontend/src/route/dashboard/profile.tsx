import { Alert, Box, Paper, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { backendRoutes, ErrorUtil, type FetchCurrentProfileResponseData } from '@relaydesk/common';

import { useLocale } from '../../hook/useLocale';
import { ApiClient } from '../../service/ApiClient';
import { QueryLoadingFallback } from '../../ui/page/QueryLoadingFallback';
import { DashboardPageContentContainer } from '../../ui/page/dashboard/layout/DashboardPageContentContainer';
import { DashboardPageLayout } from '../../ui/page/dashboard/layout/DashboardPageLayout';

// ********************************************************************************
// == Component ===================================================================
export const DashboardProfilePage = () => {
 const { currentLocale, t } = useLocale();

 // -- Query ---------------------------------------------------------------------
 const profileQuery = useQuery<FetchCurrentProfileResponseData>({
  queryFn: async () => ApiClient.get<FetchCurrentProfileResponseData>(backendRoutes.dashboard.profile.index),
  queryKey: ['dashboard', 'profile'],
 });

 // -- UI ------------------------------------------------------------------------
 const data = profileQuery.data;
 const createdAt = data ? new Date(data.profile.created_at).toLocaleString(currentLocale) : t('common.notAvailable');
 return (
  <DashboardPageLayout>
   <DashboardPageContentContainer>
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '0 auto', maxWidth: '760px', padding: '1.5rem', width: '100%' }}>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t('dashboard.profile.title')}</Typography>
      <Typography color='text.secondary'>{t('dashboard.profile.description')}</Typography>
     </Box>

     {profileQuery.error ? <Alert severity='error'>{ErrorUtil.toMessage(profileQuery.error)}</Alert> : null}

     {profileQuery.isPending
      ? <QueryLoadingFallback minHeight='140px' />
      : (
       <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 'max-content' }}>
         <TableBody>
          <TableRow>
           <TableCell>{t('dashboard.profile.field.userId')}</TableCell>
           <TableCell sx={{ wordBreak: 'break-all' }}>{data?.profile.id ?? t('common.notAvailable')}</TableCell>
          </TableRow>
          <TableRow>
           <TableCell>{t('dashboard.profile.field.userEmail')}</TableCell>
           <TableCell sx={{ wordBreak: 'break-all' }}>{data?.profile.email ?? t('common.notAvailable')}</TableCell>
          </TableRow>
          <TableRow>
           <TableCell>{t('dashboard.profile.field.createdAt')}</TableCell>
           <TableCell>{createdAt}</TableCell>
          </TableRow>
         </TableBody>
        </Table>
       </Box>
      )}
    </Paper>
   </DashboardPageContentContainer>
  </DashboardPageLayout>
 );
};

import { Alert, Box, Chip, List, ListItemButton, ListItemText, Paper, TextField, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import { backendRoutes, createWorkspaceSchema, createWorkspaceSchemaKeys, ErrorUtil, frontendRoute, type CreateWorkspaceData, type CreateWorkspaceResponseData, type ListWorkspacesResponseData } from '@relaydesk/common';

import { useLocale } from '../../hook/useLocale';
import { ApiClient } from '../../service/ApiClient';
import { SubmitFormikButton } from '../../ui/form/button';
import { getTextFieldProps } from '../../ui/form/field';
import { errorSnackbar, successSnackbar } from '../../ui/form/snackbar';
import { QueryLoadingFallback } from '../../ui/page/QueryLoadingFallback';
import { DashboardPageContentContainer } from '../../ui/page/dashboard/layout/DashboardPageContentContainer';
import { DashboardPageLayout } from '../../ui/page/dashboard/layout/DashboardPageLayout';

// ********************************************************************************
// == Constant ====================================================================
export const workspacesQueryKey = ['dashboard', 'workspaces'];

// == Component ===================================================================
export const DashboardIndexPage = () => {
 const navigate = useNavigate();
 const queryClient = useQueryClient();
 const snackbar = useSnackbar();
 const { t } = useLocale();

 // -- Query ---------------------------------------------------------------------
 const workspacesQuery = useQuery<ListWorkspacesResponseData>({
  queryFn: async () => ApiClient.get<ListWorkspacesResponseData>(backendRoutes.dashboard.workspace.index),
  queryKey: workspacesQueryKey,
 });

 // -- Handler -------------------------------------------------------------------
 const formik = useFormik<CreateWorkspaceData>({
  initialValues: { name: '' },
  validateOnBlur: false,
  validateOnChange: true,
  validationSchema: createWorkspaceSchema,
  onSubmit: async (data, helpers) => {
   try {
    await ApiClient.post<CreateWorkspaceResponseData>(backendRoutes.dashboard.workspace.index, data);
    helpers.resetForm();
    successSnackbar(snackbar, t('dashboard.index.create.success'));
    await queryClient.invalidateQueries({ queryKey: workspacesQueryKey });
   } catch (err) {
    errorSnackbar(snackbar, ErrorUtil.toMessage(err));
   }
  },
 });

 const handleOpenWorkspace = (workspaceId: string) => {
  void navigate({ params: { workspaceId }, to: frontendRoute.dashboard.workspace });
 };

 // -- UI ------------------------------------------------------------------------
 const workspaces = workspacesQuery.data?.workspaces ?? [];
 return (
  <DashboardPageLayout>
   <DashboardPageContentContainer>
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '0 auto', maxWidth: '760px', padding: '1.5rem', width: '100%' }}>
     <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t('dashboard.index.title')}</Typography>
      <Typography color='text.secondary'>{t('dashboard.index.description')}</Typography>
     </Box>

     {workspacesQuery.error ? <Alert severity='error'>{ErrorUtil.toMessage(workspacesQuery.error)}</Alert> : null}

     {workspacesQuery.isPending
      ? <QueryLoadingFallback minHeight='140px' />
      : workspaces.length === 0
       ? <Typography color='text.secondary'>{t('dashboard.index.empty')}</Typography>
       : (
        <List disablePadding>
         {workspaces.map((workspace) => (
          <ListItemButton key={workspace.id} onClick={() => handleOpenWorkspace(workspace.id)} sx={{ borderRadius: 2 }}>
           <ListItemText primary={workspace.name} />
           <Chip label={t(`workspace.role.${workspace.role}`)} size='small' />
          </ListItemButton>
         ))}
        </List>
       )}
    </Paper>

    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '0 auto', maxWidth: '760px', padding: '1.5rem', width: '100%' }}>
     <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{t('dashboard.index.create.title')}</Typography>
     <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
       <TextField {...getTextFieldProps(formik, createWorkspaceSchemaKeys.name, t('dashboard.index.create.name'))} />
       <SubmitFormikButton formik={formik}>
        <Typography>{t('dashboard.index.create.submit')}</Typography>
       </SubmitFormikButton>
      </Box>
     </form>
    </Paper>
   </DashboardPageContentContainer>
  </DashboardPageLayout>
 );
};

import { Alert, Box, Button, Chip, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import { backendRoutes, createTicketMessageSchema, createTicketMessageSchemaKeys, ErrorUtil, frontendRoute, RouteUtil, ticketPriorities, ticketStatuses, type CreateTicketMessageData, type CreateTicketMessageResponseData, type FetchTicketResponseData, type UpdateTicketData, type UpdateTicketResponseData } from '@relaydesk/common';

import { useLocale } from '../../../hook/useLocale';
import { ApiClient } from '../../../service/ApiClient';
import { SubmitFormikButton } from '../../../ui/form/button';
import { getTextFieldProps } from '../../../ui/form/field';
import { errorSnackbar, successSnackbar } from '../../../ui/form/snackbar';
import { QueryLoadingFallback } from '../../../ui/page/QueryLoadingFallback';
import { DashboardPageContentContainer } from '../../../ui/page/dashboard/layout/DashboardPageContentContainer';
import { DashboardPageLayout } from '../../../ui/page/dashboard/layout/DashboardPageLayout';

// ********************************************************************************
// == Component ===================================================================
export const DashboardTicketPage = () => {
 const navigate = useNavigate();
 const queryClient = useQueryClient();
 const snackbar = useSnackbar();
 const { ticketId = '', workspaceId = '' } = useParams({ strict: false });
 const { currentLocale, t } = useLocale();

 // -- Query ---------------------------------------------------------------------
 const ticketPath = RouteUtil.fill(backendRoutes.dashboard.workspace.ticket.detail, { ticketId, workspaceId });
 const ticketQueryKey = ['dashboard', 'workspace', workspaceId, 'ticket', ticketId];
 const ticketQuery = useQuery<FetchTicketResponseData>({
  queryFn: async () => ApiClient.get<FetchTicketResponseData>(ticketPath),
  queryKey: ticketQueryKey,
 });

 // -- Handler -------------------------------------------------------------------
 const handleUpdate = async (patch: UpdateTicketData) => {
  try {
   await ApiClient.patch<UpdateTicketResponseData>(ticketPath, patch);
   successSnackbar(snackbar, t('dashboard.ticket.updateSuccess'));
   await refreshTicket();
  } catch (err) {
   errorSnackbar(snackbar, ErrorUtil.toMessage(err));
  }
 };

 const refreshTicket = async () => {
  await queryClient.invalidateQueries({ queryKey: ticketQueryKey });
  await queryClient.invalidateQueries({ queryKey: ['dashboard', 'workspace', workspaceId, 'tickets'] });
 };

 const replyFormik = useFormik<CreateTicketMessageData>({
  initialValues: { body: '' },
  validateOnBlur: false,
  validateOnChange: false,
  validationSchema: createTicketMessageSchema,
  onSubmit: async (data, helpers) => {
   try {
    await ApiClient.post<CreateTicketMessageResponseData>(RouteUtil.fill(backendRoutes.dashboard.workspace.ticket.message, { ticketId, workspaceId }), data);
    helpers.resetForm();
    successSnackbar(snackbar, t('dashboard.ticket.reply.success'));
    await refreshTicket();
   } catch (err) {
    errorSnackbar(snackbar, ErrorUtil.toMessage(err));
   }
  },
 });

 // -- UI ------------------------------------------------------------------------
 const ticket = ticketQuery.data?.ticket;
 const messages = ticketQuery.data?.messages ?? [];
 return (
  <DashboardPageLayout>
   <DashboardPageContentContainer>
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '0 auto', maxWidth: '900px', padding: '1.5rem', width: '100%' }}>
     <Button onClick={() => void navigate({ params: { workspaceId }, to: frontendRoute.dashboard.workspace })} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
      {t('dashboard.ticket.back')}
     </Button>

     {ticketQuery.error ? <Alert severity='error'>{ErrorUtil.toMessage(ticketQuery.error)}</Alert> : null}

     {ticketQuery.isPending || !ticket
      ? <QueryLoadingFallback minHeight='140px' />
      : (
       <>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
         <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t('dashboard.ticket.title', { number: ticket.number, subject: ticket.subject })}</Typography>
         <Typography color='text.secondary'>
          {`${t('dashboard.ticket.field.requester')}: ${ticket.requester_email} · ${t('dashboard.ticket.field.createdAt')}: ${new Date(ticket.created_at).toLocaleString(currentLocale)}`}
         </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
         <TextField
          label={t('dashboard.ticket.field.status')}
          onChange={(event) => void handleUpdate({ status: event.target.value as UpdateTicketData['status'] })}
          select
          size='small'
          sx={{ minWidth: 160 }}
          value={ticket.status}
         >
          {Object.values(ticketStatuses).map((value) => <MenuItem key={value} value={value}>{t(`ticket.status.${value}`)}</MenuItem>)}
         </TextField>
         <TextField
          label={t('dashboard.ticket.field.priority')}
          onChange={(event) => void handleUpdate({ priority: event.target.value as UpdateTicketData['priority'] })}
          select
          size='small'
          sx={{ minWidth: 160 }}
          value={ticket.priority}
         >
          {Object.values(ticketPriorities).map((value) => <MenuItem key={value} value={value}>{t(`ticket.priority.${value}`)}</MenuItem>)}
         </TextField>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
         {messages.length === 0
          ? <Typography color='text.secondary'>{t('dashboard.ticket.noMessages')}</Typography>
          : messages.map((message) => (
           <Paper key={message.id} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }} variant='outlined'>
            <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
             <Chip color={message.author_type === 'agent' ? 'primary' : 'default'} label={t(`dashboard.ticket.author.${message.author_type}`)} size='small' />
             <Typography sx={{ fontWeight: 600 }}>{message.author_email}</Typography>
             <Typography color='text.secondary' sx={{ fontSize: '0.85rem' }}>{new Date(message.created_at).toLocaleString(currentLocale)}</Typography>
            </Box>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.body}</Typography>
           </Paper>
          ))}
        </Box>

        <form onSubmit={replyFormik.handleSubmit}>
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <TextField {...getTextFieldProps(replyFormik, createTicketMessageSchemaKeys.body, t('dashboard.ticket.reply.label'))} minRows={3} multiline />
          <SubmitFormikButton formik={replyFormik}>
           <Typography>{t('dashboard.ticket.reply.submit')}</Typography>
          </SubmitFormikButton>
         </Box>
        </form>
       </>
      )}
    </Paper>
   </DashboardPageContentContainer>
  </DashboardPageLayout>
 );
};

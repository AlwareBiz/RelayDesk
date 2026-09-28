import { Alert, Box, Button, Chip, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import { backendRoutes, conversationPriorities, conversationStatuses, createConversationMessageSchema, createConversationMessageSchemaKeys, ErrorUtil, frontendRoute, RouteUtil, type CreateConversationMessageData, type CreateConversationMessageResponseData, type FetchConversationResponseData, type UpdateConversationData, type UpdateConversationResponseData } from '@relaydesk/common';

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
export const DashboardConversationPage = () => {
 const navigate = useNavigate();
 const queryClient = useQueryClient();
 const snackbar = useSnackbar();
 const { conversationId = '', workspaceId = '' } = useParams({ strict: false });
 const { currentLocale, t } = useLocale();

 // -- Query ---------------------------------------------------------------------
 const conversationPath = RouteUtil.fill(backendRoutes.dashboard.workspace.conversation.detail, { conversationId, workspaceId });
 const conversationQueryKey = ['dashboard', 'workspace', workspaceId, 'conversation', conversationId];
 const conversationQuery = useQuery<FetchConversationResponseData>({
  queryFn: async () => ApiClient.get<FetchConversationResponseData>(conversationPath),
  queryKey: conversationQueryKey,
 });

 // -- Handler -------------------------------------------------------------------
 const handleUpdate = async (patch: UpdateConversationData) => {
  try {
   await ApiClient.patch<UpdateConversationResponseData>(conversationPath, patch);
   successSnackbar(snackbar, t('dashboard.conversation.updateSuccess'));
   await refreshConversation();
  } catch (err) {
   errorSnackbar(snackbar, ErrorUtil.toMessage(err));
  }
 };

 const refreshConversation = async () => {
  await queryClient.invalidateQueries({ queryKey: conversationQueryKey });
  await queryClient.invalidateQueries({ queryKey: ['dashboard', 'workspace', workspaceId, 'conversations'] });
 };

 const replyFormik = useFormik<CreateConversationMessageData>({
  initialValues: { body: '' },
  validateOnBlur: false,
  validateOnChange: false,
  validationSchema: createConversationMessageSchema,
  onSubmit: async (data, helpers) => {
   try {
    await ApiClient.post<CreateConversationMessageResponseData>(RouteUtil.fill(backendRoutes.dashboard.workspace.conversation.message, { conversationId, workspaceId }), data);
    helpers.resetForm();
    successSnackbar(snackbar, t('dashboard.conversation.reply.success'));
    await refreshConversation();
   } catch (err) {
    errorSnackbar(snackbar, ErrorUtil.toMessage(err));
   }
  },
 });

 // -- UI ------------------------------------------------------------------------
 const conversation = conversationQuery.data?.conversation;
 const messages = conversationQuery.data?.messages ?? [];
 return (
  <DashboardPageLayout>
   <DashboardPageContentContainer>
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '0 auto', maxWidth: '900px', padding: '1.5rem', width: '100%' }}>
     <Button onClick={() => void navigate({ params: { workspaceId }, to: frontendRoute.dashboard.workspace })} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
      {t('dashboard.conversation.back')}
     </Button>

     {conversationQuery.error ? <Alert severity='error'>{ErrorUtil.toMessage(conversationQuery.error)}</Alert> : null}

     {conversationQuery.isPending || !conversation
      ? <QueryLoadingFallback minHeight='140px' />
      : (
       <>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
         <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{t('dashboard.conversation.title', { number: conversation.number, subject: conversation.subject })}</Typography>
         <Typography color='text.secondary'>
          {`${t('dashboard.conversation.field.requester')}: ${conversation.requester_email} · ${t('dashboard.conversation.field.createdAt')}: ${new Date(conversation.created_at).toLocaleString(currentLocale)}`}
         </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
         <TextField
          label={t('dashboard.conversation.field.status')}
          onChange={(event) => void handleUpdate({ status: event.target.value as UpdateConversationData['status'] })}
          select
          size='small'
          sx={{ minWidth: 160 }}
          value={conversation.status}
         >
          {Object.values(conversationStatuses).map((value) => <MenuItem key={value} value={value}>{t(`conversation.status.${value}`)}</MenuItem>)}
         </TextField>
         <TextField
          label={t('dashboard.conversation.field.priority')}
          onChange={(event) => void handleUpdate({ priority: event.target.value as UpdateConversationData['priority'] })}
          select
          size='small'
          sx={{ minWidth: 160 }}
          value={conversation.priority}
         >
          {Object.values(conversationPriorities).map((value) => <MenuItem key={value} value={value}>{t(`conversation.priority.${value}`)}</MenuItem>)}
         </TextField>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
         {messages.length === 0
          ? <Typography color='text.secondary'>{t('dashboard.conversation.noMessages')}</Typography>
          : messages.map((message) => (
           <Paper key={message.id} sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }} variant='outlined'>
            <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
             <Chip color={message.author_type === 'agent' ? 'primary' : 'default'} label={t(`dashboard.conversation.author.${message.author_type}`)} size='small' />
             <Typography sx={{ fontWeight: 600 }}>{message.author_email}</Typography>
             <Typography color='text.secondary' sx={{ fontSize: '0.85rem' }}>{new Date(message.created_at).toLocaleString(currentLocale)}</Typography>
            </Box>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.body}</Typography>
           </Paper>
          ))}
        </Box>

        <form onSubmit={replyFormik.handleSubmit}>
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <TextField {...getTextFieldProps(replyFormik, createConversationMessageSchemaKeys.body, t('dashboard.conversation.reply.label'))} minRows={3} multiline />
          <SubmitFormikButton formik={replyFormik}>
           <Typography>{t('dashboard.conversation.reply.submit')}</Typography>
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

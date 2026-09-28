import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import { backendRoutes, conversationPriorities, createConversationSchema, createConversationSchemaKeys, ErrorUtil, RouteUtil, type CreateConversationData, type CreateConversationResponseData } from '@relaydesk/common';

import { useLocale } from '../../../hook/useLocale';
import { ApiClient } from '../../../service/ApiClient';
import { SubmitFormikButton } from '../../../ui/form/button';
import { getTextFieldProps } from '../../../ui/form/field';
import { errorSnackbar, successSnackbar } from '../../../ui/form/snackbar';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 isOpen: boolean;
 onClose: () => void;
 onCreated: (conversationId: string) => void;
 workspaceId: string;
};

// == Component ===================================================================
export const CreateConversationDialog = ({ isOpen, onClose, onCreated, workspaceId }: Props) => {
 const snackbar = useSnackbar();
 const { t } = useLocale();

 // -- Handler -------------------------------------------------------------------
 const formik = useFormik<CreateConversationData>({
  initialValues: { body: '', priority: conversationPriorities.normal, requester_email: '', subject: '' },
  validateOnBlur: false,
  validateOnChange: true,
  validationSchema: createConversationSchema,
  onSubmit: async (data, helpers) => {
   try {
    const { conversation } = await ApiClient.post<CreateConversationResponseData>(RouteUtil.fill(backendRoutes.dashboard.workspace.conversation.index, { workspaceId }), data);
    helpers.resetForm();
    successSnackbar(snackbar, t('dashboard.conversation.create.success'));
    onClose();
    onCreated(conversation.id);
   } catch (err) {
    errorSnackbar(snackbar, ErrorUtil.toMessage(err));
   }
  },
 });

 // -- UI ------------------------------------------------------------------------
 return (
  <Dialog fullWidth maxWidth='sm' onClose={onClose} open={isOpen}>
   <DialogTitle>{t('dashboard.conversation.create.title')}</DialogTitle>
   <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
     <TextField {...getTextFieldProps(formik, createConversationSchemaKeys.subject, t('dashboard.conversation.create.subject'))} />
     <TextField {...getTextFieldProps(formik, createConversationSchemaKeys.requester_email, t('dashboard.conversation.create.requesterEmail'))} />
     <TextField {...getTextFieldProps(formik, createConversationSchemaKeys.priority, t('dashboard.conversation.create.priority'))} select>
      {Object.values(conversationPriorities).map((value) => <MenuItem key={value} value={value}>{t(`conversation.priority.${value}`)}</MenuItem>)}
     </TextField>
     <TextField {...getTextFieldProps(formik, createConversationSchemaKeys.body, t('dashboard.conversation.create.body'))} minRows={4} multiline />
    </Box>
   </DialogContent>
   <DialogActions sx={{ padding: '1rem 1.5rem' }}>
    <Button onClick={onClose} sx={{ textTransform: 'none' }}>{t('common.cancel')}</Button>
    <SubmitFormikButton formik={formik} sx={{ width: 'auto' }}>
     <Typography>{t('dashboard.conversation.create.submit')}</Typography>
    </SubmitFormikButton>
   </DialogActions>
  </Dialog>
 );
};

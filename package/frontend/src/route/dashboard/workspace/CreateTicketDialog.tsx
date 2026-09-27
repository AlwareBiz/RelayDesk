import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';

import { backendRoutes, createTicketSchema, createTicketSchemaKeys, ErrorUtil, RouteUtil, ticketPriorities, type CreateTicketData, type CreateTicketResponseData } from '@relaydesk/common';

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
 onCreated: (ticketId: string) => void;
 workspaceId: string;
};

// == Component ===================================================================
export const CreateTicketDialog = ({ isOpen, onClose, onCreated, workspaceId }: Props) => {
 const snackbar = useSnackbar();
 const { t } = useLocale();

 // -- Handler -------------------------------------------------------------------
 const formik = useFormik<CreateTicketData>({
  initialValues: { body: '', priority: ticketPriorities.normal, requester_email: '', subject: '' },
  validateOnBlur: false,
  validateOnChange: true,
  validationSchema: createTicketSchema,
  onSubmit: async (data, helpers) => {
   try {
    const { ticket } = await ApiClient.post<CreateTicketResponseData>(RouteUtil.fill(backendRoutes.dashboard.workspace.ticket.index, { workspaceId }), data);
    helpers.resetForm();
    successSnackbar(snackbar, t('dashboard.ticket.create.success'));
    onClose();
    onCreated(ticket.id);
   } catch (err) {
    errorSnackbar(snackbar, ErrorUtil.toMessage(err));
   }
  },
 });

 // -- UI ------------------------------------------------------------------------
 return (
  <Dialog fullWidth maxWidth='sm' onClose={onClose} open={isOpen}>
   <DialogTitle>{t('dashboard.ticket.create.title')}</DialogTitle>
   <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
     <TextField {...getTextFieldProps(formik, createTicketSchemaKeys.subject, t('dashboard.ticket.create.subject'))} />
     <TextField {...getTextFieldProps(formik, createTicketSchemaKeys.requester_email, t('dashboard.ticket.create.requesterEmail'))} />
     <TextField {...getTextFieldProps(formik, createTicketSchemaKeys.priority, t('dashboard.ticket.create.priority'))} select>
      {Object.values(ticketPriorities).map((value) => <MenuItem key={value} value={value}>{t(`ticket.priority.${value}`)}</MenuItem>)}
     </TextField>
     <TextField {...getTextFieldProps(formik, createTicketSchemaKeys.body, t('dashboard.ticket.create.body'))} minRows={4} multiline />
    </Box>
   </DialogContent>
   <DialogActions sx={{ padding: '1rem 1.5rem' }}>
    <Button onClick={onClose} sx={{ textTransform: 'none' }}>{t('common.cancel')}</Button>
    <SubmitFormikButton formik={formik} sx={{ width: 'auto' }}>
     <Typography>{t('dashboard.ticket.create.submit')}</Typography>
    </SubmitFormikButton>
   </DialogActions>
  </Dialog>
 );
};

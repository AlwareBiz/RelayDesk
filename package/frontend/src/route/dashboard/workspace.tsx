import { Alert, Box, Button, Chip, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink, useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';

import { backendRoutes, ErrorUtil, frontendRoute, RouteUtil, ticketStatuses, type ListTicketsResponseData, type ListWorkspacesResponseData, type TicketStatus } from '@relaydesk/common';

import { useDialogDisclosure } from '../../hook/disclosure/useDialogDisclosure';
import { useLocale } from '../../hook/useLocale';
import { ApiClient } from '../../service/ApiClient';
import { QueryLoadingFallback } from '../../ui/page/QueryLoadingFallback';
import { DashboardPageContentContainer } from '../../ui/page/dashboard/layout/DashboardPageContentContainer';
import { DashboardPageLayout } from '../../ui/page/dashboard/layout/DashboardPageLayout';
import { workspacesQueryKey } from './index';
import { CreateTicketDialog } from './workspace/CreateTicketDialog';

// ********************************************************************************
// == Constant ====================================================================
const ALL_STATUSES = 'all';

// == Component ===================================================================
export const DashboardWorkspacePage = () => {
 const navigate = useNavigate();
 const { workspaceId = '' } = useParams({ strict: false });
 const { handleCloseDialog, handleOpenDialog, isDialogOpen } = useDialogDisclosure();
 const { currentLocale, t } = useLocale();

 // -- State ---------------------------------------------------------------------
 const [status, setStatus] = useState<TicketStatus | typeof ALL_STATUSES>(ALL_STATUSES);

 // -- Query ---------------------------------------------------------------------
 const workspacesQuery = useQuery<ListWorkspacesResponseData>({
  queryFn: async () => ApiClient.get<ListWorkspacesResponseData>(backendRoutes.dashboard.workspace.index),
  queryKey: workspacesQueryKey,
 });

 const ticketsQuery = useQuery<ListTicketsResponseData>({
  queryFn: async () => ApiClient.get<ListTicketsResponseData>(
   RouteUtil.fill(backendRoutes.dashboard.workspace.ticket.index, { workspaceId })
   + RouteUtil.query({ status: status === ALL_STATUSES ? undefined : status }),
  ),
  queryKey: ['dashboard', 'workspace', workspaceId, 'tickets', status],
 });

 // -- Handler -------------------------------------------------------------------
 const handleOpenTicket = (ticketId: string) => {
  void navigate({ params: { ticketId, workspaceId }, to: frontendRoute.dashboard.ticket });
 };

 // -- UI ------------------------------------------------------------------------
 const workspace = workspacesQuery.data?.workspaces.find((item) => item.id === workspaceId);
 const tickets = ticketsQuery.data?.tickets ?? [];
 return (
  <DashboardPageLayout>
   <DashboardPageContentContainer>
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '0 auto', maxWidth: '1100px', padding: '1.5rem', width: '100%' }}>
     <Button component={RouterLink} sx={{ alignSelf: 'flex-start', textTransform: 'none' }} to={frontendRoute.dashboard.index}>
      {t('dashboard.workspace.back')}
     </Button>

     <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
       <Typography sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{workspace?.name ?? t('common.notAvailable')}</Typography>
       <Typography color='text.secondary'>{t('dashboard.workspace.description', { total: ticketsQuery.data?.total ?? 0 })}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '0.75rem' }}>
       <TextField
        label={t('dashboard.workspace.filter.label')}
        onChange={(event) => setStatus(event.target.value as TicketStatus | typeof ALL_STATUSES)}
        select
        size='small'
        sx={{ minWidth: 160 }}
        value={status}
       >
        <MenuItem value={ALL_STATUSES}>{t('dashboard.workspace.filter.all')}</MenuItem>
        {Object.values(ticketStatuses).map((value) => <MenuItem key={value} value={value}>{t(`ticket.status.${value}`)}</MenuItem>)}
       </TextField>
       <Button onClick={handleOpenDialog} variant='contained'>{t('dashboard.workspace.newTicket')}</Button>
      </Box>
     </Box>

     {ticketsQuery.error ? <Alert severity='error'>{ErrorUtil.toMessage(ticketsQuery.error)}</Alert> : null}

     {ticketsQuery.isPending
      ? <QueryLoadingFallback minHeight='140px' />
      : tickets.length === 0
       ? <Typography color='text.secondary'>{t('dashboard.workspace.empty')}</Typography>
       : (
        <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
         <Table sx={{ minWidth: 'max-content' }}>
          <TableHead>
           <TableRow>
            <TableCell>{t('dashboard.workspace.column.number')}</TableCell>
            <TableCell>{t('dashboard.workspace.column.subject')}</TableCell>
            <TableCell>{t('dashboard.workspace.column.requester')}</TableCell>
            <TableCell>{t('dashboard.workspace.column.status')}</TableCell>
            <TableCell>{t('dashboard.workspace.column.priority')}</TableCell>
            <TableCell>{t('dashboard.workspace.column.updatedAt')}</TableCell>
           </TableRow>
          </TableHead>
          <TableBody>
           {tickets.map((ticket) => (
            <TableRow hover key={ticket.id} onClick={() => handleOpenTicket(ticket.id)} sx={{ cursor: 'pointer' }}>
             <TableCell>{ticket.number}</TableCell>
             <TableCell>{ticket.subject}</TableCell>
             <TableCell>{ticket.requester_email}</TableCell>
             <TableCell><Chip label={t(`ticket.status.${ticket.status}`)} size='small' /></TableCell>
             <TableCell>{t(`ticket.priority.${ticket.priority}`)}</TableCell>
             <TableCell>{new Date(ticket.updated_at).toLocaleString(currentLocale)}</TableCell>
            </TableRow>
           ))}
          </TableBody>
         </Table>
        </Box>
       )}
    </Paper>

    <CreateTicketDialog isOpen={isDialogOpen} onClose={handleCloseDialog} onCreated={handleOpenTicket} workspaceId={workspaceId} />
   </DashboardPageContentContainer>
  </DashboardPageLayout>
 );
};

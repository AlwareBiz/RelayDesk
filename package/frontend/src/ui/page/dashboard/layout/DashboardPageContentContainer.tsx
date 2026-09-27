import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';

// ********************************************************************************
// == Component ===================================================================
export const DashboardPageContentContainer = ({ children }: PropsWithChildren) => {
 // -- UI ------------------------------------------------------------------------
 return (
  <Box
   sx={{
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    margin: '2rem auto',
    maxWidth: '100%',
    minWidth: 0,
    width: '100%',
   }}
  >
   {children}
  </Box>
 );
};

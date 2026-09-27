import { Box } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

import { appPageBackgroundStyle } from '../constant/style';

// ********************************************************************************
// == Component ===================================================================
export const AuthPagesLayout: FC<PropsWithChildren> = ({ children }) =>
 <Box
  sx={{
   ...appPageBackgroundStyle,
   alignItems: 'center',
   display: 'flex',
   flexDirection: 'column',
   justifyContent: 'center',
   minHeight: '100vh',
   padding: '2em',
  }}
 >
  {children}
 </Box>;

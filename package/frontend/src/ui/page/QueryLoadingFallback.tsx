import { Box, CircularProgress } from '@mui/material';

// ********************************************************************************
// == Type ========================================================================
type Props = {
 minHeight?: string;
 size?: number;
};

// == Component ===================================================================
export const QueryLoadingFallback = ({ minHeight = '120px', size = 24 }: Props) => {
 // -- UI ------------------------------------------------------------------------
 return (
  <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight }}>
   <CircularProgress size={size} />
  </Box>
 );
};

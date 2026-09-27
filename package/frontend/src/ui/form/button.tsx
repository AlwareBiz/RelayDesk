import { Button, type ButtonProps } from '@mui/material';
import type { FC, PropsWithChildren } from 'react';

// ********************************************************************************
// == Type ========================================================================
type SubmitFormikButtonProps = PropsWithChildren & {
 formik: { isSubmitting: boolean; submitForm: () => void; };
 sx?: ButtonProps['sx'];
} & Omit<ButtonProps, 'formik'>;

// == Component ===================================================================
export const SubmitFormikButton: FC<SubmitFormikButtonProps> = ({ children, formik, sx, ...props }) =>
 <Button
  disabled={formik.isSubmitting}
  onClick={() => formik.submitForm()}
  sx={{
   backgroundColor: '#1976d2',
   color: '#fff',
   textTransform: 'none',
   width: '100%',
   '&:hover': { backgroundColor: '#115293' },
   ...sx,
  }}
  variant='outlined'
  {...props}
 >
  {children}
 </Button>;

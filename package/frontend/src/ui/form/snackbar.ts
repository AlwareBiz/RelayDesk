import type { useSnackbar } from 'notistack';

// ********************************************************************************
// == Type ========================================================================
export type SnackbarType = ReturnType<typeof useSnackbar>;
export type SnackbarVariant = 'default' | 'error' | 'info' | 'success' | 'warning';

// == Constant ====================================================================
const FEEDBACK_DURATION = 3000;
const style = { fontFamily: 'system-ui' };

// == Util ========================================================================
export const notifySnackbar = (snackbar: SnackbarType, message: string, variant: SnackbarVariant = 'default') => {
 snackbar.enqueueSnackbar(message, { autoHideDuration: FEEDBACK_DURATION, style, variant });
};

export const errorSnackbar = (snackbar: SnackbarType, message: string) => {
 notifySnackbar(snackbar, message, 'error');
};

export const successSnackbar = (snackbar: SnackbarType, message: string) => {
 notifySnackbar(snackbar, message, 'success');
};

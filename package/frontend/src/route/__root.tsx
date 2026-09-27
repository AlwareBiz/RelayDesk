import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet } from '@tanstack/react-router';
import { SnackbarProvider } from 'notistack';

// ********************************************************************************
// == Constant ====================================================================
const theme = createTheme({
    palette: {
        background: { default: '#f3f5f9', paper: '#f7f8fc' },
        text: { primary: '#0f172a', secondary: '#475569' },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(247, 248, 252, 0.95)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(15, 23, 42, 0.06)',
                    boxShadow: '0 12px 34px rgba(7, 17, 31, 0.08)',
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: { backgroundColor: 'rgba(248, 250, 252, 0.9)' },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: { borderBottom: '1px solid rgba(15, 23, 42, 0.08)', color: '#0f172a' },
                head: { backgroundColor: 'rgba(226, 232, 240, 0.8)', color: '#334155', fontWeight: 700 },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 255, 255, 0.35)' },
                    '&:hover': { backgroundColor: 'rgba(139, 211, 255, 0.14)' },
                },
            },
        },
    },
});

// == Component ===================================================================
export const Root = () => {
    // -- UI ------------------------------------------------------------------------
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }} autoHideDuration={3000} maxSnack={3}>
                <CssBaseline />
                <Outlet />
            </SnackbarProvider>
        </ThemeProvider>
    );
};

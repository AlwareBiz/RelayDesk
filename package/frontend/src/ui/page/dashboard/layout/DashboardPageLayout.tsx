import { AppBar, Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import type { PropsWithChildren, ReactNode } from 'react';

import { AppLocale, backendRoutes, frontendRoute, type FetchCurrentProfileResponseData, type LocaleKey } from '@relaydesk/common';

import { useDrawerDisclosure } from '../../../../hook/disclosure/useDrawerDisclosure';
import { useMenuDisclosure } from '../../../../hook/disclosure/useMenuDisclosure';
import { useLocale } from '../../../../hook/useLocale';
import { ApiClient } from '../../../../service/ApiClient';
import { AuthService } from '../../../../service/AuthService';
import { appIcons } from '../../../constant/icon';
import { appPageBackgroundStyle } from '../../../constant/style';
import { notifySnackbar } from '../../../form/snackbar';

// ********************************************************************************
// == Type ========================================================================
type DrawerNavigationItem = {
 icon: ReactNode;
 labelKey: LocaleKey;
 path: string;
};

// == Constant ====================================================================
const drawerWidth = 260;

const drawerNavigationItems: DrawerNavigationItem[] = [
 { icon: appIcons.overview, labelKey: 'dashboard.nav.workspaces', path: frontendRoute.dashboard.index },
 { icon: appIcons.profile, labelKey: 'dashboard.nav.profile', path: frontendRoute.dashboard.profile },
];

// == Component ===================================================================
export const DashboardPageLayout = ({ children }: PropsWithChildren) => {
 const { isDrawerOpen, onDrawerClose, onDrawerOpen } = useDrawerDisclosure();
 const { changeLocale, currentLocale, t } = useLocale();
 const { handleCloseMenu: handleCloseLocaleMenu, handleOpenMenu: handleOpenLocaleMenu, isMenuOpen: isLocaleMenuOpen, menuAnchor: localeMenuAnchor } = useMenuDisclosure();
 const { handleCloseMenu, handleOpenMenu, isMenuOpen, menuAnchor } = useMenuDisclosure();
 const navigate = useNavigate();
 const pathname = useRouterState({ select: (state) => state.location.pathname });
 const snackbar = useSnackbar();
 const theme = useTheme();
 const isMdOrBigger = useMediaQuery(theme.breakpoints.up('md'));

 // -- Query ---------------------------------------------------------------------
 const profileQuery = useQuery<FetchCurrentProfileResponseData>({
  queryFn: async () => ApiClient.get<FetchCurrentProfileResponseData>(backendRoutes.dashboard.profile.index),
  queryKey: ['dashboard', 'layout-profile'],
 });

 // -- Handler -------------------------------------------------------------------
 const handleGoToProfile = () => {
  handleCloseMenu();
  void navigate({ to: frontendRoute.dashboard.profile });
 };

 const handleLocaleChange = (nextLocale: AppLocale) => {
  changeLocale(nextLocale);
  handleCloseLocaleMenu();
 };

 const handleLogoutClick = async () => {
  handleCloseMenu();

  try {
   await AuthService.logOut();
   await navigate({ to: frontendRoute.login });
  } catch {
   notifySnackbar(snackbar, t('dashboard.layout.menu.logoutError'), 'error');
  }
 };

 const handleNavigationItemClick = () => {
  if (!isMdOrBigger) {
   onDrawerClose();
  } /* else -- the drawer is permanent on wide screens */
 };

 // -- UI ------------------------------------------------------------------------
 const profile = profileQuery.data?.profile;
 const avatarLabel = profile?.email.slice(0, 1).toUpperCase() ?? '?';
 return (
  <Box sx={{ ...appPageBackgroundStyle, display: 'flex', minHeight: '100vh' }}>
   <AppBar
    color='inherit'
    elevation={0}
    position='fixed'
    sx={{
     backdropFilter: 'blur(16px)',
     background: 'rgba(7, 17, 31, 0.78)',
     borderBottom: '1px solid rgba(255,255,255,0.12)',
     color: 'white',
     zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
    }}
   >
    <Toolbar sx={{ color: 'white', gap: 1, justifyContent: 'space-between' }}>
     <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
      {!isMdOrBigger
       ? (
        <IconButton edge='start' onClick={onDrawerOpen} sx={{ color: 'white' }} type='button'>
         {appIcons.menu}
        </IconButton>
       )
       : null}
      <Typography sx={{ color: 'white', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.02em' }}>
       {t('dashboard.layout.title')}
      </Typography>
     </Box>

     <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title={t('locale.switchLabel')}>
       <IconButton aria-label={t('locale.switchLabel')} onClick={(event) => handleOpenLocaleMenu(event.currentTarget)} sx={{ color: 'white' }} type='button'>
        {appIcons.language}
       </IconButton>
      </Tooltip>

      <IconButton onClick={(event) => handleOpenMenu(event.currentTarget)} sx={{ color: 'white' }} type='button'>
       <Avatar sx={{ bgcolor: 'primary.main', height: 32, width: 32 }}>{avatarLabel}</Avatar>
      </IconButton>
     </Box>

     <Menu anchorEl={localeMenuAnchor} onClose={handleCloseLocaleMenu} open={isLocaleMenuOpen}>
      <MenuItem onClick={() => handleLocaleChange(AppLocale.EN)} selected={currentLocale === AppLocale.EN}>{t('locale.english')}</MenuItem>
      <MenuItem onClick={() => handleLocaleChange(AppLocale.ES)} selected={currentLocale === AppLocale.ES}>{t('locale.spanish')}</MenuItem>
     </Menu>

     <Menu anchorEl={menuAnchor} onClose={handleCloseMenu} open={isMenuOpen}>
      <MenuItem onClick={handleGoToProfile}>
       <ListItemIcon>{appIcons.profile}</ListItemIcon>
       <ListItemText>{t('dashboard.layout.menu.profile')}</ListItemText>
      </MenuItem>

      <Divider />
      <MenuItem onClick={() => void handleLogoutClick()}>
       <ListItemIcon>{appIcons.logout}</ListItemIcon>
       <ListItemText>{t('dashboard.layout.menu.logout')}</ListItemText>
      </MenuItem>
     </Menu>
    </Toolbar>
   </AppBar>

   <Drawer
    ModalProps={{ keepMounted: true }}
    onClose={onDrawerClose}
    open={isMdOrBigger || isDrawerOpen}
    sx={{
     '& .MuiDrawer-paper': {
      backdropFilter: 'blur(18px)',
      background: 'rgba(7, 17, 31, 0.84)',
      borderRight: '1px solid rgba(255,255,255,0.12)',
      boxSizing: 'border-box',
      color: 'white',
      width: drawerWidth,
     },
     flexShrink: 0,
     width: drawerWidth,
    }}
    variant={isMdOrBigger ? 'permanent' : 'temporary'}
   >
    <Toolbar />
    <List sx={{ padding: 1 }}>
     {drawerNavigationItems.map((item) => {
      const isActive = pathname === item.path;
      return (
       <ListItemButton
        component={Link}
        key={item.path}
        onClick={handleNavigationItemClick}
        selected={isActive}
        sx={{
         '&.Mui-selected': { backgroundColor: 'rgba(139, 211, 255, 0.18)' },
         '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
         borderRadius: 2,
         color: 'white',
         marginBottom: 0.5,
        }}
        to={item.path}
       >
        <ListItemIcon sx={{ color: isActive ? '#8bd3ff' : 'rgba(255,255,255,0.78)', minWidth: 36 }}>
         {item.icon}
        </ListItemIcon>
        <ListItemText primary={t(item.labelKey)} sx={{ '& .MuiListItemText-primary': { color: 'white' } }} />
       </ListItemButton>
      );
     })}
    </List>
   </Drawer>

   <Box
    component='main'
    sx={{
     flexGrow: 1,
     minWidth: 0,
     padding: { md: 3, xs: 2 },
     width: { md: `calc(100% - ${drawerWidth}px)` },
    }}
   >
    <Toolbar />
    {children}
   </Box>
  </Box>
 );
};

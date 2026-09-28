import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import { frontendRoute } from '@relaydesk/common';

import { Root } from './route/__root';
import { DashboardIndexPage } from './route/dashboard';
import { DashboardProfilePage } from './route/dashboard/profile';
import { DashboardWorkspacePage } from './route/dashboard/workspace';
import { DashboardConversationPage } from './route/dashboard/workspace/conversation';
import { LandingPage } from './route';
import { LoginPage } from './route/login';
import { RegisterPage } from './route/register';
import { redirectIfAuthenticated, requireAuth } from './util/auth';

// ********************************************************************************
// == Type ========================================================================
declare module '@tanstack/react-router' {
 interface Register {
  router: typeof router;
 }
}

// == Route =======================================================================
const root = createRootRoute({ component: Root });

const routes = [
 // not logged in
 createRoute({ component: LandingPage, getParentRoute: () => root, path: frontendRoute.landing }),
 createRoute({ beforeLoad: redirectIfAuthenticated, component: LoginPage, getParentRoute: () => root, path: frontendRoute.login }),
 createRoute({ beforeLoad: redirectIfAuthenticated, component: RegisterPage, getParentRoute: () => root, path: frontendRoute.register }),

 // logged in
 createRoute({ beforeLoad: requireAuth, component: DashboardIndexPage, getParentRoute: () => root, path: frontendRoute.dashboard.index }),
 createRoute({ beforeLoad: requireAuth, component: DashboardProfilePage, getParentRoute: () => root, path: frontendRoute.dashboard.profile }),
 createRoute({ beforeLoad: requireAuth, component: DashboardWorkspacePage, getParentRoute: () => root, path: frontendRoute.dashboard.workspace }),
 createRoute({ beforeLoad: requireAuth, component: DashboardConversationPage, getParentRoute: () => root, path: frontendRoute.dashboard.conversation }),
];

// == Export ======================================================================
export const router = createRouter({ routeTree: root.addChildren(routes) });

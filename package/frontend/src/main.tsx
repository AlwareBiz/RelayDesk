import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { LocaleProvider } from './context/locale/LocaleProvider';
import { router } from './router';

// ********************************************************************************
// == Setup =======================================================================
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const queryClient = new QueryClient();

createRoot(rootElement).render(
 <StrictMode>
  <LocaleProvider>
   <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
   </QueryClientProvider>
  </LocaleProvider>
 </StrictMode>,
);

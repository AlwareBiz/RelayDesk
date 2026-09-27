import { createContext } from 'react';

import type { AppLocale, AppTranslationFn } from '@relaydesk/common';

// ********************************************************************************
// == Type ========================================================================
type LocaleContextState = Readonly<{
 changeLocale: ((nextLocale: AppLocale) => void) | null;
 currentLocale: AppLocale | null;
 t: AppTranslationFn | null;
}>;

// == Context =====================================================================
export const LocaleContext = createContext<LocaleContextState>({
 changeLocale: null,
 currentLocale: null,
 t: null,
});

LocaleContext.displayName = 'LocaleContext';

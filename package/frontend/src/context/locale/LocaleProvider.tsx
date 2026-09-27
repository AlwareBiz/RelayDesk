import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { AppLocale, commonTranslationFunctionality, FALLBACK_LANGUAGE_DATA, getLocaleData, getLocaleSchema, type AppTranslationFn, type LocaleData } from '@relaydesk/common';

import { LocaleContext } from './LocaleContext';

// ********************************************************************************
// == Constant ====================================================================
const LANGUAGE_SEARCH_PARAM = 'lang';
const LOCALE_STORAGE_ITEM = 'relaydesk-locale';

// == Component ===================================================================
export const LocaleProvider = ({ children }: PropsWithChildren) => {
 // -- State ---------------------------------------------------------------------
 const [currentLocale, setCurrentLocale] = useState<AppLocale>(AppLocale.ES);
 const [localeData, setLocaleData] = useState<LocaleData>(FALLBACK_LANGUAGE_DATA as LocaleData);

 // -- Handler -------------------------------------------------------------------
 const changeLocale = (nextLocale: AppLocale): void => {
  setCurrentLocale(nextLocale);
  setLocaleData(getLocaleData(nextLocale));
  localStorage.setItem(LOCALE_STORAGE_ITEM, nextLocale);
  document.documentElement.lang = nextLocale;
 };

 // -- Effect --------------------------------------------------------------------
 useEffect(() => {
  const localeFromQuery = new URLSearchParams(window.location.search).get(LANGUAGE_SEARCH_PARAM);
  if (localeFromQuery && getLocaleSchema().isValidSync(localeFromQuery)) {
   changeLocale(localeFromQuery as AppLocale);
   return;
  }

  const localeFromStorage = localStorage.getItem(LOCALE_STORAGE_ITEM);
  if (localeFromStorage && getLocaleSchema().isValidSync(localeFromStorage)) {
   changeLocale(localeFromStorage as AppLocale);
   return;
  }

  changeLocale(AppLocale.ES);
 }, []);

 const t: AppTranslationFn = useMemo(() => (path, replacement) => commonTranslationFunctionality(localeData, path, replacement), [localeData]);

 // -- UI ------------------------------------------------------------------------
 return (
  <LocaleContext.Provider value={{ changeLocale, currentLocale, t }}>
   {children}
  </LocaleContext.Provider>
 );
};

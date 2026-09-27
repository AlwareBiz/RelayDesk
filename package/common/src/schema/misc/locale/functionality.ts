import { mixed } from 'yup';

import englishLanguageData from './locales/en.json';
import fallbackLanguageData from './locales/es.json';

// ********************************************************************************
// == Type ========================================================================
/** BCP 47 language tags; each value can be passed directly to `Intl` APIs and `<html lang>` */
export enum AppLocale {
  EN = 'en',
  ES = 'es',
}

export type NestedKeys<T> = T extends object
  ? {
    [K in keyof T]: K extends string
    ? T[K] extends object
    ? `${K}` | `${K}.${NestedKeys<T[K]>}`
    : `${K}`
    : never;
  }[keyof T]
  : never;

type LocaleJsonObj = typeof fallbackLanguageData;
type LocalePath<T> = NestedKeys<T>;

export type LocaleData = { [key: string]: string | LocaleData; };

export type TranslationReplacement = { [key: string]: number | string; };

export type TranslationFn<T> = (path: LocalePath<T>, replacement?: TranslationReplacement) => string;

export type AppTranslationFn = TranslationFn<LocaleJsonObj>;
export type LocaleKey = NestedKeys<LocaleJsonObj>;

// == Constant ====================================================================
export const FALLBACK_LANGUAGE_DATA = fallbackLanguageData;

const localeDataByLocale: Record<AppLocale, LocaleData> = {
  [AppLocale.EN]: englishLanguageData as LocaleData,
  [AppLocale.ES]: fallbackLanguageData as LocaleData,
};

// == Util ========================================================================
export const commonTranslationFunctionality = (
  languageData: LocaleData,
  path: LocaleKey,
  replacement?: TranslationReplacement,
): string => {
  const tokens = path.split('.');

  let translation = getTranslationFromData(languageData, tokens) ?? getTranslationFromData(FALLBACK_LANGUAGE_DATA as LocaleData, tokens);
  if (!translation) {
    return path;
  }

  if (!replacement) {
    return translation;
  }

  const replacementKeys = Object.keys(replacement);
  for (let i = 0; i < replacementKeys.length; i += 1) {
    translation = translation.replaceAll(`{{${replacementKeys[i]}}}`, String(replacement[replacementKeys[i]]));
  }

  return translation;
};

export const getLocaleData = (locale: AppLocale): LocaleData => localeDataByLocale[locale] ?? FALLBACK_LANGUAGE_DATA as LocaleData;

export const getLocaleSchema = () =>
  mixed<AppLocale>()
    .oneOf(Object.values(AppLocale))
    .required();

/** the name of a locale in its own language, e.g. "English" or "español" */
export const displayLocale = (locale: AppLocale): string =>
  new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale;

const getTranslationFromData = (data: LocaleData, tokens: string[]): string | undefined => {
  let currentNode: LocaleData | string = data;

  for (const token of tokens) {
    if (typeof currentNode === 'string' || currentNode[token] === undefined) {
      return undefined;
    }

    currentNode = currentNode[token] as LocaleData | string;
  }

  return typeof currentNode === 'string' ? currentNode : undefined;
};

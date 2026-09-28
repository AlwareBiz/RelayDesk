import { describe, expect, it } from 'vitest';

import { AppLocale, type LocaleData } from './functionality';
import englishLanguageData from './locales/en.json';
import spanishLanguageData from './locales/es.json';

// ********************************************************************************
// == Type ========================================================================
type Dictionary = { data: LocaleData; name: string; };

// == Constant ====================================================================
const english: Dictionary = { data: englishLanguageData as LocaleData, name: `${AppLocale.EN}.json` };
const spanish: Dictionary = { data: spanishLanguageData as LocaleData, name: `${AppLocale.ES}.json` };

// == Util ========================================================================
const describeKind = (value: string | LocaleData) => (typeof value === 'string' ? 'a text' : 'a group of keys');

/** one message per key whose presence or kind differs between the two dictionaries */
const findKeyMismatches = (first: Dictionary, second: Dictionary, parentPath = ''): string[] => {
 const keys = [...new Set([...Object.keys(first.data), ...Object.keys(second.data)])].sort();
 const mismatches: string[] = [];

 for (const key of keys) {
  const path = joinPath(parentPath, key);
  const firstValue = first.data[key];
  const secondValue = second.data[key];

  if (firstValue === undefined) {
   mismatches.push(...listMissingKeys(secondValue, path, first.name));
  } else if (secondValue === undefined) {
   mismatches.push(...listMissingKeys(firstValue, path, second.name));
  } else if (typeof firstValue !== typeof secondValue) {
   mismatches.push(`${path} is ${describeKind(firstValue)} in ${first.name} and ${describeKind(secondValue)} in ${second.name}`);
  } else if (typeof firstValue !== 'string' && typeof secondValue !== 'string') {
   mismatches.push(...findKeyMismatches({ data: firstValue, name: first.name }, { data: secondValue, name: second.name }, path));
  } /* else -- both dictionaries have a text for this key */
 }

 return mismatches;
};

const joinPath = (parentPath: string, key: string) => (parentPath ? `${parentPath}.${key}` : key);

/** names every text under a missing key, since each one needs a translation */
const listMissingKeys = (value: string | LocaleData, path: string, missingFrom: string): string[] => {
 if (typeof value === 'string') {
  return [`${path} is missing from ${missingFrom}`];
 } /* else -- a whole group is missing, so each of its texts is */

 return Object.entries(value).flatMap(([key, child]) => listMissingKeys(child, joinPath(path, key), missingFrom));
};

// == Test ========================================================================
describe('locale dictionaries', () => {
 // es.json is the fallback, so a key missing from en.json shows Spanish text to English users and nothing else reports it
 it('have the same keys in en.json and es.json', () => {
  expect(findKeyMismatches(english, spanish)).toEqual([]);
 });

 describe('findKeyMismatches', () => {
  const dictionary = (name: string, data: LocaleData): Dictionary => ({ data, name });

  it('reports nothing when both dictionaries have the same keys', () => {
   const first = dictionary('en.json', { ticket: { status: { open: 'Open' } } });
   const second = dictionary('es.json', { ticket: { status: { open: 'Abierto' } } });
   expect(findKeyMismatches(first, second)).toEqual([]);
  });

  it('names a key missing from the first dictionary', () => {
   const first = dictionary('en.json', { ticket: { status: { open: 'Open' } } });
   const second = dictionary('es.json', { ticket: { status: { closed: 'Cerrado', open: 'Abierto' } } });
   expect(findKeyMismatches(first, second)).toEqual(['ticket.status.closed is missing from en.json']);
  });

  it('names a key missing from the second dictionary', () => {
   const first = dictionary('en.json', { ticket: { status: { closed: 'Closed', open: 'Open' } } });
   const second = dictionary('es.json', { ticket: { status: { open: 'Abierto' } } });
   expect(findKeyMismatches(first, second)).toEqual(['ticket.status.closed is missing from es.json']);
  });

  it('names every text under a missing group', () => {
   const first = dictionary('en.json', {});
   const second = dictionary('es.json', { ticket: { status: { closed: 'Cerrado', open: 'Abierto' } } });
   expect(findKeyMismatches(first, second)).toEqual(['ticket.status.closed is missing from en.json', 'ticket.status.open is missing from en.json']);
  });

  it('reports a key that is a text in one dictionary and a group of keys in the other', () => {
   const first = dictionary('en.json', { ticket: { status: 'Status' } });
   const second = dictionary('es.json', { ticket: { status: { open: 'Abierto' } } });
   expect(findKeyMismatches(first, second)).toEqual(['ticket.status is a text in en.json and a group of keys in es.json']);
  });
 });
});

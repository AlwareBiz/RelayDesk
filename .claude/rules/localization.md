---
paths:
 - "package/common/src/schema/misc/locale/**"
 - "package/frontend/src/**/*.tsx"
---

# Localization

- Every piece of user-facing text comes from a dictionary through `t()` from `useLocale`. Never hardcode visible text in a component.
- Dictionaries are `package/common/src/schema/misc/locale/locales/en.json` and `es.json`, named by BCP 47 tag. `es` is the default and the fallback, so its shape defines the `LocaleKey` type: a key missing from `es.json` fails the build. A key missing from `en.json` would silently show the Spanish text, so `dictionary.test.ts` fails `npm test` whenever the two dictionaries have different keys.
- Add every new key to both dictionaries in the same change, with the same structure. Keep keys alphabetical at every level.
- Scope keys by area (`dashboard.ticket.reply.submit`, `ticket.status.open`). Reuse an existing key before adding one.
- Fill dynamic values with placeholders (`"#{{number}} {{subject}}"` and `t(key, { number, subject })`), never by concatenating strings.
- Label enum values through a key per value (``t(`ticket.status.${ticket.status}`)``), so adding an enum value fails the build until `es.json` has a label for it.
- Log messages and developer diagnostics are not translated.

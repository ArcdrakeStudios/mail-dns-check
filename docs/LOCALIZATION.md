# English and German interface

The bundled `dist/language.js` supplies translations for interface text, help, errors and accessibility labels without network requests or runtime dependencies. DNS names, record values and raw resolver evidence remain data and are not translated.

Language selection follows this order:

1. A valid `?lang=de` or `?lang=en` URL parameter.
2. The saved `arcdrake-tools-language` preference.
3. German when the browser's language is German; English otherwise.

An explicit URL choice still works when browser storage is unavailable. Only the language preference is persisted by this module.

English/Deutsch controls change the language without reloading or clearing entered data. The app dispatches and listens for `arcdrake-language-change` on `window`, with `detail.language` set to `en` or `de`. A script running in the same page, such as site navigation, can use this event to coordinate language changes. The event does not cross iframe boundaries.

## Adding translations

The translator retains English source text per node and translates exact strings or bounded message templates. It does not replace arbitrary words inside user text. Add both the English source and German translation for new interface copy, keep user-supplied values outside translated text, and extend the localization tests.

Run `npm run test:localization` after installing the development tools described in the [README](../README.md). The checks cover language selection, translated results and errors, preservation of entered data, unavailable storage and narrow layouts.

The shared feedback widget mounts once in English; the bundled translator uses the exact EN/DE `NOTICES` from its copied client. Language changes translate visible copy and update the existing Tools privacy/company contact links without rebuilding the form, losing a draft, or resending feedback. The app keeps its complete English/Deutsch control; the hosting wrapper hides its duplicate language group when that control is usable and retains its fallback otherwise. Standalone cross-tab and history language changes use the same event.

/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
const enLocaleData = require('react-intl/locale-data/en');
const esLocaleData = require('react-intl/locale-data/es');
const ptLocaleData = require('react-intl/locale-data/pt');
const plLocaleData = require('react-intl/locale-data/pl');

const enTranslationMessages = require('./translations/en.json');
const esTranslationMessages = require('./translations/es.json');
const ptTranslationMessages = require('./translations/pt.json');
const plTranslationMessages = require('./translations/pl.json');

addLocaleData(enLocaleData);
addLocaleData(esLocaleData);
addLocaleData(ptLocaleData);
addLocaleData(plLocaleData);

const DEFAULT_LOCALE = 'en';

// prettier-ignore
const appLocales = [
  'en',
  'es',
  'pt',
  'pl',
];

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  es: formatTranslationMessages('es', esTranslationMessages),
  pt: formatTranslationMessages('pt', ptTranslationMessages),
  pl: formatTranslationMessages('pl', plTranslationMessages),
};

exports.appLocales = appLocales;
exports.formatTranslationMessages = formatTranslationMessages;
exports.translationMessages = translationMessages;
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;

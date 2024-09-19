import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';
import hiTranslations from './locales/hi/translation.json';
import teTranslations from './locales/te/translation.json';
import taTranslations from './locales/ta/translation.json';
import knTranslations from './locales/kn/translation.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      te: { translation: teTranslations },
      ta: { translation: taTranslations },
      kn: { translation: knTranslations },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: { escapeValue: true },
  });

export default i18n;

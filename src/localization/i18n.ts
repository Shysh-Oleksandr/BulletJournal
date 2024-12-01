import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationIT from "./locales/it/translation.json";
import translationUK from "./locales/uk/translation.json";
import { Language } from "./types";

const resources = {
  [Language.English]: {
    translation: translationEN,
  },
  [Language.Spanish]: {
    translation: translationES,
  },
  [Language.Italian]: {
    translation: translationIT,
  },
  [Language.French]: {
    translation: translationFR,
  },
  [Language.German]: {
    translation: translationDE,
  },
  [Language.Ukrainian]: {
    translation: translationUK,
  },
};

export const currentLocale = getLocales()[0];

i18n.use(initReactI18next).init({
  resources,
  lng: currentLocale.languageCode || Language.English,
  fallbackLng: Language.English,
  keySeparator: ".",
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
});

export default i18n;

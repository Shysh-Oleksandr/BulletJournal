import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import { Language } from "./types";

const resources = {
  [Language.English]: {
    translation: translationEN,
  },
  [Language.Spanish]: {
    translation: translationES,
  },
};

export const currentLocale = getLocales()[0];

i18n.use(initReactI18next).init({
  resources,
  lng: currentLocale.languageCode,
  fallbackLng: Language.English,
  keySeparator: ".",
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
});

export default i18n;

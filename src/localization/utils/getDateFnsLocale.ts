import { Locale } from "date-fns";

import * as dateFnsLocales from "date-fns/locale";
import i18n from "localization/i18n";
import { Language } from "localization/types";

interface Locales {
  [key: string]: Locale;
}

export const getDateFnsLocale = (): Locale => {
  const locales: Locales = {
    [Language.English]: dateFnsLocales.enUS,
    [Language.Spanish]: dateFnsLocales.es,
    [Language.French]: dateFnsLocales.fr,
    [Language.Italian]: dateFnsLocales.it,
    [Language.German]: dateFnsLocales.de,
    [Language.Ukrainian]: dateFnsLocales.uk,
  };

  return locales[i18n.language];
};

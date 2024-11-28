import { LocaleConfig } from "react-native-calendars";

import i18n from "localization/i18n";
import { MONTH_NAMES } from "modules/app/constants";

export const configureCalendarLocale = () => {
  LocaleConfig.locales["en"] = {
    monthNames: MONTH_NAMES,
    monthNamesShort: [],
    dayNames: [],
    dayNamesShort: [
      i18n.t("calendar.dayNames.sun"),
      i18n.t("calendar.dayNames.mon"),
      i18n.t("calendar.dayNames.tue"),
      i18n.t("calendar.dayNames.wed"),
      i18n.t("calendar.dayNames.thu"),
      i18n.t("calendar.dayNames.fri"),
      i18n.t("calendar.dayNames.sat"),
    ],
  };

  LocaleConfig.defaultLocale = "en";
};

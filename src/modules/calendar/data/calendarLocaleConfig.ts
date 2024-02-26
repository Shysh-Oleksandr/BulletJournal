import { LocaleConfig } from "react-native-calendars";

import i18n from "localization/i18n";

export const configureCalendarLocale = () => {
  LocaleConfig.locales["en"] = {
    monthNames: [
      i18n.t("calendar.monthNames.jan"),
      i18n.t("calendar.monthNames.feb"),
      i18n.t("calendar.monthNames.mar"),
      i18n.t("calendar.monthNames.apr"),
      i18n.t("calendar.monthNames.may"),
      i18n.t("calendar.monthNames.june"),
      i18n.t("calendar.monthNames.july"),
      i18n.t("calendar.monthNames.aug"),
      i18n.t("calendar.monthNames.sept"),
      i18n.t("calendar.monthNames.oct"),
      i18n.t("calendar.monthNames.nov"),
      i18n.t("calendar.monthNames.dec"),
    ],
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

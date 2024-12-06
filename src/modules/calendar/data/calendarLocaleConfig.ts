import { LocaleConfig } from "react-native-calendars";

import { MONTH_NAMES, WEEKDAY_NAMES } from "modules/app/constants";

export const configureCalendarLocale = () => {
  LocaleConfig.locales["en"] = {
    monthNames: MONTH_NAMES,
    monthNamesShort: [],
    dayNames: [],
    dayNamesShort: WEEKDAY_NAMES,
  };

  LocaleConfig.defaultLocale = "en";
};

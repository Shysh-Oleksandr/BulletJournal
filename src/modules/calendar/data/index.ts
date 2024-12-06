import theme from "theme";

import { Theme } from "react-native-calendars/src/types";

export const SIMPLE_DATE_FORMAT = "yyyy-MM-dd";

export const getCalendarTheme = (color?: string): Theme => ({
  arrowColor: color ?? theme.colors.cyan600,
  monthTextColor: color ?? theme.colors.darkBlueText,
  textMonthFontWeight: "bold",
  todayTextColor: color ?? theme.colors.darkBlueText,
  dayTextColor: color ?? theme.colors.darkBlueText,
  weekVerticalMargin: 4,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "stylesheet.calendar.header": {
    dayTextAtIndex0: { color: color ?? theme.colors.cyan500 },
    dayTextAtIndex1: { color: color ?? theme.colors.cyan500 },
    dayTextAtIndex2: { color: color ?? theme.colors.cyan500 },
    dayTextAtIndex3: { color: color ?? theme.colors.cyan500 },
    dayTextAtIndex4: { color: color ?? theme.colors.cyan500 },
    dayTextAtIndex5: { color: color ?? theme.colors.cyan500 },
    dayTextAtIndex6: { color: color ?? theme.colors.cyan500 },
  },
});

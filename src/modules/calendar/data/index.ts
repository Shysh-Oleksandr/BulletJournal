import theme from "theme";

import { Theme } from "react-native-calendars/src/types";

export const SIMPLE_DATE_FORMAT = "yyyy-MM-dd";

export const CALENDAR_THEME: Theme = {
  arrowColor: theme.colors.cyan600,
  monthTextColor: theme.colors.darkBlueText,
  textMonthFontWeight: "bold",
  todayTextColor: theme.colors.darkBlueText,
  dayTextColor: theme.colors.darkBlueText,
  weekVerticalMargin: 4,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  "stylesheet.calendar.header": {
    dayTextAtIndex0: { color: theme.colors.cyan500 },
    dayTextAtIndex1: { color: theme.colors.cyan500 },
    dayTextAtIndex2: { color: theme.colors.cyan500 },
    dayTextAtIndex3: { color: theme.colors.cyan500 },
    dayTextAtIndex4: { color: theme.colors.cyan500 },
    dayTextAtIndex5: { color: theme.colors.cyan500 },
    dayTextAtIndex6: { color: theme.colors.cyan500 },
  },
};

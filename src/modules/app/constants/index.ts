import { addDays, startOfWeek } from "date-fns";
import { Platform } from "react-native";
import theme from "theme";

import format from "date-fns/format";
import { getDateFnsLocale } from "localization/utils/getDateFnsLocale";
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";
import { getDifferentColor } from "utils/getDifferentColor";

export const IS_IOS = Platform.OS === "ios";
export const IS_ANDROID = Platform.OS === "android";

export const SMALL_BUTTON_HIT_SLOP = {
  left: 10,
  right: 10,
  top: 10,
  bottom: 10,
};

export const BUTTON_HIT_SLOP = {
  left: 15,
  right: 15,
  top: 15,
  bottom: 15,
};

export const BIG_BUTTON_HIT_SLOP = {
  left: 20,
  right: 20,
  top: 20,
  bottom: 20,
};

export const BG_GRADIENT_COLORS = [
  theme.colors.bgColor,
  getDifferentColor(theme.colors.bgColor, -10),
  theme.colors.bgColor,
] as const;

export const BG_GRADIENT_LOCATIONS = [0.2, 0.6, 0.8] as const;

export const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2024, i, 10), "LLLL", { locale: getDateFnsLocale() }),
);

export const WEEKDAY_NAMES = Array.from(Array(7)).map((_, i) =>
  capitalizeFirstLetter(
    format(addDays(startOfWeek(new Date(2024, 0, 1)), i), "EEEEEE", {
      locale: getDateFnsLocale(),
    }),
  ),
);

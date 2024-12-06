import { useMemo } from "react";
import theme from "theme";

import { getDifferentColor, isLightColor } from "utils/getDifferentColor";

export const useHabitStatColors = (color = theme.colors.cyan600) =>
  useMemo(() => {
    const isColorLight = isLightColor(color);

    return {
      textColor: isColorLight
        ? getDifferentColor(color, 30)
        : getDifferentColor(color, -15),
      bgColor: isColorLight
        ? getDifferentColor(color, 8)
        : getDifferentColor(color, 20),
      activeBgColor: isColorLight
        ? getDifferentColor(color, 15)
        : getDifferentColor(color, 0),
      secondaryTextColor: getDifferentColor(color, 15),
      isColorLight,
    };
  }, [color]);

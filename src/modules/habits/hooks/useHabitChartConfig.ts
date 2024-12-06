import { useMemo } from "react";
import theme from "theme";

import { ChartConfig } from "react-native-chart-kit/dist/HelperTypes";
import { getDifferentColor, isLightColor } from "utils/getDifferentColor";
import { hexToRGB } from "utils/hexToRGB";

export const useHabitChartConfig = (
  color = theme.colors.cyan500,
): ChartConfig =>
  useMemo(() => {
    const isColorLight = isLightColor(color);

    return {
      backgroundGradientFromOpacity: 0.2,
      backgroundGradientFrom: color,
      backgroundGradientTo: color,
      backgroundGradientToOpacity: 0.4,
      color: (opacity = 1) =>
        hexToRGB(getDifferentColor(color, isColorLight ? 30 : -25), opacity),
      decimalPlaces: 0,
      fillShadowGradient: color,
      fillShadowGradientOpacity: 0.8,
    };
  }, [color]);

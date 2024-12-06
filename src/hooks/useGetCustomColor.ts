import { useMemo } from "react";

import { getDifferentColor, isLightColor } from "utils/getDifferentColor";

export const useGetCustomColor = (bgColor: string) =>
  useMemo(() => {
    const isColorLight = isLightColor(bgColor);

    return {
      textColor: isColorLight
        ? getDifferentColor(bgColor, 45)
        : getDifferentColor(bgColor, 100),
      isColorLight,
    };
  }, [bgColor]);

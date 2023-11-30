import { Platform } from "react-native";
import theme from "theme";

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
];

export const BG_GRADIENT_LOCATIONS = [0.2, 0.6, 0.8];

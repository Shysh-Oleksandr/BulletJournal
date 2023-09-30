import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASIC_WIDTH = 375;

const scale = SCREEN_WIDTH / BASIC_WIDTH;

const normalizeFontSize = (size: number): number => {
  const newSize = size * scale;
  const normalizedSize = Math.round(PixelRatio.roundToNearestPixel(newSize));

  return normalizedSize > size ? size : normalizedSize;
};

export default normalizeFontSize;

import { isNil } from "ramda";
import { Text } from "react-native";
import style from "styled-components";
import theme from "theme";

import normalizeFontSize from "utils/normalizeFontSize";

import { getFont, getFontSize, getColor } from "./utils";

export type TypographyProps = {
  fontWeight?: keyof typeof theme.fonts;
  fontSize?: keyof typeof theme.fontSizes;
  lineHeight?: number;
  color?: string;
  align?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  uppercase?: boolean;
};

const Typography = style(Text)<TypographyProps>`
  font-family: ${(props) => getFont(props.fontWeight)};
  font-size: ${(props) => normalizeFontSize(getFontSize(props.fontSize))}px;
  color: ${(props) => getColor(props.color)};
  ${(props) =>
    !isNil(props.lineHeight) && `line-height: ${props.lineHeight}px;`}
  ${(props) => !isNil(props.align) && `text-align: ${props.align};`}
  ${(props) =>
    !isNil(props.paddingTop) && `padding-top: ${props.paddingTop}px;`}
  ${(props) =>
    !isNil(props.paddingBottom) && `padding-bottom: ${props.paddingBottom}px;`}
  ${(props) =>
    !isNil(props.paddingLeft) && `padding-left: ${props.paddingLeft}px;`}
  ${(props) =>
    !isNil(props.paddingRight) && `padding-right: ${props.paddingRight}px;`}
  ${(props) =>
    !isNil(props.paddingHorizontal) &&
    `padding-horizontal: ${props.paddingHorizontal}px;`}
    ${(props) =>
      !isNil(props.paddingVertical) &&
      `padding-vertical: ${props.paddingVertical}px;`}
  ${(props) => !isNil(props.uppercase) && "text-transform: uppercase;"}
`;

// this is designed to not let Typography elements grow too much in size on large font size settings
Typography.defaultProps = {
  maxFontSizeMultiplier: 1.2,
};

export default Typography;

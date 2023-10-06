import { isNil } from "ramda";
import theme from "theme";

const getFontSize = (fontSize?: keyof typeof theme.fontSizes): number =>
  fontSize ? theme.fontSizes[fontSize] : theme.fontSizes.md;

const getFont = (fontWeight?: keyof typeof theme.fonts): string => {
  if (fontWeight) {
    return theme.fonts[fontWeight];
  }

  return theme.fonts.medium;
};

const getColor = (color?: string): string =>
  !isNil(color) ? color : theme.colors.black;

const truncate = (width: string): string =>
  `
    width: ${width};

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;

export { getFont, getColor, getFontSize, truncate };

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      white: string;
      black: string;
    };
    fontSizes: {
      xxl: number;
      xl: number;
      l: number;
      ll: number;
      m: number;
      s: number;
      xs: number;
    };
    fonts: {
      bold: string;
      semibold: string;
      medium: string;
      regular: string;
      light: string;
    };
  }
}

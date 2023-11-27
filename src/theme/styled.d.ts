import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      white: string;
      black: string;
      bgColor: string;
      cyan700: string;
      cyan600: string;
      cyan500: string;
      cyan400: string;
      cyan300: string;
      cyan200: string;
      darkBlueText: string;
      blackText: string;
      gray: string;
      whitish: string;
      red600: string;
      red500: string;
      green600: string;
    };
    fontSizes: {
      xxl: number;
      xl: number;
      lg: number;
      md: number;
      sm: number;
      xs: number;
      xxs: number;
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

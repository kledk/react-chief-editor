import { css } from "styled-components";

export type ChiefEditorTheme = {
  colors?: {
    primary: string;
    seconday: string;
    gray: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
  };
  overrides?: {
    [key: string]: ReturnType<typeof css>;
  };
};

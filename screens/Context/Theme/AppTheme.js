import { lightColors,darkColors } from "./colors";

export const getAppTheme = (colors) => ({
  dark: colors === darkColors,
  colors: {
    background: colors.background,
    card: colors.primary,
    text: colors.text,
  },
});

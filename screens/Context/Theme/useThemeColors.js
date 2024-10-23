import { useTheme } from './ThemeContext';
import { lightColors, darkColors } from './colors';

export const useThemeColors = () => {
  const { isDarkMode } = useTheme();
  // console.log("useThemeColors - isDarkMode:", isDarkMode)
  return isDarkMode ? darkColors : lightColors; 
};
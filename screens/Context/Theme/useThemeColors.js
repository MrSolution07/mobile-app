import { useTheme } from './ThemeContext';
import { lightColors, darkColors } from './colors';

export const useThemeColors = () => {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkColors : lightColors; 
};
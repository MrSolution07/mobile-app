import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  console.log('Theme is ', colorScheme);

  const [isDarkMode, setIsDarkMode] = useState(null); // Start with null to load from storage

  // Load the theme preference from AsyncStorage when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      } else {
        // Default to system preference if no saved preference
        setIsDarkMode(colorScheme === 'dark');
      }
    };

    loadTheme();
  }, []);

  // Sync theme changes to AsyncStorage
  useEffect(() => {
    const saveTheme = async () => {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    };

    if (isDarkMode !== null) {
      saveTheme();
    }
  }, [isDarkMode]);

  // Update dark mode based on system preference changes
  useEffect(() => {
    if (isDarkMode === null) {
      setIsDarkMode(colorScheme === 'dark');
    }
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  if (isDarkMode === null) {
    return null; 
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();

  const [isDarkMode, setIsDarkMode] = useState(null); 

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      } else {
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

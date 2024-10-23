import React from 'react';
import { Switch, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../screens/Context/Theme/ThemeContext';
import { useThemeColors } from '../screens/Context/Theme/useThemeColors';
import Ionicons from '@expo/vector-icons/Ionicons';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme(); 
  const colors = useThemeColors();

  // console.log("ThemeToggle isDarkMode:", isDarkMode);
  // console.log("ThemeToggle colors:", colors);

  const handleAppearanceChange = () => {
    toggleTheme(); 
  };

  return (
    <View style={styles.optionContainer}>
      <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} style={styles.icon} />
      <Text style={[styles.label, { color: isDarkMode ? colors.textLight : colors.textDark }]}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </Text>
      <Switch
        value={isDarkMode}  
        onValueChange={handleAppearanceChange}  
        thumbColor={isDarkMode ? colors.primary : colors.secondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    backgroundColor:'#ffffff',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 1,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginRight: 15,
  },
});

export default ThemeToggle;

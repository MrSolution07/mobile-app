import 'react-native-reanimated';
import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { useCustomFonts } from './assets/fonts/fonts.js'; 
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './screens/Navigator/AppNavigator.js'; 
import { ThemeProvider } from './screens/Context/Theme/ThemeContext.js';
import { useThemeColors } from './screens/Context/Theme/useThemeColors.js';
import { getAppTheme } from './screens/Context/Theme/AppTheme.js';

export default function App() {
  const fontsLoaded = useCustomFonts();

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}

const InnerApp = () => {
  const colors = useThemeColors();
  const theme = getAppTheme(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="default" />
      <AppNavigator theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'whitesmoke',
  },
});

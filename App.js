import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc'; // this is a how you import tailwindcss in react native
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen.jsx';
import { useCustomFonts } from './assets/fonts/fonts.js'; 
import * as SplashScreen from 'expo-splash-screen';
import ForgotPassword from './components/ForgotPassword.jsx';
import AppNavigator from './screens/Navigator/AppNavigator.js'; 
import { NavigationContainer } from '@react-navigation/native';





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

      <AppNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

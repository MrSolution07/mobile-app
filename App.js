import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import tw from 'twrnc'; // this is a how you import tailwindcss in react native
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen.jsx';
import { useCustomFonts } from './assets/fonts/fonts.js'; 
import * as SplashScreen from 'expo-splash-screen';
// import ForgotPassword from './components/ForgotPassword.jsx';




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

    <LoginScreen/>
    // <ForgotPassword/>
    // <RegistrationScreen/>
    // <View style={[styles.container, tw`bg-blue-600`]}>
    //   <Text style={[styles.headerText, tw`text-white`]}>
    //     Welcome to React Native!
    //   </Text>
    //   <Text style={[styles.bodyText, tw`text-gray-200`]}>
    //     This is a sample application using Tailwind.
    //   </Text>
    // </View>
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

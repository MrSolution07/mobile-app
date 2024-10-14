import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useCustomFonts } from './assets/fonts/fonts.js'; 
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './screens/Navigator/AppNavigator.js'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Onboarding from './screens/Onboarding.js';


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
    
    <View style={styles.container}>
      <AppNavigator />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'whitesmoke',
  },
  
});

// import React from 'react';
// import { createStackNavigator } from "@react-navigation/stack";
// import { NavigationContainer } from '@react-navigation/native';
// import DataContext from '../Context/Context';
// import { DataProvider } from '../Context/Context'; 
// import { View } from 'react-native';

// // Import screens here
// import LoginScreen from '../LoginScreen';
// import RegistrationScreen from '../RegistrationScreen';
// import Onboarding from '../Onboarding';
// import ForgotPassword from '../../components/ForgotPassword';
// import TopUp from '../TopUpScreen';
// import BuyEth from '../BuyEth';
// import Withdraw from '../Withdraw';
// import HomeScreen from '../Tabs/HomeScreen';
// import Tabs from '../Tabs/Tabs';
// import ProfileScreen from '../ProfileScreen';
// import CollectionDetailScreen from '../CollectionDetailScreen';
// import ArtDetailsScreen from '../ArtDetailsScreen';
// import EditProfile from '../EditProfile';


// const Stack = createStackNavigator();

// export default function AppNavigator() {
//     return (
//         <DataProvider>
//             <NavigationContainer>
//                 <Stack.Navigator initialRouteName='Onboarding'>
//                     <Stack.Screen
//                         name="Login"
//                         component={LoginScreen}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                     <Stack.Screen
//                         name="Registration"
//                         component={RegistrationScreen}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                     <Stack.Screen
//                         name="Onboarding"
//                         component={Onboarding}
//                         options={{ headerShown: false }}
//                     />
//                     <Stack.Screen
//                         name="ForgotPassword"
//                         component={ForgotPassword}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                      {/* <Stack.Screen
//                         name="TermsAndConditions"
//                         component={TermsAndConditions}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     /> */}
//                     <Stack.Screen
//                         name="HomeScreen"
//                         component={HomeScreen}
//                         options={{
//                             headerTitle: "h",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                             gestureEnabled: false ,
//                         }}
                        
//                     />
//                     <Stack.Screen
//                         name="TopUp"
//                         component={TopUp}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                     <Stack.Screen
//                         name="BuyEth"
//                         component={BuyEth}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                     <Stack.Screen
//                         name="Withdraw"
//                         component={Withdraw}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
                   
//                     <Stack.Screen
//                         name='Tabs'
//                         component={Tabs}
//                         options={{headerShown:false,
//                             gestureEnabled: false,
//                     }}
//                     />
//                     <Stack.Screen
//                         name="ProfileScreen"
//                         component={ProfileScreen}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                       <Stack.Screen
//                         name="CollectionDetailScreen"
//                         component={CollectionDetailScreen}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                         <Stack.Screen
//                         name="ArtDetailsScreen"
//                         component={ArtDetailsScreen}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
//                     <Stack.Screen
//                         name="EditProfile"
//                         component={EditProfile}
//                         options={{
//                             headerTitle: "",
//                             headerTransparent: true,
//                             headerBackground: () => (
//                                 <View style={{ backgroundColor: 'transparent', flex: 1 }} />
//                             ),
//                         }}
//                     />
                
//                 </Stack.Navigator>
//             </NavigationContainer>
//         </DataProvider>
//     );
// }



import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import * as LocalAuthentication from 'expo-local-authentication'; // Import Expo Local Authentication
import { View, Alert } from 'react-native';
import { DataProvider } from '../Context/Context';
import { useThemeColors } from '../Context/Theme/useThemeColors'; 

// Import screens here
import LoginScreen from '../LoginScreen';
import RegistrationScreen from '../RegistrationScreen';
import Onboarding from '../Onboarding';
import ForgotPassword from '../../components/ForgotPassword';
import TopUp from '../TopUpScreen';
import BuyEth from '../BuyEth';
import Withdraw from '../Withdraw';
import MainDrawer from './DrawerNavigator';
import CollectionDetailScreen from '../CollectionDetailScreen';
import ArtDetailsScreen from '../ArtDetailsScreen';
import EditProfile from '../EditProfile';
import ChangePassword from '../ChangePassword';
import UserProfile from '../ProfileScreen';
import ProfileScreen from '../ProfileScreen';
import SubmitOffer from '../SubmitOffer';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const colors = useThemeColors();
  const [initialRoute, setInitialRoute] = useState(null); // State to manage the initial route
  const [isBiometricSupported, setIsBiometricSupported] = useState(false); // State for biometric support

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboarded = await AsyncStorage.getItem('hasOnboarded');
        if (onboarded === 'true') {
          await handleBiometricAuth(); // If onboarded, trigger biometric auth
          setInitialRoute('MainDrawer'); // After successful auth, go to Home (Tabs)
        } else {
          setInitialRoute('Onboarding'); // If not onboarded, start at Onboarding
        }
      } catch (error) {
        console.error('Failed to load onboarding status:', error);
      }
    };

    checkOnboardingStatus(); // Check onboarding status when the app starts
  }, []);

  // Function to handle biometric authentication
  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Biometric authentication is not available on this device.');
        return;
      }

      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setIsBiometricSupported(supportedTypes.length > 0);

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('No biometric records found. Please enable it in your device settings.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use passcode', // Fallback in case biometric fails
      });

      if (!result.success) {
        Alert.alert('Authentication failed. Please try again.');
        setInitialRoute('Login'); // Fallback to login if biometric fails
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
    }
  };

  if (!initialRoute) {
    return null; // Render nothing until the initial route is determined
  }

  return (
    <DataProvider>
      <NavigationContainer >
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="Registration"
            component={RegistrationScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="MainDrawer"
            component={MainDrawer}
            options={{
              headerShown:false,
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          {/* <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerTitle: "h",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
              gestureEnabled: false,
            }}
          /> */}
          <Stack.Screen
            name="TopUp"
            component={TopUp}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="BuyEth"
            component={BuyEth}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="Withdraw"
            component={Withdraw}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          {/* <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          /> */}
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="CollectionDetailScreen"
            component={CollectionDetailScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="ArtDetailsScreen"
            component={ArtDetailsScreen}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="SubmitOffer"
            component={SubmitOffer}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              headerTitle: "",
              headerTransparent: true,
              headerBackground: () => (
                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
}


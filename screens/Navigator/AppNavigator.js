import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import DataContext from '../Context/Context';
import { DataProvider } from '../Context/Context'; 
import { View } from 'react-native';

// Import screens here
import LoginScreen from '../LoginScreen';
import RegistrationScreen from '../RegistrationScreen';
import Onboarding from '../Onboarding';
import ForgotPassword from '../../components/ForgotPassword';
import TopUp from '../TopUpScreen';
import BuyEth from '../BuyEth';
import Withdraw from '../Withdraw';
import HomeScreen from '../Tabs/HomeScreen';
import Tabs from '../Tabs/Tabs';
import ProfileScreen from '../ProfileScreen';
import CollectionDetailScreen from '../CollectionDetailScreen';
import ArtDetailsScreen from '../ArtDetailsScreen';
import EditProfile from '../EditProfile';


const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <DataProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Onboarding'>
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
                     {/* <Stack.Screen
                        name="TermsAndConditions"
                        component={TermsAndConditions}
                        options={{
                            headerTitle: "",
                            headerTransparent: true,
                            headerBackground: () => (
                                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
                            ),
                        }}
                    /> */}
                    <Stack.Screen
                        name="HomeScreen"
                        component={HomeScreen}
                        options={{
                            headerTitle: "h",
                            headerTransparent: true,
                            headerBackground: () => (
                                <View style={{ backgroundColor: 'transparent', flex: 1 }} />
                            ),
                            gestureEnabled: false ,
                        }}
                        
                    />
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
                   
                    <Stack.Screen
                        name='Tabs'
                        component={Tabs}
                        options={{headerShown:false,
                            gestureEnabled: false,
                    }}
                    />
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
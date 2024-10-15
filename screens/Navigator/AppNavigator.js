// AppNavigator.js
import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
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
import DrawerNavigator from './DrawerNavigator';
import CollectionDetailScreen from '../CollectionDetailScreen';
import ArtDetailsScreen from '../ArtDetailsScreen';
import EditProfile from '../EditProfile';
import ChangePassword from '../ChangePassword';
import UserProfile from '../ProfileScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <DataProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Onboarding'>
                    <Stack.Screen
                        name="Onboarding"
                        component={Onboarding}
                        options={{ headerShown: false }}
                    />
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
                        component={DrawerNavigator}
                        options={{ headerShown: false }}
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
                    name = "ChangePassword"
                    component={ChangePassword}
                    options={{
                        headerTitle:"",
                        headerTransparent:true,
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

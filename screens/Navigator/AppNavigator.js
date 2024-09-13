import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import DataContext from '../Context/Context'; // Adjust path if needed
import { DataProvider } from '../Context/Context'; // Import DataProvider
import { View } from 'react-native';

// Import screens here
import LoginScreen from '../LoginScreen';
import RegistrationScreen from '../RegistrationScreen';
import Onboarding from '../Onboarding';
import ForgotPassword from '../../components/ForgotPassword';
import TopUp from '../TopUpScreen';
import BuyEth from '../BuyEth';
import Withdraw from '../Withdraw';
import Account from '../../components/Account';
import Tabs from '../Tabs/Tabs';

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
                        options={{ headerTitle: "",
                            headerTransparent: true,
                            headerBackground: () => (
                            <View style={{ backgroundColor: 'transparent', flex: 1 }} />
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="Onboarding"
                        component={Onboarding}
                        options={{headerShown:false}}
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
                        name="Account"
                        component={Account}
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
                        options={{headerTitle:""}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </DataProvider>
    );
}   
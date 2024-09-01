import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import DataContext from '../Context/Context'; // Adjust path if needed
import { DataProvider } from '../Context/Context'; // Import DataProvider

// Import screens here
import LoginScreen from '../LoginScreen';
import RegistrationScreen from '../RegistrationScreen';
import Onboarding from '../Onboarding';
import ForgotPassword from '../../components/ForgotPassword';
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
                        
                    />
                    <Stack.Screen
                        name="Registration"
                        component={RegistrationScreen}
                    />
                    <Stack.Screen
                        name="Onboarding"
                        component={Onboarding}
                        options={{headerShown:false}}
                    />
                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPassword}
                    />
                    <Stack.Screen
                        name='Tabs'
                        component={Tabs}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </DataProvider>
    );
}   
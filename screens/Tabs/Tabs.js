import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import tabs here
import name_A from './Tab1';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
      <Tab.Navigator initialRouteName="name_A" 
        screenOptions={{
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          headerShown: false,
        }}
      >
        <Tab.Screen 
            name="name_A"
            component={name_A}
        />
        <Tab.Screen 
            name="name_B"
            component={name_A}
            
        />
        <Tab.Screen 
            name="Name_C"
            component={name_A}
        />
      </Tab.Navigator>
  )
} 
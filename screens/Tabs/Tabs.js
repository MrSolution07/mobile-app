import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import CustomTabIcon from './CustomTabIcon'; 
import name_A from './Tab1';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
      <Tab.Navigator
        initialRouteName="name_A"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'white',
          headerShown: false,
          tabBarStyle:styles.tabBarStyle,
          tabBarIcon: ({ focused }) => <CustomTabIcon focused={focused} name={getIconName(route.name)} />,
          tabBarBackground:() =>{
            <BlurView intensity={80}
            style={{...StyleSheet.absoluteFillObject,
              borderTopLeftRadius:20,
              borderTopRightRadius:20,
              overflow:"hidden",
              backgroundColor:"transparent"
            }}
            />
          }
        })}
      >
        <Tab.Screen
            name="name_A"
            component={name_A}
            options={{title:""}}
          />
          <Tab.Screen
            name="name_B"
            component={name_A}
            options={{title:""}}
          />
          <Tab.Screen
            name="name_C"
            component={name_A}
            options={{title:""}}
          />
          <Tab.Screen
            name="name_D"
            component={name_A}
            options={{title:""}}
          />
        
      </Tab.Navigator>
  );
}

const getIconName = (routeName) => {
  switch (routeName) {
    case 'name_A':
      return 'home'; 
    case 'name_B':
      return 'magnifying-glass';
      case 'name_C':
      return 'shopping-cart'; 
    case 'name_D':
      return 'wallet';
    default:
      return 'home';
  }
};

const styles = StyleSheet.create({
  
  tabBarStyle: {
    // height: 50,
    // borderRadius: 10,
    // backgroundColor: 'black',
    // opacity: 0.8,
    // elevation: 5,
    // alignSelf:'center',
    // bottom: 15,
    // width: '80%',
      height: 60,
      borderRadius: 10,
      backgroundColor: 'black',
      opacity: 0.9,
      elevation: 5,
      alignSelf: 'center',
      bottom: 15,
      width: '80%', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingBottom: 10,
      paddingTop: 10,
  },
});

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Tabs from '../Tabs/Tabs'; 
import ProfileScreen from '../ProfileScreen';
import SettingsScreen from '../SettingsScreen';
import UploadNFTScreen from '../Tabs/UserUpload';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      screenOptions={({ navigation }) => ({
        headerShown: false,
        // headerTitle:'',
        // drawerActiveTintColor: '#e91e63',
        // drawerLabelStyle: { marginLeft: -20, fontSize: 15 },
        // headerLeft: () => (
        //   <Ionicons
        //     name="menu-sharp"
        //     size={28}
        //     color="black"
        //     style={{ marginLeft: 15 }}
        //     onPress={() => navigation.toggleDrawer()}
        //   />
        // ),
      })}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={Tabs}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
{/* 
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="UploadNFT"
        component={UploadNFTScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="cloud-upload-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

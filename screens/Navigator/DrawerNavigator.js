// DrawerNavigator.js

import React from 'react';
import { 
    createDrawerNavigator, 
    DrawerContentScrollView, 
    DrawerItemList 
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { 
    StyleSheet, 
    View, 
    Text 
} from 'react-native';
import Tabs from '../Tabs/Tabs'; 
// import ProfileScreen from '../ProfileScreen';
import SettingsScreen from '../SettingsScreen';
import UploadNFTScreen from '../Tabs/UserUpload';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      // Define the custom drawer content within the same file
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false, // Hide the default header
        // Active item styling
        drawerActiveBackgroundColor: '#075eec', // Active item background color
        drawerActiveTintColor: '#ffffff', // Active item text color
        // Inactive item styling
        drawerInactiveTintColor: '#333333', // Inactive item text color
        // Label styling
        drawerLabelStyle: {
          marginLeft: -20, // Adjust label position
          fontSize: 16, // Label font size
        },
        // Drawer width and background
        drawerStyle: {
          backgroundColor: '#ffffff', // Drawer background color
          width: 240, // Drawer width
        },
      }}
    >
      {/* Home Tabs Screen */}
      <Drawer.Screen
        name="HomeTabs"
        component={Tabs}
        options={{
          drawerLabel: 'Home', // Label for the drawer item
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ), // Icon for the drawer item
        }}
      />
      {/* 
      Uncomment and customize the Profile screen if needed
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      /> */}
      {/* Settings Screen */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
      {/* Upload NFT Screen */}
      <Drawer.Screen
        name="UploadNFT"
        component={UploadNFTScreen}
        options={{
          drawerLabel: 'Upload NFT',
          drawerIcon: ({ color }) => (
            <Ionicons name="cloud-upload-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
            <View style={styles.header}>
                {/* <Text style={styles.headerText}>MetawaySA</Text> */}
            </View>

            <View style={styles.divider} />

            <DrawerItemList {...props} />

            <View style={{ flex: 1 }} />

            <View style={styles.footer}>
                <Text style={styles.footerText}>© 2024 MetawaySA</Text>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: '#ffffff', 
    },
    
    divider: {
        height: 1, 
        backgroundColor: '#e0e0e0', 
        marginVertical: 25, 
        marginHorizontal: 25, 
    },
    footer: {
        padding: 16,
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    footerText: {
        color: '#075eec', 
        fontSize: 12,
        textAlign:'center', 
    },
});

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
import { useThemeColors } from '../Context/Theme/useThemeColors';
import { Linking } from 'react-native';
import ViewGalleryPlaceholder from './ViewGallery';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const colors = useThemeColors();

  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false, 
        drawerActiveBackgroundColor: '#075eec', 
        drawerActiveTintColor: '#ffffff', 
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          marginLeft: -20, 
          fontSize: 16, 
        },
        drawerStyle: {
          backgroundColor:'#ffffff', 
          width: 240,
        },
      }}
    >
      {/* Home Tabs Screen */}
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

<Drawer.Screen
  name="ViewGallery"
  component={ViewGalleryPlaceholder}// No component is rendered
  options={{
    drawerLabel: 'VR Gallery',
    drawerIcon: ({ color }) => (
      <Ionicons name="image-outline" size={22} color={color} />
    ),
    // Use onPress to open the external link
    onPress: () => Linking.openURL('https://metaway-68b26.web.app/'),
  }}
  listeners={{
    drawerItemPress: e => {
      e.preventDefault(); // Prevent navigation action
      Linking.openURL('https://metaway-68b26.web.app/'); // Open the link
    },
  }}
/>
    </Drawer.Navigator>
  );
}

const CustomDrawerContent = (props) => {
  const colors = useThemeColors();

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={[styles.drawerContainer,{backgroundColor:colors.background, color: colors.text}]}>
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

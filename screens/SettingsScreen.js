import React, { useContext, useState } from 'react';
import {View,Text,StyleSheet,SafeAreaView,ScrollView,Alert,Switch} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import SettingsSection from '../components/SettingsSection';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useTheme } from '@react-navigation/native'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 


const SettingsScreen = () => {
  
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true); 
  const [isDefaultMode, setIsDefaultMode] = useState(false);

  const toggleDrawer = () => {
    navigation.toggleDrawer();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteDoc(doc(db, 'users', user.uid));
                await user.delete();
                navigation.navigate('Login');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); 
  };

  const handleProfile = () => {
    navigation.navigate('UserProfile'); 
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // Implement theme change 

  const handleAppearanceChange = (mode) => {
    if (mode === 'dark') {
      setIsDarkMode(true);
      setIsLightMode(false);
      setIsDefaultMode(false);
    } else if (mode === 'light') {
      setIsDarkMode(false);
      setIsLightMode(true);
      setIsDefaultMode(false);
    
    } else {
      setIsDarkMode(false);
      setIsLightMode(false);
      setIsDefaultMode(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.menuButton} onPress={toggleDrawer}>
        <Ionicons name="menu-sharp" size={28} color="#333" />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SettingsSection
          title="Account Settings"
          options={[
            {
              icon: 'person-outline',
              label: 'Profile',
              onPress: handleProfile,
            },
            {
              icon: 'create-outline',
              label: 'Edit Profile',
              onPress: handleEditProfile,
            },
            {
              icon: 'key-outline',
              label: 'Change Password',
              onPress: handleChangePassword,
            },
          ]}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Appearance Settings</Text>
          
          <View style={styles.optionContainer}>
            <Ionicons name="moon-outline" size={24} color="#333" style={styles.icon} />
            <Text style={styles.label}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={() => handleAppearanceChange('dark')}
            />
          </View>

          <View style={styles.optionContainer}>
            <Ionicons name="sunny-outline" size={24} color="#333" style={styles.icon} />
            <Text style={styles.label}>Light Mode</Text>
            <Switch
              value={isLightMode}
              onValueChange={() => handleAppearanceChange('light')}
            />
          </View>

          <View style={styles.optionContainer}>
            <Ionicons name="color-palette-outline" size={24} color="#333" style={styles.icon} />
            <Text style={styles.label}>Default Mode</Text>
            <Switch
              value={isDefaultMode}
              onValueChange={() => handleAppearanceChange('default')}
            />
          </View>
        </View>

        <SettingsSection
          title="Account Management"
          options={[
            {
              icon: 'log-out-outline',
              label: 'Logout',
              onPress: handleLogout,
            },
            {
              icon: 'trash-outline',
              label: 'Delete Account',
              onPress: handleDeleteAccount,
            },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  menuButton: {
    // position: 'absolute',
    marginTop: hp(4),
    left: 15,
    zIndex: 10,
  },
  scrollContainer: {
    paddingTop: 25, 
    paddingBottom: 20,
  },
  sectionContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color:'#075eec',
    marginBottom: 10,
  },
  
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default SettingsScreen;
import React, { useState } from 'react';
import {View,Text,StyleSheet,SafeAreaView,TextInput,TouchableOpacity,Alert,KeyboardAvoidingView,Platform,ActivityIndicator,Pressable} from 'react-native';
import { auth } from '../config/firebaseConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import { useThemeColors } from './Context/Theme/useThemeColors';
import Feather from '@expo/vector-icons/Feather';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ScrollView } from 'react-native';
import tw from 'twrnc';

const ChangePassword = ({ navigation }) => {
  const colors = useThemeColors();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showCurrentPassword,setShowCurrentPassword] = useState(true);
  const [error, setError] = useState('');

  const toggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      setLoading(true); // Start loading

      try {
        // Re-authenticate the user
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);

        Alert.alert('Success', 'Password updated successfully.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false); // Stop loading after completion
      }
    }
  };
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor:colors.background}]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
          <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' :'tap'} style={tw`flex-1`}>
            <View style={styles.container}>
              <Text style={[styles.title,{color: colors.text}]}>Change Password</Text>

              
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry={showCurrentPassword} 
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setError(''); 
                }}
                value={currentPassword}
                placeholderTextColor='slategray'
              />
              <Pressable onPress={toggleCurrentPassword} style={styles.eyeIcon}>
                {showCurrentPassword ? (
                  <Feather name="eye" size={20} color="black" />
                ) : (
                  <Feather name="eye-off" size={20} color="black" />
                )}
              </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={showNewPassword} 
                onChangeText={setNewPassword}
                value={newPassword}
                placeholderTextColor='slategray'
              />
              <Pressable onPress={toggleNewPassword} style={styles.eyeIcon}>
                {showNewPassword ? (
                  <Feather name="eye" size={20} color="black" />
                ) : (
                  <Feather name="eye-off" size={20} color="black" />
                )}
              </Pressable>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.tabbackground }]}
              onPress={handleChangePassword}
              disabled={loading}  
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>
            
            </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  container: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'left',
    marginTop: hp('10%'),

  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    color:'black', 
  },
  passwordContainer:{
    position: 'relative',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '30%'
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ChangePassword;

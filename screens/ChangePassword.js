import React, { useState } from 'react';
import {View,Text,StyleSheet,SafeAreaView,TextInput,TouchableOpacity,Alert} from 'react-native';
import { auth } from '../config/firebaseConfig';
import { updatePassword } from 'firebase/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import { useThemeColors } from './Context/Theme/useThemeColors';

const ChangePassword = ({ navigation }) => {
  const colors = useThemeColors();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      // Re-authenticate the user
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      try {
        await user.reauthenticateWithCredential(credential);
        await updatePassword(user, newPassword);
        Alert.alert('Success', 'Password updated successfully.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor:colors.background}]}>
      <View style={styles.container}>
        <Text style={[styles.title,{color: colors.text}]}>Change Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          onChangeText={setCurrentPassword}
          value={currentPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          onChangeText={setNewPassword}
          value={newPassword}
        />

        <TouchableOpacity style={[styles.button, {backgroundColor: colors.tabbackground}]} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    marginTop: hp('10%'),
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'left',
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
});

export default ChangePassword;

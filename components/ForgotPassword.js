import React, { useState } from 'react';
import { TextInput, View, Text, Pressable, StyleSheet, Alert,KeyboardAvoidingView,ScrollView,Platform } from 'react-native';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Import the required method from Firebase

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState(''); // State for email input

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    try {
      const auth = getAuth(); // Get Firebase Auth instance
      await sendPasswordResetEmail(auth, email); // Send reset password email
      Alert.alert('Success', 'Password reset email sent! Please check your inbox.');
      navigation.navigate('Login'); // Navigate to the Login screen after successful email
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, styles.Container]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <ScrollView keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' :'tap'} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>

          <View style={tw`flex-1 justify-center items-center`}>
            <View style={[tw`absolute w-full h-full p-6 mt-5`]}>
              <View style={tw`w-full`}>
                <Text style={[tw`text-3xl mb-6 mt-15`, styles.heading]}>
                  Recover your account
                </Text>
                <Text style={[tw`text-left font-medium mb-8`, styles.text]}>
                  Fill in your email below and we will send you a link to recover your password
                </Text>
                <TextInput
                  placeholder='Enter your email'
                  placeholderTextColor='gray'
                  value={email} // Bind email state to input
                  onChangeText={setEmail} // Update email state on input change
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[tw`rounded-md bg-white text-black h-12 w-full mb-5 p-3`, styles.textInput]}
                />
                <Pressable
                  style={[tw`w-full h-12 justify-center mb-2 rounded-lg`, styles.resetPasswordbtn]}
                  onPress={handleResetPassword} // Handle password reset on button press
                  android_ripple={{ color: 'lightgray' }}
                >
                  <Text style={[tw`text-white text-center text-lg font-medium`,styles.resetText]}>
                    Reset Password
                  </Text>
                </Pressable>

                <View style={tw`flex-row justify-center mt-5 gap-x-px`}>
                  <Text style={styles.formLink}>Don't have an account?{''}</Text>
                  <Pressable onPress={() => navigation.navigate('Registration')}>
                    <Text style={[tw`underline`, styles.signUptext]}>Sign Up</Text>
                  </Pressable>
                </View>

              </View>
            </View>
          </View>
       </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    backgroundColor: 'whitesmoke',
  },
  heading: {
    color: '#1D2A32',
    textAlign: 'left',
    fontFamily: 'Roboto_700Bold',
  },
  text: {
    fontFamily: 'Roboto_400Regular',
    color: '#1D2A32',
    textAlign: 'left',
  },
  textInput: {
    fontFamily: 'Roboto_400Regular',
  },
  resetPasswordbtn: {
    backgroundColor: '#075eec',
  },
  resetText: {
    fontFamily: 'Roboto_400Regular',
  },
  signUptext: {
    fontSize: 16,
    fontWeight: '500',
    color: '#075eec',
    fontFamily: 'Roboto_400Regular',
  },
  formLink: {
    fontSize: 16,
    fontWeight: '500',
    color: '#075eec',
    fontFamily: 'Roboto_400Regular',
  },
});

export default ForgotPassword;

import React from 'react';
import { TextInput, SafeAreaView, View, Text, Pressable, StatusBar, StyleSheet } from 'react-native';
import tw from 'twrnc';

const ForgotPassword = ({navigation}) => {
  return (
    <SafeAreaView style={[tw`flex-1`, styles.Container]}>
      <StatusBar barStyle="default" />
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
              style={[tw`rounded-md bg-white text-black h-12 w-full mb-5 p-3`, styles.textInput]}
            />
            <Pressable
              style={[tw`w-full h-12 justify-center mb-2 rounded-lg`, styles.resetPasswordbtn]}
              android_ripple={{ color: 'lightgray' }}
            >
              <Text style={[tw`text-white text-center text-lg font-medium`,styles.resetText]}>
                Reset Password
              </Text>
            </Pressable>

            <View style={tw`flex-row justify-center mt-5 gap-x-px`}>
            <Text style={styles.formLink}>Don't have an account?{''}
            </Text>
            <Pressable onPress={()=> navigation.navigate('Registration')}>
              <Text style={[tw`underline`, styles.signUptext]}>Sign Up</Text>
            </Pressable>
          </View>

          </View>
        </View>
      </View>
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
    fontFamily:'Roboto_700Bold',
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
  resetText:{
    fontFamily:'Roboto_400Regular',
  },

  signUptext: {
    fontSize: 16,
    fontWeight: '500',
    color: '#075eec',
    fontFamily:'Roboto_400Regular',
  },
  formLink: {
    fontSize: 16,
    fontWeight: '500',
    color: '#075eec',
    fontFamily:'Roboto_400Regular',
  },
});

export default ForgotPassword;

import React, { useState } from 'react';
import { TextInput, SafeAreaView, View, Text, Pressable, StatusBar, Image, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import tw from 'twrnc';
// import ForgotPassword from './components/ForgotPassword.jsx'

const LoginScreen = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={[tw`flex-1`]}>
      <StatusBar barStyle="light-content" />
      <Image 
        source={{ uri: 'https://i.pinimg.com/564x/fe/01/5d/fe015d82aec5279fe7b9abceb3ee813a.jpg' }}
        style={tw`absolute w-full h-full`}
        resizeMode='cover'
      />
      <BlurView
        style={tw`absolute inset-0`}
        intensity={100}  
        tint="light"
      />

      <View style={tw`flex-1 justify-center items-center p-8`}>
        <View style={[tw`w-full p-8`, styles.contentContainer]}>
          <Text style={[tw`text-3xl font-bold text-left mb-12`, styles.header]}>Sign in to your account</Text>

          <TextInput
            placeholder='Enter your username'
            placeholderTextColor='gray'
            style={[tw`rounded-md bg-white text-black h-12 w-full mb-5 p-3`, styles.textInput]}
          />

          <TextInput
            placeholder='Enter your password'
            placeholderTextColor='gray'
            secureTextEntry
            style={[tw`rounded-md bg-white text-black h-12 w-full mb-5 p-3`, styles.textInput]}
          />

          
          <View style={tw`flex-row justify-between items-center mb-5`}>
            <View style={tw`flex-row items-center`}>
              <CheckBox
                value={isChecked}
                onValueChange={setIsChecked}
                style={tw`mr-2 rounded-md border-black`} 
                tintColors={{ true: 'black', false: 'gray' }} 
              />
              <Text style={tw`text-black font-small`}>Remember Me</Text>
            </View>

            <Pressable>
            <Text style={tw`text-black underline`}>Forgot Password?</Text>
            </Pressable>
            
          </View>

          <Pressable style={[tw` w-full h-12 justify-center mb-2 rounded-lg`,styles.loginbtn]} android_ripple={{ color: 'lightgray' }}>
            <Text style={tw`text-white text-center text-lg font-medium`}>Login</Text>
          </Pressable>

          <Pressable style={tw`bg-gray-200 w-full h-12 flex-row justify-center items-center mb-2 rounded-lg`}>
            <FontAwesome name="google" size={20} color="black" style={tw`mr-3`} />
            <Text style={tw`text-black text-center`}>Login with Google</Text>
          </Pressable>

          <Pressable style={tw`bg-gray-200 w-full h-12 flex-row justify-center items-center rounded-lg`}>
            <FontAwesome name="facebook" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-black text-center`}>Login with Facebook</Text>
          </Pressable>

          <Text style={[tw`text-center mt-5`,styles.text]}>Don't have an account? {''} 
           <Pressable >
            <Text style={[tw`underline`,styles.text]}>Sign Up</Text>
          </Pressable> 
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'Roboto_400Regular',
  },
  header: {
    color: '#1D2A32',
  },
  contentContainer: {
    backgroundColor: 'rgba(245, 245, 245, 0.9)',  
    borderRadius: 8,
  },
  loginbtn:{
    backgroundColor: '#075eec',
  },
  text:{
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
  }
});

export default LoginScreen;

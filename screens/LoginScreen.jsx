import React, { useState } from 'react';
import { TextInput, SafeAreaView, View, Text, Pressable, StatusBar, Image, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import tw from 'twrnc';

const LoginScreen = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <StatusBar barStyle="light-content" />
      <View style={tw`flex-1 justify-center items-center`}>
        <Image 
          source={{ uri: 'https://i.pinimg.com/564x/fe/01/5d/fe015d82aec5279fe7b9abceb3ee813a.jpg' }}
          style={tw`absolute w-full h-full`}
          resizeMode='cover'
        />
        <BlurView
          style={tw`absolute inset-0`}
          intensity={60}
          tint="dark"
        />
        
        <View style={tw`absolute justify-center items-center bg-white bg-opacity-70 w-full h-full p-6`}>
          <Text style={tw`text-3xl font-bold text-white mb-12 tracking-widest text-right`}>Login to your account</Text>

          <TextInput
            placeholder='Username'
            placeholderTextColor='white'
            style={[tw`border-b border-gray-300 text-black h-12 w-full mb-5`, styles.textInput]}
          />

          <TextInput
            placeholder='Password'
            placeholderTextColor='white'
            secureTextEntry
            style={[
              tw`border-b border-gray-300 text-black h-12 w-full mb-5`,
              styles.textInput, 
            ]}
          />

          <View style={tw`flex-row items-center mb-5`}>
            <View style={tw`flex-row items-center`}>
              <CheckBox
                value={isChecked}
                onValueChange={setIsChecked}
                style={tw`mr-2 rounded-md border-black`} 
                tintColors={{ true: 'black', false: 'gray' }} 
              />
              <Text style={tw`text-black`}>Remember Me</Text>
            </View>
          </View>

          <Text style={tw`text-white mb-5`}>Forgot Password?</Text>

          <Pressable style={tw`bg-black w-full h-12 justify-center mb-2 rounded-lg`} onPress={() => console.log('Login with Google pressed')}  android_ripple={{ color: 'lightgray' }}
          >
            <Text style={tw`text-white text-center text-lg font-medium`}>Login</Text>
          </Pressable>

          <Pressable style={tw`bg-gray-200 w-full h-12 flex-row justify-center items-center mb-2 rounded-lg`}>
            <FontAwesome name="google" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-black`}>Login with Google</Text>
          </Pressable>

          <Pressable style={tw`bg-gray-200 w-full h-12 flex-row justify-center items-center rounded-lg`}>
            <FontAwesome name="facebook" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-black`}>Login with Facebook</Text>
          </Pressable>

          <Text style={tw`text-white text-right mt-5`}>Don't have an account? Sign Up</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'Roboto_400Regular',
  }
});

export default LoginScreen;

import React, { useState } from 'react';
import { TextInput, SafeAreaView, View, Text, Pressable, StatusBar, Image, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import tw from 'twrnc';
import Feather from '@expo/vector-icons/Feather';

const LoginScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={tw`flex-1`}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} horizontal showsHorizontalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" translucent />

      <Image
        source={{ uri: 'https://i.pinimg.com/originals/6b/f8/48/6bf848ae5afdb77782a1ff14067b194a.jpg' }}
        style={[tw`absolute w-full h-full`, styles.img]}
        resizeMode='cover'
      />

      <BlurView
        style={tw`absolute inset-0`}
        intensity={1}
        tint="dark"
      />

      <SafeAreaView style={tw`flex-1`}>
        <View style={styles.contentContainer}>
          <Text style={[tw`text-3xl font-bold text-left mb-12`, styles.header]}>Sign in to your account</Text>

          <TextInput
            placeholder='Enter your username'
            placeholderTextColor='gray'
            style={[tw`rounded-md bg-white text-black h-12 w-full mb-5 p-3`, styles.textInput]}
          />

          <View style={tw`relative w-full mb-5`}>
            <TextInput
              placeholder='Enter your password'
              placeholderTextColor='gray'
              secureTextEntry={showPassword}
              autoCorrect={false}
              value={password}
              autoCapitalize="none"
              onChangeText={(text) => setPassword(text)}
              style={[tw`rounded-md bg-white text-black h-12 p-3`, styles.textInput]}
            />
            <Pressable
              onPress={togglePassword}
              style={tw`absolute right-3 top-2/6 transform -translate-y-1/2 `}
            >
              {showPassword ? (
                <Feather name="eye" size={20} color="black" />
              ) : (
                <Feather name="eye-off" size={20} color="black" />
              )}
            </Pressable>
          </View>

          <View style={tw`flex-row justify-between items-center mb-5`}>
            <View style={tw`flex-row items-center ml-1`}>
              <CheckBox
                value={isChecked}
                onValueChange={setIsChecked}
                style={tw`mr-2 rounded-md border-black`}
                tintColors={{ true: 'black', false: 'gray' }}
              />
              <Text style={tw`text-black`}>Remember Me</Text>
            </View>

            <Pressable style={tw`ml-10`}>
              <Text style={tw`text-black underline`}>Forgot Password?</Text>
            </Pressable>
          </View>


          <Pressable style={[tw`w-full h-12 justify-center mb-2 rounded-lg`, styles.loginBtn]} android_ripple={{ color: 'lightgray' }}>
            <Text style={tw`text-white text-center text-lg font-medium`}>Login</Text>
          </Pressable>

          <Pressable style={tw`bg-indigo-50 w-full h-12 flex-row justify-center items-center mb-2 rounded-lg`}>
            <FontAwesome name="google" size={20} color="black" style={tw`mr-3`} />
            <Text style={tw`text-black text-center`}>Login with Google</Text>
          </Pressable>

          <Pressable style={tw`bg-indigo-50 w-full h-12 flex-row justify-center items-center rounded-lg`}>
            <FontAwesome name="facebook" size={20} color="black" style={tw`mr-2`} />
            <Text style={tw`text-black text-center`}>Login with Facebook</Text>
          </Pressable>

          <View style={tw`flex-row justify-center mt-5`}>
            <Text style={styles.text}>Don't have an account?{''}
            </Text>
            <Pressable>
              <Text style={[tw`underline`, styles.text]}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
        
      </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'Roboto_400Regular',
  },
  header: {
    color: '#333',
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  loginBtn: {
    backgroundColor: '#075eec',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
  },
  img: {
    // ...StyleSheet.absoluteFillObject,
  },
});

export default LoginScreen;

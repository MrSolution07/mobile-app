import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, View, Image, Text, TextInput, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard,ActivityIndicator } from 'react-native';
import CheckBox from 'expo-checkbox';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import DataContext from '../screens/Context/Context'; 
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { signInWithCredential, GoogleAuthProvider, getAuth, signInWithEmailAndPassword, FacebookAuthProvider } from 'firebase/auth';

const webClientId = '817642667283-nvi3u2762gr41sk47ij9soluus1utlpd.apps.googleusercontent.com'
const iosClientId = '348282660108-5m00pvh46a3vrp973l0sce7q9m6nolke.apps.googleusercontent.com'
const androidClientId = '348282660108-abudgte82ncrt748dbpnod8er6re1gi9.apps.googleusercontent.com'

// 817642667283-nvi3u2762gr41sk47ij9soluus1utlpd.apps.googleusercontent.com
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const {
    isChecked, setIsChecked,
    password, setPassword,
    showPassword, setShowPassword,
    email, setEmail
  } = useContext(DataContext);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const config = {
    webClientId, 
    iosClientId,
    androidClientId
  };

  const [isLogggingIn, setIsLoggingIn] = useState(false);
  
  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const handleToken = async () => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const token = authentication?.accessToken;

      if (token) {
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(null, token);

        try {
          const result = await signInWithCredential(auth, credential);
          const user = result.user;
          console.log('User signed in:', user);
          navigation.navigate('Tabs'); // Navigate to main app screen
        } catch (error) {
          // console.error('Error signing in:', error);
          // Alert.alert('Sign-In Error', error.message);
          Alert.alert('Sign-In Error');
        }
      }
    }
  };

  useEffect(() => {
    handleToken();
  }, [response]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      navigation.navigate('MainDrawer');
    } catch (error) {
      // Alert.alert('Login Error', error.message); 
      Alert.alert('Invalid Credentials');
    }finally{
      setIsLoggingIn(false);
    }
  };

  const [facebookRequest, facebookResponse, promptFacebookLogin] = Facebook.useAuthRequest({
    clientId: '568695575728130',
  });

  const handleFacebookToken = async () => {
    if (facebookResponse?.type === 'success') {
      const { authentication } = facebookResponse;
      const token = authentication?.accessToken;

      if (token) {
        const auth = getAuth();
        const credential = FacebookAuthProvider.credential(token);

        try {
          const result = await signInWithCredential(auth, credential);
          const user = result.user;
          console.log('User signed in with Facebook:', user);
          navigation.navigate('Tabs');
        } catch (error) {
          Alert.alert('Sign-In Error');
        }
      }
    }
  };

  useEffect(() => {
    handleFacebookToken();
  }, [facebookResponse]); 


  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image
            source={{ uri: 'https://i.pinimg.com/originals/6b/f8/48/6bf848ae5afdb77782a1ff14067b194a.jpg' }}
            style={styles.backgroundImage}
            resizeMode='cover'
          />
          <BlurView
            style={StyleSheet.absoluteFillObject}
            intensity={1}
            tint="dark"
          />

          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formContainer}>
                <Text style={styles.header}>
                  Sign in to your account
                </Text>
                <TextInput
                  placeholder='Enter your email'
                  placeholderTextColor='gray'
                  onChangeText={setEmail}
                  style={styles.textInput}
                  value={email}
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder='Enter your password'
                    placeholderTextColor='gray'
                    secureTextEntry={showPassword}
                    autoCorrect={false}
                    // value={password}
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    style={styles.textInput}

                  />
                  <Pressable
                    onPress={togglePassword}
                    style={styles.eyeIcon}
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

                  <Pressable style={tw`ml-10`} onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={tw`text-[#075eec] underline `}>Forgot Password?</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.loginButton}
                  android_ripple={{ color: 'lightgray' }}
                  onPress={handleLogin}
                  disabled = {isLogggingIn}
                >
                  {isLogggingIn ? 
                  ( 
                  <Text style={styles.loginButtonText}>Logging in...</Text> ) : ( 
                  <Text style={styles.loginButtonText}>Login</Text>
                  )}
                </Pressable>

                {/* <Pressable 
                  style={styles.socialButton}
                  onPress={() => promptAsync()}
                  disabled={!request}
                >
                  <FontAwesome name="google" size={20} color="black" style={tw`right-3`} />
                  <Text style={styles.socialButtonText}>Login with Google</Text>
                </Pressable> */}

                {/* <Pressable style={styles.socialButton} >
                  <FontAwesome5 name="phone-alt" size={20} color="black" style={tw`right-3`} />
                  <Text style={styles.socialButtonText}>Login with Number</Text>
                </Pressable> */}

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account?{' '}</Text>
                  <Pressable onPress={() => navigation.navigate('Registration')}>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject
  },
  keyboardAvoidingView: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    // borderRadius: 8
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 18
  },
  textInput: {
    height: 48,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C9D3DB'
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 16
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: '30%'
  },
  loginButton: {
    backgroundColor: '#075eec',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center'
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    // marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#333',
    fontFamily:'Roboto_400Regular',
  },
  signUpLink: {
    fontSize: 16,
    color: '#075eec',
    fontFamily:'Roboto_400Regular',
    textDecorationLine: 'underline'
  }
});

export default LoginScreen;

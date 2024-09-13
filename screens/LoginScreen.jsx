import React, { useContext } from 'react';
import { SafeAreaView, View, Image, Text, TextInput, Pressable, StatusBar, StyleSheet, ScrollView } from 'react-native';
import CheckBox from 'expo-checkbox';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import DataContext from '../screens/Context/Context'; 

const LoginScreen = ({ navigation }) => {
  const {
    isChecked, setIsChecked,
    password, setPassword,
    showPassword, setShowPassword
  } = useContext(DataContext);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" translucent />
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
              placeholder='Enter your username'
              placeholderTextColor='gray'
              style={styles.textInput}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder='Enter your password'
                placeholderTextColor='gray'
                secureTextEntry={showPassword}
                autoCorrect={false}
                value={password}
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
                    <Text style={tw`text-[#075eec] underline`}>Forgot Password?</Text>
                  </Pressable>
                </View>

            <Pressable
              style={styles.loginButton}
              android_ripple={{ color: 'lightgray' }}
              onPress={() => navigation.navigate('Tabs')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Pressable style={styles.socialButton}>
            <FontAwesome name="google" size={20} color="black" style={tw`right-3`} />
            <Text style={styles.socialButtonText}>Login with Google</Text>
            </Pressable>

            <Pressable style={styles.socialButton}>
              <FontAwesome name="facebook" size={20} color="black" style={tw`right-3`}/>
              <Text style={styles.socialButtonText}>Login with Facebook</Text>
            </Pressable>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account?{' '}</Text>
              <Pressable onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
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
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1
  },
  formContainer: {
    flex: 1,
    justifyContent:'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 8
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    columnGap: 20,
    marginBottom: 16,
  },
  checkBox: {
  },
  rememberMeText: {
    fontSize: 16,
    textAlign:'left',
    color: '#333'
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#075eec',
    textDecorationLine: 'underline'
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
  socialIcon: {
    marginRight: 8
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  signUpText: {
    fontSize: 16,
    color: '#333'
  },
  signUpLink: {
    fontSize: 16,
    color: '#075eec',
    textDecorationLine: 'underline'
  }
});

export default LoginScreen;

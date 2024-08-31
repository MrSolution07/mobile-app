import React, { useContext,useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, Pressable, StatusBar } from 'react-native';
import CheckBox from 'expo-checkbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import Feather from '@expo/vector-icons/Feather';
import DataContext from './Context/Context'; // Import the context

export default function RegistrationScreen({navigation}) {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    phoneNo, setPhoneNo,
    isChecked, setIsChecked,
    showPassword, setShowPassword
  } = useContext(DataContext); 

  const [surname, setSurname] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(true); 

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <SafeAreaView style={[tw`flex-1`, styles.safeArea]}>
      <StatusBar barStyle="dark-content" translucent />
      <Image
        source={{ uri: 'https://i.pinimg.com/originals/6b/f8/48/6bf848ae5afdb77782a1ff14067b194a.jpg' }}
        style={tw`absolute w-full h-full`}
        resizeMode='cover'
      />
      <BlurView
        style={tw`absolute inset-0`}
        intensity={1}
        tint="dark"
      />
      <View style={styles.container}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Sign up to </Text>
              <Text style={styles.companyName}>MajorInvest</Text>
            </View>
            <Text style={styles.subtitle}>Create a new account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={name} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Surname</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={setSurname}
                placeholder="Your Surname"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={surname} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Your Email"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={email} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Cell Number</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="phone-pad"
                onChangeText={setPhoneNo}
                placeholder="Your Cell Number"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={phoneNo} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={tw`relative`}>
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={setPassword}
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  secureTextEntry={showPassword}
                  value={password} />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={tw`absolute right-3 top-2/6 transform -translate-y-1/2`}
                >
                  {showPassword ? (
                    <Feather name="eye" size={20} color="black" />
                  ) : (
                    <Feather name="eye-off" size={20} color="black" />
                  )}
                </Pressable>
              </View>
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={tw`relative`}>
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={setConfirmPassword}
                  placeholder="********"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  secureTextEntry={showConfirmPassword}
                  value={confirmPassword} />
                <Pressable
                  onPress={toggleConfirmPassword}
                  style={tw`absolute right-3 top-2/6 transform -translate-y-1/2`}
                >
                  {showConfirmPassword ? (
                    <Feather name="eye" size={20} color="black" />
                  ) : (
                    <Feather name="eye-off" size={20} color="black" />
                  )}
                </Pressable>
              </View>
            </View>

            <View style={tw`flex-row items-center ml-1 mb-5`}>
              <CheckBox
                value={isChecked}
                onValueChange={setIsChecked}
                style={tw`mr-2 rounded-md border-black`}
                tintColors={{ true: 'black', false: 'gray' }}
              />
              <Text style={styles.checktext}>I have read the <Text style={styles.terms}>Terms and Conditions </Text></Text>
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                  // Handle sign up logic here
                }}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-row justify-center mt-5`}>
              <Text style={styles.formLink}>Already have an account? {''}</Text>
              <Pressable
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[styles.formLink, tw`underline`]}>Sign in</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'relative',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(245, 245, 245, 0.85)',
    borderRadius: 8,
    ...StyleSheet.absoluteFillObject
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1D2A32',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  companyName: {
    fontSize: 26,
    marginBottom: 0,
    color: '#075eec',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  header: {
    marginVertical: 60,
  },
  form: {},
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
});
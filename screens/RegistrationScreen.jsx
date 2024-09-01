import React, { useContext, useState } from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity, TextInput, Pressable, StatusBar, StyleSheet, ScrollView} from 'react-native';
import CheckBox from 'expo-checkbox';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import Feather from '@expo/vector-icons/Feather';
import DataContext from './Context/Context';

export default function RegistrationScreen({ navigation }) {
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
    <SafeAreaView style={tw`flex-1 bg-transparent`}>
      <StatusBar barStyle="dark-content" translucent />
      <View style={tw`flex-1`}>
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
        <ScrollView
          contentContainerStyle={tw`flex-grow`}
          style={{ flex: 1, maxHeight: '100vh' }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`flex-1 p-6 bg-[rgba(245,245,245,0.85)]`}>
            <View style={tw`mb-10 mt-10`}>
              <View style={tw`flex-row items-center justify-center mb-2`}>
                <Text style={tw`text-2xl font-bold text-[#1D2A32]`}>Sign up to </Text>
                <Text style={tw`text-2xl mb-0 text-[#075eec]`}>MetawaySA</Text>
              </View>
              <Text style={tw`text-center text-base font-medium text-[#929292]`}>Create a new account</Text>
            </View>

            <View>
              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold text-[#222] mb-2 text-center`}>Name</Text>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={setName}
                  placeholder="Your Name"
                  placeholderTextColor="#6b7280"
                  style={tw`h-12 bg-white px-4 rounded-lg text-base font-medium text-[#222] border border-[#C9D3DB]`}
                  value={name}
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold text-[#222] mb-2 text-center`}>Surname</Text>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={setSurname}
                  placeholder="Your Surname"
                  placeholderTextColor="#6b7280"
                  style={tw`h-12 bg-white px-4 rounded-lg text-base font-medium text-[#222] border border-[#C9D3DB]`}
                  value={surname}
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold text-[#222] mb-2 text-center`}>Email Address</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="Your Email"
                  placeholderTextColor="#6b7280"
                  style={tw`h-12 bg-white px-4 rounded-lg text-base font-medium text-[#222] border border-[#C9D3DB]`}
                  value={email}
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold text-[#222] mb-2 text-center`}>Cell Number</Text>
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="phone-pad"
                  onChangeText={setPhoneNo}
                  placeholder="Your Cell Number"
                  placeholderTextColor="#6b7280"
                  style={tw`h-12 bg-white px-4 rounded-lg text-base font-medium text-[#222] border border-[#C9D3DB]`}
                  value={phoneNo}
                />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold text-[#222] mb-2 text-center`}>Password</Text>
                <View style={tw`relative`}>
                  <TextInput
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onChangeText={setPassword}
                    placeholder="********"
                    placeholderTextColor="#6b7280"
                    style={tw`h-12 bg-white px-4 rounded-lg text-base font-medium text-[#222] border border-[#C9D3DB]`}
                    secureTextEntry={showPassword}
                    value={password}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={tw`absolute right-3 top-3`}
                  >
                    {showPassword ? (
                      <Feather name="eye" size={20} color="black" />
                    ) : (
                      <Feather name="eye-off" size={20} color="black" />
                    )}
                  </Pressable>
                </View>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-semibold text-[#222] mb-2 text-center`}>Confirm Password</Text>
                <View style={tw`relative`}>
                  <TextInput
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onChangeText={setConfirmPassword}
                    placeholder="********"
                    placeholderTextColor="#6b7280"
                    style={tw`h-12 bg-white px-4 rounded-lg text-base font-medium text-[#222] border border-[#C9D3DB]`}
                    secureTextEntry={showConfirmPassword}
                    value={confirmPassword}
                  />
                  <Pressable
                    onPress={toggleConfirmPassword}
                    style={tw`absolute right-3 top-3`}
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
                <Text style={tw`text-sm text-gray-600`}>I have read the <Text style={tw`text-[#075eec]`}>Terms and Conditions </Text></Text>
              </View>

              <View style={tw`mt-1 mb-4`}>
                <TouchableOpacity
                  onPress={() => {
                    // Handle sign up logic here
                  }}>
                  <View style={tw`flex-row items-center justify-center rounded-lg py-3 px-6 bg-[#075eec] border border-[#075eec]`}>
                    <Text style={tw`text-white text-lg font-semibold`}>Sign Up</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={tw`flex-row justify-center mt-5`}>
                <Text style={tw`text-lg font-semibold text-[#075eec]`}>Already have an account? </Text>
                <Pressable
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={tw`text-lg font-semibold underline text-[#075eec]`}>Sign in</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
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
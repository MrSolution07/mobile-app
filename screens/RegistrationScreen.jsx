import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Image, Text, TouchableOpacity, TextInput,Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

export default function RegistrationScreen() {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    cellNumber: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <SafeAreaView style={[tw`flex-1`, styles.safeArea]}>
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
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              resizeMode="contain"
              style={styles.headerImg}
              source={{ uri: 'logo.png' }} />
            <Text style={styles.title}>
              Sign up to <Text style={{ color: '#075eec' }}>MajorInvest</Text>
            </Text>
            <Text style={styles.subtitle}>Create a new account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={name => setForm({ ...form, name })}
                placeholder="Your Name"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.name} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Surname</Text>
              <TextInput
                autoCapitalize="words"
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={surname => setForm({ ...form, surname })}
                placeholder="Your Surname"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.surname} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="Your Email"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Cell Number</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="phone-pad"
                onChangeText={cellNumber => setForm({ ...form, cellNumber })}
                placeholder="Your Cell Number"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.cellNumber} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.confirmPassword} />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                }}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLink}>
              Already have an account? {''}
              <Pressable>
                <Text style={styles.signInText}>Sign in</Text>
              </Pressable>
            </Text>

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
    margin: 24,
    padding: 24,
    backgroundColor: 'rgba(245, 245, 245, 0.9)', // Reduced opacity
    borderRadius: 8,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  form: {
    marginBottom: 24,
    flexGrow: 1,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  signInText: {
    textDecorationLine: 'underline',
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
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});

import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Pressable } from 'react-native';
import DataContext from './Context/Context'; 
import tw from 'twrnc';

const TopUpScreen = () => {

  const {
    amount, setAmount,
    referenceNumber, setReferenceNumber
  } = useContext(DataContext);

  
  const generateReferenceNumber = () => {
    const refNumber = '#53332';  //dummy reference number
    setReferenceNumber(refNumber);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top-Up Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount to Top-Up"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <View style={tw`justify-center items-center`}>
      <Pressable onPress={generateReferenceNumber} style={tw`rounded bg-[#075eec] w-2/3 h-8 justify-center`}>
        <Text numberOfLines={2} style={tw`font-medium text-center text-white`}>Generate Reference Number</Text>
      </Pressable>
      </View> 
      {referenceNumber ? (
        <View style={styles.instructions}>
          <TextInput
          placeholder='Bank Name'
          style={styles.input} 
          />
          <TextInput
          placeholder='Account Number'
          style={styles.input} 

          />
          <TextInput
          placeholder='Account Holder'
          style={styles.input} 

          />
          <Text>Reference Number: {referenceNumber}</Text>
        </View>
      ) : null}
      <View style={tw`m-3`}></View>
      <View style={tw`justify-center items-center`}>
      <Pressable onPress={() => alert('Top-Up Confirmed')} style={tw`rounded bg-[#075eec] w-1/2 h-8 justify-center`}>
        <Text style={tw`font-medium text-white text-center`}>Confirm Top-Up </Text>
      </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:'30%',
    // justifyItems:'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    bottom: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  instructions: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TopUpScreen;

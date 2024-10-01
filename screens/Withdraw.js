import React, { useState,useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Alert,Pressable } from 'react-native';
import DataContext from './Context/Context';
import tw from 'twrnc';

const Withdraw = () => {
  const{
    withdrawAmount, setWithdrawAmount,
  } = useContext(DataContext);

  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Funds</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount to Withdraw"
        keyboardType="numeric"
        value={withdrawAmount}
        onChangeText={setWithdrawAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Account Number"
        value={accountNumber}
        onChangeText={setAccountNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Account Holder"
        value={accountHolder}
        onChangeText={setAccountHolder}
      />
      <View style={tw`justify-center items-center`}>
      <Pressable onPress={() => alert("Withdrawal Confirmed!")} style={tw`rounded bg-[#075eec] w-1/2 h-8 justify-center`}>
      <Text style={tw`font-medium text-white text-center`}>Confirm Withdrawal</Text>  
      </Pressable>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: '30%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  confirmation: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default Withdraw;

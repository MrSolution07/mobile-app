import React, { useState,useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Pressable } from 'react-native';
import DataContext from './Context/Context';
import tw from 'twrnc';

const BuyETHPage = () => {
  const {
    ethAmount, setEthAmount,
    zarAmount, setZarAmount,
  } = useContext(DataContext);


  const convertToZAR = () => {
    // Example conversion rate 
    const conversionRate = 200; 
    const totalCost = ethAmount * conversionRate;
    setZarAmount(totalCost.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy ETH</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount of ETH to Buy"
        keyboardType="numeric"
        value={ethAmount}
        onChangeText={setEthAmount}
      />
      <View style={tw`justify-center items-center`}>
      <Pressable onPress={convertToZAR} style={tw`justify-center w-1/2 h-8 bg-[#075eec] rounded`}>
        <Text style={tw`text-white text-center font-medium`}>Convert to ZAR</Text>
      </Pressable>
      </View>
      {zarAmount ? (
        <View style={styles.summary}>
          <Text style={styles.subtitle}>Transaction Summary</Text>
          <Text>ETH Amount: {ethAmount} ETH</Text>
          <Text>Conversion Rate: 1 ETH = 200 ZAR</Text>
          <Text>Total Cost: {zarAmount} ZAR</Text>
        </View>
      ) : null}
        
        <View style={tw`m-3`}></View>
        <View style={tw`justify-center items-center`}>
      <Pressable onPress={() => alert('Purchase Confirmed')} style={tw`rounded bg-[#075eec] w-1/2 h-8 justify-center`}> 
        <Text style={tw`font-medium text-center text-white`}>Confirm Purchase</Text>  
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
    // justifyContent: 'center',
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
  summary: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BuyETHPage;

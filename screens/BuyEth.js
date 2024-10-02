import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import DataContext from './Context/Context';
import axios from 'axios';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const BuyETHPage = () => {
  const {
    ethAmount, setEthAmount,
    zarAmount, setZarAmount,
    amount, setAmount
  } = useContext(DataContext);
  
  const [conversionRate, setConversionRate] = useState(null);
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  // Fetch the conversion rate when the component mounts
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=zar');
        setConversionRate(response.data.ethereum.zar);
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
        setMessage('Unable to fetch the conversion rate.');
      }
    };
    fetchConversionRate();
  }, []);

  const convertToZAR = () => {
    if (conversionRate && ethAmount) {
      const totalCost = parseFloat(ethAmount) * conversionRate;
      setZarAmount(totalCost.toFixed(2));
      setMessage('');
    } else {
      setMessage('Unable to convert to ZAR.');
    }
  };

  const handleConfirmPurchase = () => {
    const transactionFee = 0.02; // 2 cents
    if (!conversionRate || !ethAmount) {
      setMessage('Please enter the amount of ETH to buy and convert to ZAR.');
      return;
    }

    const totalCost = parseFloat(ethAmount) * conversionRate + transactionFee;

    if (totalCost > amount) {
      setMessage('Insufficient funds to purchase ETH.');
      return;
    }

    setAmount((prevAmount) => (parseFloat(prevAmount) - totalCost).toFixed(2));
    setEthAmount('');
    setZarAmount('');

    Alert.alert('Success', `You have successfully purchased ${ethAmount} ETH!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
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
        <Pressable onPress={convertToZAR} style={styles.button}>
          <Text style={styles.buttonText}>Convert to ZAR</Text>
        </Pressable>
      </View>
      {zarAmount ? (
        <View style={styles.summary}>
          <Text style={styles.subtitle}>Transaction Summary</Text>
          <Text>ETH Amount: {ethAmount} ETH</Text>
          <Text>Conversion Rate: 1 ETH = {conversionRate} ZAR</Text>
          <Text>Total Cost: {zarAmount} ZAR</Text>
        </View>
      ) : null}
      {message ? (
        <Text style={styles.errorMessage}>{message}</Text>
      ) : null}
      <View style={tw`m-3`}></View>
      <View style={tw`justify-center items-center`}>
        <Pressable onPress={handleConfirmPurchase} style={styles.button}>
          <Text style={styles.buttonText}>Confirm Purchase</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: '10%',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  summary: {
    marginVertical: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#075eec',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BuyETHPage;

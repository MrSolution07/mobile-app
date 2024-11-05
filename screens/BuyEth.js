import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import {EXPO_PUBLIC_ETHERSCAN_API_KEY} from '@env';
import { arrayUnion } from 'firebase/firestore';
import {useThemeColors} from './Context/Theme/useThemeColors';

const BuyETHPage = () => {
  const colors = useThemeColors();
  const [ethAmount, setEthAmount] = useState(0);
  const [zarAmount, setZarAmount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userEthAmount, setUserEthAmount] = useState(0);
  const [ethStats, setEthStats] = useState(null);
  const [gasFee, setGasFee] = useState(0);
  const [message, setMessage] = useState('');
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [loadingEthStats, setLoadingEthStats] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  const navigation = useNavigation();

  const ETHERSCAN_API_KEY = EXPO_PUBLIC_ETHERSCAN_API_KEY;
  const GAS_LIMIT = 21000;

  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserBalance(userData.balanceInZar);
          setUserEthAmount(userData.ethAmount);
        } else {
          throw new Error('User not found');
        }
      } else {
        throw new Error('User is not authenticated');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data.');
    } finally {
      setLoadingUserData(false);
    }
  };

  const fetchETHStats = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=zar&include_24hr_high=true&include_24hr_low=true&include_24hr_vol=true');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEthStats({
        price: data.ethereum.zar,
        high: data.ethereum.zar_24h_high,
        low: data.ethereum.zar_24h_low,
        volume: data.ethereum.zar_24h_vol,
      });
    } catch (error) {
      console.error('Error fetching ETH stats:', error);
      setMessage(`Unable to fetch ETH stats. Error: ${error.message}`);
    } finally {
      setLoadingEthStats(false);
    }
  };

  useEffect(() => {
    fetchETHStats();
    fetchUserData();
  }, []);

  const fetchGasFee = async () => {
    if (!ethStats || !ethStats.price) return;

    try {
      const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
      const data = await response.json();

      if (data.status === '1') {
        const gasPriceInGwei = parseFloat(data.result.ProposeGasPrice);
        const gasPriceInEth = gasPriceInGwei * 1e-9;
        const gasFeeInEth = gasPriceInEth * GAS_LIMIT;
        const gasFeeInZar = gasFeeInEth * ethStats.price;

        setGasFee(gasFeeInZar.toFixed(2));
      } else {
        throw new Error('Failed to fetch gas fees');
      }
    } catch (error) {
      console.error('Error fetching gas fee:', error.message);
      setMessage(`Unable to fetch gas fees. Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (ethStats) {
      fetchGasFee();
    }
  }, [ethStats]);

  const handleETHAmountChange = (ethInput) => {
    const parsedInput = parseFloat(ethInput);
    if (isNaN(parsedInput)) {
      setEthAmount('');
      setZarAmount('');
      return;
    }

    setEthAmount(ethInput);

    if (ethStats && ethStats.price) {
      const totalZar = (parsedInput * ethStats.price).toFixed(2);
      setZarAmount(totalZar);
    } else {
      setZarAmount('');
    }
  };

  const handleConfirmPurchase = async () => {
    setIsConfirming(true);
    setMessage('');
  
    if (!ethStats || !ethAmount || !gasFee) {
      setMessage('Please complete all fields.');
      setIsConfirming(false);
      return;
    }
  
    const transactionFee = 0.02;
    const totalCost = parseFloat(ethAmount) * ethStats.price + parseFloat(gasFee) + transactionFee;
  
    if (totalCost > userBalance) {
      setMessage('Insufficient funds to purchase ETH.');
      setIsConfirming(false);
      return;
    }
  
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, 'users', userId);
  
        const newEthAmount = (parseFloat(userEthAmount) + parseFloat(ethAmount)).toFixed(8);
        const newZarBalance = (userBalance - totalCost).toFixed(2);
  
        // Log the transaction
        const transactionLog = {
          ethAmount: parseFloat(ethAmount),
          totalCostInZar: totalCost.toFixed(2),
          gasFeeInZar: gasFee,
          date: new Date().toISOString().split('T')[0],
        };
  
        await updateDoc(userDocRef, {
          ethAmount: newEthAmount,
          balanceInZar: newZarBalance,
          BuyETH: arrayUnion(transactionLog), // Append the transaction to the BuyETH field
        });
  
        setUserBalance(newZarBalance);
        setUserEthAmount(newEthAmount);
  
        Alert.alert('Success', `You have successfully purchased ${ethAmount} ETH!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      setMessage('Failed to complete the purchase.');
    } finally {
      setIsConfirming(false);
    }
  
    setEthAmount('');
    setZarAmount('');
  };

  if (loadingUserData || loadingEthStats) {
    return (
      <View style={[styles.loadingContainer,{backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color="#075eec" />
        <Text style={[styles.loadingText, {color: colors.text}]}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={[styles.container,{backgroundColor: colors.background}]}>
        <ScrollView  contentContainerStyle={tw`flex-grow`}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled">
          <Text style={[styles.title,{color: colors.text}]}>Buy ETH</Text>

      {/* ETH Stats Section */}
      <View style={styles.ethStats}>
        <Text style={styles.subtitle}>ETH Rates</Text>
        {ethStats ? (
          <View style={styles.statsBox}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Current Price:</Text>
              <Text style={styles.statValue}>{ethStats.price} ZAR</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>24h High:</Text>
              <Text style={styles.statValue}>{ethStats.high} ZAR</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>24h Low:</Text>
              <Text style={styles.statValue}>{ethStats.low} ZAR</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Gas Fee:</Text>
              <Text style={styles.statValue}>{gasFee ? `${gasFee} ZAR` : 'Calculating...'}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorMessage}>Fetching ETH stats...</Text>
        )}
      </View>


      <TextInput
        style={styles.input}
        placeholder="Amount of ETH to Buy"
        keyboardType="numeric"
        value={ethAmount}
        onChangeText={handleETHAmountChange} 
        placeholderTextColor={'#808080'} 
      />

      {zarAmount ? (
        <View style={styles.summary}>
          <Text style={styles.subtitle}>Transaction Summary</Text>
          <Text>ETH Amount: {ethAmount} ETH</Text>
          <Text>Total in ZAR: {zarAmount} ZAR</Text>
          <Text>Gas Fee: {gasFee} ZAR</Text>
        </View>
      ) : null}

      <Pressable style={styles.button} onPress={handleConfirmPurchase}>
        {isConfirming ? (
          <Text style={styles.buttonText}>Confirming...</Text>
        ): (
          <Text style={styles.buttonText}>Confirm Purchase</Text>
        )}
        
      </Pressable>
 
      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}
      </ScrollView>
    </View>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: '6%',

  },
  ethStats: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  statsBox: {
    flexDirection: 'column',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075eec',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  summary: {
    marginVertical: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  grandTotal: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
    fontSize: 16,
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
  button: {
    backgroundColor: '#075eec',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
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

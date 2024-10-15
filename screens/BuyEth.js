import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import DataContext from './Context/Context';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const BuyETHPage = () => {
  const {
    ethAmount, setEthAmount,
    zarAmount, setZarAmount,
    amount, setAmount,
    updateEthAmount // Ensure this function is available in your context
  } = useContext(DataContext);

  const [ethStats, setEthStats] = useState(null);
  const [gasFee, setGasFee] = useState(null); // To store gas fee in ZAR
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigation = useNavigation();

  const ETHERSCAN_API_KEY = '2AKWGIEU2PKUVFSBCN8P11RDZ92ZGRAT36'; // Your Etherscan API key
  const GAS_LIMIT = 21000; // Standard gas limit for ETH transfer

  // Fetch ETH stats from CoinGecko API
  useEffect(() => {
    const fetchETHStats = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=zar&include_24hr_high=true&include_24hr_low=true&include_24hr_vol=true');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('CoinGecko API Response Data:', data);

        // Update ETH stats using the CoinGecko response
        setEthStats({
          price: data.ethereum.zar,
          high: data.ethereum.zar_24h_high,
          low: data.ethereum.zar_24h_low,
          volume: data.ethereum.zar_24h_vol,
        });
      } catch (error) {
        console.error('Error fetching ETH stats:', error.message);
        setMessage(`Unable to fetch ETH stats. Error: ${error.message}`);
      }
    };

    fetchETHStats();
  }, []);

  // Fetch Gas Fees from Etherscan API once ETH price is available
  useEffect(() => {
    const fetchGasFee = async () => {
      if (!ethStats || !ethStats.price) {
        return; // Wait until ethStats is available
      }

      try {
        const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_API_KEY}`);
        const data = await response.json();

        if (data.status === '1') {
          const gasPriceInGwei = parseFloat(data.result.ProposeGasPrice); // ProposeGasPrice in Gwei
          const gasPriceInEth = gasPriceInGwei * 1e-9; // Convert Gwei to ETH
          const gasFeeInEth = gasPriceInEth * GAS_LIMIT; // Total Gas Fee in ETH
          const gasFeeInZar = gasFeeInEth * ethStats.price; // Convert ETH to ZAR

          setGasFee(gasFeeInZar.toFixed(2)); // Store the gas fee in ZAR
        } else {
          throw new Error('Failed to fetch gas fees');
        }
      } catch (error) {
        console.error('Error fetching gas fee:', error.message);
        setMessage(`Unable to fetch gas fees. Error: ${error.message}`);
      } finally {
        setLoading(false); // Stop loading once gas fee fetch attempt is done
      }
    };

    fetchGasFee();
  }, [ethStats]); // Dependency on ethStats

  // Function to handle ETH to ZAR conversion as user types
  const handleETHAmountChange = (ethInput) => {
    setEthAmount(ethInput);

    if (ethStats && ethStats.price && ethInput) {
      const totalZar = (parseFloat(ethInput) * ethStats.price).toFixed(2);
      setZarAmount(totalZar);
    } else {
      setZarAmount('');
    }
  };

  const handleConfirmPurchase = () => {
    if (!ethStats || !ethAmount) {
      setMessage('Please enter the amount of ETH to buy.');
      return;
    }

    if (!gasFee) {
      setMessage('Gas fee is not available yet. Please try again later.');
      return;
    }

    const transactionFee = 0.02; // Static transaction fee in ZAR
    const totalCost = parseFloat(ethAmount) * ethStats.price + parseFloat(gasFee) + transactionFee;

    if (totalCost > amount) {
      setMessage('Insufficient funds to purchase ETH.');
      return;
    }

    // Update ETH amount in context
    updateEthAmount(parseFloat(ethAmount));

    // Deduct the cost from the user's ZAR balance
    setAmount((prevAmount) => (parseFloat(prevAmount) - totalCost).toFixed(2));

    setEthAmount('');
    setZarAmount('');

    Alert.alert('Success', `You have successfully purchased ${ethAmount} ETH!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075eec" />
        <Text style={styles.loadingText}>Fetching gas fees...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy ETH</Text>

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
              <Text style={styles.statLabel}>24h Volume:</Text>
              <Text style={styles.statValue}>{ethStats.volume}</Text>
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

      {/* Input for ETH Amount */}
      <TextInput
        style={styles.input}
        placeholder="Amount of ETH to Buy"
        keyboardType="numeric"
        value={ethAmount}
        onChangeText={handleETHAmountChange}  // Automatic conversion as user types
      />

      {/* Show Converted ZAR Amount */}
      {zarAmount ? (
        <View style={styles.summary}>
          <Text style={styles.subtitle}>Transaction Summary</Text>
          <Text>ETH Amount: {ethAmount} ETH</Text>
          <Text>Total Cost (ETH): {zarAmount} ZAR</Text>
          <Text>Gas Fee: {gasFee} ZAR</Text>
          <Text style={styles.grandTotal}>Grand Total: {(parseFloat(zarAmount) + parseFloat(gasFee)).toFixed(2)} ZAR</Text>
        </View>
      ) : null}

      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}

      <View style={tw`m-3`} />
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
    marginTop: '5%',
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

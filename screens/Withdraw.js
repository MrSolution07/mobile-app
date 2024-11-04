import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useThemeColors} from './Context/Theme/useThemeColors';
import { db, auth } from '../config/firebaseConfig'; 
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import tw from 'twrnc';


const Withdraw = () => {
  const colors = useThemeColors();
  // const { withdrawAmount, setWithdrawAmount,  zarAmount, setAmount } = useContext(DataContext);
  const [zarAmount, setZarAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName,setBankName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [ loading, setloading] = useState();
  const [loadingEth,setLoadingEth] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [ethToZarRate, setEthToZarRate] = useState(null); 
  const [convertedZarAmount, setConvertedZarAmount] = useState(''); 
  const [ethAmount, setEthAmount] = useState('');
  const [ethAmountInZar, setEthAmountInZar] = useState(0);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  const fetchAmounts = async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setZarAmount(userData.balanceInZar || 0);
        const ethAmount = userData.ethAmount || 0; 
        const totalZarFromEth = (ethAmount * ethToZarRate).toFixed(2);
        setEthAmountInZar(totalZarFromEth);
      }

      if (!ethToZarRate) {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=zar');
        const data = await response.json();
        setEthToZarRate(data.ethereum.zar);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch account balance or ETH rate.');
      console.error('Error fetching account balance:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAmounts();
    }, [])
  );

  const handleWithdraw = async () => {
    setloading(true);
    setErrorMessage('');
  
    if (!withdrawAmount || !accountNumber || !accountHolder || !bankName || !branchCode) {
      setErrorMessage('Please fill in all fields.');
      setloading(false);
      return;
    }
  
    if (parseFloat(withdrawAmount) > zarAmount) {
      setErrorMessage('Cannot withdraw amount greater than balance.');
      setloading(false);
      return;
    }
  
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const currentBalance = userDocSnapshot.data().balanceInZar || 0;
        const newBalance = currentBalance - parseFloat(withdrawAmount);
  
        const withdrawalEntry = {
          type: 'Withdrawal',
          amount: parseFloat(withdrawAmount),
          date: new Date().toISOString().split('T')[0], 
        };
  
        await updateDoc(userDocRef, {
          balanceInZar: newBalance,
          withdrawals: [...(userDocSnapshot.data().withdrawals || []), withdrawalEntry],
        });

  
        setWithdrawAmount('');
        setAccountNumber('');
        setAccountHolder('');
        setBankName('');
        setBranchCode('');
  
        Alert.alert('Success', `Withdrawal of ${withdrawAmount} ZAR was successful!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      Alert.alert('Error', 'Failed to process withdrawal.');
    } finally {
      setloading(false);
    }
  };

  const handleEthConversion = async () => {
    setLoadingEth(true);
  
    if (!ethAmount) {
      Alert.alert('Error', 'Please enter a valid ETH amount to convert.');
      setLoadingEth(false);
      return;
    }
  
    const ethAmountFloat = parseFloat(ethAmount);
    if (isNaN(ethAmountFloat) || ethAmountFloat <= 0) {
      Alert.alert('Error', 'Invalid ETH amount entered.');
      setLoadingEth(false);
      return;
    }
  
    const zarEquivalent = ethAmountFloat * ethToZarRate; 
    console.log(typeof zarEquivalent);
  
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const currentZarBalance = userDocSnapshot.data().balanceInZar || 0;
        console.log(typeof currentZarBalance);
 
        const currentEthBalance = userDocSnapshot.data().ethAmount || 0; 

        if (ethAmountFloat > currentEthBalance) {
          Alert.alert('Error', 'Insufficient ETH balance for conversion.');
          return;
        }
  
        const newZarBalance = (parseFloat(currentZarBalance) + zarEquivalent).toFixed(2);
        const newEthBalance = currentEthBalance - ethAmountFloat.toFixed(8);
  
        await updateDoc(userDocRef, {
          balanceInZar: newZarBalance,
          ethAmount: newEthBalance, 
        });
  
        Alert.alert('Success', `Converted ${ethAmountFloat} ETH to R${zarEquivalent}.`,[
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
        setEthAmount('');
        setConvertedZarAmount('');
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      Alert.alert('Error', 'Failed to update balance after conversion.');
    } finally {
      setLoadingEth(false);
    }
  };

  const handleETHAmountChange = (ethInput) => {
    const parsedInput = parseFloat(ethInput);
    if (isNaN(parsedInput)) {
      setEthAmount('');
      setConvertedZarAmount('');
      return;
    }
    setEthAmount(ethInput);
    const zarEquivalent = (parsedInput * ethToZarRate).toFixed(2);
    setConvertedZarAmount(zarEquivalent); 
  };
  


  const handleAccountNumberChange = (input) => {
    if (/^\d{0,10}$/.test(input)) {  
      setAccountNumber(input);
    }
  };
  
  const handleBranchCodeChange = (input) => {
    if (/^\d{0,5}$/.test(input)) {  
      setBranchCode(input);
    }
  };
  
  const handleAccountHolderChange = (input) => {
    if (/^[a-zA-Z\s]*$/.test(input)) {  
      setAccountHolder(input);
    }
  };
  
  const handleBankNameChange = (input) => {
    if (/^[a-zA-Z\s]*$/.test(input)) {  
      setBankName(input);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} 
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={[styles.container, {backgroundColor:colors.background}]}>
            <Text style={[styles.title,{color :colors.text}]}>Withdraw Funds</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Amount to Withdraw (ZAR)"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              placeholderTextColor={colors.placeholderText}

              
            />

            <Text style={[styles.bankDetailsTitle,{color :colors.text}]}>Bank Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Account Number"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={handleAccountNumberChange}
              placeholderTextColor={colors.placeholderText}
            />
            <TextInput
              style={styles.input}
              placeholder="Account Holder"
              keyboardType="default"
              value={accountHolder}
              onChangeText={handleAccountHolderChange}
              placeholderTextColor={colors.placeholderText}
            />
            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              keyboardType="default"
              value={bankName}
              onChangeText={handleBankNameChange}
              placeholderTextColor={colors.placeholderText}
            />
            <TextInput
              style={styles.input}
              placeholder="Branch Code"
              keyboardType="numeric"
              value={branchCode}
              onChangeText={handleBranchCodeChange}
              placeholderTextColor={colors.placeholderText}
            />


            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

              <Pressable onPress={handleWithdraw} style={styles.button}>
                {loading ? (
                  <Text style= {styles.buttonText}>Confirming...</Text>
                ) : (
                  <Text style={styles.buttonText}>Confirm Withdrawal</Text>
                )}
              </Pressable>

              <View style={tw`mt-15`}>
              <Text style={[styles.subheading, { color: colors.text }]}>Convert ETH to ZAR</Text>
              <TextInput
                style={styles.input}
                placeholder="Amount in ETH"
                keyboardType="numeric"
                value={ethAmount}
                onChangeText={handleETHAmountChange}
                placeholderTextColor={colors.placeholderText}
              />
              {convertedZarAmount ? (
                <View style={tw`justify-center items-center mb-2`}>
                <View style={styles.zarEquivalent}>
                 <Text style={styles.subtitle}>Transaction Summary</Text>

                <Text style={styles.convertedAmount}>
                  ZAR Equivalent: R{convertedZarAmount}
                </Text>
                </View>
                </View>
              ) : null}

              <Pressable style={styles.button} onPress={handleEthConversion}>
                {loadingEth ? (
                  <Text style={styles.buttonText}>Confirming...</Text>
                ) : (
                  <Text style={styles.buttonText}>Confirm ETH Withdrawal</Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: '10%',

  },
  bankDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
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
  cardInputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  zarEquivalent:{
  backgroundColor:'white',
  borderColor:'#dcdcdc',
  borderRadius:8,
  width:wp('60%'),
  height:hp('20%'),
  alignContent:'center',
  justifyContent:'center',
  borderWidth: 1,
  padding: 15,

  },
  convertedAmount:{
    color: '#075eec',
    fontWeight:'bold',
  },
  inputWithIcon: {
    height: 50,
    borderColor: '#dcdcdc', 
    borderWidth: 1,
    borderRadius: 10, 
    paddingHorizontal: 15,
    paddingRight: 50, 
    backgroundColor: '#ffffff', 
    fontSize: 16,
  },
  cardIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    width: 40,
    height: 25,
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
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subheading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight:'bold',
    textAlign:'center',
    color:'#333333',
  },
  convertedAmount: {
    marginTop: 10,
    fontSize: 16,
    color:'#075eec',
  },
  subtitle:{
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign:'center',

  },
});

export default Withdraw;

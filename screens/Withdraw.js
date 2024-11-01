import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useThemeColors} from './Context/Theme/useThemeColors';
import { db, auth } from '../config/firebaseConfig'; 
import { doc, getDoc,updateDoc } from 'firebase/firestore';

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
  const [errorMessage, setErrorMessage] = useState('');
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
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch account balance.');
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
  
        // setZarAmount(newBalance);
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
});

export default Withdraw;

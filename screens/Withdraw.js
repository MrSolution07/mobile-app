import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import DataContext from './Context/Context';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useThemeColors} from './Context/Theme/useThemeColors';


const cardIcons = {
  visa: require('../assets/images/visa.png'), 
  mastercard: require('../assets/images/mastercard.png'),
};

const Withdraw = () => {
  const colors = useThemeColors();
  const { withdrawAmount, setWithdrawAmount, amount, setAmount } = useContext(DataContext);
  const [cardNumber, setCardNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardType, setCardType] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const determineCardType = (number) => {
    if (number.startsWith('4')) {
      return 'visa';
    } else if (number.startsWith('5')) {
      return 'mastercard';
    }
    return null;
  };

  const handleCardNumberChange = (number) => {
    const cleaned = number.replace(/\D+/g, '');
    const limited = cleaned.slice(0, 16);
    const formatted = limited.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    const type = determineCardType(limited);
    setCardType(type);
  };

  const handleWithdraw = () => {
    setErrorMessage('');
    if (!withdrawAmount || !accountNumber || !cardNumber || !cvv || !expiryDate) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const rawCardNumber = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(rawCardNumber)) {
      setErrorMessage('Card number must be exactly 16 digits.');
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      setErrorMessage('CVV must be exactly 3 digits.');
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      setErrorMessage('Expiry date must be in MM/YY format.');
      return;
    }

    const [inputMonth, inputYear] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
      setErrorMessage('Expiry date cannot be in the past.');
      return;
    }

    const totalWithdrawal = parseFloat(withdrawAmount) + 0.02;
    if (totalWithdrawal > amount) {
      setErrorMessage('Insufficient funds for withdrawal.');
      return;
    }

    setAmount((prevAmount) => (prevAmount - totalWithdrawal).toFixed(2));
    setWithdrawAmount('');
    setAccountNumber('');
    setCardNumber('');
    setCvv('');
    setExpiryDate('');
    setCardType(null);

    Alert.alert('Success', `Withdrawal of ${withdrawAmount} ZAR was successful!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust this value as necessary
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
              
            />

            <Text style={[styles.bankDetailsTitle,{color :colors.text}]}>Bank Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Account Number"
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />

            <View style={styles.cardInputContainer}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Card Number"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                maxLength={19}
              />
              {cardType && (
                <Image
                  source={cardIcons[cardType]}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
              maxLength={3}
            />

            <TextInput
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
              maxLength={5}
            />

            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            <Pressable onPress={handleWithdraw} style={styles.button}>
              <Text style={styles.buttonText}>Confirm Withdrawal</Text>
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

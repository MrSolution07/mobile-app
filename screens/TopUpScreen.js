import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert, ScrollView, Animated,Platform,KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../config/firebaseConfig'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from './Context/Theme/useThemeColors';
import {useTheme} from './Context/Theme/ThemeContext';

const cardIcons = {
  visa: require('../assets/images/visa.png'), 
  mastercard: require('../assets/images/mastercard.png'),
};

const TopUpScreen = () => {
  const colors = useThemeColors();
  const {isDarkMode} = useTheme();
  const [amount, setAmount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardType, setCardType] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const navigation = useNavigation();
  const currentUser = auth.currentUser; 

  // Pulsating animation for confirming text
  const fadeAnim = new Animated.Value(0);

  const startPulsating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchOrGenerateReferenceNumber = async () => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const existingRefNumber = userDocSnapshot.data().lastTopUpReference;
        if (existingRefNumber) {
          setReferenceNumber(existingRefNumber); 
        } else {
          generateReferenceNumber(userDocRef); 
        }
      }
    } catch (error) {
      console.error('Error fetching reference number:', error);
    }
  };

  const generateReferenceNumber = async (userDocRef) => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const newRefNumber = `#${randomNumber}`;
    setReferenceNumber(newRefNumber);

    try {
      await updateDoc(userDocRef, { lastTopUpReference: newRefNumber });
    } catch (error) {
      console.error('Error saving reference number:', error);
    }
  };

  const determineCardType = (number) => {
    const cleanedNumber = number.replace(/\s+/g, '');
    if (cleanedNumber.startsWith('4')) {
      return 'visa';
    } else if (cleanedNumber.startsWith('5')) {
      return 'mastercard';
    }
    return null;
  };

  const handleCardNumberChange = (number) => {
    const cleaned = number.replace(/\D+/g, ''); // Remove non-digit characters
    const limited = cleaned.slice(0, 16); // Limit to 16 digits
    const formatted = limited.replace(/(.{4})/g, '$1 ').trim(); // Add spaces after 4 digits

    setCardNumber(formatted);
    setCardType(determineCardType(formatted)); // Determine card type
  };

  const handleTopUp = async () => {
    setErrorMessage(''); 
    setIsConfirming(true);
    startPulsating(); 
  
    if (!amount || !accountHolder || !cardNumber || !cvv || !expiryDate) {
      setErrorMessage('Please fill in all fields.');
      setIsConfirming(false);
      return;
    }
  
    const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      setErrorMessage('Card number must be exactly 16 digits.');
      setIsConfirming(false);
      return;
    }
  
    if (!/^\d{3}$/.test(cvv)) {
      setErrorMessage('CVV must be exactly 3 digits.');
      setIsConfirming(false);
      return;
    }
  
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      setErrorMessage('Expiry date must be in MM/YY format.');
      setIsConfirming(false);
      return;
    }
  
    const [inputMonth, inputYear] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;
  
    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
      setErrorMessage('Expiry date cannot be in the past.');
      setIsConfirming(false);
      return;
    }
  
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const currentBalance = userDocSnapshot.data().balanceInZar || 0;
  
        const newBalance = currentBalance + parseFloat(amount);
  
        const transferEntry = {
          type: 'Transfer',
          amount: parseFloat(amount),
          date: new Date().toISOString().split('T')[0], // Date format: YYYY-MM-DD
        };
  
        await updateDoc(userDocRef, {
          balanceInZar: newBalance,
          lastTopUpReference: referenceNumber,
          transfers: [...(userDocSnapshot.data().transfers || []), transferEntry], // Add new transfer
        });
  
        setAmount('');
        setAccountHolder('');
        setCardNumber('');
        setCvv('');
        setExpiryDate('');
        setCardType(null);
  
        Alert.alert('Success', `Top-Up of ${amount} ZAR was successful!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error processing your top-up. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  useEffect(() => {
    fetchOrGenerateReferenceNumber();
  }, []);

  return (
    <SafeAreaView style={[styles.pageContainer, {backgroundColor: colors.background}]}         keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} 
      >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={[styles.title , {color :colors.text}]}>Top-Up Your Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Amount to Top-Up (ZAR)"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
            placeholderTextColor={colors.placeholderText}

          />

          <Text style={[styles.label,{color :colors.text}]}>Reference Number:</Text>
          <TextInput
            style={[styles.referenceInput, {color : colors.placeholderText}]}
            value={referenceNumber}
            editable={false}
          />

          <Text style={[styles.bankDetailsTitle,{color :colors.text}]}>Card Details</Text>

          <View style={styles.cardInputContainer}>
            <TextInput
              style={styles.inputWithIcon}
              placeholder="Card Number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              maxLength={19}
              placeholderTextColor={colors.placeholderText}
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
            placeholder="Account Holder"
            value={accountHolder}
            onChangeText={setAccountHolder}
            placeholderTextColor={colors.placeholderText}

          />

          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            value={cvv}
            
            onChangeText={(text) => setCvv(text.replace(/[^0-9]/g, ''))}
            maxLength={3}
            placeholderTextColor={colors.placeholderText}

          />

          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            maxLength={5}
            placeholderTextColor={colors.placeholderText}

          />

          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}

          <Pressable onPress={handleTopUp} style={styles.button} disabled={isConfirming}>
            {isConfirming ? (
              <Text style={[styles.confirmingText]}>
                Confirming...
              </Text>
            ) : (
              <Text style={styles.buttonText}>Confirm Top-Up</Text>
            )}
            
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: wp(4),
  },
  title: {
    fontSize: wp(6),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: wp(4),
  },
  input: {
    height: 48,
    borderColor: '#dcdcdc', 
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    fontSize: 16,
    // color:'black',
  },
  referenceInput: {
    height: 48,
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
  placeholder:{
    color:'lightgray',
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
    right: wp(3),
    top: wp(3),
    width: wp(8),
    height: wp(8),
  },
  bankDetailsTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginBottom: wp(3),
  },
  label: {
    fontSize: wp(4),
    color: '#555',
  },
  errorMessage: {
    color: 'red',
    marginBottom: wp(3),
    textAlign: 'center',
  },
  button: {
    height: wp(12),
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  confirmingText: {
    color: '#ffffff',
    fontSize: wp(4),
    fontWeight: 'bold',

  },
});

export default TopUpScreen;

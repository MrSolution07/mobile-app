import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../config/firebaseConfig'; // Firebase config
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const cardIcons = {
  visa: require('../assets/images/visa.png'), 
  mastercard: require('../assets/images/mastercard.png'),
  // Add a error image to indicate invalid card number cause for visa is 4 and mastercard is 5 the fucntion is determineCardType
};

const TopUpScreen = () => {
  const [amount, setAmount] = useState('');
  // const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardType, setCardType] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const currentUser = auth.currentUser; 
  
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

  // so the user will just have one attributed to him cause that thing of generating might create a logivcal issue
  const generateReferenceNumber = async (userDocRef) => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const newRefNumber = `#${randomNumber}`;
    setReferenceNumber(newRefNumber);

    // Save the reference number in the Firestore
    try {
      await updateDoc(userDocRef, { lastTopUpReference: newRefNumber });
    } catch (error) {
      console.error('Error saving reference number:', error);
    }
  };

  // Function to determine card type based on the first digit of card number
  const determineCardType = (number) => {
    const cleanedNumber = number.replace(/\s+/g, '');
    if (cleanedNumber.startsWith('4')) {
      return 'visa';
    } else if (cleanedNumber.startsWith('5')) {
      return 'mastercard';
    }
    return 'error';
  };

  // Handler for card number input change with formatting
  const handleCardNumberChange = (number) => {
    const cleaned = number.replace(/\D+/g, ''); // Remove all non-digit characters
    const limited = cleaned.slice(0, 16); // Limit to 16 digits
    const formatted = limited.replace(/(.{4})/g, '$1 ').trim(); // Add spaces after every 4 digits

    setCardNumber(formatted);
    setCardType(determineCardType(formatted)); // Determine card type
  };

  // Handler for confirming the top-up
  const handleTopUp = async () => {
    setErrorMessage(''); // Reset error message

    // Basic validation
    if (!amount || !accountNumber || !accountHolder || !cardNumber || !cvv || !expiryDate) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Validate card number (16 digits)
    const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      setErrorMessage('Card number must be exactly 16 digits.');
      return;
    }

    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(cvv)) {
      setErrorMessage('CVV must be exactly 3 digits.');
      return;
    }

    // Validate expiry date (MM/YY format)
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

  
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const currentBalance = userDocSnapshot.data().balanceInZar || 0;

        await updateDoc(userDocRef, {
          balanceInZar: currentBalance + parseFloat(amount), // Update balance
          lastTopUpReference: referenceNumber, 
        });

       
        setAmount('');
        setAccountNumber('');
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
    }
  };

  // Load the reference number when the component mounts this prevents to have many ref number i used the altcoin trader's logic 
  useEffect(() => {
    fetchOrGenerateReferenceNumber();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Top-Up Your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Amount to Top-Up (ZAR)"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
        />

        {referenceNumber && (
          <View style={styles.instructions}>
            <Text style={styles.referenceText}>Reference Number: {referenceNumber}</Text>
          </View>
        )}

        <Text style={styles.bankDetailsTitle}>Card Details</Text>

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
          placeholder="Account Number"
          keyboardType="numeric"
          value={accountNumber}
          onChangeText={(text) => setAccountNumber(text.replace(/[^0-9]/g, ''))}
          maxLength={13}
        />

        <TextInput
          style={styles.input}
          placeholder="Account Holder"
          value={accountHolder}
          onChangeText={setAccountHolder}
        />

        <TextInput
          style={styles.input}
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          onChangeText={(text) => setCvv(text.replace(/[^0-9]/g, ''))}
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

        <Pressable onPress={handleTopUp} style={styles.button}>
          <Text style={styles.buttonText}>Confirm Top-Up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    top:hp('2%'),
  },
  bankDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    marginTop: 10,
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
  cardInputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 20,
  },
  cardIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    width: 40,
    height: 25,
  },
  button: {
    backgroundColor: '#075eec',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  referenceText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default TopUpScreen;

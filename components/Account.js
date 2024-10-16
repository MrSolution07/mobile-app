import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { db, auth } from '../config/firebaseConfig'; // Firebase config
import { doc, getDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import tw from 'twrnc';

const Account = () => {
  const navigation = useNavigation();
  const [zarAmount, setZarAmount] = useState(0);
  const [ethAmount, setEthAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const currentUser = auth.currentUser;

  // Fetch ZAR and ETH amounts from Firestore
  const fetchAmounts = async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setZarAmount(userData.balanceInZar || 0); 
        setEthAmount(userData.ethAmount || 0);
        setWithdrawAmount(userData.withdrawAmount || 0); // Set withdrawal amount (if applicable)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch account balance.');
      console.error('Error fetching account balance:', error);
    }
  };

  useEffect(() => {
    fetchAmounts();
  }, []);

  // Calculate current ZAR balance with withdrawal taken into account
  const currentZarBalance = parseFloat(zarAmount || 0) - (withdrawAmount ? parseFloat(withdrawAmount) + 0.02 : 0);

  return (
    <View style={styles.accountContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>BALANCE</Text>
          <Text style={styles.balanceAmount}>
            {currentZarBalance.toFixed(2)} ZAR
          </Text>

          <View style={tw`flex-row rounded-md gap-x-2 items-center justify-center w-40 p-2 top-3`}>
            <Text style={tw`font-bold text-xl text-black`}>{ethAmount ? ethAmount : 0} </Text>
            <Text style={tw`text-[#6d28d9] font-bold text-xl`}>ETH</Text>
            <FontAwesome5 name="ethereum" size={20} color="black" />
          </View>

          <View style={tw`flex-row justify-between gap-x-3 mt-10`}>
            <Pressable style={styles.actionButton} onPress={() => navigation.navigate('TopUp')}>
              <Text style={styles.buttonText}>Transfer</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Withdraw')}>
              <Text style={styles.buttonText}>Withdraw</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => {
              if (currentZarBalance >= 50) { 
                navigation.navigate('BuyEth');
              } else {
                alert("Insufficient funds to purchase ETH.");
              }
            }}>
              <Text style={styles.buttonText}>Buy ETH</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  accountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('5.5%'),
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  balanceContainer: {
    width: wp('90%'),
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceTitle: {
    color: '#333333',
    fontSize: 17,
    textAlign: 'center',
    letterSpacing: 0.8,
    fontWeight: 'bold',
    marginBottom: hp('3%'),
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#333333',
  },
  actionButton: {
    width: wp('23%'),
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Account;

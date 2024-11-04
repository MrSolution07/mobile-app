import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DataContext from '../screens/Context/Context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db, auth } from '../config/firebaseConfig'; 
import { doc, onSnapshot } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import tw from 'twrnc';
import { useThemeColors } from '../screens/Context/Theme/useThemeColors';
import { useTheme } from '../screens/Context/Theme/ThemeContext';

const Activity = () => {
  const colors = useThemeColors();
  const {isDarkMode} = useTheme();
  const { amount, ethAmount, zarAmount, withdrawAmount } = useContext(DataContext);
  const [transfers, setTransfers] = useState([]);
  const [ethTransactions, setEthTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const currentUser = auth.currentUser;



  useEffect(() => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribeTransfers = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setTransfers(userData.transfers || []); // Fetch the 'transfers' array
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribeTransfers();
  }, [currentUser]);

  // Fetch ETH Transactions
  useEffect(() => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribeETH = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setEthTransactions(userData.BuyETH || []); // Fetch the 'ethTransactions' array
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribeETH();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribeETH = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setWithdrawals(userData.withdrawals || []); // Fetch the 'withdrawals' array
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribeETH();
  }, [currentUser]);

  const getActivityContainerStyle = (isDarkMode) => ({
    backgroundColor: isDarkMode ? colors.tabbackground : 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    width: wp('90%'),
    height: hp('14%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  });

  return (
    <SafeAreaView style={tw`top-5 p-4 flex-1`}>
    <ScrollView contentContainerStyle={tw`flex-grow`}>
    {transfers.length > 0 ? (
          transfers.map((transfer, index) => (
            <View key={index} style={getActivityContainerStyle(isDarkMode)}>
              <View style={styles.iconRow}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="arrow-up" size={20} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={isDarkMode ? {color:colors.text}: styles.activityType}>Transfer</Text>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={isDarkMode ?{color: colors.text}: styles.activityAmount}>{transfer.amount} ZAR</Text>
                    <Text style={isDarkMode ? {color: colors.grayText}:styles.activityDate}>{transfer.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={isDarkMode? {color:colors.text} : {color:'#000'}}>No transfers found.</Text>
        )}

        {withdrawals.length > 0? (
         withdrawals.map((withdraw,index) => (
        <View key={index} style={getActivityContainerStyle(isDarkMode)}>
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="arrow-down" size={20} color="white" />
            </View>
            <View style={styles.activityContent}>
              <Text style={isDarkMode? {color:colors.text}: styles.activityType}>Withdrawals</Text>
              <View style={tw`flex-row justify-between`}>
              <Text style={isDarkMode?  {color:colors.text}: styles.activityAmount}>{withdraw.amount} ZAR</Text>
              <Text style={isDarkMode? {color:colors.grayText}: styles.activityDate}>{withdraw.date}</Text>
              </View>
            </View>
          </View>
        </View>
        ))
      ): (
        <Text style={isDarkMode? {color:colors.text} : {color:'#000'}}>No withdrawals found.</Text>
        )}

        {ethTransactions.length > 0 ? (
          ethTransactions.map((transaction, index) => (
            <View key={index} style={getActivityContainerStyle(isDarkMode)}>
              <View style={styles.iconRow}>
                <View style={styles.iconCircle}>
                  <FontAwesome5 name="ethereum" size={20} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={isDarkMode ? {color:colors.text}: styles.activityType}>Purchased ETH</Text>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={isDarkMode?{color:colors.text}: styles.activityAmount}>{transaction.ethAmount} ETH</Text>
                    <Text style={isDarkMode? {color:colors.grayText}: styles.activityDate}>{transaction.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={isDarkMode? {color:colors.text} : {color:'#000'}}>No ETH purchases found.</Text>
        )}
    </ScrollView>
    </SafeAreaView>


  );
};

const styles = StyleSheet.create({
  // activityContainer: {
  //   backgroundColor: '#fffff',
  //   borderRadius: 15,
  //   padding: 20,
  //   marginBottom: 15,
  //   width: wp('90%'),
  //   height: hp('14%'),
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 5,
  //   elevation: 5,
  // },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  iconCircle: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityAmount: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight:'600',
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default Activity;

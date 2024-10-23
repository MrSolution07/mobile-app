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

const Activity = () => {
  const { amount, ethAmount, zarAmount, withdrawAmount } = useContext(DataContext);
  const [transfers, setTransfers] = useState([]);
  const [ethTransactions, setEthTransactions] = useState([]);
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

  return (
    <ScrollView contentContainerStyle={tw`flex-grow`}>
    <SafeAreaView style={tw`top-5 p-4`}>
    {transfers.length > 0 ? (
          transfers.map((transfer, index) => (
            <View key={index} style={styles.activityContainer}>
              <View style={styles.iconRow}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="arrow-up" size={20} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>Transfer</Text>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={styles.activityAmount}>{transfer.amount} ZAR</Text>
                    <Text style={styles.activityDate}>{transfer.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>No transfers found.</Text>
        )}

        <View style={styles.activityContainer}>
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="arrow-down" size={20} color="white" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityType}>Withdrawals</Text>
              <View style={tw`flex-row justify-between`}>
              <Text style={styles.activityAmount}>{withdrawAmount} ZAR</Text>
              <Text style={styles.activityDate}>2024-09-02</Text>
              </View>
            </View>
          </View>
        </View>

        {ethTransactions.length > 0 ? (
          ethTransactions.map((transaction, index) => (
            <View key={index} style={styles.activityContainer}>
              <View style={styles.iconRow}>
                <View style={styles.iconCircle}>
                  <FontAwesome5 name="ethereum" size={20} color="white" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>Purchased ETH</Text>
                  <View style={tw`flex-row justify-between`}>
                    <Text style={styles.activityAmount}>{transaction.ethAmount} ETH</Text>
                    <Text style={styles.activityDate}>{transaction.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>No ETH purchases found.</Text>
        )}
    </SafeAreaView>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  activityContainer: {
    backgroundColor: '#ffffff',
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
  },
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
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default Activity;

import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DataContext from '../screens/Context/Context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 

import tw from 'twrnc';

const Activity = () => {
  const { amount, ethAmount, zarAmount, withdrawAmount } = useContext(DataContext);

  return (
    <SafeAreaView style={tw`top-5 p-4`}>
      <ScrollView contentContainerStyle={tw`flex-row flex-wrap justify-between`}>
        <View style={styles.activityContainer}>
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="arrow-up" size={20} color="white" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityType}>Transfers</Text>
              <View style={tw`flex-row justify-between`}>
              <Text style={styles.activityAmount}>{amount} ZAR</Text>
              <Text style={styles.activityDate}>2024-09-01</Text>
              </View>
            </View>
          </View>
        </View>

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

        <View style={styles.activityContainer}>
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="ethereum" size={20} color="white" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityType}>Purchased ETH</Text>
              <View style={tw`flex-row justify-between`}>
              <Text style={styles.activityAmount}>{ethAmount} ETH</Text>
              <Text style={styles.activityDate}>2024-09-03</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

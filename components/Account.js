import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DataContext from '../screens/Context/Context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import tw from 'twrnc';

const Account = () => {
  const navigation = useNavigation();
  const { amount, ethAmount, zarAmount, withdrawAmount } = useContext(DataContext);

  return (
        <View style={[tw`justify-center items-center`,styles.accountContainer]}>          
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceTitle}>BALANCE </Text>
                <Text style={styles.balanceAmount}>
                  {amount
                    ? (amount - (zarAmount || 0)).toFixed(2)
                    : (amount - (withdrawAmount || 0)).toFixed(2)}{' '}
                  ZAR
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
                <Pressable style={styles.actionButton} onPress={() => navigation.navigate('BuyEth')}>
                  <Text style={styles.buttonText}>Buy ETH</Text>
                </Pressable>
              </View>
              </View>
          </View>
          
  );
};

const styles = StyleSheet.create({
  accountContainer:{
    marginTop:hp('33%'),
  },
    balanceContainer: {
    width: wp('90%'),
    height:hp('45%'),
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent:'center',
    alignItems: 'center',
    position:'absolute',
  },
  balanceTitle: {
    color: '#333333',
    fontSize: 17,
    textAlign:'center',
    letterSpacing: 0.8,
    fontWeight: 'bold',
    marginBottom: hp('6%'),
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

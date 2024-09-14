import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import DataContext from '../screens/Context/Context'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import tw from 'twrnc';

const Account = () => {
  const navigation = useNavigation();

  const {amount, ethAmount ,zarAmount,withdrawAmount} = useContext(DataContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 100, 200, 0.7)', 'rgba(0, 0, 0, 0.9)']}
            start={[0.2, 0.2]}
            end={[0.8, 0.8]}
            style={styles.gradientBackground}
          >
            <View style={styles.balanceContainer}>

              <Text style={styles.balanceTitle}>BALANCE </Text>
              <Text style={styles.balanceAmount}> {amount
                                                        ? ((amount - (zarAmount || 0)).toFixed(2))
                                                        : (amount - (withdrawAmount || 0)).toFixed(2)
                                                      } ZAR</Text>

                  <View style={tw`flex-row rounded-md gap-x-2 items-center justify-center w-40 p-2 top-3 `}>
                    <Text style={tw`font-bold text-xl text-white`}>{ethAmount ? ethAmount:0} </Text>
                    <Text style={tw`text-[#6d28d9] font-bold text-xl`}>ETH</Text>
                    <FontAwesome5 name="ethereum" size={20} color="whitesmoke" />
                  </View>

            </View>
          
          </LinearGradient>

          <View style={tw`flex-row justify-between gap-x-3 mt-5`}>
            <Pressable style={styles.actionButton} onPress={() => navigation.navigate('TopUp') }>
              <Text style={styles.buttonText}>Transfer</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Withdraw') }>
              <Text style={styles.buttonText}>Withdraw</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={() => navigation.navigate('BuyEth') }>
              <Text style={styles.buttonText}>Buy ETH</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  gradientBackground: {
    width: wp('92%'),
    height: hp('40%'),
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius: 20,
    top: 0,
    bottom: 18,
    marginBottom: 15,
    overflow: 'hidden',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceTitle: {
    color: 'white',
    fontSize: 17,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    marginBottom: 10,
    top: -30,
    textShadowOffset: { width: 5, height: 2 },
    textShadowRadius: 8,
    transform: [
      { scaleX: 1.2 }, // Slightly scale the text to make it look like it's bulging
      { scaleY: 0.9 }  // Compress vertically to give a converging effect
    ],
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  balanceEquivalent: {
    color: '#fff',
    fontSize: 14,
  },
  actionButton: {
    width: wp('30%'),
    height: hp('10%'),
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    zIndex: 2,
  },
});

export default Account;

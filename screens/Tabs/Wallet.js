import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Account from '../../components/Account';
import Items from '../../components/Items';
import Activity from '../../components/Activity';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import tw from 'twrnc';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const animationValue = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);

    Animated.timing(animationValue, {
      toValue: tab === 'Account' ? 0 : tab === 'Items' ? -screenWidth : -2 * screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[tw`flex-1`, styles.walletContainer]}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 100, 200, 0.7)', 'rgba(0, 0, 0, 0.9)']}
        start={[0.2, 0.2]}
        end={[0.8, 0.8]}
        style={styles.gradientBackground}
      />
      <View style={tw`items-center top-40 justify-center`}> 
        <View style={styles.tabsContainer}>
          {['Account', 'Items', 'Activity'].map((tab) => (
            <Pressable
              key={tab}
              onPress={() => handleTabSwitch(tab)}
              style={[
                styles.tabButton,
                { backgroundColor: activeTab === tab ? 'black' : 'slategrey' },
              ]}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Animated.View
          style={{
            flexDirection: 'row',
            width: screenWidth * 3,
            transform: [{ translateX: animationValue }],
          }}
        >
          <View style={{ width: screenWidth }}>
            <Account />
          </View>
          <View style={{ width: screenWidth }}>
            <Items />
          </View>
          <View style={{ width: screenWidth }}>
            <Activity />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  walletContainer: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    justifyContent:'center',
    alignContent:'center',
    width: '100%',
    height: '50%',
  },
  contentContainer: {
    flex: 1,
    marginTop: hp('20%'),
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'slategray', 
    borderRadius: 22,
    
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    justifyContent: 'center',
    padding: 1,
    alignItems: 'center',
    width: wp('24%'),
    height: hp('7%'),
    margin:0,
  },
  tabText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Wallet;

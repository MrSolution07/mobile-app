import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, Dimensions, StyleSheet } from 'react-native';
import Account from '../../components/Account';
import Items from '../../components/Items';
import Activity from '../../components/Activity';
import tw from 'twrnc';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const animationValue = useRef(new Animated.Value(0)).current;
  const underlinePosition = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);

    Animated.timing(animationValue, {
      toValue: tab === 'Account' ? 0 : tab === 'Items' ? -screenWidth : -2 * screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(underlinePosition, {
      toValue: tab === 'Account' ? 0 : tab === 'Items' ? screenWidth / 3 : 2 * (screenWidth / 3),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row justify-start ml-3 mt-5`}>
        <Pressable onPress={() => handleTabSwitch('Account')}>
          <View style={tw`relative`}>
            <Text style={tw`ml-2 ${activeTab === 'Account' ? 'text-blue-500 text-base font-medium' : 'text-[#333333] text-base'}`}>Account</Text>
            {activeTab === 'Account' && (
              <Animated.View style={[styles.underline, { center: underlinePosition }]} />
            )}
          </View>
        </Pressable>
        <Pressable onPress={() => handleTabSwitch('Items')}>
          <View style={tw`relative`}>
            <Text style={tw`ml-2 ${activeTab === 'Items' ? 'text-blue-500 text-base font-medium' : 'text-[#333333] text-base'}`}>Items</Text>
            {activeTab === 'Items' && (
              <Animated.View style={[styles.underline, { center: underlinePosition }]} />
            )}
          </View>
        </Pressable>
        <Pressable onPress={() => handleTabSwitch('Activity')}>
          <View style={tw`relative`}>
            <Text style={tw`ml-2 ${activeTab === 'Activity' ? 'text-blue-500 text-base font-medium' : 'text-[#333333] text-base'}`}>Activity</Text>
            {activeTab === 'Activity' && (
              <Animated.View style={[styles.underline, { center: underlinePosition }]} />
            )}
          </View>
        </Pressable>
      </View>

      <View style={styles.contentContainer}>
        <Animated.View
          style={{
            flexDirection: 'row',
            width: screenWidth * 3,
            transform: [{ translateX: animationValue }],
          }}
        >
          <View style={{ width: screenWidth, flex: 1 }}>
            <Account />
          </View>
          <View style={{ width: screenWidth, flex: 1 }}>
            <Items />
          </View>
          <View style={{ width: screenWidth, flex: 1 }}>
            <Activity />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor:'whitesmoke',
  },
  underline: {
    position: 'absolute',
    alignItems: 'center',
    left: '10%',
    bottom: -1,
    height: 3,
    width: '90%',
    backgroundColor: '#075eec',
    borderRadius: 5,
  },
});

export default Wallet;

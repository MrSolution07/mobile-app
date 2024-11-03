import React, { useState, useRef,useEffect } from 'react';
import { View, Text, Pressable, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import Account from '../../components/Account';
import Items from '../../components/Items';
import Activity from '../../components/Activity';
import Bids from '../../components/Bids'; 
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRoute,useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import tw from 'twrnc';
import { useTheme } from '../Context/Theme/ThemeContext';
import { useThemeColors } from '../Context/Theme/useThemeColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const Wallet = () => {
  const colors = useThemeColors();
  const { isDarkMode } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [activeTab, setActiveTab] = useState('Account');
  const animationValue = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;

  const route = useRoute();


  const handleTabSwitch = (tab) => {
    setActiveTab(tab);

    Animated.timing(animationValue, {
      toValue: tab === 'Account' ? 0 : tab === 'Items' ? -screenWidth : tab === 'Bids' ? -2 * screenWidth : -3 * screenWidth,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    const tab = route.params?.tab || 'Account'; 
    handleTabSwitch(tab);
  }, [route.params?.tab]);


  useFocusEffect(
    useCallback(() => {
      // Lock the screen orientation when the tab is focused
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

      return () => {
        // Unlock the orientation when leaving the tab
        ScreenOrientation.unlockAsync();
      };
    }, [])
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.background}}>
    <View style={[tw`flex-1`, styles.walletContainer]}>
      <LinearGradient
        colors={isDarkMode ? colors.walletGradient : ['rgba(255, 255, 255, 0.5)', 'rgba(7, 94, 236, 0.5)', 'rgba(128, 0, 128, 0.5)']}
        style={styles.gradientBackground}
      />
      <View style={tw`items-center top-30 justify-center`}>
        <View style={styles.tabsContainer}>
          {['Account', 'Items', 'Bids', 'Activity'].map((tab) => ( 
            <Pressable
              key={tab}
              onPress={() => handleTabSwitch(tab)}
              style={[styles.tabButton, { backgroundColor: activeTab === tab ? 'black' : 'slategrey' }]}
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
            width: screenWidth * 4, 
            transform: [{ translateX: animationValue }],
          }}
        >
          <View style={{ width: screenWidth,paddingBottom:tabBarHeight }}>
            <Account />
          </View>
          <View style={{ width: screenWidth,paddingBottom:tabBarHeight  }}>
            <Items />
          </View>
          <View style={{ width: screenWidth,paddingBottom:tabBarHeight }}>
            <Bids /> 
          </View>
          <View style={{ width: screenWidth,paddingBottom:tabBarHeight}}>
            <Activity />
          </View>
        </Animated.View>
      </View>
    </View>
    </SafeAreaView>
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
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
    paddingVertical: 12,
    paddingHorizontal: 12, 
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('22%'), 
    height: hp('8%'), 
  },
  tabText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Wallet;

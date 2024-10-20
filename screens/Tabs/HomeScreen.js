import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Animated, Pressable, Alert, Platform} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as LocalAuthentication from 'expo-local-authentication'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Collection1, Collection2, Collection3, Collection4 } from '../NFT/dummy';
import tw from 'twrnc';
import {EXPO_PUBLIC_OPENSEA_API_KE} from '@env';

const collections = [Collection1, Collection2, Collection3, Collection4];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const scrollX = new Animated.Value(0);
  const [profileImage, setProfileImage] = useState(null);
  const [loginPromptShown, setLoginPromptShown] = useState(false);
  const [collectionData, setCollectionData] = useState([]);


  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': EXPO_PUBLIC_OPENSEA_API_KE,
      },
    };

    axios
      .get('https://api.opensea.io/api/v2/collections', options)
      .then(response => {
      })
      .catch(err => console.error(err));
  }, []);


  const askLoginPreference = async () => {
    Alert.alert(
      'Login Preference',
      'Would you like to use biometrics (FaceID/Fingerprint) or password for future logins?',
      [
        {
          text: 'Biometrics',
          onPress: async () => {
            const hasBiometricAuth = await LocalAuthentication.hasHardwareAsync();
            const isBiometricSupported = await LocalAuthentication.supportedAuthenticationTypesAsync();

            if (hasBiometricAuth && isBiometricSupported.length > 0) {
              const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Enable biometric authentication',
              });

              if (result.success) {
                await AsyncStorage.setItem('loginMethod', 'biometrics');
                Alert.alert('Success', 'Biometric authentication enabled!');
              } else {
                Alert.alert('Failed', 'Biometric authentication failed.');
              }
            } else {
              Alert.alert('Error', 'Biometric authentication is not supported on this device.');
            }
          }
        },
        {
          text: 'Password',
          onPress: async () => {
            await AsyncStorage.setItem('loginMethod', 'password');
            Alert.alert('Password Selected', 'You will use your password to log in.');
          }
        }
      ],
      { cancelable: false }
    );
  };

  const fetchCollectionData = () => {
    const data = collections.map((collection) => {
      const prices = collection.nfts.map((nft) => nft.price);
      const floorPrice = Math.min(...prices);
      const volume = prices.reduce((acc, price) => acc + price, 0);
      return {
        ...collection,
        name: collection.name,
        floorPrice,
        volume,
        image: collection.image,
      };
    });
    setCollectionData(data);
  };

  useEffect(() => {
    fetchCollectionData();
  }, []);

  const checkLoginPreference = async () => {
    const loginMethod = await AsyncStorage.getItem('loginMethod');
    const isPromptShown = await AsyncStorage.getItem('loginPromptShown');

    if (!loginMethod && !isPromptShown) {
      askLoginPreference();
      await AsyncStorage.setItem('loginPromptShown', 'true');
    }
  };

  useEffect(() => {
    checkLoginPreference();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name);
          setProfileImage(userData.ProfileImage ? { uri: userData.ProfileImage } : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y");
        } else {
          setProfileImage(require('../../assets/images/NoImg.jpg'));
        }
      }
    };

    fetchProfileImage();
  }, []);

  const toggleDrawer = () => {
    navigation.getParent()?.toggleDrawer();
  };

  const onCollectionPress = (collection) => {
    navigation.navigate('CollectionDetailScreen', { collection });
  };

  const renderHorizontalItem = ({ item, index }) => {
    const scale = scrollX.interpolate({
      inputRange: [
        (index - 1) * wp('35%'),
        index * wp('35%'),
        (index + 1) * wp('35%')
      ],
      outputRange: [1, 1.1, 1],
      extrapolate: 'clamp',
    });
    
    return (
      <TouchableOpacity onPress={() => onCollectionPress(item)} activeOpacity={0.8}>
        <Animated.View style={[styles.collectionItem, { transform: [{ scale }] }]}>
          <Image source={item.image} style={styles.collectionImage} />
          <Text style={styles.collectionName}>{item.name}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderVerticalItem = ({ item }) => (
    <TouchableOpacity onPress={() => onCollectionPress(item)} activeOpacity={0.8}>
      <View style={styles.topSellingItem}>
        <Image source={item.image} style={styles.topSellingImage} />
        <View style={styles.topSellingInfo}>
          <Text style={styles.topSellingName} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
          <Text style={styles.topSellingPrice}>{item.floorPrice}<Text style={tw`text-[#6d28d9]`}> ETH</Text></Text>
          <Text style={styles.topSellingVolume}>{item.volume} <Text style={tw`text-[#2563eb]`}> ETH</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCollectionHeader = () => (
    <View style={styles.collectionHeader}>
      <Text style={styles.headerText}>Collection</Text>
      <Text style={styles.headerText}>Floor Price</Text>
      <Text style={styles.headerText}>Volume</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={() => (
            <View>
              <View style={styles.header}>
                <Pressable onPress={toggleDrawer}>
                  <Ionicons name="menu-sharp" size={28} color="black" />
                </Pressable>
                <TouchableOpacity onPress={ () => navigation.navigate('ProfileScreen', {showButton: true})}>
                  <Image source={profileImage} style={styles.profileImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>
                  Hello, <Text style={styles.username}>{name}</Text>
                </Text>
              </View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Collections</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Explore', { screen: 'Explore', params: { initialTab: 'Collections' } })}>
                  <Text style={styles.sectionLink}>See All</Text>
                </TouchableOpacity>
              </View>
              <Animated.FlatList
                data={collections}
                renderItem={renderHorizontalItem}
                keyExtractor={(item) => item.name}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
              />
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Selling</Text>
                
              </View>
              {renderCollectionHeader()}
            </View>
          )}
          data={collectionData}
          renderItem={renderVerticalItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',

  },
  container: {
    paddingHorizontal: wp('4%'),
    top: Platform.OS === 'ios' ? hp('2.5%') : hp('2%'),

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    marginTop: hp('2%'),
  },
  greeting: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
  },
  username: {
    color: '#007bff',
  },
  profileImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'grey',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: hp('2%'),
    color: '#007bff',
  },
  horizontalList: {
    paddingVertical: 25,
    margin: 5,
    paddingLeft: 15,
  },
  collectionItem: {
    marginRight: 20,
    marginBottom: hp('6%'),
    alignItems: 'center',
    borderRadius: wp('2%'),
    width: wp('35%'),
    height: hp('30%'),
    backgroundColor: 'gray',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp('2%'),
    resizeMode: 'cover',
  },
  collectionName: {
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '600',
  },
  verticalList: {
    paddingTop: 10,
    flexGrow: 1,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: hp('1%'),
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  topSellingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  topSellingImage: {
    width: wp('15%'),
    height: hp('8%'),
    borderRadius: 15,
    marginRight: wp('2%'),
  },
  topSellingInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSellingName: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    // marginRight: wp('10'),
  },
  topSellingPrice: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    textAlign: 'center',
    marginRight: wp('10%'),

  },
  topSellingVolume: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
});

export default HomeScreen;
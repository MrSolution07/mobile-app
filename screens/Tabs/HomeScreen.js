import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Animated, Pressable, Alert, Platform,ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as LocalAuthentication from 'expo-local-authentication'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from '../../config/firebaseConfig';
import { doc, getDoc,setDoc, updateDoc,onSnapshot } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Collection1, Collection2, Collection3, Collection4 } from '../NFT/dummy';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import tw from 'twrnc';
import * as Notifications from 'expo-notifications'; // Import Notifications
import { getToken } from 'expo-notifications'; 
import * as Location from 'expo-location';
import { useThemeColors } from '../Context/Theme/useThemeColors';
import { useTheme } from '../Context/Theme/ThemeContext';
import DataContext from '../Context/Context';
import { onAuthStateChanged } from 'firebase/auth';


const collections = [Collection1, Collection2, Collection3, Collection4];

const HomeScreen = () => {
  const colors = useThemeColors();
  const {isDarkMode} = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation();

  // const [name, setName] = useState('');
  const {name,setName} = useContext(DataContext);

  const scrollX = new Animated.Value(0);
  const [profileImage, setProfileImage] = useState(null);
  const [loginPromptShown, setLoginPromptShown] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [location, setLocation] = useState(null); 
  const [loading, setLoading] = useState(true);


  const requestNotificationPermissions = async () => {
    try {
      // Check existing permissions
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
  
      // Request permissions if not already granted
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
        if (newStatus !== 'granted') {
          Alert.alert('Notification permissions not granted');
          return;
        }
      }

  
      // Get the push token if permission is granted
      if (finalStatus === 'granted') {
        const { data: token } = await Notifications.getExpoPushTokenAsync();
        console.log('Push Token:', token); // Optional: Log the push token for testing
        
        // Save the token to Firestore under the current user's document
        const currentUser = auth.currentUser;
        if (currentUser && token) {
          await setDoc(doc(db, 'users', currentUser.uid), { pushToken: token }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error while requesting notification permissions or saving token:', error);
      Alert.alert('Failed to set up notifications', 'Please check your internet connection.');

    }
  };

  useEffect(() => {
    requestNotificationPermissions(); // Call the function to request permissions on mount
  }, []);

 
  useEffect(() => {
    const fetchCollections = async () => {
      
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 
            'application/json',
            'x-api-key': '73b5488d384f4be88dab537a9276bd0f',
          },
        };
        const response = await axios.get('https://api.opensea.io/api/v2/collections?chain=ethereum', options);
        //console.log(response.data); // Log the data for debugging
      } catch (error) {
        console.error('Error fetching collections:', error.response?.data || error.message);
      }
    };
  
    fetchCollections();
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
        surname: collection.surname,
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
    // Monitor authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);

        // Listen for real-time updates on the user's data
        const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User Data:', userData);

            setName(userData.name);
            setProfileImage(
              userData.ProfileImage 
                ? { uri: userData.ProfileImage } 
                : { uri: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }
            );

            // Handle location
            if (!userData.country) {
              requestLocationPermission(); // Ensure this function is defined in your code
            } else {
              setLocation(userData.country);
            }
          } else {
            console.log("No such document!");
          }
          setLoading(false); // Set loading to false once data is loaded
        });

        // Cleanup user snapshot listener on component unmount
        return () => unsubscribeUser();
      } else {
        console.log("No current user logged in.");
        setLoading(false);
      }
    });

    // Cleanup auth state listener on component unmount
    return () => unsubscribeAuth();
  }, []); // Empty dependency array ensures this runs only once when the component mounts




    // Request Location Permission
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch your country.');
        return;
      }
  
      const location = await Location.getCurrentPositionAsync({});
      fetchCountryFromCoordinates(location.coords.latitude, location.coords.longitude);
    };
  
    // Fetch country from coordinates using reverse geocoding (OpenCage or Google Maps API)
    const fetchCountryFromCoordinates = async (latitude, longitude) => {
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        const country = reverseGeocode[0]?.country;
        if (country) {
          setLocation(country);
          storeLocationInFirestore(country); // Store in Firestore
        }
      } catch (error) {
        console.error('Error fetching country:', error);
      }
    };
  
    // Store country in Firestore
    const storeLocationInFirestore = async (country) => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          location: country,
        });
      }
    };

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
          <Text style={[styles.collectionName,{color: colors.text}]}>{item.name}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderVerticalItem = ({ item }) => (
    <TouchableOpacity onPress={() => onCollectionPress(item)} activeOpacity={0.8}>
      <View style={styles.topSellingItem}>
        <Image source={item.image} style={styles.topSellingImage} />
        <View style={styles.topSellingInfo}>
          <Text style={[styles.topSellingName, {color: colors.text}]} numberOfLines={1} ellipsizeMode='tail'>{item.name}</Text>
          <Text style={[styles.topSellingPrice, {color: colors.ethVolumeAmount}]}>{item.floorPrice}<Text style={tw`text-[#6d28d9]`}> ETH</Text></Text>
          <Text style={[styles.topSellingVolume, {color: colors.ethVolumeAmount}]}>{item.volume} <Text style={tw`text-[#2563eb]`}> ETH</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCollectionHeader = () => (
    <View style={styles.collectionHeader}>
      <Text style={[styles.headerText, {color: colors.ethVolumeAmount}]}>Collection</Text>
      <Text style={[styles.headerText, {color: colors.ethVolumeAmount}]}>Floor Price</Text>
      <Text style={[styles.headerText, {color: colors.ethVolumeAmount}]}>Volume</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea,{ backgroundColor: colors.background}]}>
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={() => (
            <View>
              <View style={styles.header}>
                <Pressable onPress={toggleDrawer}>
                  <Ionicons name="menu-sharp" size={28} color={isDarkMode ? colors.text : "black"} />
                </Pressable>
                <TouchableOpacity onPress={ () => navigation.navigate('ProfileScreen', {showButton: true})}>
                  <Image source={profileImage} style={styles.profileImage} />
                </TouchableOpacity>
              </View>
              <View style={styles.greetingContainer}>
                <Text style={[styles.greeting, {color: colors.text}]}>
                  Hello, 
                  {loading ? (
                      <ActivityIndicator size="small" color="#D3D3D3" style={{justifyContent:'center'}} />
                    ) : (
                      <Text style={styles.username}> {name}</Text>
                    )}
                </Text>
              </View>
              <View style={[styles.sectionHeader, {color: colors.text}]}>
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
              <View style={[styles.sectionHeader, {color: colors.text}]}>
                <Text style={styles.sectionTitle}>Top Selling</Text>
                
              </View>
              {renderCollectionHeader()}
            </View>
          )}
          data={collectionData}
          renderItem={renderVerticalItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.verticalList, { paddingBottom: tabBarHeight }]}
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
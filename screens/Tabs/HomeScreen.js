import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Animated, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from '../../config/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Collection1, Collection2, Collection3, Collection4 } from '../NFT/dummy';

const collections = [Collection1, Collection2, Collection3, Collection4];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const scrollX = new Animated.Value(0);
  const [profileImage, setProfileImage] = useState(null);
  const [loginPromptShown, setLoginPromptShown] = useState(false);  // Track if the login prompt has been shown

  // Function to ask for login method choice unfortunately, this will not work i will try after a build on the testing env it works well !
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

  // Function to check if user has already chosen a login method 
  const checkLoginPreference = async () => {
    const loginMethod = await AsyncStorage.getItem('loginMethod');
    const isPromptShown = await AsyncStorage.getItem('loginPromptShown'); // Check if prompt was shown

    // If no login method is set and prompt wasn't shown, ask for preference
    if (!loginMethod && !isPromptShown) {
      askLoginPreference();
      await AsyncStorage.setItem('loginPromptShown', 'true');  // Set flag that the prompt was shown
    }
  };

  // Run the checkLoginPreference on component mount
  useEffect(() => {
    checkLoginPreference();
  }, []);

  // Fetch profile image from Firestore
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

  // Function to toggle the side menu drawer
  const toggleDrawer = () => {
    navigation.getParent()?.toggleDrawer();
  };

  // Function to navigate to CollectionDetailScreen
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
      <TouchableOpacity onPress={() => onCollectionPress(item)}>
        <Animated.View style={[styles.collectionItem, { transform: [{ scale }] }]}>
          <Image source={item.image} style={styles.collectionImage} />
          <Text style={styles.collectionName}>{item.name}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderVerticalItem = ({ item }) => (
    <View style={styles.topSellingItem}>
      <Image source={item.image} style={styles.topSellingImage} />
      <View style={styles.ethAndButtonContainer}>
        <View style={styles.ethContainer}>
          <Text style={styles.ethText}>0.31</Text>
          <Text style={styles.ethText}>ETH</Text>
        </View>
        <TouchableOpacity style={styles.placeBidButton}>
          <Text style={styles.placeBidText}>Place Bid</Text>
        </TouchableOpacity>
      </View>
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
                <TouchableOpacity>
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
                <TouchableOpacity onPress={() => { /* Navigate to the collections list */ }}>
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
                <TouchableOpacity onPress={() => { /* Navigate to top selling list */ }}>
                  <Text style={styles.sectionLink}>See All</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          data={collections.slice(0, 3)}
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
    marginTop: hp('2%'),
    paddingVertical: hp('4%'), 
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
    backgroundColor:'grey', 
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
    fontWeight:'600',
  },
  verticalList: {
    paddingTop: 10,
    flexGrow: 1,
  },
  topSellingItem: {
    marginTop: hp('2%'),
    marginLeft: wp('3%'), 
    width: wp('90%'), 
    padding: '1%',
    height: hp('20%'), 
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
  },
  topSellingImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp('3%'), 
    resizeMode: 'cover',
  },
  placeBidButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: hp('1.5%'), 
    paddingHorizontal: wp('5%'), 
    borderRadius: wp('5%'), 
  },
  placeBidText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ethAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: hp('1.5%'), 
    width: '90%',
    paddingHorizontal: wp('2.5%'), 
  },
  ethContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: hp('0.8%'), 
    borderRadius: wp('5%'),
  },
  ethText: {
    marginRight: wp('1%'), 
  },
});

export default HomeScreen;



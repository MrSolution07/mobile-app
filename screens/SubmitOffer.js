import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView,KeyboardAvoidingView,Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { auth, db } from '../config/firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; 
import * as Notifications from 'expo-notifications';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const SubmitOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { nft } = route.params; // Get the NFT data passed from the previous screen
  const [offerAmount, setOfferAmount] = useState('');
  const [loading, setLoading] = useState();

  // Request permission and get push token
  useEffect(() => {
    const registerForPushNotifications = async () => {
      // Request permissions for notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted', 'You need to enable notifications for this app to receive offers.');
        return;
      }

      // Get the push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;

      // Save the push token to Firestore
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { pushToken: token });
      }
    };

    registerForPushNotifications();
  }, []);

  const latestBid = nft && nft.bids && nft.bids.length > 0 ? nft.bids[nft.bids.length - 1] : null;

  const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15); 
};

const handleOfferSubmit = async () => {
  setLoading(true);
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === nft.creatorId) {
    Alert.alert("Sorry", "You can't make an offer on your own NFT.");
    setLoading(false);
    return;
  }

  if (!offerAmount || isNaN(offerAmount) || parseFloat(offerAmount) <= 0) {
    Alert.alert('Error', 'Please enter a valid offer amount.');
    setLoading(false);
    return;
  }

  try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
          Alert.alert('Error', 'You must be logged in to submit an offer.');
          return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};

      if (!userData) {
          Alert.alert('Error', 'User data not found.');
          return;
      }

      const userName = userData.name || currentUser.displayName || 'Anonymous';
      const bidderImage = userData.ProfileImage || 'https://via.placeholder.com/150';

      // Check if NFT exists and has required properties
      if (!nft || !nft.title || !nft.creatorId) {
          Alert.alert('Error', 'Invalid NFT data.');
          return;
      }

      const userEthAmount = userData.ethAmount || 0;
      if (parseFloat(offerAmount) > userEthAmount) {
          Alert.alert('Insufficient funds', 'You do not have enough ETH to make this offer.');
          return;
      }

      const newBid = {
          id: generateUniqueId(),
          bidderId: currentUser.uid,
          bidderName: userName,
          bidderImage: bidderImage,
          offerAmount: parseFloat(offerAmount),
          timestamp: new Date().toISOString(), 
      };

      const nftRef = doc(db, 'nfts', nft.id);
      const nftDoc = await getDoc(nftRef);

      if (!nftDoc.exists()) {
          Alert.alert('Error', 'NFT not found.');
          return;
      }

      const nftData = nftDoc.data();
      const existingBids = Array.isArray(nftData.bids) ? nftData.bids : [];
      const updatedBids = [...existingBids, newBid];

      
      await updateDoc(nftRef, { bids: updatedBids });
      const creatorRef = doc(db, 'users', nft.creatorId);
      const creatorDoc = await getDoc(creatorRef);

      if (!creatorDoc.exists()) {
          Alert.alert('Error', 'Creator not found.');
          return;
      }

      const creatorData = creatorDoc.data();
      const pushToken = creatorData.pushToken;
      if (pushToken) {
          const notificationContent = {
              to: pushToken,
              sound: 'default',
              title: 'New Offer',
              body: `You have a new offer of ${offerAmount} ETH on your NFT "${nft.title}" by ${userName}`,
              data: { nftId: nft.id },
          };

          await Notifications.scheduleNotificationAsync({
              content: notificationContent,
              trigger: null,
          });
      } else {
          Alert.alert('Error', 'Creator does not have a push token.');
      }

      setOfferAmount('');
      Alert.alert('Success', `Your offer of ${offerAmount} ETH has been submitted!`);
      navigation.goBack();

  } catch (error) {
    console.error('Error submitting offer:', error);
    Alert.alert('Error', 'There was an issue submitting your offer. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow`}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled">

        <View style={styles.container}>
          <Image source={nft.imageUrl } style={styles.backgroundImage} />
          <View style={styles.card}>
            <Text style={styles.title}>Make an Offer on {nft.title}</Text>
            <Text style={styles.nftPrice}>
              Price: {nft.price} ETH <FontAwesome5 name="ethereum" size={16} color="black" />
            </Text>
            {latestBid ? (
              <Text style={styles.latestBid}>
                Latest Bid: {latestBid.offerAmount} ETH <FontAwesome5 name="ethereum" size={16} color="black" />
              </Text>
            ) : (
              <Text style={styles.latestBid}>No bids available.</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter your offer amount in ETH"
              keyboardType="numeric"
              value={offerAmount}
              onChangeText={setOfferAmount}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleOfferSubmit}>
              { loading ? (
                <ActivityIndicator size="large" color="#075eec"/> ):(

                <Text style={styles.submitButtonText}>Submit Offer</Text>
                )}
               </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignContent:'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 5,
    width: wp('90%'),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('60%'),
    marginBottom: hp('8%'),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nftPrice: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  latestBid: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SubmitOfferScreen;

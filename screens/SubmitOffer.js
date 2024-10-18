import React, { useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';


const SubmitOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { nft, collection } = route.params; 
  const [offerAmount, setOfferAmount] = useState('');

  // Gets the latest bids
  const latestBid = nft && nft.bids && nft.bids.length > 0 ? nft.bids[nft.bids.length - 1] : null;

  const handleOfferSubmit = () => {
    if (!offerAmount) {
      Alert.alert('Error', 'Please enter a valid offer amount.');
      return;
    }

    console.log(`Offer submitted for ${nft ? nft.name : collection.name}: ${offerAmount} ETH`);

    setOfferAmount('');
    Alert.alert('Success', `Your offer of ${offerAmount} ETH has been submitted!`);
    navigation.goBack(); 
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView  contentContainerStyle={tw`flex-grow`}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled">

    <View style={styles.container}>
      <Image source={collection ? collection.image : nft.image} style={styles.backgroundImage} />

        <View style={styles.card}>
          <Text style={styles.title}>
            Make an Offer on {collection ? collection.name : nft.name}
          </Text>

          <Text style={styles.nftPrice}>
            Price: {nft ? nft.price : collection.volumePrice} ETH <FontAwesome5 name="ethereum" size={16} color="black" />
          </Text>

          {latestBid ? (
            <Text style={styles.latestBid}>
              Latest Bid: {latestBid.price} ETH <FontAwesome5 name="ethereum" size={16} color="black" />
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
            <Text style={styles.submitButtonText}>Submit Offer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
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
    alignItems:'center',
    justifyContent:'center',
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

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions,Platform } from 'react-native';
import { useRoute,useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';


const { width } = Dimensions.get('window'); // Get screen width for dynamic positioning

const ArtDetailsScreen = () => {
  const route = useRoute();
  const { nft } = route.params; // Receiving NFT data from the previous screen

  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('Details'); // State to track the active tab
  const underlinePosition = useRef(new Animated.Value(0)).current; // Animated value for underline position

  const underlineWidth = wp('18%');
  const tabOffsetMap = {
    Details: Platform.OS === 'ios'? wp('3.5%') : wp('3%'),
    Owners:  Platform.OS === 'ios'? wp('27%'): wp('26%'),
    Bids:  Platform.OS === 'ios'? wp('48%') : wp('48%'),
    History: Platform.OS ==='ios'? wp('68.5%') : wp('69%'),
  };

  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: tabOffsetMap['Details'],
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, []);

  // Tab rendering function
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{nft.description}</Text>
          </View>
        );
      case 'Owners':
        return (
          <View style={styles.ownersContainer}>
            <Text style={styles.ownersTitle}>Owner</Text>
            <Text style={styles.ownerName}>Creator: {nft.creator}</Text>
          </View>
        );
      case 'Bids':
        return (
          <View style={styles.bidsContainer}>
            <Text style={styles.bidsTitle}>Bids</Text>
            {nft.bids && nft.bids.length > 0 ? (
              nft.bids.map((bid) => (
                <View key={bid.id} style={styles.bidItem}>
                  <Image source={bid.image} style={styles.bidderImage} />
                  <View style={styles.bidderInfo}>
                    <Text style={styles.bidderName}>{bid.name}</Text>
                    <Text style={styles.bidPrice}>{bid.price} ETH</Text>
                    <Text style={styles.bidDate}>{bid.date}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>No bids available.</Text>
            )}
          </View>
        );
      case 'History':
        return (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>History</Text>
            {/* Render any historical details here */}
            <Text>No history available.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  // Function to handle tab switching with animation
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    Animated.timing(underlinePosition, {
      toValue: tabOffsetMap[tab],
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
    <ScrollView contentContainerStyle={styles.container}>

      <Image 
        source={nft.image}  // Dynamically loading the NFT image from passed data
        style={styles.artImage}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.creatorName}>{nft.creator}</Text>
        <Text style={styles.artNumber}>{nft.name}</Text>

        {/* Tabs for Details, Owners, Bids, History */}
        <View style={styles.tabContainer}>
          {['Details', 'Owners', 'Bids', 'History'].map((tab, index) => (
            <TouchableOpacity key={tab} onPress={() => handleTabPress(tab, index)}>
              <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
          {/* Animated underline */}
          <Animated.View
            style={[
              styles.underline,
              { width: underlineWidth, transform: [{ translateX: underlinePosition }] },
            ]}
          />
        </View>

        {/* Render content based on selected tab */}
        {renderTabContent()}

        {/* Current Bid Section */}
        <View style={styles.bidContainer}>
          <Text style={styles.currentBidLabel}>Current Bid</Text>
          <Text style={styles.currentBid}>
            {nft.price} ETH <FontAwesome5 name="ethereum" size={16} color="black" />
          </Text>
          <TouchableOpacity style={styles.offerButton} onPress={() => navigation.navigate('SubmitOffer',{nft})}>
            <Text style={styles.offerButtonText}>Make Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    paddingBottom: hp('2%'),
  },
  artImage: {
    width: '100%',
    height: hp('45%'), // Adjust for responsiveness
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    marginTop: -wp('10%'),
  },
  creatorName: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#000',
  },
  artNumber: {
    fontSize: hp('2%'),
    color: '#aaa',
    marginTop: hp('0.5%'),
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2%'),
    position: 'relative', 
  },
  tab: {
    fontSize: hp('2%'),
    color: '#aaa',
    textAlign: 'center',
  },
  activeTab: {
    fontWeight: 'bold',
    color: '#000',
  },
  underline: {
    height: 2,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  descriptionContainer: {
    marginTop: hp('3%'),
  },
  descriptionTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#000',
  },
  descriptionText: {
    fontSize: hp('2%'),
    color: '#555',
    marginTop: hp('1%'),
  },
  ownersContainer: {
    marginTop: hp('3%'),
  },
  ownersTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#000',
  },
  ownerName: {
    fontSize: hp('2%'),
    color: '#555',
  },
  bidsContainer: {
    marginTop: hp('3%'),
  },
  bidsTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#000',
  },
  bidItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  bidderImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    marginRight: wp('3%'),
  },
  bidderInfo: {
    flex: 1,
  },
  bidderName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  bidPrice: {
    fontSize: hp('2%'),
    color: '#007bff',
    marginBottom: hp('0.5%'),
  },
  bidDate: {
    fontSize: hp('1.8%'),
    color: '#666',
  },
  bidContainer: {
    marginTop: hp('8%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentBidLabel: {
    fontSize: hp('2%'),
    color: '#777',
  },
  currentBid: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#000',
  },
  historyContainer:{
    top:hp('1%'),
  },
  historyTitle:{
    top:hp('5%'),
  },
  offerButton: {
    backgroundColor: '#222',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
  },
  offerButtonText: {
    color: '#fff',
    fontSize: hp('2.2%'),
  },
});

export default ArtDetailsScreen;

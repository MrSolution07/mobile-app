import React, { useState, useRef, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useThemeColors } from './Context/Theme/useThemeColors';
import { useTheme } from './Context/Theme/ThemeContext';

const { width } = Dimensions.get('window');

const ArtDetailsScreen = () => {
  const colors = useThemeColors();
  const route = useRoute();
  const { nft } = route.params; // Receiving NFT data from the previous screen

  const [bids, setBids] = useState([]);
  const [loadingBids, setLoadingBids] = useState(true);

  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('Details');
  const underlinePosition = useRef(new Animated.Value(0)).current;

  const underlineWidth = wp('18%');
  const tabOffsetMap = {
    Details: Platform.OS === 'ios' ? wp('3.5%') : wp('3%'),
    Owners: Platform.OS === 'ios' ? wp('27%') : wp('26%'),
    Bids: Platform.OS === 'ios' ? wp('48%') : wp('48%'),
    History: Platform.OS === 'ios' ? wp('68.5%') : wp('69%'),
  };

  useEffect(() => {
    Animated.timing(underlinePosition, {
      toValue: tabOffsetMap['Details'],
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, []);


  

  // Fetch bids from Firestore
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const nftDocRef = doc(db, 'nfts', nft.id);
        const nftDoc = await getDoc(nftDocRef);
        if (nftDoc.exists()) {
          const nftData = nftDoc.data();
          setBids(nftData.bids || []);
        }
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoadingBids(false);
      }
    };

    fetchBids();
  }, [nft.id]);

  // Tab rendering function
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return (
          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionTitle,{color:colors.blueText}]}>Description</Text>
            <Text style={[styles.descriptionText,{color:colors.text}]}>{nft.description}</Text>
          </View>
        );
      case 'Owners':
        return (
          <View style={styles.ownersContainer}>
            <Text style={[styles.ownersTitle,{color:colors.blueText}]}>Owner</Text>
            <Text style={[styles.ownerName,{color:colors.text}]}>Creator: {nft.uploadedBy}</Text>
          </View>
        );
      case 'Bids':
        return (
          <View style={styles.bidsContainer}>
            <Text style={[styles.bidsTitle,{color:colors.blueText}]}>Bids</Text>
            {loadingBids ? (
        <ActivityIndicator size="large" color="#000" />
      ) : bids.length > 0 ? (
        bids.map((bid, index) => {
          const bidDate = bid.timestamp
            ? (bid.timestamp.toDate ? bid.timestamp.toDate() : new Date(bid.timestamp)).toLocaleDateString()
            : 'Unknown date';

          return (
            <View key={index} style={styles.bidItem}>
              <Image source={{ uri: bid.bidderImage }} style={styles.bidderImage} />
              <View style={styles.bidderInfo}>
                <Text style={[styles.bidderName, {color:colors.text}]}>{bid.bidderName}</Text>
                <Text style={styles.bidPrice}>{bid.offerAmount} ETH</Text>
                <Text style={[styles.bidDate,{color:colors.inactiveTabBackground}]}>{bidDate}</Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={[styles.noBidsText, {color:colors.text}]}>No bids available.</Text>
      )}
          </View>
        );
      case 'History':
        return (
          <View style={styles.historyContainer}>
            <Text style={[styles.historyTitle,{color:colors.blueText}]}>History</Text>
            <Text style={[styles.noHistoryText, {color: colors.text}]}>No history available.</Text>
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
        <Image source={{uri: nft.imageUrl }} style={styles.artImage}
        />

        <View style={[styles.detailsContainer, {backgroundColor:colors.background}]}>
          <Text style={[styles.creatorName,{color:colors.text}]}>{nft.uploadedBy}</Text>
          <Text style={[styles.artNumber,{color:colors.text}]}>{nft.name}</Text>

          <View style={styles.tabContainer}>
            {['Details', 'Owners', 'Bids', 'History'].map((tab) => (
              <TouchableOpacity key={tab} onPress={() => handleTabPress(tab)}>
                <Text style={[styles.tab,{color: colors.inactiveTabBackground} ,activeTab === tab && styles.activeTab,{color:colors.text}]}>{tab}</Text>
              </TouchableOpacity>
            ))}
            <Animated.View
              style={[
                styles.underline,
                {backgroundColor: colors.text},
                { width: underlineWidth, transform: [{ translateX: underlinePosition }] },
              ]}
            />
          </View>

          {renderTabContent()}

          <View style={styles.bidContainer}>
            <Text style={[styles.currentBidLabel, {color:colors.text}]}>Current Bid</Text>
            <Text style={[styles.currentBid,{color: colors.purpleText}]}>
              {nft.price} ETH <FontAwesome5 name="ethereum" size={16} color="black" />
            </Text>
            <TouchableOpacity style={[styles.offerButton,{backgroundColor: colors.tabbackground}]} onPress={() => navigation.navigate('SubmitOffer', { nft })}>
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
    // backgroundColor: '#000',
    paddingBottom: hp('2%'),
  },
  artImage: {
    width: '100%',
    height: hp('45%'),
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    marginBottom:-50,
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
    fontSize: hp('2.3%'),
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
    fontSize: hp('2.4%'),
    fontWeight: 'bold',
    color: '#000',
  },
  ownerName: {
    fontSize: hp('2%'),
    color: '#555',
    marginTop: 8,
  },
  bidsContainer: {
    marginTop: hp('3%'),
  },
  bidsTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  noBidsText:{
    color: '#fff',
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
  historyContainer: {
    marginTop: hp('3%'),
  },
  historyTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    color: '#000',
  },
  noHistoryText:{
    color:'#fff',
    marginTop: 8,
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

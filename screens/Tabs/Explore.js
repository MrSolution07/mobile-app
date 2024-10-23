import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  SafeAreaView,
  View,
  Image,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Polygon } from 'react-native-svg';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import debounce from 'lodash.debounce'; 
import {useThemeColors} from '../Context/Theme/useThemeColors';

const Hexagon = ({ price }) => (
  <View style={styles.hexagonContainer}>
    <Svg height={hp('15%')} width={150} viewBox="0 0 100 100" style={styles.svg}>
      <Polygon points="50,5 100,25 100,75 50,95 0,75 0,25" fill="white" />
    </Svg>
    <Text style={styles.priceText}>{price} ETH</Text>
  </View>
);

const Explore = ({ navigation }) => {
  const colors = useThemeColors();
  const [nfts, setNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('NFTs');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);



  useFocusEffect(
    React.useCallback(() => {
      const fetchCards = async () => {
        const querySnapshot = await getDocs(collection(db, 'nfts'));
        const fetchedNfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNfts(fetchedNfts);
      };
      fetchCards();
    }, [])
  );

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'nfts'));
        const fetchedNfts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageUrl: { uri: doc.data().imageUrl }, // Ensure imageUrl is in the right format
        }));
        setNfts(fetchedNfts);
        setFilteredData(fetchedNfts); // Set initial filteredData to fetched NFTs
      } catch (error) {
        console.error("Error fetching NFTs: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNfts();
  }, []);

  useEffect(() => {
    const updateFilteredData = () => {
      const filteredNFTs = nfts.filter(nft => nft.title.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredData(filteredNFTs);
    };

    updateFilteredData();
  }, [searchQuery, nfts]); // Removed activeTab since we're only filtering NFTs

  const debouncedSearch = debounce((text) => setSearchQuery(text), 300);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ArtDetailsScreen', { nft: item })}
      accessibilityLabel={`Navigate to ${item.title}`}
      accessibilityHint={`View details of ${item.title}`}
    >
      <Hexagon price={item.price} />
      <Image source={item.imageUrl} style={styles.nftImage} />
      <View style={styles.nftNameContainer}>
        <Text style={styles.nftName}>{item.title}</Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
    <View style={{backgroundColor: colors.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={colors.text} />
    </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container,{backgroundColor: colors.background}]}>
      <View style={styles.pageContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={debouncedSearch}
        />
        <View style={styles.tabs}>
          {['NFTs', 'Collections', 'Recent'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id} 
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    // backgroundColor: '#fff',
  },
  pageContainer: {
    marginTop: Platform.OS === 'ios' ? hp('5%') : hp('2%'), 
    flex: 1,
  },
  searchBar: {
    height: hp('7%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    marginBottom: hp('2%'),
    fontSize: hp('2%'),
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    marginHorizontal: wp('2%'),
    position: 'relative',
  },
  nftImage: {
    width: wp('40%'),
    height: hp('20%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
  },
  nftNameContainer: {
    position: 'absolute',
    top: hp('15%'),
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderRadius: 5,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  nftName: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'VarelaRound_400Regular', 
  },
  hexagonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: hp('-10%'),
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: wp('12%'),
  },
  priceText: {
    position: 'absolute',
    top: hp('10%'),
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('5%'),
    marginTop: hp('2%'),
  },
  tabButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: wp('2%'),
    backgroundColor: 'rgba(128, 128, 128, 0.1)', 
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: hp('2%'),
    color: '#666',
    fontFamily: 'Roboto_400Regular', 
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: '#666',
  },
  svg: {
    borderRadius: 50,
  },
});

export default Explore;


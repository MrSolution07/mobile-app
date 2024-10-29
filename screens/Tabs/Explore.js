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
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Svg, { Polygon } from 'react-native-svg';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import debounce from 'lodash.debounce'; 
import { Collection1, Collection2, Collection3, Collection4, Collection5, Collection6, Collection7, Collection8 } from '../NFT/dummy';
import {useThemeColors} from '../Context/Theme/useThemeColors';
import { useTheme } from '../Context/Theme/ThemeContext';
import tw from 'twrnc';

const Hexagon = ({ price,isDarkMode,colors }) => (
  <View style={styles.hexagonContainer}>
    <Svg height={hp('15%')} width={150} viewBox="0 0 100 100" style={styles.svg}>
      <Polygon points="50,5 100,25 100,75 50,95 0,75 0,25" fill={isDarkMode ? "black" : "white"} />
    </Svg>
    <Text style={[styles.priceText, {color:colors.text}]} numberOfLines={2} ellipsizeMode="tail">{price} ETH</Text>
  </View>
);

const collections = [Collection1, Collection2, Collection3, Collection4, Collection5, Collection6, Collection7, Collection8];

const Explore = ({ navigation }) => {
  const colors = useThemeColors();
  const {isDarkMode} = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const [nfts, setNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('NFTs');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [collectionData, setCollectionData] = useState([]);

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
    const fetchCollections = () => {
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
    
    fetchCollections();
  }, []);

  useEffect(() => {
    if (activeTab === 'NFTs') {
      const filteredNFTs = nfts.filter((nft) =>
        nft.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filteredNFTs);
    } else if (activeTab === 'Collections') {
      const filteredCollections = collectionData.filter((collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filteredCollections);
    }
  }, [searchQuery, nfts, collectionData, activeTab]);

  const debouncedSearch = debounce((text) => setSearchQuery(text), 300);

  const renderItem = ({ item }) => {
    if (activeTab === 'NFTs') {
      return (
        <Pressable
          style={styles.itemContainer}
          onPress={() => navigation.navigate('ArtDetailsScreen', { nft: item })}
          accessibilityLabel={`Navigate to ${item.title}`}
          accessibilityHint={`View details of ${item.title}`}
        >
          <Hexagon price={item.price} isDarkMode={isDarkMode} colors={colors}/>
          <Image source={Platform.OS === 'ios' ? { uri: item.imageUrl } : item.imageUrl} 
           style={styles.nftImage} 
          />
          <View style={styles.nftNameContainer}>
            <Text style={styles.nftName}>{item.title}</Text>
          </View>
        </Pressable>
      );
    } else if (activeTab === 'Collections') {
      return (
        <Pressable style={styles.itemContainer}
        onPress={() => navigation.navigate('CollectionDetailScreen', { collection: item })}>
          
          <Image source={item.image} style={styles.nftImage} />
          <View style={styles.nftNameContainer}>
            <Text style={styles.nftName}>{item.name}</Text>
           
           
          </View>
        </Pressable>
      );
    }
  };

  if (loading) {
    return (
    <View style={{backgroundColor: colors.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={colors.text} />
    </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container,{backgroundColor: colors.background}]} >
      <View style={styles.pageContainer}>
        <View style={tw`items-center justify-center`} >
        <TextInput
          style={[styles.searchBar,{color:colors.text}]}
          placeholder="Search"
          onChangeText={debouncedSearch}
          placeholderTextColor={colors.text}
        />
        </View>
        <View style={styles.tabs}>
          {['NFTs', 'Collections', 'Recent'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                { backgroundColor: activeTab === tab ? colors.activeTabBackground : colors.inactiveTabBackground },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
                {color: colors.text}]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || item.name} // Collections use 'name' as key
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={{ paddingBottom: tabBarHeight }}
          initialNumToRender={5}
        />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
    // backgroundColor: '#fff',
  },
  pageContainer: {
    marginTop: Platform.OS === 'ios' ? hp('5%') : hp('2%'),
    flex: 1,
  },
  searchBar: {
    height: hp('6%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    fontSize: hp('2%'),
    width : wp('90%'),
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
    top: -hp('10%'),
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
    width: 100,
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

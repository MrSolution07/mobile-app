import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, FlatList, StyleSheet, Text, TextInput, Pressable, TouchableOpacity, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Polygon } from 'react-native-svg';
import { Collection1, Collection2, Collection3, Collection4, Collection5, Collection6, Collection7, Collection8, Collection9, Collection10 } from '../NFT/dummy';

const Hexagon = ({ price }) => (
  <View style={styles.hexagonContainer}>
    <Svg height={hp('15%')} width={150} viewBox="0 0 100 100" style={styles.svg}>
      <Polygon
        points="50,5 100,25 100,75 50,95 0,75 0,25"
        fill="white"
      />
    </Svg>
    <Text style={styles.priceText}>{price} ETH</Text>
  </View>
);

const Explore = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('NFTs');
  const [searchQuery, setSearchQuery] = useState('');
  const collections = [Collection1, Collection2, Collection3, Collection4, Collection5, Collection6, Collection7, Collection8, Collection9, Collection10];
  const allNFTs = collections.flatMap(collection => collection.nfts);
  const [filteredData, setFilteredData] = useState(allNFTs);

  useEffect(() => {
    if (activeTab === 'NFTs') {
      const filteredNFTs = allNFTs.filter(nft => nft.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredData(filteredNFTs);
    } else if (activeTab === 'Collections') {
      const filteredCollections = collections.filter(collection => collection.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredData(filteredCollections);
    }
  }, [searchQuery, activeTab]);

  useEffect(() => {
    const initialTab = route.params?.initialTab || 'NFTs';
    setActiveTab(initialTab);
  }, [route.params?.initialTab]);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() => activeTab === 'NFTs'
        ? navigation.navigate('ArtDetailsScreen', { nft: item })
        : navigation.navigate('CollectionDetailScreen', { collection: item })
      }
    >
      {activeTab === 'NFTs' && <Hexagon price={item.price} />}
      <Image source={item.image} style={activeTab === 'NFTs' ? styles.nftImage : styles.collectionImage} />
      {activeTab === 'NFTs' ? (
        <View style={styles.nftNameContainer}>
          <Text style={styles.nftName}>{item.name}</Text>
        </View>
      ) : (
        <View style={styles.CollectionNameContainer}>
          <Text style={styles.collectionName}>{item.name}</Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <View style={styles.tabs}>
          {['NFTs', 'Collections', 'Recent'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabButton, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || item.name}
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
    padding: wp('4%'),
    backgroundColor: '#fff',
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
  collectionImage: {
    width: wp('40%'),
    height: hp('25%'),
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
  CollectionNameContainer: {
    marginTop: hp('2%'),
  },
  collectionName: {
    textAlign: 'center',
    color: '#333333',
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

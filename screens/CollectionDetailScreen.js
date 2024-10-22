import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Pressable, TouchableOpacity,Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Polygon } from 'react-native-svg';

const Hexagon = ({ price }) => (
  <View style={styles.hexagonContainer}>
    <Svg height={hp('15%')} width={150} viewBox="0 0 100 100" style={styles.svg}>
      <Polygon
        points="50,5 100,25 100,75 50,95 0,75 0,25"
        fill="white"
      />
    </Svg>

    <Text style={styles.ethPrice}>{price} ETH</Text> 
  </View>
);

const CollectionDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { collection } = route.params; 

  const totalVolumePrice = collection.nfts.reduce((sum, nft) => sum + nft.price, 0);

  // Navigates to SubmitOfferScreen with the collection data
  const handleMakeCollectionOffer = () => {
    navigation.navigate('SubmitOffer', {
      collection: {
        name: collection.name,
        image: collection.image,
        volumePrice: totalVolumePrice,
      },
    });
  };

  const onNftPress = (item) => {
    console.log("NFT Pressed:", item);
    navigation.navigate('ArtDetailsScreen', { nft: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onNftPress(item)} activeOpacity={0.8} style={styles.nftItem}>
      <Hexagon price={item.price} />
      <Image source={item.imageUrl} style={styles.nftImage} />
      <Text style={styles.nftName}>{item.name}</Text>
      <Text style={styles.nftCreator}>Creator: {item.uploadedBy}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.collectionTitle}>{collection.name}</Text>
      <FlatList
        data={collection.nfts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.nftList}
        numColumns={2}
      />
      
      <TouchableOpacity style={styles.makeOfferButton} onPress={handleMakeCollectionOffer}>
        <Text style={styles.makeOfferButtonText}>Make Collection Offer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 6,
  },
  collectionTitle: {
    marginTop: Platform.OS === 'ios' ? hp('3%') : hp('4%'), 
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  nftList: {
    paddingHorizontal: wp('4%'),
  },
  nftItem: {
    marginBottom: hp('2%'),
    padding: hp('1.5%'),
    borderRadius: wp('2%'),
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
    margin: '1%',
    width: wp('45%'), 
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%', 
    height: hp('25%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  nftName: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  nftCreator: {
    fontSize: hp('2%'),
    fontStyle: 'italic',
    color: '#666',
    marginBottom: hp('0.5%'),
  },
  hexagonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: hp('-8%'),
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: wp('12%'),
  },
  ethPrice: {
    position: 'absolute',
    top: hp('9.5%'),
    textAlign: 'center',
    fontSize: hp('1.9%'),
    fontWeight: 'bold',
    color: '#000',
  },
  makeOfferButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: wp('4%'),
  },
  makeOfferButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
  },
});

export default CollectionDetailScreen;

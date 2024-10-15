import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Pressable } from 'react-native';
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
  const { collection } = route.params; // Get the collection passed from HomeScreen

  // Navigate to ArtDetailsScreen when an NFT is clicked
  const onNftPress = (nft) => {
    navigation.navigate('ArtDetailsScreen', { nft });
  };

  // Render individual NFTs from the collection
  const renderItem = ({ item }) => (
    <Pressable onPress={() => onNftPress(item)}>
      <View style={styles.nftItem}>
        <Hexagon price={item.price} />
        <Image source={item.image} style={styles.nftImage} />
        <Text style={styles.nftName}>{item.name}</Text>
        <Text style={styles.nftCreator}>Creator: {item.creator}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.collectionTitle}>{collection.name}</Text>
      <FlatList
        data={collection.nfts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.nftList}
      />
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
    marginTop: hp('8%'),
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
    // backgroundColor: '#f9f9f9',
    padding: hp('1.5%'), 
    borderRadius: wp('2%'),
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // elevation: 5,
    alignItems: 'center',
    margin: '1%', 
    width:wp('80%'),
    overflow:'hidden',
  },
  nftImage: {
    width: '80%',
    height: hp('25%'), 
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  nftName: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('0.5%'),
  },
  svg:{
    borderRadius:50,
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
    // left: hp('7.2%'),
    textAlign:'center',
    fontSize: hp('1.9%'),
    fontWeight: 'bold',
    color: '#000',
  },
});

export default CollectionDetailScreen;

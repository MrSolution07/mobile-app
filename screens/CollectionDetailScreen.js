import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
    <TouchableOpacity onPress={() => onNftPress(item)}>
      <View style={styles.nftItem}>
        <Image source={item.image} style={styles.nftImage} />
        <Text style={styles.nftName}>{item.name}</Text>
        <Text style={styles.nftCreator}>Creator: {item.creator}</Text>
        <Text style={styles.nftPrice}>{item.price} ETH</Text>
      </View>
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  collectionTitle: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  nftList: {
    paddingHorizontal: wp('4%'),
  },
  nftItem: {
    marginBottom: hp('3%'),
    backgroundColor: '#f9f9f9',
    padding: hp('2%'),
    borderRadius: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nftImage: {
    width: '100%',
    height: hp('30%'),
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
  nftPrice: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
});

export default CollectionDetailScreen;

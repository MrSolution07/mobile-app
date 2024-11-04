import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Pressable, TouchableOpacity,Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Svg, { Polygon } from 'react-native-svg';
import { useThemeColors } from './Context/Theme/useThemeColors';
import { useTheme } from './Context/Theme/ThemeContext';

const Hexagon = ({ price, isDarkMode,colors }) => (
  <View style={styles.hexagonContainer}>
    <Svg height={hp('15%')} width={150} viewBox="0 0 100 100" style={styles.svg}>
      <Polygon
        points="50,5 100,25 100,75 50,95 0,75 0,25"
        fill={isDarkMode ?'black':'white'}
      />
    </Svg>

    <Text style={[styles.ethPrice,{color: colors.text}]}>{price} ETH</Text> 
  </View>
);

const CollectionDetailScreen = () => {
  const colors = useThemeColors();
  const {isDarkMode} = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { collection } = route.params; 


  

  const onNftPress = (item) => {
    console.log("NFT Pressed:", item);
    navigation.navigate('ArtDetailsScreen', { nft: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onNftPress(item)} activeOpacity={0.8} style={styles.nftItem}>
      <Hexagon price={item.price}  isDarkMode={isDarkMode} colors={colors} />
      <Image source={item.image} style={styles.nftImage} />
      <Text style={[styles.nftName,{color:colors.blueText}]}>{item.name}</Text>
      <Text style={[styles.nftCreator,{color:colors.grayText}]}>Creator: {item.uploadedBy}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea,{backgroundColor:colors.background}]}>
      <Text style={[styles.collectionTitle, {color:colors.text}]}>{collection.name}</Text>
      <FlatList
        data={collection.nfts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.columWrapper}
        numColumns={2}
      />
      
      <TouchableOpacity style={[styles.makeOfferButton,{backgroundColor: colors.tabbackground}]}>
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
  columWrapper:{
    overflow:'hidden',
    
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
    top: -hp('9%'),
    zIndex: 1,
    borderRadius: wp('12%'),
    overflow:'hidden',
  },
  ethPrice: {
    position: 'absolute',
    top: hp('10%'),
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
    fontSize: hp('2.4%'),
    fontWeight:'600',
  },
});

export default CollectionDetailScreen;

import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, FlatList, StyleSheet, Text, TextInput, Pressable } from 'react-native';
import { Collection1, Collection2, Collection3,
  Collection4, Collection5, Collection6, Collection7,
  Collection8, Collection9, Collection10
 } from '../NFT/dummy';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Explore = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const collections = [Collection1, Collection2, Collection3, Collection4,
    Collection5,Collection6, Collection7, Collection8, Collection9,
    Collection10
  ];
  const [filteredCollections, setFilteredCollections] = useState(collections);

  // Filter collections based on the search query
  useEffect(() => {
    const filteredData = collections.filter((collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCollections(filteredData);
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.collectionContainer}
      onPress={() => navigation.navigate('CollectionDetailScreen', { collection: item })}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Collections"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <FlatList
        data={filteredCollections}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2} // Ensure two items per row
        columnWrapperStyle={styles.columnWrapper} // Add styling for columns
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
    backgroundColor: '#fff',
  },
  searchBar: {
    height: hp('6%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: wp('2%'),
    marginTop:hp('8%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    fontSize: hp('2%'), // Adjust font size for better readability
  },
  collectionContainer: {
    flex: 1,
    flexGrow:1,
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    marginHorizontal: wp('2%'),
    margin:hp ('5%'),
  },
  image: {
    width: wp('40%'),
    height: hp('20%'),
    borderRadius: wp('2%'),
  },
  text: {
    marginTop: hp('1%'),
    textAlign: 'center',
    fontSize: hp('2%'),
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default Explore;

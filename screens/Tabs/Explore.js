import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, FlatList, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Collection1, Collection2, Collection3 } from '../NFT/dummy';


const Explore = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const collections = [Collection1, Collection2, Collection3];
  const [filteredCollections, setFilteredCollections] = useState(collections);

  // Filter collections based on the search query
  useEffect(() => {
    const filteredData = collections.filter((collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCollections(filteredData);
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionContainer}
      onPress={() => navigation.navigate('CollectionDetailScreen', { collection: item })}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  collectionContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  text: {
    marginTop: 5,
    textAlign: 'center',
  },
});

export default Explore;

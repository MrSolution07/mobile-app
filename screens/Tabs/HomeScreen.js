import React, { useEffect, useState,useContext } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import DataContext  from '../Context/Context';

const HomeScreen = () => {
  const [collections, setCollections] = useState([]);
  const navigation = useNavigation();
  const { name,setName,ProfilleImage, setProfilleImage } = useContext(DataContext);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': '73b5488d384f4be88dab537a9276bd0f', // will implement te dotenv later since i was just tesing this api
      },
    };

    axios
      .get('https://api.opensea.io/api/v2/collections', options)
      .then(response => {
        setCollections(response.data.collections || []);
      })
      .catch(err => console.error(err));
  }, []);

  const renderHorizontalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionItem}
      onPress={() => navigation.navigate('NFTCollection', { url: `https://api.opensea.io/api/v2/collection/${item.slug}/nfts` })}
    >
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.collectionImage} />
      ) : (
        <Image source={require('../../assets/images/NoImg1.jpg')} style={styles.topSellingImage} /> 
      )}
      
    </TouchableOpacity>
  );

  const renderVerticalItem = ({ item }) => (
    <View style={styles.topSellingItem}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.topSellingImage} />
      ) : (
        <Image source={require('../../assets/images/NoImg.jpg')} style={styles.topSellingImage} />  // instead of having no images
      )}
      <TouchableOpacity style={styles.placeBidButton}>
        <Text style={styles.placeBidText}>Place Bid</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, <Text style={styles.username}>{name}</Text> {/* Add your username here */}
          </Text>
          <TouchableOpacity onPress={() => { /* Add your profile navigation here */ }}>
          <Image
              source={ProfilleImage ? { uri: ProfilleImage } : require('../../assets/images/NoImg.jpg')} // you can change this image i was jsut testing
              style={styles.profileImage}
          />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Collections</Text>
          <TouchableOpacity onPress={() => { /* Navigate to the collections list */ }}>
            <Text style={styles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={collections.slice(0, 10)} 
          renderItem={renderHorizontalItem}
          keyExtractor={item => item.slug}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Selling</Text>
        </View>

        <FlatList
          data={collections.slice(3,7)}
          renderItem={renderVerticalItem}
          keyExtractor={item => item.slug}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  username: {
    color: '#007bff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: 16,
    color: '#007bff',
  },
  horizontalList: {
    paddingVertical: 15,
  },
  collectionItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  collectionImage: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  collectionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verticalList: {
    paddingTop: 15,
  },
  topSellingItem: {
    marginBottom: 15,
    alignItems: 'center',
    position: 'relative',
  },
  topSellingImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  placeBidButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }], // center the button
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  placeBidText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  placeholderText: {
    width: 120,
    height: 160,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    color: '#888888',
  },
});

export default HomeScreen;

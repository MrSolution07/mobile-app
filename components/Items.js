import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore'; 
import { auth, db } from '../config/firebaseConfig'; 
import tw from 'twrnc';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Items = () => {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);

  const fetchNFTsByStatus = (status, setState) => {
    const user = auth.currentUser;
    if (!user) return;

    const nftQuery = query(
      collection(db, 'nfts'),
      where('userId', '==', user.uid),
      where('status', '==', status)
    );

    const unsubscribe = onSnapshot(nftQuery, (querySnapshot) => {
      const nfts = querySnapshot.docs.map(doc => doc.data());
      setState(nfts);
      setLoading(false); // Stop loading when data is fetched
    });

    return unsubscribe; // Return unsubscribe function to stop listening on unmount
  };

  useEffect(() => {
    const unsubscribeMinted = fetchNFTsByStatus('minted', setMintedNFTs);
    const unsubscribePurchased = fetchNFTsByStatus('purchased', setPurchasedNFTs);
    const unsubscribeSold = fetchNFTsByStatus('sold', setSoldNFTs);

    return () => {
      unsubscribeMinted();
      unsubscribePurchased();
      unsubscribeSold();
    };
  }, []);

  const renderItem = ({ item }) => {
    const tagsArray = item.tags ? item.tags.split(',').map(tag => tag.trim()) : [];

    return (
      <View style={tw`bg-white m-2 p-2 rounded-lg shadow-md ${isLandscape ? 'w-40 h-60' : 'w-full h-60'}`}>
        <Image source={{ uri: item.imageUrl }} style={tw`h-30 w-full rounded-md`} />
        
        <Text style={tw`text-lg font-bold mt-2 truncate`}>{item.title}</Text>
        
        <Text style={tw`text-xs text-gray-500 truncate`}>{item.description}</Text>
        
        {tagsArray.length > 0 && (
          <View style={tw`flex-row flex-wrap mt-1`}>
            {tagsArray.map((tag, index) => (
              <Text key={index} style={tw`text-xs text-gray-400 mr-1`}>
                #{tag}
              </Text>
            ))}
          </View>
        )}
        
        <View style={tw`flex-row items-center gap-x-2 mt-1`}>
          <Text style={tw`font-bold text-sm`}>
            {item.price ? `${item.price} ETH` : 'Price N/A'}
          </Text>
          <FontAwesome5 name="ethereum" size={18} color="black" />
        </View>

        <Text style={tw`text-xs text-gray-400 mt-1`}>Token ID: {item.tokenId}</Text>
      </View>
    );
  };

  return (
    <View style={tw`bg-white flex-1 p-3`}>
      <View style={tw`m-1 mt-4`}>
        <Text style={tw`text-xl font-bold text-[#075eec]`}>Recently Minted NFTs</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={mintedNFTs}
            renderItem={renderItem}
            keyExtractor={(item) => item.tokenId}
            ListEmptyComponent={<Text style={tw`text-center mt-4`}>No NFTs minted yet.</Text>}
            style={tw`mb-5`}
            contentContainerStyle={{ paddingBottom: 15 }}
          />
        )}

        {/* Purchased NFTs */}
        <Text style={tw`text-xl font-bold text-[#075eec] mb-4`}>Purchased NFTs</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : purchasedNFTs.length > 0 ? (
          purchasedNFTs.map((item) => (
            <View key={item.tokenId} style={tw`bg-white m-2 p-2 rounded-lg shadow-md`}>
              <Image source={{ uri: item.imageUrl }} style={tw`h-48 w-full rounded-md`} />
              <Text style={tw`text-lg font-bold mt-2`}>{item.title}</Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-center mt-4 text-gray-500`}>No NFTs purchased yet.</Text>
        )}

        {/* Sold NFTs */}
        <Text style={tw`text-xl font-bold text-[#075eec] mb-4 mt-8`}>Sold NFTs</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : soldNFTs.length > 0 ? (
          soldNFTs.map((item) => (
            <View key={item.tokenId} style={tw`bg-white m-2 p-2 rounded-lg shadow-md`}>
              <Image source={{ uri: item.imageUrl }} style={tw`h-48 w-full rounded-md`} />
              <Text style={tw`text-lg font-bold mt-2`}>{item.title}</Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-center mt-4 text-gray-500`}>No NFTs sold yet.</Text>
        )}
      </View>
    </View>
  );
};

export default Items;

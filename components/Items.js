import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { auth, db } from '../config/firebaseConfig'; 
import tw from 'twrnc';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Items = () => {
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);

  const fetchNFTsByStatus = async (status) => {
    try {
      const user = auth.currentUser; 
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching NFTs for user:', user.uid, 'with status:', status);  // Debug log

      const nftQuery = query(
        collection(db, 'nfts'),
        where('userId', '==', user.uid),
        where('status', '==', status)
      );

      const querySnapshot = await getDocs(nftQuery);
      const nfts = querySnapshot.docs.map(doc => doc.data());
      
      console.log(`Fetched ${nfts.length} NFTs with status "${status}"`); // Debug log
      return nfts;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchNFTData = async () => {
      const minted = await fetchNFTsByStatus('minted');
      const purchased = await fetchNFTsByStatus('purchased');
      const sold = await fetchNFTsByStatus('sold');

      setMintedNFTs(minted);
      setPurchasedNFTs(purchased);
      setSoldNFTs(sold);

      
      console.log('Minted NFTs:', minted);
      console.log('Purchased NFTs:', purchased);
      console.log('Sold NFTs:', sold);
    };

    fetchNFTData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={tw`bg-white m-2 p-2 rounded-lg shadow-md`}>
      <Image source={{ uri: item.imageUrl }} style={tw`h-48 w-full rounded-md`} />
      <Text style={tw`text-lg font-bold mt-2`}>{item.title}</Text>
      <FontAwesome5 name="ethereum" size={18} color="black" />
    </View>
  );

  return (
    <View style={tw`flex-1 p-6 top-20`}>
      {/* Recently Minted NFTs */}
      <Text style={tw`text-xl font-bold text-[#075eec] mb-4 mt-8`}>Recently Minted NFTs</Text>
      <FlatList
        data={mintedNFTs}
        renderItem={renderItem}
        keyExtractor={(item) => item.tokenId} 
        ListEmptyComponent={<Text style={tw`text-center mt-4`}>No NFTs minted yet.</Text>}
        style={tw`mb-5`}
        contentContainerStyle={{ paddingBottom: 15 }}
      />

      {/* Purchased NFTs */}
      <ScrollView contentContainerStyle={tw`flex-grow p-2`}>
        <Text style={tw`text-xl font-bold text-[#075eec] mb-4`}>Purchased NFTs</Text>
        {purchasedNFTs.length > 0 ? (
          purchasedNFTs.map((item, index) => (
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
        {soldNFTs.length > 0 ? (
          soldNFTs.map((item, index) => (
            <View key={item.tokenId} style={tw`bg-white m-2 p-2 rounded-lg shadow-md`}>
              <Image source={{ uri: item.imageUrl }} style={tw`h-48 w-full rounded-md`} />
              <Text style={tw`text-lg font-bold mt-2`}>{item.title}</Text>
            </View>
          ))
        ) : (
          <Text style={tw`text-center mt-4 text-gray-500`}>No NFTs sold yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Items;

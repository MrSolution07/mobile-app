import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Items = () => {
  const [nftItems, setNftItems] = useState([]);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const storedNFTData = await AsyncStorage.getItem('nftData');
        if (storedNFTData) {
          setNftItems(JSON.parse(storedNFTData));
        }
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      }
    };

    fetchNFTData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={tw`bg-white m-2 items-left p-2 rounded-lg shadow-md`}>
      <Image source={{ uri: item.imageUri }} style={tw`h-48 w-full rounded-md`} /> 
      <Text style={tw`text-lg font-bold mt-2`}>{item.title}</Text>
      <Text style={tw`text-sm text-gray-500`}>{item.description}</Text>
      <Text style={tw`text-sm text-gray-400 mt-1`}>Tags: {item.tags}</Text>
      <Text style={tw`text-sm text-[#333333] mt-1`}>Token ID: {item.tokenId}</Text>
      <Text style={tw`text-sm text-purple-600 mt-1`}>Price: {item.price} ETH</Text>
      <FontAwesome5 name="ethereum" size={18} color="black" />
    </View>
  );

  return (
      <View style={tw`flex-1 p-6 top-20 `}>
        <Text style={tw`text-xl font-bold text-[#075eec] mb-4 mt-8`}>Recently Minted NFTs</Text>
        <FlatList
          data={nftItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.tokenId}-${index}`}
          ListEmptyComponent={<Text style={tw`text-center mt-4`}>No NFTs minted yet.</Text>}
          style={tw`mb-5`}
          contentContainerStyle={{ paddingBottom: 15 }} 
        />
    <ScrollView contentContainerStyle={tw`flex-grow p-2`}>

        <Text style={tw`text-xl font-bold text-[#075eec] mb-4`}>Purchased NFTs</Text>
        <Text style={tw`text-center mt-4 text-gray-500`}>No NFTs purchased yet.</Text>

        <Text style={tw`text-xl font-bold text-[#075eec] mb-4 mt-8`}>Sold NFTs</Text>
        <Text style={tw`text-center mt-4 text-gray-500`}>No NFTs sold yet.</Text>
      </ScrollView>

      </View>
  );
};

export default Items;

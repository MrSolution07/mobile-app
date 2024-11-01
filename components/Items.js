import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; 
import tw from 'twrnc';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../screens/Context/Theme/useThemeColors';

const Items = () => {
  const colors = useThemeColors();
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);
  const [soldNFTs, setSoldNFTs] = useState([]);
  const [soldedNFTs, setSoldedNFTs] = useState([]); // State for the new 'soldednfts' collection
  const [loading, setLoading] = useState(true);

  const fetchNFTsByStatus = (status, setState) => {
    const user = auth.currentUser;
    if (!user) return;

    const nftQuery = query(
      collection(db, 'nfts'),
      where('status', '==', status),
      where(status === 'purchased' ? 'ownerId' : 'userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(nftQuery, (querySnapshot) => {
      const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setState(nfts);
      setLoading(false);
    });

    return unsubscribe;
  };

  const fetchSoldedNFTs = () => {
    const user = auth.currentUser;
    if (!user) return;

    const soldedNFTsQuery = query(
      collection(db, 'soldednfts'),
      where('creatorId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(soldedNFTsQuery, (querySnapshot) => {
      const nfts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSoldedNFTs(nfts);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribeMinted = fetchNFTsByStatus('minted', setMintedNFTs);
    const unsubscribePurchased = fetchNFTsByStatus('purchased', setPurchasedNFTs);
    const unsubscribeSold = fetchNFTsByStatus('sold', setSoldNFTs);
    const unsubscribeSoldedNFTs = fetchSoldedNFTs(); // Fetch for 'soldednfts' collection

    return () => {
      unsubscribeMinted();
      unsubscribePurchased();
      unsubscribeSold();
      unsubscribeSoldedNFTs(); // Unsubscribe on cleanup
    };
  }, []);

  const handleUpdatePrice = async (nftId) => {
    Alert.prompt(
      "Update Price",
      "Enter the new price in ETH:",
      async (price) => {
        try {
          if (price) {
            const nftDocRef = doc(db, 'nfts', nftId);
            await updateDoc(nftDocRef, { price: parseFloat(price) });
            Alert.alert("Success", "Price updated successfully.");
          }
        } catch (error) {
          console.error("Error updating price:", error);
          Alert.alert("Error", "Could not update price. Please try again.");
        }
      },
      "plain-text"
    );
  };

  return (
    <SafeAreaView style={[tw`flex-1 justify-center p-1 bg-white`, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        <View style={tw`h-full m-2`}>

          {/* Minted NFTs */}
          <Text style={tw`text-xl p-2 font-bold text-[#075eec]`}>Recently Minted NFTs</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            mintedNFTs.length > 0 ? (
              mintedNFTs.map((item) => (
                <NFTCard key={item.id} item={item} isOwner={false} colors={colors} />
              ))
            ) : (
              <Text style={[tw`text-center mt-4`, { color: colors.text }]}>No NFTs minted yet.</Text>
            )
          )}

          {/* Purchased NFTs with Price Update Option */}
          <Text style={tw`text-xl p-2 font-bold text-[#075eec] mb-4`}>Purchased NFTs</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            purchasedNFTs.length > 0 ? (
              purchasedNFTs.map((item) => (
                <NFTCard
                  key={item.id}
                  item={item}
                  isOwner={true}
                  onPriceUpdate={() => handleUpdatePrice(item.id)}
                  colors={colors}
                />
              ))
            ) : (
              <Text style={[tw`text-center mt-4`, { color: colors.text }]}>No NFTs purchased yet.</Text>
            )
          )}

          {/* Sold NFTs */}
          {/* <Text style={tw`text-xl p-2 font-bold text-[#075eec] mb-4 mt-8`}>Sold NFTs</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            soldNFTs.length > 0 ? (
              soldNFTs.map((item) => (
                <NFTCard key={item.id} item={item} isOwner={false} colors={colors} />
              ))
            ) : (
              <Text style={[tw`text-center mt-4`, { color: colors.text }]}>No NFTs sold yet.</Text>
            )
          )} */}

          {/* Solded NFTs */}
          <Text style={tw`text-xl p-2 font-bold text-[#075eec] mb-4 mt-8`}>Sold NFTs</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            soldedNFTs.length > 0 ? (
              soldedNFTs.map((item) => (
                <NFTCard key={item.id} item={item} isOwner={false} colors={colors} />
              ))
            ) : (
              <Text style={[tw`text-center mt-4`, { color: colors.text }]}>No NFTs solded yet.</Text>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Separate Card Component for NFTs
const NFTCard = ({ item, isOwner, onPriceUpdate, colors }) => (
  <View style={tw`bg-white m-2 p-2 rounded-lg shadow-md`}>
    <Image source={{ uri: item.imageUrl }} style={tw`h-48 w-full rounded-md`} />
    <Text style={tw`text-lg font-bold mt-2`}>{item.title}</Text>
    <Text style={tw`text-xs text-gray-500`} numberOfLines={2}>{item.description}</Text>
    <Text style={tw`text-xs text-gray-400 mt-1`}>Token ID: {item.tokenId}</Text>
    <View style={tw`flex-row items-center gap-x-2 mt-1`}>
      <Text style={tw`font-bold text-sm`}>{item.price ? `${item.price} ETH` : 'Price N/A'}</Text>
      <FontAwesome5 name="ethereum" size={18} color="black" />
    </View>
    {isOwner && (
      <TouchableOpacity onPress={onPriceUpdate} style={tw`bg-blue-500 p-2 mt-2 rounded-lg`}>
        <Text style={tw`text-white text-center`}>Update Price</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default Items;

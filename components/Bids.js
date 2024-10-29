import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { auth, db } from '../config/firebaseConfig'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import tw from 'twrnc';
import { collection, onSnapshot } from 'firebase/firestore'; 
import { doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import * as Notifications from 'expo-notifications'; 
import { useThemeColors } from '../screens/Context/Theme/useThemeColors';
import { useTheme } from '../screens/Context/Theme/ThemeContext';
import { setDoc, deleteDoc } from 'firebase/firestore';

const Bids = () => {
  const colors = useThemeColors();
  const {isDarkMode} = useTheme();
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [userBidsData, setUserBidsData] = useState([]); 
  const [bidsData, setBidsData] = useState([]); 

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'nfts'), (snapshot) => {
      const allBids = []; 
      const userBids = []; 
  
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.bids) {
          data.bids.forEach(bid => {
            const bidData = {
              id: doc.id, 
              ...bid,
              itemName: data.title, 
              itemImage: data.imageUrl,
              itemPrice: bid.offerAmount, 
              itemDate: bid.timestamp,
            };
            if (data.creatorId === auth.currentUser.uid) {
              allBids.push(bidData); 
            }
            if (bid.bidderId === auth.currentUser.uid) {
              userBids.push(bidData); 
            }
          });
        }
      });
  
      
      setBidsData(allBids); 
      setUserBidsData(userBids); 
    });
  
    return () => unsubscribe(); 
  }, []);
  
  

  const sendNotification = async (userId, title, message) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const pushToken = userData.pushToken; 

      if (pushToken) {
        const notificationContent = {
          to: pushToken,
          sound: 'default',
          title: title,
          body: message,
          data: { userId: userId }, 
        };

        await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: null, 
        });
      } else {
        console.error('No push token found for user:', userId);
      }
    } else {
      console.error('User document not found:', userId);
    }
  };

  const handleAction = async (action, bidId) => {
    try {
        console.log('Action:', action);
        console.log('Bid ID:', bidId);

       
        const nftsRef = collection(db, 'nfts');
        const nftsSnapshot = await getDocs(nftsRef);

        let nftData = null;
        let nftDocId = null;

       
        nftsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.bids) {
                const bid = data.bids.find(b => b.id === bidId);
                if (bid) {
                    nftData = data;
                    nftDocId = doc.id;
                }
            }
        });

        if (!nftData) {
            throw new Error("NFT not found for the given bid ID");
        }

        
        const bid = nftData.bids.find(b => b.id === bidId);

        if (!bid) {
            throw new Error("Invalid data: Bid not found");
        }

        console.log("Bid Data:", bid);

        const bidAmount = bid.offerAmount; 
        const bidderId = bid.bidderId;

        if (action === 'Accept') {
          const creatorAmount = bidAmount * 0.95; 
          const bidderDocRef = doc(db, 'users', bidderId);
          const bidderSnapshot = await getDoc(bidderDocRef);
      
          if (bidderSnapshot.exists()) {
              const bidderData = bidderSnapshot.data();
              const newBidderBalance = bidderData.ethAmount - bidAmount;
      
              if (newBidderBalance < 0) throw new Error("Insufficient balance");
      
              // Update the bidder's balance
              await updateDoc(bidderDocRef, { ethAmount: newBidderBalance });
      
              const creatorDocRef = doc(db, 'users', nftData.creatorId);
              const creatorSnapshot = await getDoc(creatorDocRef);
      
              if (creatorSnapshot.exists()) {
                  const creatorData = creatorSnapshot.data();
                  const newCreatorBalance = creatorData.ethAmount + creatorAmount;
      
                  // Update the creator's balance
                  await updateDoc(creatorDocRef, { ethAmount: newCreatorBalance });
      
                  // Send notification to the bidder
                  sendNotification(bidderId, 'Offer Accepted', 'Your offer has been accepted.');
      
                  // Update the NFT's ownership and status in the main NFT collection
                  const nftDocRef = doc(db, 'nfts', nftDocId);
                  await updateDoc(nftDocRef, { 
                      bids: [], 
                      status: 'purchased', 
                      ownerId: bidderId,
                      creatorId: bidderId,
                  });
      
            // Prepare NFT data for the purchased section
                  const purchasedNFTData = {
                    ...nftData,
                    ownerId: bidderId,
                    status: 'purchased'
                };

                // Add NFT to bidder's purchased section
                const purchasedNFTsCollectionRef = collection(db, 'users', bidderId, 'purchased');
                await setDoc(doc(purchasedNFTsCollectionRef, nftDocId), purchasedNFTData);

                // Remove NFT from creator's minted section
                const mintedNFTsCollectionRef = collection(db, 'users', nftData.creatorId, 'minted');
                await deleteDoc(doc(mintedNFTsCollectionRef, nftDocId));

                // Create a new NFT object for the sold section
                const soldNFTData = {
                    ...nftData,
                    status: 'sold',
                    ownerId: bidderId,
                    soldAt: new Date().toISOString(), // Record the sale date
                };

                // Ensure you generate a unique ID for the sold NFT document
                const soldNFTsCollectionRef = collection(db, 'users', nftData.creatorId, 'sold');
                const newSoldNFTDocRef = doc(soldNFTsCollectionRef); // Create a new document with a unique ID
                await setDoc(newSoldNFTDocRef, soldNFTData);
            }
        }
      }

      else if (action === 'Reject') {
            // Remove the rejected bid
            const updatedBids = nftData.bids.filter(b => b.id !== bidId);
            await updateDoc(doc(db, 'nfts', nftDocId), { bids: updatedBids });
            sendNotification(bidderId, 'Offer Rejected', 'Your offer has been rejected.');

            // console.log("Bid rejected and removed");
        }

    } catch (error) {
        console.error("Error handling action:", error);
    }
};



  const renderBidItem = ({ item}) => (
    <View style={styles.bidItem}>
      <View style={styles.bidderInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: item.bidderImage }} style={styles.bidderImage} />
          <Text style={isDarkMode? {color:colors.text}: styles.bidderName}>{item.bidderName}</Text>
        </View>
        <Text style={styles.bidPrice}>{item.itemPrice} ETH</Text>
        <Text style={isDarkMode? {color:colors.text}: styles.bidDate}>{item.date}</Text>
        <Text style={isDarkMode? {color:colors.text}: styles.itemName}>{item.itemName}</Text>
      </View>
      <Image source={{ uri: item.itemImage }} style={styles.itemImage} />
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAction('Accept', item.id)}>
          <Text style={styles.actionText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleAction('Reject', item.id)}>
          <Text style={styles.actionText}>Reject</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.counterOfferButton} onPress={() => handleAction('Counter Offer', item.id)}>
          <Text style={styles.actionText} numberOfLines={2}>Counter Offer</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  const renderUserBidItem = ({ item }) => (
    <View style={styles.userBidItem}>
      <Image source={{ uri: item.itemImage }} style={styles.userItemImage} />
      <View style={styles.userBidInfo}>
        <Text style={isDarkMode? {color:colors.text}: styles.userItemName}>{item.itemName}</Text>
        <Text style={styles.userBidPrice}>{item.itemPrice} ETH</Text>
        <Text style={isDarkMode? {color:colors.text}: styles.userBidDate}>{item.date}</Text>
        <Text style={isDarkMode? {color:colors.text}: styles.userBidStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <View style={tw`mt-4`}>
        <Text style={[styles.title,{color:colors.blueText}]}>Bids on Your NFTs</Text>

        {feedbackMessage ? (
          <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
        ) : null}

            <FlatList
              data={bidsData} // This is the list for "Bids on Your NFTs"
              renderItem={renderBidItem}
              keyExtractor={(item) => `bid-${item.id}`} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContent}
            />

        <Text style={[styles.title,{color:colors.blueText}]}>Your Bids</Text>
          <FlatList
          data={userBidsData} // This is the list for "Your Bids"
          renderItem={renderUserBidItem}
          keyExtractor={(item) => `user-bid-${item.id}`} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp('5%'),
    backgroundColor: '#fff',
    height: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: hp('3%'),
    marginBottom: hp('1%'),
    fontFamily: 'NotoSansJP_700Bold',
    textAlign:'center',
  },
  feedbackMessage: {
    fontSize: hp('2%'),
    color: 'green',
    marginBottom: hp('1%'),
  },
  bidItem: {
    padding: wp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: hp('1%'),
    width: wp('90%'),
    borderRadius: 5,
    borderBottomColor: '#eee',
  },
  bidderImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    marginRight: wp('3%'),
  },
  bidderInfo: {
    flex: 1,
  },
  bidderName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 70,
    padding:15,
  },
  bidPrice: {
    fontSize: hp('1.8%'),
    color: '#007bff',
    marginTop: hp('1%'),
  },
  bidDate: {
    fontSize: hp('1.5%'),
    fontStyle: 'italic',
    color: '#666',
    fontFamily: 'MavenPro_400Regular',
  },
  itemName: {
    fontSize: hp('1.6%'),
    marginVertical: hp('0.5%'),
    fontFamily: 'MavenPro_400Regular',
  },
  itemImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
    marginTop: hp('1%'),
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: hp('1%'), 
    gap: 18,
  },
  acceptButton: {
    backgroundColor: '#075eec',
    padding: wp('2.5%'),
    borderRadius: wp('2%'),
    marginRight: wp('1%'),
    height: hp('6%'),
    width: wp('23%'),
  },
  rejectButton: {
    backgroundColor: '#333333',
    padding: wp('3%'),
    height: hp('6%'),
    borderRadius: wp('2%'),
    marginRight: wp('1%'),
    width: wp('23%'),
  },
  counterOfferButton: {
    backgroundColor: '#6d28d9',
    padding: wp('2.5%'),
    height: hp('6%'),
    borderRadius: wp('2%'),
    width: wp('28%'),
  },
  actionText: {
    color: '#fff',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 15,
  },
  userBidItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: hp('3%'),
    width:wp('90%'),
    borderRadius: wp('8%'),
  },
  userItemImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  userBidInfo: {
    flex: 1,
  },
  userItemName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  userBidPrice: {
    fontSize: hp('1.8%'),
    color: '#007bff',
  },
  userBidDate: {
    fontSize: hp('1.5%'),
    color: '#666',
  },
  userBidStatus: {
    fontSize: hp('1.5%'),
    color: '#666',
    marginTop: hp('0.5%'),
  },
});

export default Bids;

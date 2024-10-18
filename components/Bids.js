import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Bids = () => {
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [userBidsData, setUserBidsData] = useState([
    {
      id: '3',
      itemName: 'Another NFT Art #3',
      itemImage: 'https://via.placeholder.com/100',
      price: '1.0',
      date: '2024-10-18',
      status: 'Pending', 
    },
  ]);

  const bidsData = [
    {
      id: '1',
      bidderName: 'John Doe',
      bidderImage: 'https://via.placeholder.com/150',
      price: '1.5',
      date: '2024-10-17',
      itemName: 'Awesome NFT Art #1',
      itemImage: 'https://via.placeholder.com/100',
    },
    {
      id: '2',
      bidderName: 'Jane Smith',
      bidderImage: 'https://via.placeholder.com/150',
      price: '2.0',
      date: '2024-10-16',
      itemName: 'Stunning NFT Art #2',
      itemImage: 'https://via.placeholder.com/100',
    },
  ];

  const handleAction = (action, bidId) => {
    const updatedBids = userBidsData.map(bid => {
      if (bid.id === bidId) {
        return { ...bid, status: action === 'Accept' ? 'Accepted' : action === 'Reject' ? 'Rejected' : 'Counter Offer' };
      }
      return bid;
    });

    setUserBidsData(updatedBids);
    setFeedbackMessage(`You chose to ${action} the bid for "${updatedBids.find(bid => bid.id === bidId).itemName}"`);
    setTimeout(() => {
      setFeedbackMessage('');
    }, 3000);
  };

  const renderBidItem = ({ item }) => (
    <View style={styles.bidItem}>
      <View style={styles.bidderInfo}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: item.bidderImage }} style={styles.bidderImage} />
          <Text style={styles.bidderName}>{item.bidderName}</Text>
        </View>
        <Text style={styles.bidPrice}>{item.price} ETH</Text>
        <Text style={styles.bidDate}>{item.date}</Text>
        <Text style={styles.itemName}>{item.itemName}</Text>
      </View>
      <Image source={{ uri: item.itemImage }} style={styles.itemImage} />
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAction('Accept', item.id)}>
          <Text style={styles.actionText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={() => handleAction('Reject', item.id)}>
          <Text style={styles.actionText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.counterOfferButton} onPress={() => handleAction('Counter Offer', item.id)}>
          <Text style={styles.actionText} numberOfLines={2}>Counter Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserBidItem = ({ item }) => (
    <View style={styles.userBidItem}>
      <Image source={{ uri: item.itemImage }} style={styles.userItemImage} />
      <View style={styles.userBidInfo}>
        <Text style={styles.userItemName}>{item.itemName}</Text>
        <Text style={styles.userBidPrice}>{item.price} ETH</Text>
        <Text style={styles.userBidDate}>{item.date}</Text>
        <Text style={styles.userBidStatus}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bids on Your NFTs</Text>

      {feedbackMessage ? (
        <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
      ) : null}

      <FlatList
        data={bidsData}
        renderItem={renderBidItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <Text style={styles.title}>Your Bids</Text>
      <FlatList
        data={userBidsData}
        renderItem={renderUserBidItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: hp('3%'),
    marginBottom: hp('2%'),
    fontFamily: 'NotoSansJP_700Bold',
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
    padding: wp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: hp('3%'),
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

import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DataContext from '../Context/Context';
import tw from 'twrnc';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 

const HomeScreen = () => {
  const [collections, setCollections] = useState([]);
  const navigation = useNavigation();
  const { name, ProfilleImage } = useContext(DataContext);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-api-key': '73b5488d384f4be88dab537a9276bd0f',
      },
    };

    axios
      .get('https://api.opensea.io/api/v2/collections', options)
      .then(response => {
        setCollections(response.data.collections || []);
      })
      .catch(err => console.error(err));
  }, []);

// scroll based animation that will scale as the item comes into view 
  const renderHorizontalItem = ({ item, index }) => {
    const scale = scrollX.interpolate({
      inputRange: [
        (index - 1) * wp('35%'),
        index * wp('35%'),
        (index + 1) * wp('35%')
      ],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[styles.collectionItem, { transform: [{ scale }] }]}
      >
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.collectionImage} />
        ) : (
          <Image source={require('../../assets/images/NoImg1.jpg')} style={styles.collectionImage} />
        )}
        <Text style={styles.collectionName}>{item.collection}</Text>
      </Animated.View>
    );
  };
  const renderVerticalItem = ({ item }) => (
    <View style={styles.topSellingItem}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.topSellingImage} />
      ) : (
        <Image source={require('../../assets/images/NoImg.jpg')} style={styles.topSellingImage} />
      )}

      <View style={styles.ethAndButtonContainer}>
        <View style={styles.ethContainer}>
          <Text style={[tw`text-white text-base font-black`, styles.ethText]}>0.31</Text>
          <Text style={[tw`text-[#6d28d9] text-base font-black`, styles.ethText]}>ETH</Text>
          <FontAwesome5 name="ethereum" size={24} color="black" />
        </View>

        <TouchableOpacity style={styles.placeBidButton}>
          <Text style={styles.placeBidText}>Place Bid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.greeting}>
              Hello, <Text style={styles.username}>{name}</Text>
            </Text>
            <TouchableOpacity onPress={() => { /* Add your profile navigation here */ }}>
              <Image
                source={ProfilleImage ? { uri: ProfilleImage } : require('../../assets/images/NoImg.jpg')}
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

          <Animated.FlatList
          data={collections.slice(0, 10)}
          renderItem={renderHorizontalItem}
          keyExtractor={item => item.slug}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        />
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Selling</Text>
          </View>

          <FlatList
            data={collections.slice(3, 7)}
            renderItem={renderVerticalItem}
            keyExtractor={item => item.slug}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.verticalList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: wp('4%'),
    marginTop: hp('8%'),
    paddingVertical: hp('2%'), 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
  },
  username: {
    color: '#007bff',
  },
  profileImage: {
    width: wp('10%'), 
    height: wp('10%'), 
    borderRadius: wp('5%'), 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'), 
  },
  sectionTitle: {
    fontSize: hp('2.5%'), 
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: hp('2%'), 
    color: '#007bff',
  },
  horizontalList: {
    paddingVertical: 25,
    margin: 5,
    paddingLeft: 15, 
  },
  collectionItem: {
    marginRight: 20,
    marginBottom: hp('6%'), 
    alignItems: 'center',
    borderRadius: wp('2%'), 
    width: wp('35%'), 
    height: hp('30%'),
    backgroundColor: 'gray', 
  },
  collectionImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp('2%'), 
    resizeMode: 'cover',
  },
  collectionName: {
    fontSize: 13,
    color: '#333333',
    textAlign: 'center',
    // marginTop: 4,
    fontWeight:'600',
  },
  verticalList: {
    paddingTop: 10,
    flexGrow: 1,
  },
  topSellingItem: {
    marginBottom: hp('2%'), 
    width: wp('90%'), 
    height: hp('20%'), 
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
  },
  topSellingImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp('3%'), 
    resizeMode: 'cover',
  },
  placeBidButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: hp('1.5%'), 
    paddingHorizontal: wp('5%'), 
    borderRadius: wp('5%'), 
  },
  placeBidText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ethAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: hp('1.5%'), 
    width: '90%',
    paddingHorizontal: wp('2.5%'), 
  },
  ethContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: hp('0.8%'), 
    borderRadius: wp('5%'),
  },
  ethText: {
    marginRight: wp('1%'), 
  },
});

export default HomeScreen;

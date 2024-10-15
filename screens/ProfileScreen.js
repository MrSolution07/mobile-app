import React, { useState } from 'react';
import {View,Text,StyleSheet,Image,SafeAreaView,ActivityIndicator} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig'; 
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 


const UserProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loader while data is being fetched from the db

  

  // Fetch the user's profile data from Firestore
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data()); 
        } else {
          console.error('No user data found!');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  // Use useFocusEffect to fetch user data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = () => {
    // Implement your logout logic here (e.g., sign out from Firebase)
    // For now, we'll just navigate to the Login screen
    navigation.navigate('Login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Text>No user data found</Text>
      </SafeAreaView>
    );
  }

  const { name, balance, email, phoneNo, location, ProfilleImage } = userData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <Image
          source={{ uri: 'https://i.pinimg.com/originals/6b/f8/48/6bf848ae5afdb77782a1ff14067b194a.jpg' }}
          style={styles.backgroundImage}
          resizeMode='cover'
        />
        <BlurView style={styles.blurView} intensity={1} tint="dark" />

        <View style={styles.content}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.5)', 'rgba(7, 94, 236, 0.5)', 'rgba(128, 0, 128, 0.5)']}
            style={styles.header}
          >
            <BlurView style={styles.headerBlur} intensity={50} tint="light" />
          </LinearGradient>

          <View style={styles.contentContainer}>
            <View style={styles.avatarCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: ProfilleImage || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.assetsLabel}>Total Assets</Text>
                <Text style={styles.balance}>{balance || '0.00'}</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailsCard}>
                <InfoItem icon="📧" value={email} />
                <InfoItem icon="📱" value={phoneNo} />
                <InfoItem icon="📍" value={location} />
              </View>
            </View>
          </View>

          {/* Edit Profile Button */}
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity> */}

          {/* Logout Button */}
          {/* <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

const InfoItem = ({ icon, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  loaderContainer:{
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  menuButton: {
    position: 'absolute',
    top: 40, 
    left: 20,
    zIndex: 10, 
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  blurView: {
    position: 'absolute',
    inset: 0,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(245, 245, 245, 0.85)',
  },
  header: {
    height: '30%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: '100%',
    overflow: 'hidden',
  },
  headerBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    top: hp(-12),
    paddingHorizontal: 10,
    paddingBottom: 20,
    width: '100%',
  },
  avatarCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    width: '100%',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'lightgrey',
    overflow: 'hidden',
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5, 
  },
  assetsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3, 
  },
  balance: {
    fontSize: 22, 
    color: '#666',
    marginBottom: 20,
  },
  detailsContainer:{
    alignItems:'center',
    justifyContent:'center',
  },
  detailsCard: {
    backgroundColor: 'whitesmoke',
    borderRadius: 20,
    padding: 25,
    bottom: 8,
    elevation: 5,
    width: '100%',
    height: 160,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, 
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
    width: 30,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 16, 
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#47ABCE',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    bottom: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10, 
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserProfile;

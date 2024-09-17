import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import DataContext from '../screens/Context/Context'; 

const UserProfile = ({ navigation }) => {
  const { name, balance, email, phoneNo, location, ProfilleImage } = useContext(DataContext);

  const defaultUser = {
    name: 'Deez Nuts',
    email: 'deezn@majortech.com',
    avatar: 'https://via.placeholder.com/150/808080/FFFFFF?text=Avatar',
    phoneNo: '+27 72 123 4567',
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://i.pinimg.com/originals/6b/f8/48/6bf848ae5afdb77782a1ff14067b194a.jpg' }}
          style={styles.backgroundImage}
          resizeMode='cover'
        />
        <BlurView
          style={styles.blurView}
          intensity={1}
          tint="dark"
        />
        <View style={styles.content}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.5)', 'rgba(7, 94, 236, 0.5)', 'rgba(128, 0, 128, 0.5)']}
            style={styles.header}
          >
            <BlurView
              style={styles.headerBlur}
              intensity={50}
              tint="light"
            />
          </LinearGradient>
          <View style={styles.contentContainer}>
            <View style={styles.avatarCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={defaultUser.avatar}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{name || defaultUser.name}</Text>
                <Text style={styles.assetsLabel}>Total Assets</Text>
                <Text style={styles.balance}>{balance || 'R0.00'}</Text>
              </View>
            </View>
            <View style={styles.detailsCard}>
              <InfoItem icon="📧" value={email || defaultUser.email} />
              <InfoItem icon="📱" value={phoneNo || defaultUser.phoneNo} />
              <InfoItem icon="📍" value={location || 'SA'} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
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
      marginTop: -100,
      paddingHorizontal: 10,
      paddingBottom: 20,
      width: '100%',
    },
    avatarCard: {
      backgroundColor: 'whitesmoke',
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
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    assetsLabel: {
      fontSize: 18,
      color: '#666',
      marginBottom: 5,
    },
    balance: {
      fontSize: 26,
      color: '#666',
      marginBottom: 20,
    },
    detailsCard: {
      backgroundColor: 'whitesmoke',
      borderRadius: 20,
      padding: 20,
      marginBottom: 10,
      elevation: 5,
      width: '100%',
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 25,
    },
    infoIcon: {
      fontSize: 20,
      marginRight: 10,
      width: 30,
      textAlign: 'center',
    },
    infoValue: {
      fontSize: 18,
      color: '#333',
      flex: 1,
    },
    button: {
      backgroundColor: '#47ABCE',
      paddingVertical: 15,
      borderRadius: 15,
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
  });

export default UserProfile;

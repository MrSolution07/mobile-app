import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../config/firebaseConfig'; 
import DataContext from '../screens/Context/Context'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const EditProfile = ({ navigation }) => {
  const { name, email, phoneNo, location } = useContext(DataContext); 

  // State variables
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userPhoneNo, setUserPhoneNo] = useState(phoneNo || ''); 
  const [userLocation, setUserLocation] = useState(location || ''); 
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchProfileImage = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAvatar(userData.ProfilleImage ? { uri: userData.ProfilleImage } : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"); 
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchProfileImage();
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!username || !userEmail) {
      Alert.alert('Error', 'Username and Email are required.');
      return;
    }

    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Prepare update data
        const updateData = {
          name: username || name,
          email: userEmail || email,
          phoneNo: userPhoneNo || phoneNo, 
          location: userLocation || location, 
          ProfilleImage: avatar?.uri || '', 
        };

        await updateDoc(userRef, updateData);

        if (password) {
          await currentUser.updatePassword(password);
        }

        Alert.alert('Success', 'Profile updated successfully!');
        navigation.navigate('ProfileScreen');
      } else {
        Alert.alert('Error', 'No user is currently logged in.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to update profile: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://i.pinimg.com/originals/6b/f8/48/6bf848ae5afdb77782a1ff14067b194a.jpg' }}
          style={styles.backgroundImage}
          resizeMode='cover'
        />
        <BlurView style={styles.blurView} intensity={1} tint="dark" />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.formContainer}>
            
            <TouchableOpacity onPress={handlePickImage}>
              <Image 
                source={avatar ? avatar : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <View style={styles.fieldContainer}>
            <Text>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="username"
              onChangeText={setUsername}
            />
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
            />
            <Text>Phone No</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              onChangeText={setUserPhoneNo} 
              keyboardType="phone-pad"
            />
            <Text>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={userLocation}
              onChangeText={setUserLocation} 
            />
            {/* <Text>New Password (leave blank to keep current)</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password (leave blank to keep current)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            /> */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

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
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
 
  },
  formContainer: {
    backgroundColor: 'whitesmoke',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    marginTop: hp('10%'),
    alignItems: 'center',
    height:hp('91%'),
  },
  fieldContainer:{
      width:wp('75%'),
      height:hp('15%'),
  },  
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    backgroundColor:'gray',
  },
  input: {
    width: '100%',
    padding: hp(2), 
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: hp(2), 
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#47ABCE',
    paddingVertical: hp(2.5), 
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    top: hp(10),
  },
  saveButtonText: {
    color: 'white',
    fontSize: hp(2.5), 
    fontWeight: '600',
  },
});

export default EditProfile;

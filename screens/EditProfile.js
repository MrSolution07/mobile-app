import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Import the image manipulator
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import { db, auth } from '../config/firebaseConfig'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const EditProfile = ({ navigation }) => {
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoneNo, setUserPhoneNo] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch user data and profile image
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Start loading
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAvatar(userData.ProfileImage ? { uri: userData.ProfileImage } : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y');
          setUsername(userData.name || '');
          setUserEmail(userData.email || '');
          setUserPhoneNo(userData.phoneNo || '');
          setUserLocation(userData.location || '');
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false); // Stop loading
    };

    fetchUserData();
  }, []);

  // Ask for camera and media library permissions
  const askForPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert('Permissions required', 'You need to grant camera and media library permissions to use this feature.');
      return false;
    }
    return true;
  };

  // Resize and upload image to Firebase
  const uploadImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const currentUser = auth.currentUser;
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${currentUser.uid}.jpg`);

      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  // Pick image from gallery
  const handlePickImage = async () => {
    const hasPermissions = await askForPermissions();
    if (!hasPermissions) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const downloadURL = await uploadImage(result.assets[0].uri);
      setAvatar({ uri: downloadURL });
    }
  };

  // Take a photo
  const handleTakePhoto = async () => {
    const hasPermissions = await askForPermissions();
    if (!hasPermissions) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const downloadURL = await uploadImage(result.assets[0].uri);
      setAvatar({ uri: downloadURL });
    }
  };

  // Show options to pick image from gallery or take a photo
  const handleImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Pick from Gallery', onPress: handlePickImage },
        { text: 'Take a Photo', onPress: handleTakePhoto },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
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
        const updateData = {
          name: username,
          email: userEmail,
          phoneNo: userPhoneNo,
          location: userLocation,
          ProfileImage: avatar?.uri || '',
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
            
            <TouchableOpacity onPress={handleImageOptions}>
              <Image 
                source={avatar ? avatar : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <View style={styles.fieldContainer}>
            <Text>Username</Text>
            <TextInput
              style={styles.input}
              value= {username}
              onChangeText={setUsername}
            />
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
            />
            <Text>Phone No</Text>
            <TextInput
              style={styles.input}
              value={userPhoneNo}
              onChangeText={setUserPhoneNo} 
              keyboardType="phone-pad"
            />
            <Text>Location</Text>
            <TextInput
              style={styles.input}
              value={userLocation}
              onChangeText={setUserLocation} 
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
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

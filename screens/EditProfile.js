import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, TouchableOpacity, Alert, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; // Import the image manipulator
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import { db, auth } from '../config/firebaseConfig'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useThemeColors } from './Context/Theme/useThemeColors';
import {useTheme} from './Context/Theme/ThemeContext';


const EditProfile = ({ navigation }) => {
  const colors = useThemeColors();
  const {isDarkMode} = useTheme();
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
    >
    <View style={styles.container}>
        <Image
          source={{ uri: isDarkMode ?'https://i.pinimg.com/564x/c6/04/60/c60460f2e96140732fdf9a79b6432f3e.jpg' :'https://i.pinimg.com/originals/6b/f8/48/6bf848ae5afdb77782a1ff14067b194a.jpg' }}
          style={styles.backgroundImage}
          resizeMode='cover'
        />
        <BlurView style={styles.blurView} intensity={1} tint="dark" />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={[styles.formContainer,{backgroundColor:colors.background}]}>
            
            <TouchableOpacity onPress={handleImageOptions}>
              <Image 
                source={avatar ? avatar : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <View style={styles.fieldContainer}>
            <Text style={{color: colors.text}}>Username</Text>
            <TextInput
              style={styles.input}
              value= {username}
              onChangeText={setUsername}
              
            />
            <Text style={{color: colors.text}}>Email</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
            />
            <Text style={{color: colors.text}}>Phone No</Text>
            <TextInput
              style={styles.input}
              value={userPhoneNo}
              onChangeText={setUserPhoneNo} 
              keyboardType="phone-pad"
            />
            <Text style={{color: colors.text}}>Location</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:'transparent',
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
    height:hp('85%'),
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
    backgroundColor: '#2563eb',
    paddingVertical: hp(2.5), 
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    top: hp('5%'),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: hp(2.5), 
    // fontWeight: '600',
    fontFamily:'Roboto_700Bold',
  },
});

export default EditProfile;

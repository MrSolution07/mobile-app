import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '../config/firebaseConfig'; 
import DataContext from '../screens/Context/Context'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const EditProfile = ({ navigation }) => {
  const { name, email, phoneNo, location } = useContext(DataContext); 

  // State variables
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userPhoneNo, setUserPhoneNo] = useState(phoneNo || ''); // New phone number state
  const [userLocation, setUserLocation] = useState(location || ''); // New location state
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
        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <TouchableOpacity onPress={handlePickImage}>
              <Image 
                source={avatar ? avatar : { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <Text>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="username"
              // value={username}
              onChangeText={setUsername}
            />
            <Text>email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
            />
             <Text>phoneNo</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              // value={userPhoneNo}
              onChangeText={setUserPhoneNo} // Update phone number state
              keyboardType="phone-pad"
            />
             <Text>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={userLocation}
              onChangeText={setUserLocation} // Update location state
            />
            <Text>New Password (leave blank to keep current)</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password (leave blank to keep current)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
  },
  formContainer: {
    backgroundColor: 'whitesmoke',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#47ABCE',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditProfile;

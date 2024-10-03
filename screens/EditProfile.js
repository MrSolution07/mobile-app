//Firebase is showing me flames
//I'm trying to update the user's profile but I'm getting an error
//I don't know what I'm doing wrong
//If anyone can help, I would really appreciate it


import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import DataContext from '../screens/Context/Context'; 
import firebase from '../config/firebaseConfig';

const EditProfile = ({ navigation }) => {
  const { name, email, phoneNo, ProfilleImage, updateProfile } = useContext(DataContext);

  const [username, setUsername] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(ProfilleImage || { uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' });


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
    if (!username || !userEmail || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const userRef = firebase.firestore().collection('users').doc(currentUser.id);
      await userRef.update({
        name: username,
        email: userEmail,
        phoneNo: phoneNo,
        ProfilleImage: avatar.uri,
      });

      await firebase.auth().currentUser.updatePassword(password);

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.navigate('UserProfile');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
              <Image source={avatar} style={styles.avatar} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
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

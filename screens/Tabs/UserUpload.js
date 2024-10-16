import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState } from 'react';
import { StyleSheet, Image, ScrollView, View, Text, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useForm, Controller, set } from 'react-hook-form';
import { setDoc, doc } from '../../config/firebaseConfig'; 
import { db, storage, auth } from '../../config/firebaseConfig'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';  

const UploadNFTScreen = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [imageUri, setImageUri] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMenuPress = () => {
        navigation.toggleDrawer();
    };

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const resizedImage = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            setImageUri(resizedImage.uri);
            
        } else {
            setMessage('Image selection was cancelled.');
        }
    };

    const generateTokenId = () => {
        return Math.random().toString(36).substring(2, 200);
    };

    const uploadImageToFirebase = async (imageUri, tokenId) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const storageRef = ref(storage, `nfts/${tokenId}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const uploadNFTToFirestore = async (nftData) => {
        try {
            const nftDocRef = doc(db, 'nfts', nftData.tokenId);
            await setDoc(nftDocRef, nftData);
        } catch (error) {
            console.error('Error saving NFT to Firestore:', error);
            throw new Error('Failed to upload NFT to Firestore');
        }
    };

    const onSubmit = async (data) => {
        if (!imageUri) {
            setMessage('Please select an image.');
            return;
        }

        setLoading(true);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                throw new Error('User not authenticated');
            }

            const tokenId = generateTokenId();
            const imageUrl = await uploadImageToFirebase(imageUri, tokenId);

            const nftData = {
                ...data,
                imageUrl,  
                tokenId,
                price: data.price,
                bids: [], 
                createdAt: new Date().toISOString(),
                userId: user.uid,
                uploadedBy: user.displayName || user.email,
                status: 'minted',  
            };

            await uploadNFTToFirestore(nftData);
            setImageUri(null);
            reset();
            setMessage('NFT uploaded successfully!');
            setMessage('');
            navigation.navigate('items');
            
        } catch (error) {
            setMessage('Error uploading NFT: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <Ionicons 
                name="menu-sharp" 
                size={29} 
                onPress={handleMenuPress} 
                style={styles.menuIcon}
            />
            <View style={styles.header}>
                <Text style={styles.screenTitle}>Upload Your NFT</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
                    {/* Form inputs */}
                    <Controller
                        control={control}
                        rules={{ required: 'Title is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Title"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                errorMessage={errors.title?.message}
                                inputContainerStyle={styles.inputContainer}
                                labelStyle={styles.label}
                                inputStyle={styles.input}
                            />
                        )}
                        name="title"
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        rules={{ required: 'Description is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Description"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                errorMessage={errors.description?.message}
                                multiline
                                inputContainerStyle={styles.inputContainer}
                                labelStyle={styles.label}
                                inputStyle={styles.input}
                            />
                        )}
                        name="description"
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        rules={{ 
                            required: 'Price is required', 
                            pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Invalid price format' } 
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Price (ETH)"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType="numeric"
                                errorMessage={errors.price?.message}
                                inputContainerStyle={styles.inputContainer}
                                labelStyle={styles.label}
                                inputStyle={styles.input}
                            />
                        )}
                        name="price"
                        defaultValue=""
                    />
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Tags (comma separated)"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                inputContainerStyle={styles.inputContainer}
                                labelStyle={styles.label}
                                inputStyle={styles.input}
                            />
                        )}
                        name="tags"
                        defaultValue=""
                    />
                    <Pressable
                        onPress={handlePickImage}
                        style={styles.imageButton}
                    >
                        <Text style={styles.buttonText}>Select Image</Text>
                    </Pressable>
                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    )}
                    <Pressable
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                        style={[styles.button, { opacity: loading ? 0.6 : 1 }]}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Upload NFT</Text>
                        )}
                    </Pressable>
                    {message ? (
                        <Text style={styles.message}>{message}</Text>
                    ) : null}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
        backgroundColor: '#f7f9fc', 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 20,
        padding: 15,
        marginTop: hp('8.5%'),
        // backgroundColor: '#fff',
        // elevation: 5, 
        // borderBottomLeftRadius: 15,
        // borderBottomRightRadius: 15,
    },
    menuIcon: {
        position: 'absolute',
        left: 15,
        marginTop: hp(3.5),
    },
    container: {
        flexGrow: 1, 
        justifyContent: 'center',
        padding: 12,
        
    },
    screenTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#075eec',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        padding: 18,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: 'rgba(0,0,0,0.1)', 
        borderRadius: 10,
        padding: 8,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333', 
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        color: '#333',
    },
    imageButton: {
        backgroundColor: '#075eec', 
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    button: {
        backgroundColor: '#4caf50', 
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: wp('80%'),
        height: hp('30%'),
        borderRadius: 15,
        marginVertical: 15,
        alignSelf: 'center',
    },
    message: {
        textAlign: 'center',
        color: '#e74c3c',
        fontSize: 16,
        marginTop: 10,
    },
});

export default UploadNFTScreen;

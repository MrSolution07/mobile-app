import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState } from 'react';
import { StyleSheet, Image, ScrollView, View, Text, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { setDoc, doc } from '../../config/firebaseConfig'; 
import { db } from '../../config/firebaseConfig'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const UploadNFTScreen = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors } } = useForm();
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
            setImageUri(result.assets[0].uri);
            setMessage('');
        } else {
            setMessage('Image selection was cancelled.');
        }
    };

    const generateTokenId = () => {
        return Math.random().toString(36).substring(2, 8); // random token id
    };

    const uploadNFTToFirestore = async (nftData) => {
        try {
            const nftDocRef = doc(db, 'nfts', nftData.tokenId); // Create reference with tokenId
            await setDoc(nftDocRef, nftData); // Upload data to Firestore
            setImageUri(null); // Clear image after upload
            setMessage('NFT uploaded successfully!');
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
            const tokenId = generateTokenId(); 
            const nftData = {
                ...data,
                imageUri,
                tokenId,
                price: data.price,
                bids: [], // Initialize bids as an empty array
                createdAt: new Date().toISOString() // Add a timestamp
            };

            await uploadNFTToFirestore(nftData); // Upload to Firestore
            setMessage('NFT uploaded successfully!');
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
            <View style={styles.header}>
                <Ionicons 
                    name="menu-sharp" 
                    size={30} 
                    onPress={handleMenuPress} 
                    style={styles.menuIcon}
                />
                <Text style={styles.screenTitle}>Upload Your NFT</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        padding: 15,
        marginTop: hp('6%'),
        // backgroundColor: '#fff',
        // elevation: 5, 
        // borderBottomLeftRadius: 15,
        // borderBottomRightRadius: 15,
    },
    menuIcon: {
        position: 'absolute',
        left: 20,
    },
    container: {
        flexGrow: 1, 
        justifyContent: 'center',
        padding: 12,
        
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
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

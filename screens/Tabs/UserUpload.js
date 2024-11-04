

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Image, ScrollView, View, Text, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useForm, Controller, set } from 'react-hook-form';
import { setDoc, doc} from '../../config/firebaseConfig'; 
import { db, storage, auth } from '../../config/firebaseConfig'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import tw from 'twrnc';  
import { useThemeColors } from '../Context/Theme/useThemeColors';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

const UploadNFTScreen = () => {
    const colors = useThemeColors();
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [imageUri, setImageUri] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageloading, setImageLoading] = useState(false);
    const [predictedPrice, setPredictedPrice] = useState(null);

    const handleMenuPress = () => {
        navigation.toggleDrawer();
    };


    const copyToClipboard = async () => {
        if (predictedPrice) {
            await Clipboard.setStringAsync(`${predictedPrice}`);
            Alert.alert("Copied to Clipboard", "The price has been copied to your clipboard.");
        }
    };


    const savePredictedPriceToFirestore = async (predictedPrice, tokenId) => {
    try {
        const predictedPricesCollection = collection(db, 'predictedPrices');
        const predictedPriceData = {
            tokenId,
            predictedPrice,
            createdAt: new Date().toISOString(),
        };
        
        await addDoc(predictedPricesCollection, predictedPriceData);
        console.log("Predicted price saved successfully!");
    } catch (error) {
        console.error("Error saving predicted price to Firestore:", error);
    }
};



    useEffect(() => {
        const loadModel = async () => {
            try {
                await tf.ready();
                setIsTfReady(true);

                const modelJson = require('../../assets/model/model.json');
                const weightsManifest = require('../../assets/model/weights.bin');

                const loadedModel = await tf.loadGraphModel(modelJson, { weightPathPrefix: weightsManifest });
                setModel(loadedModel);
            } catch (error) {
              
            }
        };

        loadModel();
    }, []);




  
    

    const handlePickImage = async () => {
        setImageLoading(true);
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
            const predictedPrice = await predictPrice();
            setPredictedPrice(predictedPrice);
            
        } else {
            setMessage('Image selection was cancelled.');
        }
        setImageLoading(false);
        
    };

    const generateTokenId = (length = 20) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let tokenId = '';
    
        for (let i = 0; i < length; i++) {
            tokenId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    
        return tokenId;
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
            const nftDocRef = await addDoc(collection(db, 'nfts'), nftData);
            return nftDocRef.id;
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
                creatorId: user.uid, 
            };

            await uploadNFTToFirestore(nftData);
            setImageUri(null);
            reset();
            savePredictedPriceToFirestore(predictedPrice, tokenId)
            setMessage('NFT uploaded successfully!');
            setMessage('');
            navigation.navigate('Wallet', {screen:'Wallet', tab:'Items'} );
            
        } catch (error) {
            setMessage('Error uploading NFT: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

      
    const generatePredictedPrice = (baseValue) => {
       
        
        const randomOffset = Math.random() * 0.002 - 0.001; 
        const predictedPrice = baseValue + randomOffset;
    
        // Limit the price to be within the range [0, 1)
        return Math.max(0.001, Math.min(predictedPrice, 0.009)).toFixed(5); // Ensures no negative prices and less than 1
    };
    
    const predictPrice = async () => {
        const baseValue = 0.001 + Math.random() * (0.009 - 0.001); 
        const randomPrice = generatePredictedPrice(baseValue);
        console.log("Generated price:", randomPrice);
        return randomPrice;
    };

    return (
        <SafeAreaView style={[tw`flex-1 bg-white`,{backgroundColor: colors.background}]}>
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={10}
        >
            <Ionicons 
                name="menu-sharp" 
                size={29} 
                onPress={handleMenuPress} 
                style={[styles.menuIcon, {color :colors.text}]}
            />
            <View style={styles.header}>
                <Text style={styles.screenTitle}>Upload Your NFT</Text>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[styles.formContainer, { backgroundColor : colors.uploadFormContainer}]}>
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
                                pattern: { value: /^\d+(\.\d{1,10})?$/, message: 'Invalid price format' } 
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
                        {predictedPrice ? (
                            <View style={styles.predictedPriceContainer}>
                            <Text style={styles.predictedPriceText}>
                                Suggested Price: {predictedPrice} ETH
                            </Text>
                            <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                                <Text style={styles.copyButtonText}>Copy</Text>
                            </TouchableOpacity>
                        </View>
                            
                        ) : null}

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
                            {imageloading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Select Image</Text>
                            )}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingContainer: {
        flex: 1,
        // backgroundColor: '#f7f9fc', 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        // marginBottom: 10,
        padding: 15,
        marginTop: Platform.OS ==='ios'? hp('8%'): hp('10%'),
       
    },
    menuIcon: {
        position: 'absolute',
        left: 15,
        marginTop: Platform.OS ==='ios' ? hp('4%') : hp('5%') ,
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
        shadowColor: 'lightgrey',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.10,
        shadowRadius: 10,
        elevation: 3,
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
    predictedPriceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        textAlign: 'center',
        marginTop:-25
    },
    predictedPriceContainer: { flexDirection: 'row', alignItems: 'center' },
   
    copyButton: { backgroundColor: '#4CAF50', 
        padding: 15, 
        borderRadius: 4, 
        marginBottom:30,
        marginLeft:5

    },
    copyButtonText: { color: '#fff' },
});

export default UploadNFTScreen;
import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, View, Text, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useForm, Controller } from 'react-hook-form';
import { db, storage, auth } from '../../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js
import { Asset } from 'expo-asset'; // Import Asset for loading assets
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const UploadNFTScreen = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageloading, setImageLoading] = useState(false);
    const [model, setModel] = useState(null);
    const [price, setPrice] = useState('');
    const [isTfReady, setIsTfReady] = useState(false);

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready(); // Wait for TensorFlow.js to be ready
            setIsTfReady(true); // Set the TensorFlow readiness state

            try {
                // Load the model files from the assets
                const modelJsonAsset = Asset.fromModule(require('../../assets/model/model.json'));
                const weightsAsset = Asset.fromModule(require('../../assets/model/weights.bin'));

                // Ensure assets are downloaded
                await modelJsonAsset.downloadAsync();
                await weightsAsset.downloadAsync();

                // Log the URIs for debugging
                console.log("Model JSON URI:", modelJsonAsset.uri);
                console.log("Weights URI:", weightsAsset.uri);

                // Load the model using the bundleResourceIO method
                const model = await tf.loadGraphModel(bundleResourceIO(modelJsonAsset, weightsAsset));

                setModel(model); // Set the loaded model
            } catch (error) {
                console.error("Error loading model:", error);
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
        }
        setImageLoading(false);
    };

    const predictPrice = async (inputData) => {
        if (model) {
            const inputTensor = tf.tensor2d([inputData]); // Reshape input data as needed
            const prediction = model.predict(inputTensor); // Make the prediction
            const predictedPrice = prediction.dataSync()[0]; // Get the predicted price
            return predictedPrice; // Return or set this to your state
        }
        return null;
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
    
            // Prepare input data for prediction based on the user's input
            const inputData = [data.title.length, data.description.length, parseFloat(data.price)]; // Adjust as per your model's requirements
            const predictedPrice = await predictPrice(inputData);
    
            const nftData = {
                ...data,
                imageUrl,
                tokenId,
                price: predictedPrice ? predictedPrice.toString() : data.price, // Use predicted price if available
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
            setMessage('NFT uploaded successfully!');
            navigation.navigate('Wallet', { screen: 'Wallet', tab: 'Items' });
        } catch (error) {
            setMessage('Error uploading NFT: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
                    <View style={styles.formContainer}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Title"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    errorMessage={errors.title?.message}
                                />
                            )}
                            name="title"
                            defaultValue=""
                            rules={{ required: 'Title is required' }}
                        />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Description"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    errorMessage={errors.description?.message}
                                />
                            )}
                            name="description"
                            defaultValue=""
                            rules={{ required: 'Description is required' }}
                        />
                        <Text>Predicted Price: {price ? price.toFixed(2) : '...'}</Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Price (ETH)"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    keyboardType="numeric"
                                    errorMessage={errors.price?.message}
                                />
                            )}
                            name="price"
                            defaultValue=""
                            rules={{
                                required: 'Price is required',
                                pattern: { value: /^\d+(\.\d{1,10})?$/, message: 'Invalid price format' },
                            }}
                        />
                        <Pressable onPress={handlePickImage}>
                            <Text>Select Image</Text>
                        </Pressable>
                        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
                        <Pressable onPress={handleSubmit(onSubmit)}>
                            <Text>Upload NFT</Text>
                        </Pressable>
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
});

export default UploadNFTScreen;

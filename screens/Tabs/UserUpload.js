import React, { useState } from 'react';
import { StyleSheet, Image, ScrollView, View, Text, KeyboardAvoidingView, Platform, Pressable, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const UploadNFTScreen = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [imageUri, setImageUri] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

    const saveNFTData = async (nftData) => {
        try {
            const existingData = await AsyncStorage.getItem('nftData');
            const newNFTData = existingData ? [...JSON.parse(existingData), nftData] : [nftData];
            await AsyncStorage.setItem('nftData', JSON.stringify(newNFTData));
            console.log('NFT data saved:', newNFTData); 
        } catch (error) {
            console.error('Error saving NFT data:', error);
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
            const nftData = { ...data, imageUri, tokenId, price: data.price  }; 
            await saveNFTData(nftData); 

            console.log('Uploaded NFT Data:', nftData);
            setMessage('NFT uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading NFT: ' + error.message);
            console.error('Error in onSubmit:', error); 
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
            <Text style={styles.screenTitle}>Upload Your NFT</Text>
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
                        style={styles.button}
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
    },
    container: {
        flexGrow: 1, 
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f4f8',
        top: hp('4%'), 
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: hp('8%'),
        color: '#075eec',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: '#eef3f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#1068EC',
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 20,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    message: {
        marginTop: 20,
        textAlign: 'center',
        color: 'green',
        fontSize: 16,
    },
});

export default UploadNFTScreen;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';
import { BlurView } from 'expo-blur';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CustomTabIcon = ({ focused, name }) => {
    return (
        <View style={styles.container}>
            {focused && (
                <View style={styles.gradientContainer}>
                    <BlurView intensity={35} style={styles.blurView} />
                    <LinearGradient
                        colors={['rgba(128, 0, 128, 0.5)', '#320089', '#640AFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientCircle}
                    />
                </View>
            )}
            <Entypo name={name} size={24} color="white" style={styles.icon} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        height: width * 0.15, 
        width: width * 0.15,  
        marginTop: 10,        
    },
    gradientContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: width * 0.075, 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
        opacity: 0.5,
    },
    blurView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: width * 0.075, 
        overflow: 'hidden',
    },
    gradientCircle: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.075, 
    },
    icon: {
        textAlign: 'center', 
    },
});

export default CustomTabIcon;
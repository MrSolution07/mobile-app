import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';
import { BlurView } from 'expo-blur';

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
      
      <Entypo name={name} size={24} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientContainer: {
    position: 'absolute',
    width: 56, 
    height: 56, 
    borderRadius: 38, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, 
    backgroundColor:"purple",
    opacity:0.5,
  },
  blurView: {
    position: 'absolute',
    width: 56, 
    height: 56, 
    borderRadius: 28,  
    overflow: 'hidden', 
  },
  gradientCircle: {
    width: 56,  
    height: 56, 
    borderRadius: 28,  
  },
});

export default CustomTabIcon;

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import Feather from '@expo/vector-icons/Feather';

const termsHtml = Asset.fromModule(require('../assets/terms.html')).uri;

const TermsAndConditions = ({ isVisible, onClose }) => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const scrollToBottom = () => {
    webViewRef.current.injectJavaScript(`
      window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
      true;
    `);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: termsHtml }}
          style={styles.webview}
          onLoadEnd={handleLoadEnd}
          scrollEnabled={true}
          onHttpError={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
        <Pressable style={styles.scrollButton} onPress={scrollToBottom}>
          <Feather name="chevrons-down" size={32} color="#075eec" />
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    width: wp('100%'),
    height: hp('100%'),
  },
  modalContent: {
    height: hp('80%'), 
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden', 
  },
  webview: {
    width: wp('100%'),
    height: hp('80%'),
  },
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 10,
  },
  scrollButton: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    padding: 10,
    elevation: 2,
    zIndex: 5,
  },
});

export default TermsAndConditions;

import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView,KeyboardAvoidingView,Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DataContext from '../Context/Context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import { useThemeColors } from '../Context/Theme/useThemeColors';

const Gemini = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, setShowResult, name, suggestedPrompts } = useContext(DataContext);
  const colors = useThemeColors();

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // i honeslty dont know how to prevent the styling with Gemini sometimes it's okay some other...      //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Handle when a suggested prompt is clicked
  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt); 
    onSent(prompt);   
  };

  // Handle Back button to return to greeting
  const handleBack = () => {
    setShowResult(false);
    setInput(''); 
  };

  // Prevent sending empty prompt
  const handleSend = () => {
    if (input.trim()) {
      onSent(input); 
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.container, {backgroundColor:colors.background}]}>
          <View style={styles.mainContainer}>
            {!showResult ? (
              <>
                <View style={styles.greet}>
                  <Text style={[styles.greetText,{color: colors.text}]}>Hello, <Text style={styles.name}>{name}</Text> </Text>
                  <Text style={[styles.subText,{color: colors.ethVolumeAmount}]}>How can I help you today?</Text>
                </View>

                <ScrollView horizontal={true} style={styles.cardsContainer}>
                  {suggestedPrompts.map((prompt, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => handleSuggestedPrompt(prompt)}>
                      <Text style={styles.cardText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <View style={[styles.resultContainer,{color: colors.text}]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.resultTitle}>
                  <Text style={{color: colors.text}}>{recentPrompt}</Text>
                </View>
                <View style={styles.resultData}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                  ) : (
                    <Text style={{color: colors.text}}>{resultData}</Text> // Result displayed word-by-word
                  )}
                </View>
              </View>
            )}
            <KeyboardAvoidingView
            // style={{ flexGrow: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 10}>
                <View style={styles.bottomContainer}>
                  <View style={styles.searchBox}>
                  
                    <TextInput
                      style={styles.input}
                      value={input}
                      onChangeText={(text) => setInput(text)}
                      placeholder="Enter a prompt here"
                      placeholderTextColor="#999"
                    />

                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                      <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bottomInfo}>
                    Gravity. It keeps you rooted to the ground...
                  </Text>
                </View>
                </KeyboardAvoidingView>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:15,
  },
  mainContainer: {
    padding: 10,
    flex: 1,
    marginTop: hp('5%'),

  },
  greet: {
    marginBottom: 20,
  },
  name:{
    color:'#6a4f8c',
    fontWeight: '700',
  },
  greetText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  subText: {
    fontSize: 16,
    color: '#555',
  },
  cardsContainer: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginRight: 16,
    width: 200,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
  },
  resultTitle: {
    marginBottom: 16,
  },
  resultData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 8,
    top: 0,
    marginBottom: '28%',
  },
  input: {
    flex: 1,
    padding: 8,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
  },
  bottomInfo: {
    bottom: 70,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default Gemini;

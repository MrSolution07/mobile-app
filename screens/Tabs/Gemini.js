import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView, MaskedViewComponent } from 'react-native';
import DataContext from '../Context/Context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; 
import { LinearGradient } from 'expo-linear-gradient';

const Gemini = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, setShowResult, name } = useContext(DataContext);

  const suggestedPrompts = [
    "What is an NFT and how does it work?",
    "How can I create and sell my own NFT?",
    "What are the benefits of owning an NFT?",
    "What is the environmental impact of NFTs?",
    "How do NFTs impact the art and gaming industries?",
    "What are gas fees in the context of NFTs?",
    "Can NFTs be resold, and how does that process work?",
    "How are NFTs different from cryptocurrencies?",
    "What makes an NFT valuable?",
    "Are NFTs a good investment?"
];

  // Handle when a suggested prompt is clicked
  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt); // Set the input to the suggested prompt
    setTimeout(() => onSent(), 3); // Call onSent after the input is updated
  };

  // Handle Back button to return to greeting
  const handleBack = () => {
    setShowResult(false);
    setInput(''); // Clear input when going back
  };

  // Prevent sending empty prompt
  const handleSend = () => {
    if (input.trim()) {
      onSent();
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.mainContainer}>
            {/* Display Greeting or Results */}
            {!showResult ? (
              <>
                <View style={styles.greet}>
                  <Text style={styles.greetText}>Hello, <Text style={styles.name}>Hello</Text> </Text>
                  <Text style={styles.subText}>How can I help you today?</Text>
                </View>

                {/* Horizontal ScrollView for Suggested Prompts */}
                <ScrollView horizontal={true} style={styles.cardsContainer}>
                  {suggestedPrompts.map((prompt, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => handleSuggestedPrompt(prompt)}>
                      <Text style={styles.cardText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <View style={styles.resultContainer}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.resultTitle}>
                  <Text>{recentPrompt}</Text>
                </View>
                <View style={styles.resultData}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                  ) : (
                    <Text>{resultData}</Text> // Result displayed word-by-word
                  )}
                </View>
              </View>
            )}

            {/* Bottom Input Area */}
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
    // backgroundColor:'rgba(0,0,0,0.1)',
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
    marginTop: 16,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default Gemini;
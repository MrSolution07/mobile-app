import React, { useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import DataContext from '../Context/Context';

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

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
    setTimeout(() => onSent(), 3);
  };

  const handleBack = () => {
    setShowResult(false);
    setInput('');
  };

  const handleSend = () => {
    if (input.trim()) {
      onSent();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.mainContainer}>
            {!showResult ? (
              <>
                <View style={styles.greet}>
                  <Text style={styles.greetText}>Hello, {name}</Text>
                  <Text style={styles.subText}>How can MetaWay AI I assist you today?</Text>
                </View>

                <ScrollView horizontal={true} style={styles.cardsContainer} showsHorizontalScrollIndicator={false}>
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
                  <Text style={styles.backButtonText}>Reset</Text>
                </TouchableOpacity>
                <View style={styles.resultTitle}>
                  <Text style={styles.promptText}>{recentPrompt}</Text>
                </View>
                <View style={styles.resultData}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                  ) : (
                    <Text style={styles.resultText}>{resultData}</Text>
                  )}
                </View>
              </View>
            )}

            <View style={styles.bottomContainer}>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.input}
                  value={input}
                  onChangeText={(text) => setInput(text)}
                  placeholder="Ask me anything..."
                  placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.bottomInfo}>
                Nft can make you rich...
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    padding: 20,
    flex: 1,
  },
  greet: {
    marginBottom: 24,
  },
  greetText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  subText: {
    fontSize: 18,
    color: '#666',
  },
  cardsContainer: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#E8EEF3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 16,
    width: 220,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
  },
  resultTitle: {
    marginBottom: 20,
  },
  promptText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
  },
  resultData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    padding: 12,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomInfo: {
    marginTop: 24,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default Gemini;

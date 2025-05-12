import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyBlbgVMq6W849PT9WAnHZZghMKtIq8RtAY'; // Replace with your Gemini API key

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const theme = {
  colors: {
    primary: '#6B48FF',
    secondary: '#FF6B6B',
    accent: '#4ECDC4',
    background: '#F7F7FF',
    text: '#2D3436',
  }
};

const Chat = () => {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null); // Create a ref for the ScrollView

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    try {
      setIsChatLoading(true);
      const userMessage = chatInput.trim();
      setChatMessages(prev => [...prev, { text: userMessage, isUser: true }]);
      setChatInput('');

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `As an emergency assistance chatbot, help the user with their situation: ${userMessage}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botMessage = response.text().replace(/\*/g, '');

      setChatMessages(prev => [...prev, { text: botMessage, isUser: false }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to get response from AI');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Scroll to the bottom whenever chatMessages changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatTitle}>Emergency Assistance Chatbot</Text>
        </View>

        <ScrollView 
          style={styles.chatMessages} 
          ref={scrollViewRef} // Attach the ref to the ScrollView
        >
          {chatMessages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
          {isChatLoading && (
            <ActivityIndicator color={theme.colors.primary} style={styles.chatLoading} />
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="Describe your emergency..."
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 90,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  chatMessages: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'purple',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatLoading: {
    marginVertical: 10,
  },
});

export default Chat;

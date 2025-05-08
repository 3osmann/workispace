/**
 * Écran de chat pour le support client
 * Permet aux utilisateurs de communiquer avec le service client via une interface de chat
 */
import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { ChatMessage } from '../../src/types';

// Messages initiaux pour la démonstration
const MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Bonjour ! Comment puis-je vous aider aujourdhui ?',
    timestamp: '10:30',
    sender: 'agent',
    agent: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    },
  },
  {
    id: '2',
    text: 'Jai une question concernant ma réservation',
    timestamp: '10:31',
    sender: 'user',
  },
  {
    id: '3',
    text: 'Bien sûr, je peux vous aider avec ça. Pouvez-vous me donner plus de détails sur votre réservation ?',
    timestamp: '10:32',
    sender: 'agent',
    agent: {
      name: 'Sophie Martin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    },
  },
];

/**
 * Composant d'écran de chat pour le support client
 */
export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);

  /**
   * Gère l'envoi d'un nouveau message
   */
  const handleSend = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Support client</Text>
          <Text style={styles.headerSubtitle}>En ligne • Répond généralement en quelques minutes</Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }}
      >
        {MESSAGES.map((msg) => (
          <View 
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.sender === 'user' ? styles.userMessageWrapper : styles.agentMessageWrapper
            ]}
          >
            {msg.sender === 'agent' && msg.agent && (
              <Image 
                source={{ uri: msg.agent.avatar }}
                style={styles.agentAvatar}
              />
            )}
            <View style={[
              styles.message,
              msg.sender === 'user' ? styles.userMessage : styles.agentMessage
            ]}>
              {msg.sender === 'agent' && msg.agent && (
                <Text style={styles.agentName}>{msg.agent.name}</Text>
              )}
              <Text style={[
                styles.messageText,
                msg.sender === 'user' ? styles.userMessageText : styles.agentMessageText
              ]}>
                {msg.text}
              </Text>
              <Text style={[
                styles.timestamp,
                msg.sender === 'user' ? styles.userTimestamp : styles.agentTimestamp
              ]}>
                {msg.timestamp}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Écrivez votre message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Send size={24} color={message.trim() ? '#fff' : '#A0AEC0'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#0066FF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  agentMessageWrapper: {
    justifyContent: 'flex-start',
  },
  agentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  message: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    backgroundColor: '#0066FF',
    borderBottomRightRadius: 4,
  },
  agentMessage: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  agentName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#fff',
  },
  agentMessageText: {
    color: '#333',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  agentTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    padding: 16,
    paddingTop: 16,
    marginRight: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    maxHeight: 120,
    minHeight: 54,
  },
  sendButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
});

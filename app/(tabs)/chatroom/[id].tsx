import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Sender {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
}

interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  type: 'SYSTEM' | 'TEXT' | 'IMAGE' | 'FILE';
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  isEdited: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  sender: Sender;
}

interface ApiResponse {
  success: boolean;
  data: {
    messages: Message[];
    totalCount: number;
    hasMore: boolean;
  };
}

const ChatRoomScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id: consultationId } = useLocalSearchParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3;
  const [consultation, setConsultation] = useState<any>(null);
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  // Mock user ID - replace with actual user context
  const currentUserId = user?.id || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '') || '';

  useEffect(() => {
    fetchMessages();
    markAllAsRead();
    
    // Set up real-time message polling with longer interval to avoid rate limiting
    const interval = setInterval(() => fetchMessages(), 15000); // Increased to 15 seconds
    
    // Also fetch messages when the app comes back into focus
    const handleFocus = () => fetchMessages();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchMessages();
      }
    };
    
    // Add event listeners for focus/visibility changes
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchMessages = async (isRetry: boolean = false) => {
    const now = Date.now();
    
    // Prevent too frequent requests (minimum 5 seconds between requests)
    if (now - lastFetchTime < 5000 && !isRetry) {
      return;
    }
    
    try {
      setLastFetchTime(now);
      const response = await fetch(
        `http://34.45.85.24/api/messages/consultation/${consultationId}?userId=${currentUserId}&page=1&limit=50`
      );
      
      if (response.status === 429) {
        // Rate limited - implement exponential backoff
        if (retryCount < maxRetries) {
          const backoffDelay = Math.pow(2, retryCount) * 5000; // 5s, 10s, 20s
          console.log(`Rate limited. Retrying in ${backoffDelay/1000} seconds...`);
          
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchMessages(true);
          }, backoffDelay);
          
          return;
        } else {
          console.error('Max retries reached for rate limit');
          setRetryCount(0);
          return;
        }
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setMessages(data.data.messages || []);
        setRetryCount(0); // Reset retry count on success
        // setConsultation(data.data.consultation); // Uncomment if consultation data is included in response
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      // Only retry on network errors, not API errors
      if (retryCount < maxRetries && !isRetry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchMessages(true);
        }, 5000);
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    setSending(true);
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      consultationId: consultationId || '',
      senderId: currentUserId,
      content: inputText.trim(),
      type: 'TEXT',
      fileUrl: null,
      fileName: null,
      fileSize: null,
      isEdited: false,
      readAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sender: {
        id: currentUserId,
        fullName: user?.fullName || 'You',
        username: user?.username || 'user',
        avatar: user?.avatar || null,
      },
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    setInputText('');

    try {
      const response = await fetch('http://34.45.85.24/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultationId,
          senderId: currentUserId,
          content: tempMessage.content,
          messageType: 'TEXT',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Replace temp message with actual message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? data.data : msg
          )
        );
      } else {
        // Remove temp message on failure
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`http://34.45.85.24/api/messages/read-all/${consultationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
        }),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const endSession = async () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this consultation session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch('http://34.45.85.24/api/messages/session/end', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  consultationId,
                  endedBy: currentUserId,
                }),
              });

              const data = await response.json();
              if (data.success) {
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to end session');
            }
          },
        },
      ]
    );
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.senderId === currentUserId;
    const isSystemMessage = item.type === 'SYSTEM';
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showDate = !previousMessage || 
      new Date(item.createdAt).toDateString() !== new Date(previousMessage.createdAt).toDateString();

    if (isSystemMessage) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.content}</Text>
          <Text style={styles.systemMessageTime}>
            {formatMessageTime(item.createdAt)}
          </Text>
        </View>
      );
    }

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage
        ]}>
          {!isOwnMessage && (
            <Text style={styles.senderName}>
              {item.sender.fullName}
            </Text>
          )}
          
          <View style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText
            ]}>
              {item.content}
            </Text>
            <View style={styles.messageFooter}>
              <Text style={[
                styles.messageTime,
                isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
              ]}>
                {formatMessageTime(item.createdAt)}
                {item.isEdited && ' (edited)'}
              </Text>
              {isOwnMessage && (
                <Ionicons
                  name={item.readAt ? "checkmark-done" : "checkmark"}
                  size={14}
                  color={item.readAt ? "#5B5AF1" : "#666"}
                  style={styles.readIndicator}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B5AF1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#5B5AF1" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {consultation?.topic || 'Consultation'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {consultation?.status === 'ACTIVE' ? 'Active' : 'Chat Session'}
          </Text>
        </View>

        <TouchableOpacity onPress={endSession}>
          <Ionicons name="call-outline" size={24} color="#FF5722" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#333" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="send" size={20} color="#000" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5B5AF1',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#5B5AF1',
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontStyle: 'italic',
  },
  systemMessageTime: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  messageContainer: {
    marginBottom: 12,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#5B5AF1',
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ownMessageBubble: {
    backgroundColor: '#5B5AF1',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#555',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#000',
  },
  otherMessageText: {
    color: '#FFF',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  ownMessageTime: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  otherMessageTime: {
    color: '#999',
  },
  readIndicator: {
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    backgroundColor: '#222',
    color: '#FFF',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B5AF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#5B5AF1',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ChatRoomScreen;
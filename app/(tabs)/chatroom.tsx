import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar, 
  TextInput,
  FlatList 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { MessageStackParamList } from '../../App';

type ChatDetailScreenRouteProp = RouteProp<MessageStackParamList, 'ChatDetail'>;

interface ChatDetailScreenProps {
  route: ChatDetailScreenRouteProp;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ route }) => {
  const { name } = route.params;
  const [message, setMessage] = useState<string>('');
  
  const messages: Message[] = [
    { id: 1, text: 'Hello! How are you doing today?', sender: 'them', time: '10:30 AM' },
    { id: 2, text: 'I\'m doing great, thanks for asking! How about you?', sender: 'me', time: '10:32 AM' },
    { id: 3, text: 'I\'m good too. Are you ready for our session?', sender: 'them', time: '10:35 AM' },
    { id: 4, text: 'Yes, I\'ve been practicing the techniques you suggested last time.', sender: 'me', time: '10:36 AM' },
    { id: 5, text: 'That\'s excellent! We\'ll build on those today.', sender: 'them', time: '10:38 AM' },
  ];

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessageBubble : styles.theirMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.sender === 'me' ? '#030712' : '#E5E7EB' }
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message sending logic here
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      
      <View style={styles.chatHeader}>
        <View style={styles.chatTitleContainer}>
          <View style={styles.chatDetailAvatar}>
            <Text style={styles.chatDetailAvatarText}>
              {name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.chatTitle}>{name}</Text>
        </View>
        
        <View style={styles.chatActions}>
          <TouchableOpacity style={styles.chatAction}>
            <Text style={styles.actionIcon}>📞</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chatAction}>
            <Text style={styles.actionIcon}>📹</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMessage}
        style={styles.messagesContainer}
        inverted={false}
      />
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachmentButton}>
          <Text style={styles.attachmentIcon}>+</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={message}
          onChangeText={setMessage}
        />
        
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  chatTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatDetailAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#FCDF03',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatDetailAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030712',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  chatActions: {
    flexDirection: 'row',
  },
  chatAction: {
    paddingHorizontal: 12,
  },
  actionIcon: {
    fontSize: 20,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: '#FCDF03',
    borderTopRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  attachmentButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attachmentIcon: {
    fontSize: 24,
    color: '#E5E7EB',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#E5E7EB',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FCDF03',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
    color: '#030712',
  },
});

export default ChatDetailScreen;
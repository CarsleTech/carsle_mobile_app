import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sentAt: string;
    senderId: string;
    isRead: boolean;
    isEdited?: boolean;
  };
  isOwnMessage: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onPress,
  onLongPress,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <TouchableOpacity
      style={[
        messageStyles.container,
        isOwnMessage ? messageStyles.ownMessage : messageStyles.otherMessage
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[
        messageStyles.bubble,
        isOwnMessage ? messageStyles.ownBubble : messageStyles.otherBubble
      ]}>
        <Text style={[
          messageStyles.text,
          isOwnMessage ? messageStyles.ownText : messageStyles.otherText
        ]}>
          {message.content}
        </Text>
        
        <View style={messageStyles.footer}>
          <Text style={[
            messageStyles.time,
            isOwnMessage ? messageStyles.ownTime : messageStyles.otherTime
          ]}>
            {formatTime(message.sentAt)}
            {message.isEdited && ' (edited)'}
          </Text>
          
          {isOwnMessage && (
            <Ionicons
              name={message.isRead ? "checkmark-done" : "checkmark"}
              size={14}
              color={message.isRead ? "#4CAF50" : "rgba(255, 255, 255, 0.7)"}
              style={messageStyles.readIndicator}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const messageStyles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ownBubble: {
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#FFF',
  },
  otherText: {
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
  },
  ownTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTime: {
    color: '#757575',
  },
  readIndicator: {
    marginLeft: 4,
  },
});
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';

export default function MessagesScreen() {
  const navigation = useRouter();
  const activeConversations = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      initials: 'DSC',
      message: 'Thanks for the session today! Feel free to reach out if you have any questions.',
      time: '35m ago',
      duration: '52.5 min',
      backgroundColor: '#FCDF03',
      hasNotification: false,
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      initials: 'MJ',
      message: "I've reviewed your business plan. Let's schedule a call to discuss the feedback.",
      time: '2h ago',
      duration: '35 min',
      backgroundColor: '#FCDF03',
      hasNotification: true,
    },
  ];

  const previousConversations = [
    {
      id: 3,
      name: 'Emily Rodriguez',
      initials: 'ER',
      message: 'The wireframes look great! I have a few suggestions for the user flow.',
      time: '1d ago',
      duration: '43.7 min',
      backgroundColor: '#E5E7EB',
      textColor: '#030712',
    },
  ];

  const viewConversation = (conversationId:string) => {
    console.log(`Viewing conversation with ID: ${conversationId}`);
    navigation.navigate('/chatroom', { id: conversationId });

  };

  const ConversationItem = ({ conversation, isPrevious = false }) => (
    <TouchableOpacity  onPress={() => viewConversation(conversation.id)} style={styles.conversationItem}>
      <View style={styles.conversationContent}>
        <View style={[
          styles.avatar,
          { backgroundColor: conversation.backgroundColor }
        ]}>
          <Text style={[
            styles.avatarText,
            { color: isPrevious ? conversation.textColor : '#030712' }
          ]}>
            {conversation.initials}
          </Text>
        </View>
        
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.senderName}>{conversation.name}</Text>
            {conversation.hasNotification && (
              <View style={styles.notificationDot} />
            )}
          </View>
          <Text style={styles.messageText} numberOfLines={2}>
            {conversation.message}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={styles.timeText}>{conversation.time}</Text>
            <Text style={styles.durationText}>{conversation.duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        {/* <View style={styles.header}>
          <View style={styles.headerIcon}>
            <IconSymbol name="message.fill" size={32} color="#FCDF03" />
          </View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>Your consultation conversations</Text>
        </View> */}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Active Conversations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Conversations</Text>
          {activeConversations.map((conversation) => (
            <ConversationItem 
              key={conversation.id} 
              conversation={conversation} 
            />
          ))}
        </View>

        {/* Previous Conversations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Previous Conversations</Text>
          {previousConversations.map((conversation) => (
            <ConversationItem 
              key={conversation.id} 
              conversation={conversation} 
              isPrevious={true}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  backgroundColor: '#F8F9FA',
    backgroundColor: '#030712', // Dark background
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#030712',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#030712',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#030712',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 16,
  },
  conversationItem: {
    backgroundColor: '#030712',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conversationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
    flex: 1,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
  },
  durationText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
});
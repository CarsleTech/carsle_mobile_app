import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { MessageCircle, Plus, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface User {
  id: string;
  fullName: string;
  username: string;
  avatar?: string | null;
}

interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  type: 'SYSTEM' | 'USER';
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  isEdited: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
  sender: User;
}

interface Consultation {
  id: string;
  clientId: string;
  consultantId: string;
  topic: string;
  description: string;
  type: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PENDING' | 'CANCELLED';
  scheduledAt?: string | null;
  startTime: string;
  endTime?: string | null;
  duration?: number | null;
  rate?: number | null;
  totalAmount?: number | null;
  meetingLink?: string | null;
  createdAt: string;
  updatedAt: string;
  transactionId?: string | null;
  client: User;
  consultant: User;
  messages: Message[];
  _count: {
    messages: number;
  };
  unreadCount: number;
  lastMessage?: Message;
}

const MessagesScreen: React.FC = () => {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'ended'>('all');
  const { user } = useAuth(); // Assuming useAuth is a custom hook to get user context

  // Get current user ID
  const currentUserId = user?.id ||  (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '') || ''

  // Helper function to get the other user (not the current user)
  const getOtherUser = (consultation: Consultation): User => {
    return consultation.clientId === currentUserId ? consultation.consultant : consultation.client;
  };

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Helper function to get consistent colors
  const getAvatarColor = (index: number): string => {
    const colors = ['#030712', '#5B5AF1', '#E5E7EB', '#6B7280'];
    return colors[index % colors.length];
  };

  useEffect(() => {
    if (currentUserId) {
      fetchConsultations();
    }
  }, [activeTab, currentUserId]);

  const fetchConsultations = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      const status = getApiStatus(activeTab);
      const response = await fetch(
        `http://34.45.85.24/api/messages/consultations/${currentUserId}?status=${status}`
      );
      const data = await response.json();
      
      if (data.success) {
        // Fetch unread counts for each consultation
        const consultationsWithCounts = await Promise.all(
          data.data.map(async (consultation: Consultation) => {
            try {
              const unreadResponse = await fetch(
                `http://34.45.85.24/api/messages/unread-count/${consultation.id}?userId=${currentUserId}`
              );
              const unreadData = await unreadResponse.json();
              
              return {
                ...consultation,
                unreadCount: unreadData.success ? unreadData.data.unreadCount : 0,
              };
            } catch (error) {
              console.error('Error fetching unread count for consultation:', consultation.id, error);
              return {
                ...consultation,
                unreadCount: 0,
              };
            }
          })
        );
        setConsultations(consultationsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      Alert.alert('Error', 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Map frontend status to API status
  const getApiStatus = (tabStatus: string): string => {
    switch (tabStatus) {
      case 'active':
        return 'IN_PROGRESS';
      case 'ended':
        return 'COMPLETED';
      case 'all':
      default:
        return '';
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConsultations();
    setRefreshing(false);
  };

  const filteredConsultations = consultations.filter(consultation => {
    const otherUser = getOtherUser(consultation);
    return (
      consultation.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const startNewConsultation = () => {
    router.push('/startConsultationScreen');
  };

  const openChat = (consultation: Consultation) => {
    router.push(`/chatroom/${consultation.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return '#5B5AF1';
      case 'COMPLETED':
        return '#6B7280';
      case 'PENDING':
        return '#E5E7EB';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Active';
      case 'COMPLETED':
        return 'Ended';
      case 'PENDING':
        return 'Pending';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status.toLowerCase();
    }
  };

  const renderConsultationItem = ({ item, index }: { item: Consultation; index: number }) => {
    const otherUser = getOtherUser(item);
    const avatarColor = getAvatarColor(index);
    const initials = getInitials(otherUser.fullName);
    
    return (
      <TouchableOpacity
        style={[
          styles.consultationItem,
          item.unreadCount > 0 && styles.unreadConsultation
        ]}
        onPress={() => openChat(item)}
      >
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            {otherUser.avatar ? (
              <Text>Image placeholder</Text> // Replace with actual image component
            ) : (
              <Text style={[
                styles.avatarText,
                { color: avatarColor === '#5B5AF1' ? '#030712' : '#E5E7EB' }
              ]}>
                {initials}
              </Text>
            )}
          </View>
          {/* Note: The API doesn't provide online status, so we'll omit this for now */}
        </View>

        <View style={styles.consultationContent}>
          <View style={styles.consultationHeader}>
            <Text style={styles.consultationName} numberOfLines={1}>
              {otherUser.fullName}
            </Text>
            <Text style={styles.consultationTime}>
              {item.lastMessage ? formatTime(item.lastMessage.createdAt) : formatTime(item.startTime)}
            </Text>
          </View>

          <Text style={styles.consultationTopic} numberOfLines={1}>
            {item.topic}
          </Text>

          {item.lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={2}>
              {item.lastMessage.content}
            </Text>
          )}

          <View style={styles.consultationFooter}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.status === 'IN_PROGRESS' ? '#030712' : '#E5E7EB' }
              ]}>
                {getStatusDisplayText(item.status)}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const TabButton = ({ tab, isActive }: { tab: 'all' | 'active' | 'ended'; isActive: boolean }) => (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  if (!currentUserId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please log in to view messages</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B5AF1" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={startNewConsultation} style={styles.addButton}>
          <Plus size={20} color="#030712" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.tabContainer}>
        <TabButton tab="all" isActive={activeTab === 'all'} />
        <TabButton tab="active" isActive={activeTab === 'active'} />
        <TabButton tab="ended" isActive={activeTab === 'ended'} />
      </View>

      <FlatList
        data={filteredConsultations}
        renderItem={renderConsultationItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#5B5AF1"
            colors={['#5B5AF1']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageCircle size={64} color="#4B5563" />
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>Start a new consultation to begin messaging</Text>
            <TouchableOpacity style={styles.startButton} onPress={startNewConsultation}>
              <Text style={styles.startButtonText}>Start Consultation</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#030712',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#5B5AF1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#030712',
  },
  searchContainer: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    top: 14,
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
    color: '#030712',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#5B5AF1',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#030712',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  consultationItem: {
    flexDirection: 'row',
    backgroundColor: '#030712',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  unreadConsultation: {
    borderColor: '#5B5AF1',
    backgroundColor: '#1A1B0F',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 14,
  },
  onlineIndicator: {
    width: 16,
    height: 16,
    backgroundColor: '#5B5AF1',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#030712',
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  consultationContent: {
    flex: 1,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  consultationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
    flex: 1,
  },
  consultationTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  consultationTopic: {
    fontSize: 14,
    color: '#5B5AF1',
    marginBottom: 4,
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 18,
    marginBottom: 8,
  },
  consultationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#030712',
  },
  unreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#E5E7EB',
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#5B5AF1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#030712',
  },
  startButtonText: {
    color: '#030712',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '500',
  },
});

export default MessagesScreen;
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Search, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Consultant {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  isOnline: boolean;
  profileImage?: string;
  hourlyRate: number;
  initials: string;
  bgColor: string;
  reviews: number;
  responseTime: string;
  username: string;
  email: string;
  verified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  balance: string;
}

const StartConsultationScreen: React.FC = () => {
  const router = useRouter();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth()

  // Mock user ID - replace with actual user context
  const currentUserId = user?.id || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '') || '';

  // Helper function to get initials from full name
  const getInitials = (fullName: string): string => {
    if (!fullName) return '??';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Helper function to get consistent colors - matching Explore theme
  const getRandomColor = (index: number): string => {
    const colors = ['#030712', '#FCDF03', '#E5E7EB', '#6B7280'];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        const expertsResponse = await axios.get('http://34.10.13.252/api/users');
        console.log("Experts Response:", expertsResponse.data.data.users);
        
        // Transform the API data to match our component's expected format
        const transformedExperts = expertsResponse.data.data.users.map((user: any, index: number) => ({
          id: user.id,
          name: user.fullName,
          specialty: 'Expert', // You might want to add this field to your API
          initials: getInitials(user.fullName),
          rating: Number((4.5 + (Math.random() * 0.5)).toFixed(1)), // Random rating between 4.5-5.0
          reviews: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
          responseTime: '< ' + (Math.floor(Math.random() * 15) + 5) + ' min',
          hourlyRate: Number((Math.random() * 100 + 50).toFixed(0)), // Random rate $50-150
          bgColor: getRandomColor(index),
          isOnline: Math.random() > 0.3, // 70% chance of being online
          username: user.username,
          email: user.email,
          verified: user.verified,
          phoneVerified: user.phoneVerified,
          createdAt: user.createdAt,
          balance: user.balance,
        }));
        
        setConsultants(transformedExperts);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load experts. Please try again.');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const startConsultation = async () => {
    if (!selectedConsultant || !topic.trim()) {
      Alert.alert('Missing Information', 'Please select a consultant and provide a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://34.45.85.24/api/messages/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: currentUserId,
          consultantId: selectedConsultant,
          topic: topic.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push(`/chat/${data.consultant.id}`);
      } else {
        Alert.alert('Error', data.message || 'Failed to start consultation');
      }
    } catch (error) {
      console.error('Error starting consultation:', error);
      Alert.alert('Error', 'Failed to start consultation');
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultants = consultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultant.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConsultant = ({ item }: { item: Consultant }) => (
    <TouchableOpacity
      style={[
        styles.consultantItem,
        selectedConsultant === item.id && styles.selectedConsultant
      ]}
      onPress={() => setSelectedConsultant(item.id)}
    >
      <View style={styles.consultantInfo}>
        <View style={styles.initialsWrap}>
          <View style={[styles.avatar, { backgroundColor: item.bgColor }]}>
            <Text style={[
              styles.avatarText,
              { color: item.bgColor === '#FCDF03' ? '#030712' : '#E5E7EB' }
            ]}>
              {item.initials}
            </Text>
          </View>
          {item.isOnline && <View style={styles.onlineDot} />}
        </View>
        
        <View style={styles.consultantDetails}>
          <View style={styles.consultantHeader}>
            <Text style={styles.consultantName}>{item.name}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.consultantSpecialty}>{item.specialty}</Text>
          <Text style={styles.username}>@{item.username}</Text>
          
          <View style={styles.consultantMeta}>
            <View style={styles.inlineIconText}>
              <Star size={12} color="#FCDF03" fill="#FCDF03" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewsText}>({item.reviews})</Text>
            </View>
            <View style={styles.inlineIconText}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.responseTime}>{item.responseTime}</Text>
            </View>
            <View style={styles.inlineIconText}>
              <DollarSign size={12} color="#E5E7EB" />
              <Text style={styles.hourlyRate}>${item.hourlyRate}/hr</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.selectIndicator}>
        {selectedConsultant === item.id && (
          <CheckCircle size={24} color="#FCDF03" fill="#FCDF03" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (fetchLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#E5E7EB" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Start Consultation</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FCDF03" />
          <Text style={styles.loadingText}>Loading consultants...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Consultation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Select a Consultant</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search consultants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => {
                setError(null);
                // Refetch data
                const fetchData = async () => {
                  try {
                    setFetchLoading(true);
                    const expertsResponse = await axios.get('http://34.10.13.252/api/users');
                    const transformedExperts = expertsResponse.data.data.users.map((user: any, index: number) => ({
                      id: user.id,
                      name: user.fullName,
                      specialty: 'Expert',
                      initials: getInitials(user.fullName),
                      rating: Number((4.5 + (Math.random() * 0.5)).toFixed(1)),
                      reviews: Math.floor(Math.random() * 200) + 50,
                      responseTime: '< ' + (Math.floor(Math.random() * 15) + 5) + ' min',
                      hourlyRate: Number((Math.random() * 100 + 50).toFixed(0)),
                      bgColor: getRandomColor(index),
                      isOnline: Math.random() > 0.3,
                      username: user.username,
                      email: user.email,
                      verified: user.verified,
                      phoneVerified: user.phoneVerified,
                      createdAt: user.createdAt,
                      balance: user.balance,
                    }));
                    setConsultants(transformedExperts);
                    setError(null);
                  } catch (error) {
                    console.error('Failed to fetch data:', error);
                    setError('Failed to load experts. Please try again.');
                  } finally {
                    setFetchLoading(false);
                  }
                };
                fetchData();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.consultantsList}>
            {filteredConsultants.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No consultants found</Text>
              </View>
            ) : (
              filteredConsultants.map((consultant) => (
                <View key={consultant.id}>
                  {renderConsultant({ item: consultant })}
                </View>
              ))
            )}
          </View>
        )}

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Consultation Details</Text>
          
          <TextInput
            style={styles.topicInput}
            placeholder="What would you like to discuss? *"
            value={topic}
            onChangeText={setTopic}
            placeholderTextColor="#6B7280"
            maxLength={100}
          />
          
          <TextInput
            style={styles.descriptionInput}
            placeholder="Additional details (optional)"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#6B7280"
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, (!selectedConsultant || !topic.trim() || loading) && styles.startButtonDisabled]}
          onPress={startConsultation}
          disabled={!selectedConsultant || !topic.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#030712" />
          ) : (
            <Text style={styles.startButtonText}>Start Consultation</Text>
          )}
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 16,
    marginTop: 16,
  },
  searchContainer: {
    position: 'relative',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#FCDF03',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#030712',
  },
  retryButtonText: {
    color: '#030712',
    fontSize: 16,
    fontWeight: '600',
  },
  consultantsList: {
    marginBottom: 24,
  },
  consultantItem: {
    backgroundColor: '#030712',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#030712',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 2,
    borderColor: '#374151',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectedConsultant: {
    borderColor: '#FCDF03',
    backgroundColor: '#1A1B0F',
  },
  consultantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  initialsWrap: {
    position: 'relative',
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
  onlineDot: {
    width: 16,
    height: 16,
    backgroundColor: '#FCDF03',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#030712',
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  consultantDetails: {
    flex: 1,
  },
  consultantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    columnGap: 6,
  },
  consultantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  verifiedBadge: {
    backgroundColor: '#FCDF03',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#030712',
  },
  verifiedText: {
    color: '#030712',
    fontSize: 10,
    fontWeight: 'bold',
  },
  consultantSpecialty: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2,
  },
  username: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 8,
  },
  consultantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
    flexWrap: 'wrap',
  },
  inlineIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  responseTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  hourlyRate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  selectIndicator: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  formSection: {
    marginBottom: 100, // Extra space for footer
  },
  topicInput: {
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#030712',
  },
  descriptionInput: {
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 100,
    marginBottom: 16,
    color: '#030712',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#030712',
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  startButton: {
    backgroundColor: '#FCDF03',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#030712',
  },
  startButtonDisabled: {
    backgroundColor: '#6B7280',
    borderColor: '#4B5563',
  },
  startButtonText: {
    color: '#030712',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default StartConsultationScreen;
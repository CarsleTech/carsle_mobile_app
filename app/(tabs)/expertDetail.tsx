import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Users
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Expert {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  specialization: string | null;
  hourlyRate: number | null;
  rating: number;
  totalRatings: number;
  isAvailable: boolean;
  phone: string | null;
  phoneVerified: boolean;
  verified: boolean;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

const ExpertDetail = ({ route, navigation }) => {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { expertId } = useLocalSearchParams<{ expertId: string }>();

  useEffect(() => {
    fetchExpertDetails();
  }, [expertId]);

  const fetchExpertDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://34.10.13.252/api/user/${expertId}`);
      
      if (response.data.status === 'OK') {
        console.log('Expert details fetched successfully:', response.data.data.user);
        setExpert(response.data.data.user);
        setError(null);
      } else {
        setError('Failed to load expert details');
      }
    } catch (error) {
      console.error('Failed to fetch expert details:', error);
      setError('Failed to load expert details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return '??';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleCall = () => {
    if (!expert) return;
    
    // Navigate directly to calls screen with expert ID
    router.push({
      pathname: '/calls',
      params: {
        expertId: expert.id
      }
    });
  };

  const handleMessage = () => {
    if (!expert) return;
    
    // Navigate directly to messages screen with expert data
    router.push({
      pathname: '/(tabs)/messages',
      params: {
        expertId: expert.id,
        expertName: expert.fullName,
        expertUsername: expert.username,
        action: 'chat'
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B5AF1" />
        <Text style={styles.loadingText}>Loading expert details...</Text>
      </View>
    );
  }

  if (error || !expert) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Expert not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchExpertDetails}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expert Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.initialsWrap}>
              <View style={styles.initials}>
                <Text style={styles.initialsText}>{getInitials(expert.fullName)}</Text>
              </View>
              {expert.isAvailable && <View style={styles.onlineDot} />}
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.expertName}>{expert.fullName}</Text>
                {expert.verified && (
                  <CheckCircle size={20} color="#5B5AF1" fill="#5B5AF1" />
                )}
              </View>
              <Text style={styles.username}>@{expert.username}</Text>
              <Text style={styles.specialization}>
                {expert.specialization || 'General Expert'}
              </Text>
              
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { 
                    backgroundColor: expert.isAvailable ? '#10B981' : '#EF4444' 
                  }]} />
                  <Text style={styles.statusText}>
                    {expert.isAvailable ? 'Available' : 'Busy'}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <MapPin size={12} color="#6B7280" />
                  <Text style={styles.statusText}>{expert.timezone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Star size={16} color="#5B5AF1" fill="#5B5AF1" />
              <Text style={styles.statValue}>
                {expert.rating > 0 ? expert.rating.toFixed(1) : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={16} color="#6B7280" />
              <Text style={styles.statValue}>{expert.totalRatings}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <DollarSign size={16} color="#6B7280" />
              <Text style={styles.statValue}>
                {expert.hourlyRate ? `$${expert.hourlyRate}` : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Per Hour</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.statValue}>{formatJoinDate(expert.createdAt)}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
          </View>
        </View>

        {/* Bio Section - Only show if bio exists */}
        {expert.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{expert.bio}</Text>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Text style={styles.contactValue}>{expert.email}</Text>
          </View>
          {expert.phone && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone:</Text>
              <View style={styles.phoneRow}>
                <Text style={styles.contactValue}>{expert.phone}</Text>
                {expert.phoneVerified && (
                  <CheckCircle size={16} color="#10B981" fill="#10B981" />
                )}
              </View>
            </View>
          )}
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Role:</Text>
            <Text style={styles.contactValue}>{expert.role}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Joined:</Text>
            <Text style={styles.contactValue}>{formatJoinDate(expert.createdAt)}</Text>
          </View>
        </View>

        {/* Verification Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          <View style={styles.verificationItem}>
            <View style={styles.verificationRow}>
              <Text style={styles.verificationLabel}>Account Verified:</Text>
              <View style={styles.verificationStatus}>
                <CheckCircle 
                  size={16} 
                  color={expert.verified ? "#10B981" : "#EF4444"} 
                  fill={expert.verified ? "#10B981" : "#EF4444"} 
                />
                <Text style={[
                  styles.verificationText, 
                  { color: expert.verified ? "#10B981" : "#EF4444" }
                ]}>
                  {expert.verified ? 'Verified' : 'Not Verified'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.verificationItem}>
            <View style={styles.verificationRow}>
              <Text style={styles.verificationLabel}>Phone Verified:</Text>
              <View style={styles.verificationStatus}>
                <CheckCircle 
                  size={16} 
                  color={expert.phoneVerified ? "#10B981" : "#EF4444"} 
                  fill={expert.phoneVerified ? "#10B981" : "#EF4444"} 
                />
                <Text style={[
                  styles.verificationText, 
                  { color: expert.phoneVerified ? "#10B981" : "#EF4444" }
                ]}>
                  {expert.phoneVerified ? 'Verified' : 'Not Verified'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.callButton]} 
            onPress={handleCall}
          >
            <Phone size={20} color="#030712" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.messageButton]} 
            onPress={handleMessage}
          >
            <MessageCircle size={20} color="#E5E7EB" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  initialsWrap: {
    position: 'relative',
    marginRight: 16,
  },
  initials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5B5AF1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  initialsText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#030712',
  },
  onlineDot: {
    width: 20,
    height: 20,
    backgroundColor: '#10B981',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#1F2937',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  expertName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E5E7EB',
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 80,
  },
  contactValue: {
    fontSize: 14,
    color: '#E5E7EB',
    flex: 1,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  verificationItem: {
    marginBottom: 8,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verificationLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  callButton: {
    backgroundColor: '#5B5AF1',
  },
  messageButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#6B7280',
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030712',
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#030712',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#030712',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#5B5AF1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#030712',
  },
  retryText: {
    color: '#030712',
    fontWeight: '600',
  },
});

export default ExpertDetail;
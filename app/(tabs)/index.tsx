import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { router } from 'expo-router';
import { Clock, DollarSign, Search, Star, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const Explore = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const expertsResponse = await axios.get('http://34.10.13.252/api/users');
        console.log("Experts Response:", expertsResponse.data.data.users);
        
        // Filter out current user and transform the API data
        const filteredUsers = expertsResponse.data.data.users.filter(apiUser => 
          user && apiUser.id !== user.id
        );
        
        const transformedExperts = filteredUsers.map((apiUser, index) => ({
          id: apiUser.id,
          name: apiUser.fullName,
          specialty: apiUser.specialization || 'General Expert',
          initials: getInitials(apiUser.fullName),
          rating: apiUser.rating || 0,
          reviews: apiUser.totalRatings || 0,
          responseTime: apiUser.isAvailable ? '< 5 min' : 'Offline',
          price: apiUser.hourlyRate ? (apiUser.hourlyRate / 60).toFixed(2) : '0.00', // Convert hourly to per minute
          bgColor: getRandomColor(index),
          online: apiUser.isAvailable || false,
          username: apiUser.username,
          email: apiUser.email,
          verified: apiUser.verified || false,
          phoneVerified: apiUser.phoneVerified || false,
          createdAt: apiUser.createdAt,
          role: apiUser.role,
          bio: apiUser.bio,
          timezone: apiUser.timezone,
        }));
        
        setExperts(transformedExperts);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load experts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Helper function to get initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return '??';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Helper function to get consistent colors - using custom color palette
  const getRandomColor = (index) => {
    const colors = ['#030712', '#FCDF03', '#E5E7EB', '#030712', '#FCDF03', '#E5E7EB'];
    return colors[index % colors.length];
  };

  const categories = [
    { name: 'All', active: true, icon: Users },
    { name: 'Business', active: false, icon: Users },
    { name: 'Health', active: false, icon: Users },
    { name: 'Tech', active: false, icon: Users },
  ];

  // Get most booked experts (users with highest ratings/reviews)
  const mostBookedExperts = experts
    .filter(expert => expert.rating > 0 || expert.reviews > 0)
    .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
    .slice(0, 3);

  const navigateToExpert = (expert) => {
    console.log('Navigate to expert:', expert);
    router.push({
        pathname: '/expertDetail',
       params: { expertId: expert.id },
    });
  };

  const ExpertCard = ({ expert, isCompact = false }) => (
    <TouchableOpacity onPress={() => navigateToExpert(expert)} style={[styles.card, isCompact && styles.compactCard]}>
      <View style={styles.cardRow}>
        <View style={styles.initialsWrap}>
          <View style={[styles.initials, { backgroundColor: expert.bgColor }]}>
            <Text style={[
              styles.initialsText,
              { color: expert.bgColor === '#FCDF03' ? '#030712' : '#FFFFFF' }
            ]}>
              {expert.initials}
            </Text>
          </View>
          {expert.online && <View style={styles.onlineDot} />}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.expertName}>{expert.name}</Text>
            {expert.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.specialty}>{expert.specialty}</Text>
          <Text style={styles.username}>@{expert.username}</Text>
          <View style={styles.infoRow}>
            {expert.rating > 0 && (
              <View style={styles.inlineIconText}>
                <Star size={12} color="#FCDF03" fill="#FCDF03" />
                <Text style={styles.rating}>{expert.rating.toFixed(1)}</Text>
                <Text style={styles.reviews}>({expert.reviews})</Text>
              </View>
            )}
            {expert.responseTime && (
              <View style={styles.inlineIconText}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.responseTime}>{expert.responseTime}</Text>
              </View>
            )}
            {parseFloat(expert.price) > 0 && (
              <View style={styles.inlineIconText}>
                <DollarSign size={12} color="#030712" />
                <Text style={styles.price}>${expert.price}/min</Text>
              </View>
            )}
          </View>
        </View>
        {/* {!isCompact && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FCDF03" />
        <Text style={styles.loadingText}>Loading experts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => window.location.reload()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchWrap}>
          <Search style={styles.searchIcon} size={20} color="#6B7280" />
          <TextInput
            placeholder="Search experts..."
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesRow}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                category.active ? styles.activeCategory : styles.inactiveCategory,
              ]}
            >
              <category.icon 
                size={16} 
                color={category.active ? '#030712' : '#6B7280'} 
              />
              <Text
                style={
                  category.active
                    ? styles.activeCategoryText
                    : styles.inactiveCategoryText
                }
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {mostBookedExperts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Booked</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mostBookedExperts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} isCompact />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Experts ({experts.length})</Text>
        {experts.length > 0 ? (
          experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))
        ) : (
          <Text style={styles.noExpertsText}>No experts available at the moment.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#030712', // Dark background
    flex: 1,
  },
  header: {
    backgroundColor: '#030712', // Dark background
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchWrap: {
    position: 'relative',
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
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 12,
  },
  categoriesRow: {
    flexDirection: 'row',
    columnGap: 8,
    rowGap: 8,
    flexWrap: 'wrap',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeCategory: {
    backgroundColor: '#FCDF03',
  },
  inactiveCategory: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeCategoryText: {
    color: '#030712',
    fontWeight: '600',
    fontSize: 14,
  },
  inactiveCategoryText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14,
  },
  card: {
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
    borderColor: '#E5E7EB',
  },
  compactCard: {
    minWidth: 280,
    marginRight: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    justifyContent: 'space-between',
  },
  initialsWrap: {
    position: 'relative',
  },
  initials: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  initialsText: {
    fontWeight: '700',
    fontSize: 14,
  },
  onlineDot: {
    width: 16,
    height: 16,
    backgroundColor: '#FCDF03',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    columnGap: 6,
  },
  expertName: {
    fontSize: 14,
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
    color: '#E5E7EB',
    fontSize: 10,
    fontWeight: 'bold',
  },
  specialty: {
    color: '#4B5563',
    fontSize: 12,
    marginTop: 2,
  },
  username: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    columnGap: 16,
    flexWrap: 'wrap',
  },
  inlineIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
  },
  responseTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderColor: '#030712',
    borderWidth: 1,
    backgroundColor: '#FCDF03',
  },
  followText: {
    fontSize: 12,
    color: '#030712',
    fontWeight: '600',
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
    backgroundColor: '#FCDF03',
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
  noExpertsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default Explore;
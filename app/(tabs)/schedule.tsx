import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Consultant {
  id: string;
  name: string;
  specialty: string;
  initials: string;
  rating: number;
  reviews: number;
  responseTime: string;
  price: string;
  online: boolean;
  username: string;
  email: string;
  verified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  balance: number;
}

interface Schedule {
  id: string;
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  isRecurring: boolean;
  isAvailable: boolean;
}

interface NewSchedule {
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  isRecurring: boolean;
  isAvailable: boolean;
}

const ScheduleScreen: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [consultantsLoading, setConsultantsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'available' | 'booked'>('all');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Initialize newSchedule with better default values
  const [newSchedule, setNewSchedule] = useState<NewSchedule>({
    userId: '',
    title: '',
    startTime: '',
    endTime: '',
    description: '',
    isRecurring: false,
    isAvailable: true
  });

  const BASE_URL = 'http://34.45.85.24';
  const CONSULTANTS_URL = 'http://34.10.13.252/api/users';

  // Utility functions
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch consultants
  const fetchConsultants = async () => {
    try {
      setConsultantsLoading(true);
      console.log('Fetching consultants from:', CONSULTANTS_URL);
      const response = await fetch(CONSULTANTS_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Consultants response:', data);
      
      if (data && data.data && data.data.users) {
        const transformedConsultants: Consultant[] = data.data.users.map((user: any, index: number) => ({
          id: user.id,
          name: user.fullName || user.name || 'Unknown',
          specialty: 'Expert',
          initials: getInitials(user.fullName || user.name || 'U'),
          rating: 4.5 + (Math.random() * 0.5),
          reviews: Math.floor(Math.random() * 200) + 50,
          responseTime: '< ' + (Math.floor(Math.random() * 15) + 5) + ' min',
          price: (Math.random() * 3 + 2).toFixed(2),
          online: Math.random() > 0.3,
          username: user.username,
          email: user.email,
          verified: user.verified,
          phoneVerified: user.phoneVerified,
          createdAt: user.createdAt,
          balance: user.balance,
        }));
        console.log('Transformed consultants:', transformedConsultants);
        setConsultants(transformedConsultants);
        setError(null);
      } else {
        console.error('Invalid data structure:', data);
        setError('Invalid data received from server');
      }
    } catch (error: any) {
      console.error('Failed to fetch consultants:', error);
      setError('Failed to load consultants: ' + error.message);
    } finally {
      setConsultantsLoading(false);
    }
  };

  // Fetch schedules for selected consultant
  const fetchSchedules = async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/schedules/user/${userId}`);
      const data = await response.json();
      if (data.success) {
        setSchedules(data.schedules || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch schedules:', error);
      setError('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  // Create new schedule - Fixed to prevent modal toggling
  const createSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule)
      });
      const data = await response.json();
      if (data.success) {
        // Reset form and close modal in proper order
        setNewSchedule({
          userId: selectedConsultant,
          title: '',
          startTime: '',
          endTime: '',
          description: '',
          isRecurring: false,
          isAvailable: true
        });
        setShowCreateModal(false);
        fetchSchedules(selectedConsultant);
        Alert.alert('Success', 'Schedule created successfully');
      } else {
        setError(data.error || 'Failed to create schedule');
      }
    } catch (error: any) {
      console.error('Failed to create schedule:', error);
      setError('Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  // Update schedule
  const updateSchedule = async () => {
    if (!editingSchedule) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/schedules/${editingSchedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSchedule)
      });
      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingSchedule(null);
        fetchSchedules(selectedConsultant);
        Alert.alert('Success', 'Schedule updated successfully');
      } else {
        setError(data.error || 'Failed to update schedule');
      }
    } catch (error: any) {
      console.error('Failed to update schedule:', error);
      setError('Failed to update schedule');
    } finally {
      setLoading(false);
    }
  };

  // Delete schedule
  const deleteSchedule = async (scheduleId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this schedule?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await fetch(`${BASE_URL}/api/schedules/${scheduleId}`, {
                method: 'DELETE'
              });
              const data = await response.json();
              if (data.success) {
                fetchSchedules(selectedConsultant);
                Alert.alert('Success', 'Schedule deleted successfully');
              } else {
                setError('Failed to delete schedule');
              }
            } catch (error: any) {
              console.error('Failed to delete schedule:', error);
              setError('Failed to delete schedule');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Book schedule
  const bookSchedule = async (scheduleId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/schedules/${scheduleId}/book`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        fetchSchedules(selectedConsultant);
        Alert.alert('Success', 'Schedule booked successfully');
      } else {
        setError('Failed to book schedule');
      }
    } catch (error: any) {
      console.error('Failed to book schedule:', error);
      setError('Failed to book schedule');
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConsultants();
    if (selectedConsultant) {
      await fetchSchedules(selectedConsultant);
    }
    setRefreshing(false);
  };

  // Fixed: Memoized handlers to prevent re-renders
   const handleTitleChange = useCallback((text: string) => {
    setNewSchedule(prev => ({ ...prev, title: text }));
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    setNewSchedule(prev => ({ ...prev, description: text }));
  }, []);

  const handleStartTimeChange = useCallback((text: string) => {
    setNewSchedule(prev => ({ ...prev, startTime: text }));
  }, []);

  const handleEndTimeChange = useCallback((text: string) => {
    setNewSchedule(prev => ({ ...prev, endTime: text }));
  }, []);

  const handleRecurringToggle = useCallback(() => {
    setNewSchedule(prev => ({ ...prev, isRecurring: !prev.isRecurring }));
  }, []);

  const handleAvailableToggle = useCallback(() => {
    setNewSchedule(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setNewSchedule(prev => ({ ...prev, userId: selectedConsultant }));
    setShowCreateModal(true);
  }, [selectedConsultant]);

  useEffect(() => {
    fetchConsultants();
  }, []);

  useEffect(() => {
    if (selectedConsultant) {
      fetchSchedules(selectedConsultant);
    }
  }, [selectedConsultant]);

  

  // Filter schedules based on view mode
  const filteredSchedules = schedules.filter(schedule => {
    switch (viewMode) {
      case 'available':
        return schedule.isAvailable;
      case 'booked':
        return !schedule.isAvailable;
      default:
        return true;
    }
  });

  const selectedConsultantData = consultants.find(c => c.id === selectedConsultant);

  const renderConsultantCard = (consultant: Consultant) => (
    <TouchableOpacity
      key={consultant.id}
      style={[
        styles.consultantCard,
        selectedConsultant === consultant.id && styles.selectedConsultantCard
      ]}
      onPress={() => setSelectedConsultant(consultant.id)}
    >
      <View style={styles.consultantInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{consultant.initials}</Text>
        </View>
        <View style={styles.consultantDetails}>
          <Text style={styles.consultantName}>{consultant.name}</Text>
          <Text style={styles.consultantSpecialty}>{consultant.specialty}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: consultant.online ? '#10B981' : '#6B7280' }]} />
            <Text style={styles.statusText}>{consultant.online ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderScheduleCard = (schedule: Schedule) => (
    <View key={schedule.id} style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleTitle}>{schedule.title}</Text>
          <Text style={styles.scheduleDescription}>{schedule.description}</Text>
        </View>
        <Ionicons 
          name={schedule.isAvailable ? "checkmark-circle" : "close-circle"} 
          size={24} 
          color={schedule.isAvailable ? "#10B981" : "#EF4444"} 
        />
      </View>
      
      <View style={styles.scheduleDetails}>
        <View style={styles.scheduleDetailRow}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.scheduleDetailText}>
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </Text>
        </View>
        <View style={styles.scheduleDetailRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.scheduleDetailText}>
            {new Date(schedule.startTime).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.scheduleActions}>
        <View style={[styles.statusBadge, { backgroundColor: schedule.isAvailable ? '#D1FAE5' : '#FEE2E2' }]}>
          <Text style={[styles.statusBadgeText, { color: schedule.isAvailable ? '#065F46' : '#991B1B' }]}>
            {schedule.isAvailable ? 'Available' : 'Booked'}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          {schedule.isAvailable && (
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => bookSchedule(schedule.id)}
            >
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => {
              setEditingSchedule(schedule);
              setShowEditModal(true);
            }}
          >
            <Ionicons name="pencil-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteSchedule(schedule.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Fixed CreateScheduleModal with proper event handling
 const CreateScheduleModal = useMemo(() => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseCreateModal}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create New Schedule</Text>
          <TouchableOpacity onPress={handleCloseCreateModal}>
            <Ionicons name="close" size={24} color="#030712" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.modalContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={newSchedule.title}
              onChangeText={handleTitleChange}
              placeholder="Enter schedule title"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newSchedule.description}
              onChangeText={handleDescriptionChange}
              placeholder="Enter description"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Start Time</Text>
            <TextInput
              style={styles.textInput}
              value={newSchedule.startTime}
              onChangeText={handleStartTimeChange}
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>End Time</Text>
            <TextInput
              style={styles.textInput}
              value={newSchedule.endTime}
              onChangeText={handleEndTimeChange}
              placeholder="YYYY-MM-DD HH:MM"
              placeholderTextColor="#6B7280"
            />
          </View>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={handleRecurringToggle}
          >
            <Ionicons 
              name={newSchedule.isRecurring ? "checkbox" : "square-outline"} 
              size={24} 
              color="#030712" 
            />
            <Text style={styles.checkboxLabel}>Recurring</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={handleAvailableToggle}
          >
            <Ionicons 
              name={newSchedule.isAvailable ? "checkbox" : "square-outline"} 
              size={24} 
              color="#030712" 
            />
            <Text style={styles.checkboxLabel}>Available</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCloseCreateModal}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={createSchedule}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#030712" />
            ) : (
              <Text style={styles.createButtonText}>Create Schedule</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  ), [
    showCreateModal,
    newSchedule.title,
    newSchedule.description,
    newSchedule.startTime,
    newSchedule.endTime,
    newSchedule.isRecurring,
    newSchedule.isAvailable,
    loading,
    handleCloseCreateModal,
    handleTitleChange,
    handleDescriptionChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleRecurringToggle,
    handleAvailableToggle
  ]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="calendar" size={32} color="#030712" />
            <Text style={styles.headerTitle}>Schedule Management</Text>
          </View>
          <Text style={styles.headerSubtitle}>Manage consultant schedules and availability</Text>
        </View>

        {/* Error Alert */}
        {error && (
          <View style={styles.errorAlert}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons name="close" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Consultant Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color="#374151" />
            <Text style={styles.sectionTitle}>Select Consultant</Text>
          </View>
          
          {consultantsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#030712" />
              <Text style={styles.loadingText}>Loading consultants...</Text>
            </View>
          ) : consultants.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No consultants available</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchConsultants}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.consultantsList}>
              {consultants.map(renderConsultantCard)}
            </View>
          )}
        </View>

        {selectedConsultant && (
          <>
            {/* Controls */}
            <View style={styles.section}>
              <View style={styles.controlsHeader}>
                <Text style={styles.schedulesTitle}>
                  Schedules for {selectedConsultantData?.name}
                </Text>
                
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleOpenCreateModal}
                >
                  <Ionicons name="add" size={20} color="#030712" />
                  <Text style={styles.addButtonText}>Add Schedule</Text>
                </TouchableOpacity>
              </View>

              {/* View Mode Toggle */}
              <View style={styles.viewModeToggle}>
                {['all', 'available', 'booked'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.viewModeButton,
                      viewMode === mode && styles.activeViewModeButton
                    ]}
                    onPress={() => setViewMode(mode as any)}
                  >
                    <Text style={[
                      styles.viewModeButtonText,
                      viewMode === mode && styles.activeViewModeButtonText
                    ]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Schedules */}
            <View style={styles.section}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#030712" />
                  <Text style={styles.loadingText}>Loading schedules...</Text>
                </View>
              ) : filteredSchedules.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.emptyText}>No schedules found</Text>
                </View>
              ) : (
                <View style={styles.schedulesList}>
                  {filteredSchedules.map(renderScheduleCard)}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {CreateScheduleModal }
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#FCDF03',
    marginBottom: 16,
    borderColor: '#030712',
    borderWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#030712',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#030712',
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: '#B91C1C',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FCDF03',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 16,
    borderColor: '#030712',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#030712',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    color: '#030712',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#030712',
    marginTop: 8,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#030712',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FCDF03',
    fontWeight: '500',
  },
  consultantsList: {
    gap: 12,
  },
  consultantCard: {
    borderWidth: 1,
    borderColor: '#030712',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  selectedConsultantCard: {
    borderColor: '#030712',
    backgroundColor: '#FCDF03',
    borderWidth: 2,
  },
  consultantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FCDF03',
    fontWeight: '600',
    fontSize: 16,
  },
  consultantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  consultantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#030712',
  },
  consultantSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  controlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  schedulesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#030712',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCDF03',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderColor: '#030712',
    borderWidth: 1,
  },
  addButtonText: {
    color: '#030712',
    fontWeight: '500',
    marginLeft: 4,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    borderColor: '#030712',
    borderWidth: 1,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeViewModeButton: {
    backgroundColor: '#FCDF03',
    borderColor: '#030712',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  viewModeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeViewModeButtonText: {
    color: '#030712',
  },
  schedulesList: {
    gap: 16,
  },
  scheduleCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  scheduleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  scheduleDetails: {
    gap: 8,
    marginBottom: 16,
  },
  scheduleDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  scheduleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default ScheduleScreen;
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { router } from 'expo-router';
import {
    ArrowLeft,
    Bell,
    CheckCircle,
    Clock,
    DollarSign,
    Edit,
    LogOut,
    Mail,
    Phone,
    Save,
    Shield,
    User,
    X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SettingsProps {
  navigation: {
    goBack: () => void;
  };
}

interface UserData {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  specialization: string | null;
  hourlyRate: number | null;
  timezone: string;
  verified: boolean;
  phoneVerified: boolean;
  isAvailable: boolean;
  balance: number;
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const {logout} = useAuth()
  const {user: currentUser} = useAuth()
  const currentUserId = currentUser?.id || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '') || '';

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
    hourlyRate: '',
    timezone: '',
    isAvailable: false,
  });

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

 

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://34.10.13.252/api/user/${currentUserId}`);
      
      if (response.data.status === 'OK') {
        const userData = response.data.data.user;
        setUser(userData);
        setFormData({
          fullName: userData.fullName || '',
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          specialization: userData.specialization || '',
          hourlyRate: userData.hourlyRate?.toString() || '',
          timezone: userData.timezone || '',
          isAvailable: userData.isAvailable || false,
        });
        setError(null);
      } else {
        setError('Failed to load user data');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone || null,
        bio: formData.bio || null,
        specialization: formData.specialization || null,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        timezone: formData.timezone,
        isAvailable: formData.isAvailable,
      };

      const response = await axios.put(
        `http://34.10.13.252/api/user/${currentUserId}`,
        updateData
      );

      if (response.data.status === 'OK') {
        Alert.alert('Success', 'Profile updated successfully!');
        setEditing(false);
        fetchUserData(); // Refresh data
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axios.delete(
                `http://34.10.13.252/api/user/${currentUserId}`
              );
              if (response.data.status === 'OK') {
                Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
                // Handle logout/navigation
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          // Handle logout logic here
          logout();
          console.log('Logging out...');
        },
      },
    ]);
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return '??';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FCDF03" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'User not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
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
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity
          onPress={() => {
            if (editing) {
              if (saving) return;
              setEditing(false);
              // Reset form data
              setFormData({
                fullName: user.fullName || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                specialization: user.specialization || '',
                hourlyRate: user.hourlyRate?.toString() || '',
                timezone: user.timezone || '',
                isAvailable: user.isAvailable || false,
              });
            } else {
              setEditing(true);
            }
          }}
          style={styles.editButton}
        >
          {editing ? (
            <X size={24} color="#E5E7EB" />
          ) : (
            <Edit size={24} color="#E5E7EB" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.initialsWrap}>
              <View style={styles.initials}>
                <Text style={styles.initialsText}>{getInitials(user.fullName)}</Text>
              </View>
              {user.isAvailable && <View style={styles.onlineDot} />}
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.fullName}</Text>
                {user.verified && (
                  <CheckCircle size={20} color="#FCDF03" fill="#FCDF03" />
                )}
              </View>
              <Text style={styles.username}>@{user.username}</Text>
              {/* <Text style={styles.balance}>Balance: ${user.balance.toFixed(2)}</Text> */}
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputRow}>
              <User size={16} color="#6B7280" />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="Enter your full name"
                placeholderTextColor="#6B7280"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputRow}>
              <User size={16} color="#6B7280" />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                placeholder="Enter your username"
                placeholderTextColor="#6B7280"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputRow}>
              <Mail size={16} color="#6B7280" />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <View style={styles.inputRow}>
              <Phone size={16} color="#6B7280" />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor="#6B7280"
                keyboardType="phone-pad"
                editable={editing}
              />
              {user.phoneVerified && (
                <CheckCircle size={16} color="#10B981" fill="#10B981" />
              )}
            </View>
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Specialization</Text>
            <View style={styles.inputRow}>
              <User size={16} color="#6B7280" />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.specialization}
                onChangeText={(text) => setFormData({ ...formData, specialization: text })}
                placeholder="Enter your specialization"
                placeholderTextColor="#6B7280"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hourly Rate ($)</Text>
            <View style={styles.inputRow}>
              <DollarSign size={16} color="#6B7280" />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.hourlyRate}
                onChangeText={(text) => setFormData({ ...formData, hourlyRate: text })}
                placeholder="Enter your hourly rate"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Timezone</Text>
            <View style={styles.inputRow}>
              <Clock size={16} color="#6B7280" />
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={formData.timezone}
                onChangeText={(text) => setFormData({ ...formData, timezone: text })}
                placeholder="Enter your timezone"
                placeholderTextColor="#6B7280"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textArea, !editing && styles.inputDisabled]}
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              editable={editing}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.inputLabel}>Availability Status</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {formData.isAvailable ? 'Available' : 'Not Available'}
              </Text>
              <Switch
                value={formData.isAvailable}
                onValueChange={(value) => setFormData({ ...formData, isAvailable: value })}
                trackColor={{ false: '#374151', true: '#FCDF03' }}
                thumbColor={formData.isAvailable ? '#030712' : '#6B7280'}
                disabled={!editing}
              />
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.switchGroup}>
            <Text style={styles.inputLabel}>Push Notifications</Text>
            <View style={styles.switchRow}>
              <Bell size={16} color="#6B7280" />
              <Text style={styles.switchLabel}>Receive push notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#374151', true: '#FCDF03' }}
                thumbColor={notificationsEnabled ? '#030712' : '#6B7280'}
              />
            </View>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.inputLabel}>Email Notifications</Text>
            <View style={styles.switchRow}>
              <Mail size={16} color="#6B7280" />
              <Text style={styles.switchLabel}>Receive email notifications</Text>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: '#374151', true: '#FCDF03' }}
                thumbColor={emailNotifications ? '#030712' : '#6B7280'}
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={()=>logout()}>
            <LogOut size={20} color="#E5E7EB" />
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={handleDeleteAccount}
          >
            <Shield size={20} color="#EF4444" />
            <Text style={[styles.actionButtonText, styles.dangerText]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        {editing && (
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#030712" />
              ) : (
                <Save size={20} color="#030712" />
              )}
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  editButton: {
    padding: 8,
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
    alignItems: 'center',
  },
  initialsWrap: {
    position: 'relative',
    marginRight: 16,
  },
  initials: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FCDF03',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  initialsText: {
    fontWeight: '700',
    fontSize: 18,
    color: '#030712',
  },
  onlineDot: {
    width: 16,
    height: 16,
    backgroundColor: '#10B981',
    borderRadius: 8,
    borderWidth: 2,
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
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginRight: 8,
  },
  username: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  balance: {
    fontSize: 14,
    color: '#FCDF03',
    fontWeight: '600',
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
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#E5E7EB',
  },
  inputDisabled: {
    opacity: 0.6,
  },
  textArea: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#E5E7EB',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  switchGroup: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#7F1D1D',
  },
  dangerText: {
    color: '#EF4444',
  },
  saveButtonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FCDF03',
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030712',
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
  },
  retryText: {
    color: '#030712',
    fontWeight: '600',
  },
});

export default Settings;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { ArrowLeft, Bell, Volume2, CheckCheck, Radio, Eye, Download, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const MessageSettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    readReceipts: true,
    onlineStatus: true,
    autoRead: false,
  });

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllChats = () => {
    Alert.alert(
      'Clear All Chats',
      'This will permanently delete all your chat history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            // Implement clear chats logic
            Alert.alert('Success', 'All chats have been cleared');
          },
        },
      ]
    );
  };

  const exportChats = () => {
    Alert.alert('Export Chats', 'This feature will be available soon');
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    icon: Icon 
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon: any;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <View style={styles.iconContainer}>
          <Icon size={20} color="#FCDF03" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#374151', true: '#FCDF03' }}
        thumbColor={value ? '#030712' : '#E5E7EB'}
        ios_backgroundColor="#374151"
      />
    </View>
  );

  const ActionItem = ({ 
    title, 
    subtitle, 
    onPress, 
    icon: Icon, 
    danger = false 
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    icon: any;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.settingInfo}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={danger ? '#EF4444' : '#FCDF03'} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ArrowLeft size={16} color="#6B7280" style={{ transform: [{ rotate: '180deg' }] }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notifications</Text>
          
          <SettingItem
            title="Push Notifications"
            subtitle="Receive notifications for new messages"
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
            icon={Bell}
          />
          
          <SettingItem
            title="Sound"
            subtitle="Play sound for new messages"
            value={settings.soundEnabled}
            onValueChange={(value) => updateSetting('soundEnabled', value)}
            icon={Volume2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy</Text>
          
          <SettingItem
            title="Read Receipts"
            subtitle="Let others know when you've read their messages"
            value={settings.readReceipts}
            onValueChange={(value) => updateSetting('readReceipts', value)}
            icon={CheckCheck}
          />
          
          <SettingItem
            title="Online Status"
            subtitle="Show when you're online to consultants"
            value={settings.onlineStatus}
            onValueChange={(value) => updateSetting('onlineStatus', value)}
            icon={Radio}
          />
          
          <SettingItem
            title="Auto-read Messages"
            subtitle="Automatically mark messages as read when opened"
            value={settings.autoRead}
            onValueChange={(value) => updateSetting('autoRead', value)}
            icon={Eye}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Data Management</Text>
          
          <ActionItem
            title="Export Chat History"
            subtitle="Download your conversation history"
            onPress={exportChats}
            icon={Download}
          />
          
          <ActionItem
            title="Clear All Chats"
            subtitle="Permanently delete all conversations"
            onPress={clearAllChats}
            icon={Trash2}
            danger
          />
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: 16,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#030712',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#030712',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#374151',
  },
  settingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E5E7EB',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  dangerText: {
    color: '#EF4444',
  },
});

export default MessageSettingsScreen;
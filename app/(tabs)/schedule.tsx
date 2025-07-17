import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import React from 'react'

const Schedule = () => {
  const sessions = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      initials: 'DSC',
      type: 'Anxiety Management Session',
      date: 'Tomorrow at 12:43 AM',
      duration: '30 min',
      method: 'Video',
      status: 'confirmed',
      rate: '$2.5/min',
      canJoin: true
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      initials: 'MJ',
      type: 'Startup Strategy Discussion',
      date: 'Tomorrow at 10:43 PM',
      duration: '60 min',
      method: 'Message',
      status: 'pending',
      rate: '$5/min',
      canJoin: false
    },
    {
      id: 3,
      name: 'Dr. James Wilson',
      initials: 'DJW',
      type: 'Nutrition Plan Review',
      date: 'Jun 12, 10:43 PM',
      duration: '45 min',
      method: 'Video',
      status: 'confirmed',
      rate: '$2.25/min',
      canJoin: false
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#FCDF03' // Bright yellow for confirmed
      case 'pending':
        return '#E5E7EB' // Light gray for pending
      default:
        return '#E5E7EB' // Light gray as default
    }
  }

  const renderSession = (session) => (
    <View key={session.id} style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{session.initials}</Text>
          </View>
        </View>
        
        <View style={styles.sessionInfo}>
          <Text style={styles.doctorName}>{session.name}</Text>
          <Text style={styles.sessionType}>{session.type}</Text>
          
          <View style={styles.sessionDetails}>
            <Text style={styles.dateTime}>{session.date}</Text>
            <Text style={styles.duration}>{session.duration}</Text>
          </View>
          
          <View style={styles.sessionMeta}>
            <View style={styles.methodContainer}>
              <Text style={styles.methodIcon}>{session.method === 'Video' ? '📹' : '💬'}</Text>
              <Text style={styles.methodText}>{session.method}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                <Text style={styles.statusText}>{session.status}</Text>
              </View>
            </View>
            <Text style={styles.rate}>{session.rate}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.rescheduleButton}>
          <Text style={styles.rescheduleText}>Reschedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        {session.canJoin && (
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinText}>Join Call</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      
      {/* <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>📅</Text>
        </View>
        <Text style={styles.headerTitle}>Schedule</Text>
        <Text style={styles.headerSubtitle}>Manage your upcoming sessions</Text>
      </View> */}

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
          <TouchableOpacity style={styles.bookNewButton}>
            <Text style={styles.bookNewText}>+ Book New</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
          {sessions.map(session => renderSession(session))}
        </ScrollView>
      </View>
    </View>
  )
}

export default Schedule

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712', // Dark background
  },
  header: {
    backgroundColor: '#030712', // Dark background
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#FCDF03', // Bright yellow background
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIconText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#E5E7EB', // Light gray text
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E5E7EB', // Light gray text
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E5E7EB', // Light gray text
  },
  bookNewButton: {
    backgroundColor: '#FCDF03', // Bright yellow background
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookNewText: {
    color: '#030712', // Dark text on yellow background
    fontSize: 14,
    fontWeight: '500',
  },
  sessionsList: {
    flex: 1,
  },
  sessionCard: {
    backgroundColor: '#030712', // Dark background
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Light gray border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#FCDF03', // Bright yellow background
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#030712', // Dark text on yellow background
    fontSize: 14,
    fontWeight: '600',
  },
  sessionInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB', // Light gray text
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: '#E5E7EB', // Light gray text
    marginBottom: 8,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 13,
    color: '#E5E7EB', // Light gray text
    marginRight: 12,
  },
  duration: {
    fontSize: 13,
    color: '#E5E7EB', // Light gray text
  },
  sessionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    marginRight: 4,
  },
  methodText: {
    fontSize: 13,
    color: '#E5E7EB', // Light gray text
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    color: '#030712', // Dark text on colored background
    fontSize: 11,
    fontWeight: '500',
  },
  rate: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E5E7EB', // Light gray text
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rescheduleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E5E7EB', // Light gray background
    alignItems: 'center',
  },
  rescheduleText: {
    color: '#030712', // Dark text on light background
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E5E7EB', // Light gray background
    alignItems: 'center',
  },
  cancelText: {
    color: '#030712', // Dark text on light background
    fontSize: 14,
    fontWeight: '500',
  },
  joinButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FCDF03', // Bright yellow background
    alignItems: 'center',
  },
  joinText: {
    color: '#030712', // Dark text on yellow background
    fontSize: 14,
    fontWeight: '500',
  },
})
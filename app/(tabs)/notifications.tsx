import { Check, X } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NotificationsUI = () => {
  const notifications = [
    {
      id: 1,
      type: "session",
      title: "Session Confirmed",
      message: "Your session with Dr. Sarah Chen has been confirmed for tomorrow at 2:00 PM",
      time: "35m ago",
      avatar: "DSC",
      avatarColor: "#3B82F6", // Tailwind's bg-blue-500
      isUnread: true,
      actions: [
        { label: "View Session", type: "primary" },
        { label: "Reschedule", type: "secondary" }
      ]
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Marcus Johnson sent you a message about your business plan review",
      time: "2h ago",
      avatar: "MJ",
      avatarColor: "#5B5AF1", // Tailwind's bg-indigo-600
      isUnread: true,
      actions: [
        { label: "Open Message", type: "primary" }
      ]
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Received",
      message: "You earned $45.75 from your consultation with John Doe",
      time: "4h ago",
      avatar: "$",
      avatarColor: "#FBBF24", // Tailwind's bg-yellow-500
      isUnread: false,
      amount: "+$45.75"
    }
  ];

  const NotificationItem = ({ notification }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.closeButton}>
        <X size={16} color="#9CA3AF" />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <View style={[styles.avatar, { backgroundColor: notification.avatarColor }]}>
          <Text style={styles.avatarText}>{notification.avatar}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{notification.title}</Text>
            {notification.isUnread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message}>{notification.message}</Text>
          <View style={styles.footer}>
            <Text style={styles.time}>{notification.time}</Text>
            {notification.amount && (
              <View style={styles.amountPill}>
                <Text style={styles.amountText}>{notification.amount}</Text>
              </View>
            )}
          </View>
          {notification.actions && (
            <View style={styles.actions}>
              {notification.actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.actionButton,
                    action.type === 'primary' ? styles.primaryButton : styles.secondaryButton
                  ]}
                >
                  <Text style={[
                    styles.actionText,
                    action.type === 'primary' ? styles.primaryText : styles.secondaryText
                  ]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.bellIcon}>
          <Bell size={32} color="white" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>Stay updated with your consultations</Text>
      </View> */}

      {/* Recent */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleWrap}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <View style={styles.newPill}>
            <Text style={styles.newText}>2 new</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.markReadButton}>
          <Check size={16} color="#4B5563" />
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 80 }}
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NotificationItem notification={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712', paddingTop: 20 },
  header: {
    backgroundColor: 'white',
    paddingTop: 64,
    paddingBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 24
  },
  bellIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F9FA',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center'
  },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8F9FA',
    marginRight: 8
  },
  newPill: {
    backgroundColor: '#EF4444',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  newText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  markReadButton: { flexDirection: 'row', alignItems: 'center' },
  markReadText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 4
  },
  card: {
    backgroundColor: '#030712',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1
  },
  cardContent: { flexDirection: 'row' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth:2,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarText: {
    color: '030712',
    fontWeight: '600',
    fontSize: 14
  },
  content: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F9FA',
    marginRight: 6
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#5B5AF1',
    borderRadius: 4
  },
  message: {
    color: '#F8F9FA',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  time: {
    fontSize: 12,
    color: '#6B7280'
  },
  amountPill: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999
  },
  amountText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 8
  },
  primaryButton: {
    backgroundColor: '#5B5AF1'
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6'
  },
  primaryText: {
    color: '#030712',
    fontWeight: '500'
  },
  secondaryText: {
    color: '#374151',
    fontWeight: '500'
  }
});

export default NotificationsUI;

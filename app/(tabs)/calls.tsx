import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Phone, Check } from 'lucide-react-native';

const CallHistoryUI = () => {
  const callHistory = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      initials: "DSC",
      bgColor: "#FCDF03", // Bright yellow
      verified: true,
      status: "Just now",
      statusColor: "#FCDF03", // Bright yellow for status
      indicatorColor: "#FCDF03", // Bright yellow indicator
    },
    {
      id: 2,
      name: "Marcus Johnson",
      initials: "MJ",
      bgColor: "#FCDF03", // Bright yellow
      verified: true,
      status: "Just now",
      duration: "20:45",
      statusColor: "#E5E7EB", // Light gray for status
      indicatorColor: "#FCDF03", // Bright yellow indicator
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      initials: "ER",
      bgColor: "#FCDF03", // Bright yellow
      verified: false,
      status: "Just now",
      duration: "14:52",
      statusColor: "#E5E7EB", // Light gray for status
      indicatorColor: "#FCDF03", // Bright yellow indicator
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      initials: "DJW",
      bgColor: "#FCDF03", // Bright yellow
      verified: true,
      status: "Just now",
      duration: "36:56",
      statusColor: "#E5E7EB", // Light gray for status
      indicatorColor: "#FCDF03", // Bright yellow indicator
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Phone color="#030712" size={32} />
        </View>
        <Text style={styles.headerTitle}>Call History</Text>
        <Text style={styles.headerSubtitle}>Your recent consultation calls</Text>
      </View> */}

      {/* Call List */}
      <View style={styles.callList}>
        {callHistory.map((call) => (
          <View key={call.id} style={styles.callCard}>
            <View style={styles.callRow}>
              <View style={styles.callLeft}>
                <View style={[styles.avatar, { backgroundColor: call.bgColor }]}>
                  <Text style={styles.avatarText}>{call.initials}</Text>
                </View>
                <View style={styles.callDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameText}>{call.name}</Text>
                    {call.verified && (
                      <View style={styles.verifiedRow}>
                        <Check size={12} color="#FCDF03" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                      <Phone size={12} color="#E5E7EB" />
                      <Text style={[styles.statusText, { color: call.statusColor }]}>{call.status}</Text>
                    </View>
                    {call.duration && (
                      <View style={styles.statusItem}>
                        <View style={styles.clockIcon}>
                          <Text style={{ fontSize: 10, color: "#E5E7EB" }}>🕒</Text>
                        </View>
                        <Text style={styles.durationText}>{call.duration}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <View style={[styles.indicatorDot, { backgroundColor: call.indicatorColor }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default CallHistoryUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712', // Dark background
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#030712', // Dark background
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#FCDF03', // Bright yellow background
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  callList: {
    paddingHorizontal: 24,
  },
  callCard: {
    backgroundColor: '#030712', // Dark background
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Light gray border
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  callRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#030712', // Dark text on yellow background
    fontWeight: '600',
    fontSize: 12,
  },
  callDetails: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: '600',
    color: '#E5E7EB', // Light gray text
    fontSize: 16,
    marginRight: 6,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#FCDF03', // Bright yellow text
    marginLeft: 2,
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    marginLeft: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#E5E7EB', // Light gray text
    marginLeft: 4,
  },
  clockIcon: {
    marginTop: 1,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
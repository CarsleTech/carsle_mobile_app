import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function WalletScreen() {  
  const {user} = useAuth();

  const recentTransactions = [
    {
      id: 1,
      title: 'Session with Dr. Sarah Chen',
      time: '2h ago',
      amount: '-$25.50',
      status: 'completed',
      type: 'session',
      icon: '—',
      color: '#EF4444',
    },
    {
      id: 2,
      title: 'Wallet top-up',
      time: '1d ago',
      amount: '+$100.00',
      status: 'completed',
      type: 'topup',
      icon: '+',
      color: '#10B981',
    },
    {
      id: 3,
      title: 'Consultation with John Doe',
      time: '3d ago',
      amount: '+$45.75',
      status: 'completed',
      type: 'consultation',
      icon: '↗',
      color: '#3B82F6',
    },
  ];

  const TabButton = ({ title, isActive = false }) => (
    <TouchableOpacity style={[styles.tabButton, isActive && styles.activeTab]}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TransactionItem = ({ transaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionContent}>
        <View style={[styles.transactionIcon, { backgroundColor: `${transaction.color}15` }]}>
          <Text style={[styles.iconText, { color: transaction.color }]}>
            {transaction.icon}
          </Text>
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{transaction.title}</Text>
          <Text style={styles.transactionTime}>{transaction.time}</Text>
        </View>

        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amountText,
            { color: transaction.amount.startsWith('+') ? '#10B981' : '#EF4444' }
          ]}>
            {transaction.amount}
          </Text>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        {/* <View style={styles.header}>
          <View style={styles.headerIcon}>
            <IconSymbol name="wallet.pass.fill" size={32} color="#FCDF03" />
          </View>
          <Text style={styles.headerTitle}>Wallet</Text>
          <Text style={styles.headerSubtitle}>Manage your funds and earnings</Text>
        </View> */}

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <TouchableOpacity style={styles.eyeIcon}>
              <IconSymbol name="eye" size={20} color="#030712" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.balanceAmount}>{(user?.balance).toFixed(2)}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.addFundsButton}>
              <Text style={styles.addFundsText}>+ Add Funds</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TabButton title="Transactions" isActive={true} />
          <TabButton title="Referrals" />
          <TabButton title="Settings" />
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F8F9FA',
    backgroundColor: '#030712', // Dark background
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FCDF03',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#030712',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  balanceCard: {
    backgroundColor: '#FCDF03', 
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#030712',
    opacity: 0.8,
  },
  eyeIcon: {
    padding: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#030712',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addFundsButton: {
    flex: 1,
    backgroundColor: '#030712',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addFundsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FCDF03',
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(3, 7, 18, 0.2)',
  },
  withdrawText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030712',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    color: '#FCDF03',
    borderBottomColor: '#FCDF03',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FCDF03',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
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
    color: '#030712',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FCDF03',
    fontWeight: '500',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '600',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#030712',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
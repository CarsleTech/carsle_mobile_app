// screens/WalletScreen.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Transaction {
  id: string;
  title: string;
  time: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'session' | 'topup' | 'consultation' | 'withdrawal' | 'transfer';
  icon: string;
  color: string;
}

const API_BASE_URL = 'http://localhost:3003';

export default function WalletScreen() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    fetchWalletData();
  }, []); // Keep empty dependency array

  const fetchWalletData = async () => {
    if (!user?.id) {
      console.log('No user ID available');
      setIsLoading(false); // Important: Set loading to false even when no user
      return;
    }
    
    try {
      setIsLoading(true); // Set loading to true at start
      await Promise.all([
        fetchBalance(),
        fetchTransactions()
      ]);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet data');
    } finally {
      setIsLoading(false); // Always set loading to false in finally block
    }
  };

  const fetchBalance = async () => {
    try {
      let userId = user?.id;
      if (!userId) {
        const userData = await AsyncStorage.getItem('user');
        userId = userData ? JSON.parse(userData).id : '';
      }

      if (!userId) {
        console.log('No user ID found');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/transaction/balance/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      // Set default balance on error
      setBalance(0);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedTransactions = data.transactions?.map((t: any) => ({
        id: t.id,
        title: t.description || t.type,
        time: formatTime(t.created_at),
        amount: formatAmount(t.amount, t.type),
        status: t.status,
        type: t.type,
        icon: getTransactionIcon(t.type),
        color: getTransactionColor(t.type)
      })) || [];
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Set empty array on error
      setTransactions([]);
    }
  };

  const formatTime = (timestamp: string): string => {
    try {
      const now = new Date();
      const transactionTime = new Date(timestamp);
      const diffInHours = Math.floor((now.getTime() - transactionTime.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  const formatAmount = (amount: number, type: string): string => {
    const sign = ['topup', 'deposit', 'consultation'].includes(type) ? '+' : '-';
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  const getTransactionIcon = (type: string): string => {
    const icons = {
      session: '--',
      topup: '+',
      consultation: '↗',
      withdrawal: '↓',
      transfer: '↔'
    };
    return icons[type as keyof typeof icons] || '•';
  };

  const getTransactionColor = (type: string): string => {
    const colors = {
      session: '#EF4444',
      topup: '#10B981',
      consultation: '#3B82F6',
      withdrawal: '#F59E0B',
      transfer: '#8B5CF6'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchWalletData();
    } catch (error) {
      console.error('Refresh failed:', error);
      Alert.alert('Refresh Failed', 'Unable to refresh wallet data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);

  const handleManualRefresh = async () => {
    if (refreshing || isLoading) return;
    
    try {
      await fetchWalletData();
      Alert.alert('Success', 'Wallet data refreshed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh wallet data');
    }
  };

  const TabButton = ({ title, isActive = false }: { title: string; isActive: boolean }) => (
    <TouchableOpacity 
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={() => setActiveTab(title.toLowerCase())}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => router.push(`/transaction/${transaction.id}`)}
    >
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

  // Show loading only on initial load
  if (isLoading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FCDF03" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#FCDF03"
            colors={["#FCDF03"]}
            progressBackgroundColor="#030712"
          />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <View style={styles.headerActions}>
              {/* Manual refresh button */}
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={handleManualRefresh}
                disabled={refreshing || isLoading}
              >
                <IconSymbol 
                  name="arrow.clockwise" 
                  size={18} 
                  color={refreshing || isLoading ? "#666" : "#030712"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setBalanceVisible(!balanceVisible)}
              >
                <IconSymbol 
                  name={balanceVisible ? "eye" : "eye.slash"} 
                  size={20} 
                  color="#030712" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.balanceAmount}>
            ${balanceVisible ? balance.toFixed(2) : '••••••'}
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.addFundsButton}
              onPress={() => router.push('/(wallet)/add-funds')}
            >
              <Text style={styles.addFundsText}>+ Add Funds</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={() => router.push('/(wallet)/withdraw')}
            >
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/(wallet)/transfer')}
            >
              <IconSymbol name="arrow.up.arrow.down" size={20} color="#030712" />
              <Text style={styles.quickActionText}>Transfer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => router.push('/(wallet)/pay')}
            >
              <IconSymbol name="creditcard" size={20} color="#030712" />
              <Text style={styles.quickActionText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TabButton title="Transactions" isActive={activeTab === 'transactions'} />
          <TabButton title="Referrals" isActive={activeTab === 'referrals'} />
        </View>

        {/* Content based on active tab */}
        {activeTab === 'transactions' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => router.push('/(wallet)/transactions')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </View>

            {transactions.length === 0 && !isLoading && (
              <View style={styles.emptyState}>
                <IconSymbol name="doc.text" size={48} color="#6B7280" />
                <Text style={styles.emptyStateText}>No transactions yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Your transaction history will appear here
                </Text>
                <TouchableOpacity 
                  style={styles.refreshEmptyButton}
                  onPress={handleManualRefresh}
                >
                  <Text style={styles.refreshEmptyButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === 'referrals' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Referral Program</Text>
            <View style={styles.referralCard}>
              <Text style={styles.referralTitle}>Invite friends and earn</Text>
              <Text style={styles.referralSubtitle}>
                Get $10 for each friend who joins
              </Text>
              <TouchableOpacity style={styles.referralButton}>
                <Text style={styles.referralButtonText}>Share Invite Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FCDF03',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 4,
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
    marginBottom: 20,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#030712',
    fontWeight: '500',
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
    color: '#FFFFFF',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshEmptyButton: {
    backgroundColor: '#FCDF03',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshEmptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030712',
  },
  referralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#030712',
    marginBottom: 8,
  },
  referralSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  referralButton: {
    backgroundColor: '#FCDF03',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  referralButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030712',
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#030712',
  },
});
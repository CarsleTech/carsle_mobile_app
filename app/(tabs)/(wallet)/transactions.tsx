import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const API_BASE_URL = 'http://localhost:3003';
  const {user} = useAuth()

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/transactions?userId=${user?.id}`)
      const data = await response.json();
      if (response.ok) {
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
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const transactionTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - transactionTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatAmount = (amount: number, type: string): string => {
    const sign = ['topup', 'deposit', 'consultation'].includes(type) ? '+' : '-';
    return `${sign}${Math.abs(amount).toFixed(2)}`;
  };

  const getTransactionIcon = (type: string): string => {
    const icons = {
      session: '—',
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

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.type === filter
  );

  const FilterButton = ({ title, value }: { title: string; value: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.activeFilter]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterText, filter === value && styles.activeFilterText]}>
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
          <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B5AF1" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#5B5AF1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity>
          <IconSymbol name="magnifyingglass" size={20} color="#5B5AF1" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.filterContainer}>
          <FilterButton title="All" value="all" />
          <FilterButton title="Income" value="consultation" />
          <FilterButton title="Expenses" value="session" />
          <FilterButton title="Top-ups" value="topup" />
          <FilterButton title="Transfers" value="transfer" />
        </View>

        <View style={styles.transactionsList}>
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>

        {filteredTransactions.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="doc.text" size={48} color="#6B7280" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              {filter === 'all' 
                ? 'Your transaction history will appear here'
                : `No ${filter} transactions found`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(252, 223, 3, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5B5AF1',
  },
  balanceInfo: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5B5AF1',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(252, 223, 3, 0.2)',
  },
  amountInput: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(252, 223, 3, 0.2)',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5B5AF1',
    marginRight: 8,
  },
  amountText: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledButton: {
    opacity: 0.6,
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
  },
});

// Merge shared styles with component-specific styles
const styles = StyleSheet.create({
  ...sharedStyles,
  // Add specific styles for each component
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickAmountButton: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(252, 223, 3, 0.2)',
  },
  selectedQuickAmount: {
    backgroundColor: '#5B5AF1',
    borderColor: '#5B5AF1',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  selectedQuickAmountText: {
    color: '#030712',
  },
  methodSection: {
    marginBottom: 24,
  },
  methodOption: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(252, 223, 3, 0.2)',
  },
  selectedMethod: {
    borderColor: '#5B5AF1',
    backgroundColor: 'rgba(252, 223, 3, 0.1)',
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  addButton: {
    backgroundColor: '#5B5AF1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030712',
  },
  withdrawButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transferButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  payButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: 'rgba(252, 223, 3, 0.2)',
  },
  activeFilter: {
    backgroundColor: '#5B5AF1',
    borderColor: '#5B5AF1',
  },
  filterText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  activeFilterText: {
    color: '#030712',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(252, 223, 3, 0.1)',
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
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 14,
    color: '#9CA3AF',
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
    textTransform: 'capitalize',
  },
  quickReasons: {
    marginBottom: 24,
  },
  quickReasonsTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  quickReasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickReasonButton: {
    backgroundColor: '#1F2937',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(252, 223, 3, 0.2)',
  },
  quickReasonText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});

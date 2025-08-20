import React, { useState } from 'react';
// ./tigerbeetle start --addresses=3003 0_0.tigerbeetle

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];
const API_BASE_URL = 'http://localhost:3003';

export default function AddFundsScreen() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');

  user.id = user?.id || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '') || '' // Fallback for demonstration

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleAddFunds = async () => {
    console.log('Adding funds:', amount);
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(amount),
          description: 'Wallet top-up',
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Funds added successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to add funds');
      }
    } catch (error) {
      console.error('Add funds error:', error);
      Alert.alert('Error', 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#FCDF03" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Funds</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={{}}>
          <Text style={styles.sectionTitle}>Amoun</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountText}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              autoFocus
            />
          </View>

          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.quickAmountButton,
                  amount === value.toString() && styles.selectedQuickAmount
                ]}
                onPress={() => handleQuickAmount(value)}
              >
                <Text style={[
                  styles.quickAmountText,
                  amount === value.toString() && styles.selectedQuickAmountText
                ]}>
                  ${value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.methodSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === 'card' && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod('card')}
          >
            <IconSymbol name="creditcard" size={20} color="#FCDF03" />
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Credit/Debit Card</Text>
              <Text style={styles.methodSubtitle}>**** **** **** 1234</Text>
            </View>
            <IconSymbol 
              name={selectedMethod === 'card' ? "checkmark.circle.fill" : "circle"} 
              size={20} 
              color="#FCDF03" 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === 'bank' && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod('bank')}
          >
            <IconSymbol name="building.2" size={20} color="#FCDF03" />
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Bank Transfer</Text>
              <Text style={styles.methodSubtitle}>Chase Bank ****1234</Text>
            </View>
            <IconSymbol 
              name={selectedMethod === 'bank' ? "checkmark.circle.fill" : "circle"} 
              size={20} 
              color="#FCDF03" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addButton, isLoading && styles.disabledButton]}
          onPress={handleAddFunds}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#030712" />
          ) : (
            <Text style={styles.addButtonText}>Add ${amount || '0.00'}</Text>
          )}
        </TouchableOpacity>
      </View>
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
    color: '#FCDF03',
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
    color: '#FCDF03',
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
    color: '#FCDF03',
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
    backgroundColor: '#FCDF03',
    borderColor: '#FCDF03',
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
    borderColor: '#FCDF03',
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
    backgroundColor: '#FCDF03',
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
    backgroundColor: '#FCDF03',
    borderColor: '#FCDF03',
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


import { useState, useEffect, useCallback } from 'react';
import { WalletService } from '../services/walletService';
import { useAuth } from '../contexts/AuthContext';

export interface Transaction {
  id: string;
  title: string;
  time: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'session' | 'topup' | 'consultation' | 'withdrawal' | 'transfer' | 'debit' | 'credit' | 'payment';
  icon: string;
  color: string;
  description?: string;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const data = await WalletService.getUserBalance(user.id);
      if (data) {
        setBalance(data.balance || 0);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance');
    }
  }, [user?.id]);

  const fetchTransactions = useCallback(async () => {
    try {
      const data = await WalletService.getTransactions();
      const formattedTransactions = data.map((t: any) => ({
        id: t.id,
        title: t.description || t.type,
        time: formatTime(t.created_at),
        amount: formatAmount(t.amount, t.type),
        status: t.status,
        type: t.type,
        icon: getTransactionIcon(t.type),
        color: getTransactionColor(t.type),
        description: t.description,
        created_at: t.created_at,
      }));
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    }
  }, []);

  const refreshWalletData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchBalance(), fetchTransactions()]);
    } catch (err) {
      setError('Failed to refresh wallet data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchBalance, fetchTransactions]);

  const deposit = async (amount: number, description?: string) => {
    if (!user?.id) throw new Error('User not found');
    
    const result = await WalletService.deposit(user.id, amount, description);
    if (result.success) {
      await refreshWalletData();
    }
    return result;
  };

  const withdraw = async (amount: number, description?: string) => {
    if (!user?.id) throw new Error('User not found');
    
    const result = await WalletService.withdraw(user.id, amount, description);
    if (result.success) {
      await refreshWalletData();
    }
    return result;
  };

  const transfer = async (toUserId: string, amount: number, description?: string) => {
    if (!user?.id) throw new Error('User not found');
    
    const result = await WalletService.transfer(user.id, toUserId, amount, description);
    if (result.success) {
      await refreshWalletData();
    }
    return result;
  };

  const makePayment = async (amount: number, description?: string) => {
    if (!user?.id) throw new Error('User not found');
    
    const result = await WalletService.debitUser(user.id, amount, description);
    if (result.success) {
      await refreshWalletData();
    }
    return result;
  };

  useEffect(() => {
    refreshWalletData();
  }, [refreshWalletData]);

  return {
    balance,
    transactions,
    isLoading,
    error,
    refreshWalletData,
    deposit,
    withdraw,
    transfer,
    makePayment,
  };
};

// Helper functions (moved from inline)
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
  const sign = ['topup', 'deposit', 'consultation', 'credit'].includes(type) ? '+' : '-';
  return `${sign}${Math.abs(amount).toFixed(2)}`;
};

const getTransactionIcon = (type: string): string => {
  const icons: Record<string, string> = {
    session: '—',
    topup: '+',
    consultation: '↗',
    withdrawal: '↓',
    transfer: '↔',
    debit: '—',
    credit: '+',
  };
  return icons[type] || '•';
};

const getTransactionColor = (type: string): string => {
  const colors: Record<string, string> = {
    session: '#EF4444',
    topup: '#10B981',
    consultation: '#3B82F6',
    withdrawal: '#F59E0B',
    transfer: '#8B5CF6',
    debit: '#EF4444',
    credit: '#10B981',
  };
  return colors[type] || '#6B7280';
};
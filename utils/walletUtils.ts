export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatTime = (timestamp: string): string => {
  const now = new Date();
  const transactionTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - transactionTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
};

export const getTransactionIcon = (type: string): string => {
  const icons: Record<string, string> = {
    session: '—',
    topup: '+',
    deposit: '+',
    consultation: '↗',
    withdrawal: '↓',
    withdraw: '↓',
    transfer: '↔',
    debit: '—',
    credit: '+',
    payment: '→',
  };
  return icons[type.toLowerCase()] || '•';
};

export const getTransactionColor = (type: string): string => {
  const colors: Record<string, string> = {
    session: '#EF4444',
    topup: '#10B981',
    deposit: '#10B981',
    consultation: '#3B82F6',
    withdrawal: '#F59E0B',
    withdraw: '#F59E0B',
    transfer: '#8B5CF6',
    debit: '#EF4444',
    credit: '#10B981',
    payment: '#6366F1',
  };
  return colors[type.toLowerCase()] || '#6B7280';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    completed: '#10B981',
    success: '#10B981',
    pending: '#F59E0B',
    failed: '#EF4444',
    error: '#EF4444',
    cancelled: '#6B7280',
  };
  return colors[status.toLowerCase()] || '#6B7280';
};

export const validateAmount = (amount: string, maxAmount?: number): { isValid: boolean; error?: string } => {
  const numAmount = parseFloat(amount);
  
  if (!amount || isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }
  
  if (numAmount > 999999) {
    return { isValid: false, error: 'Amount is too large' };
  }
  
  if (maxAmount && numAmount > maxAmount) {
    return { isValid: false, error: 'Insufficient balance' };
  }
  
  return { isValid: true };
};

export const validateUserId = (userId: string): { isValid: boolean; error?: string } => {
  if (!userId || userId.trim().length === 0) {
    return { isValid: false, error: 'Please enter a valid user ID' };
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(userId)) {
    return { isValid: true };
  }
  
  // Basic phone number validation (US format)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (phoneRegex.test(userId.replace(/\D/g, ''))) {
    return { isValid: true };
  }
  
  // UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(userId)) {
    return { isValid: true };
  }
  
  // Allow alphanumeric user IDs (minimum 3 characters)
  if (userId.length >= 3 && /^[a-zA-Z0-9_]+$/.test(userId)) {
    return { isValid: true };
  }
  
  return { isValid: false, error: 'Please enter a valid email, phone number, or user ID' };
};

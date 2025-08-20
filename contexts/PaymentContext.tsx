import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { Axios } from 'axios';

interface PaymentContextType {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const paymentApi = axios.create({
    baseURL: 'http://localhost:3003/transaction/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const getBalance = async (accountId: bigint): Promise<number> => {
  try {
    const response = await paymentApi.get(`/balance/${accountId}`);
    return response.data.balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

const getTransactionHistory = async (accountId: bigint): Promise<any[]> => {
  try {
    const response = await paymentApi.get(`/transactions/${accountId}`);
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}

const debitAccount = async (accountId: bigint, amount: number): Promise<void> => {
  try {
    const response = await paymentApi.post(`/debit/${accountId}`, { amount });
    return response.data;
  } catch (error) {
    console.error('Error debiting account:', error);
    throw error;
  }
}

const creditAccount = async (accountId: bigint, amount: number): Promise<void> => {
  try {
    const response = await paymentApi.post(`/credit/${accountId}`, { amount });
    return response.data;
  } catch (error) {
    console.error('Error crediting account:', error);
    throw error;
  }
}



export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');

    

  return (
    <PaymentContext.Provider value={{ paymentMethod, setPaymentMethod }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

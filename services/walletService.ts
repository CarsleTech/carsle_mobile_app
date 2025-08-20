// services/walletService.ts
export class WalletService {
  private static baseUrl = 'http://localhost:3003';

  static async getUserBalance(userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/balance/${userId}`);
      const data = await response.json();
      return response.ok ? data : null;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  }

  static async getTransactions() {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/transactions`);
      const data = await response.json();
      return response.ok ? data.transactions || [] : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  static async deposit(userId: string, amount: number, description?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description }),
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error making deposit:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async withdraw(userId: string, amount: number, description?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description }),
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error making withdrawal:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async transfer(fromUserId: string, toUserId: string, amount: number, description?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId, toUserId, amount, description }),
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error making transfer:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async debitUser(userId: string, amount: number, description?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/debit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description }),
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error debiting user:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async creditUser(userId: string, amount: number, description?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/credit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description }),
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error crediting user:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async createUserAccount(userId: string, initialBalance = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/accounts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, initialBalance }),
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error creating user account:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async getAccountSummary(userId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/account/${userId}/summary`);
      const data = await response.json();
      return response.ok ? data : null;
    } catch (error) {
      console.error('Error fetching account summary:', error);
      return null;
    }
  }

  static async createPendingTransfer(fromUserId: string, toUserId: string, amount: number, description?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/transfer/pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId, toUserId, amount, description }),
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error creating pending transfer:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async acceptPendingTransfer(pendingTransferId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/transfer/pending/${pendingTransferId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error accepting pending transfer:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }

  static async rejectPendingTransfer(pendingTransferId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/transfer/pending/${pendingTransferId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return { success: response.ok, data, message: data.message };
    } catch (error) {
      console.error('Error rejecting pending transfer:', error);
      return { success: false, data: null, message: 'Network error' };
    }
  }
}
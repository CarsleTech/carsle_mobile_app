import { useAuth } from "@/contexts/AuthContext";

export interface MessageAPIService {
  baseURL: string;
  currentUserId: string;
}

class MessageService implements MessageAPIService {
  baseURL = 'http://34.45.85.24/api/messages';
  // Assuming useAuth is a custom hook to get user context
  currentUserId = (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '') || '';

  async startSession(consultantId: string, topic: string, description?: string) {
    const response = await fetch(`${this.baseURL}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: this.currentUserId,
        consultantId,
        topic,
        description,
      }),
    });
    return await response.json();
  }

  async endSession(consultationId: string) {
    const response = await fetch(`${this.baseURL}/session/end`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consultationId,
        endedBy: this.currentUserId,
      }),
    });
    return await response.json();
  }

  async sendMessage(consultationId: string, content: string, messageType: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT') {
    const response = await fetch(`${this.baseURL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consultationId,
        senderId: this.currentUserId,
        content,
        messageType,
      }),
    });
    return await response.json();
  }

  async getMessages(consultationId: string, page = 1, limit = 50) {
    const response = await fetch(
      `${this.baseURL}/consultation/${consultationId}?userId=${this.currentUserId}&page=${page}&limit=${limit}`
    );
    return await response.json();
  }

  async markAsRead(messageId: string) {
    const response = await fetch(`${this.baseURL}/read/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUserId }),
    });
    return await response.json();
  }

  async markAllAsRead(consultationId: string) {
    const response = await fetch(`${this.baseURL}/read-all/${consultationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUserId }),
    });
    return await response.json();
  }

  async getUnreadCount(consultationId: string) {
    const response = await fetch(
      `${this.baseURL}/unread-count/${consultationId}?userId=${this.currentUserId}`
    );
    return await response.json();
  }

  async getUserConsultations(status?: string) {
    const statusParam = status ? `?status=${status}` : '';
    const response = await fetch(`${this.baseURL}/consultations/${this.currentUserId}${statusParam}`);
    return await response.json();
  }

  async editMessage(messageId: string, content: string) {
    const response = await fetch(`${this.baseURL}/edit/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.currentUserId,
        content,
      }),
    });
    return await response.json();
  }
}

export const messageService = new MessageService();

// Create a hook to get the message service with the current user
export const useMessageService = () => {
  const { user } = useAuth();
  const service = new MessageService();
  
  if (user?.id) {
    service.currentUserId = user.id;
  }
  
  return service;
};
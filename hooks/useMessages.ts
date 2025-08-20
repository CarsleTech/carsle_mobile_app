import { useState, useEffect, useCallback } from 'react';
import { messageService } from '@/services/MessageService';

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  isEdited?: boolean;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
}

export const useMessages = (consultationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await messageService.getMessages(consultationId);
      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setSending(true);
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      consultationId,
      senderId: messageService.currentUserId,
      content: content.trim(),
      sentAt: new Date().toISOString(),
      isRead: false,
      messageType: 'TEXT',
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);

    try {
      const data = await messageService.sendMessage(consultationId, content.trim());
      
      if (data.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? data.data : msg
          )
        );
      } else {
        // Remove temp message on failure
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      throw error;
    } finally {
      setSending(false);
    }
  }, [consultationId]);

  const markAllAsRead = useCallback(async () => {
    try {
      await messageService.markAllAsRead(consultationId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [consultationId]);

  useEffect(() => {
    fetchMessages();
    markAllAsRead();
    
    // Set up polling for new messages (replace with WebSocket in production)
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages, markAllAsRead]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    refetch: fetchMessages,
    markAllAsRead,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { messageService } from '@/services/MessageService';

export interface Consultation {
  id: string;
  clientId: string;
  consultantId: string;
  topic: string;
  description: string;
  status: 'ACTIVE' | 'ENDED' | 'PENDING';
  startTime: string;
  endTime?: string;
  lastMessage?: {
    content: string;
    sentAt: string;
    senderId: string;
  };
  unreadCount: number;
  otherUser: {
    id: string;
    name: string;
    profileImage?: string;
    isOnline: boolean;
  };
}

export const useConsultations = (status?: 'active' | 'ended') => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const statusParam = status ? status.toUpperCase() : '';
      const data = await messageService.getUserConsultations(statusParam);
      
      if (data.success) {
        // Fetch unread counts for each consultation
        const consultationsWithCounts = await Promise.all(
          data.data.map(async (consultation: any) => {
            const unreadData = await messageService.getUnreadCount(consultation.id);
            
            return {
              ...consultation,
              unreadCount: unreadData.success ? unreadData.data.unreadCount : 0,
            };
          })
        );
        setConsultations(consultationsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  return {
    consultations,
    loading,
    refetch: fetchConsultations,
  };
};

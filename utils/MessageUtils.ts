export const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const formatChatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const shouldShowDateSeparator = (
  currentMessage: { sentAt: string },
  previousMessage?: { sentAt: string }
): boolean => {
  if (!previousMessage) return true;
  
  const currentDate = new Date(currentMessage.sentAt).toDateString();
  const previousDate = new Date(previousMessage.sentAt).toDateString();
  
  return currentDate !== previousDate;
};

export const generateConsultationId = (): string => {
  return `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// export { MessagesScreen, ChatRoomScreen, StartConsultationScreen, MessageSettingsScreen };
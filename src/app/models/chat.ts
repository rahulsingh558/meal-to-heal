export interface ChatMessage {
  id: number;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatContact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  role: 'customer_support' | 'delivery_support' | 'billing_support';
}

export interface QuickReply {
  id: number;
  text: string;
  icon?: string;
}
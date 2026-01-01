import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChatMessage, ChatContact, QuickReply } from '../models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject: BehaviorSubject<ChatMessage[]>;
  private contactsSubject: BehaviorSubject<ChatContact[]>;
  private unreadCountSubject: BehaviorSubject<number>;
  private isChatOpenSubject: BehaviorSubject<boolean>;
  private isBrowser = false;

  private storageKey = 'chatMessages';
  private contactsStorageKey = 'chatContacts';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Initialize with sample data
    let initialMessages: ChatMessage[] = [];
    let initialContacts: ChatContact[] = [];
    
    if (this.isBrowser) {
      const savedMessages = localStorage.getItem(this.storageKey);
      const savedContacts = localStorage.getItem(this.contactsStorageKey);
      
      initialMessages = savedMessages ? JSON.parse(savedMessages) : this.getSampleMessages();
      initialContacts = savedContacts ? JSON.parse(savedContacts) : this.getSampleContacts();
    } else {
      initialMessages = this.getSampleMessages();
      initialContacts = this.getSampleContacts();
    }
    
    this.messagesSubject = new BehaviorSubject<ChatMessage[]>(initialMessages);
    this.contactsSubject = new BehaviorSubject<ChatContact[]>(initialContacts);
    this.unreadCountSubject = new BehaviorSubject<number>(
      initialMessages.filter(m => !m.isRead && m.sender === 'agent').length
    );
    this.isChatOpenSubject = new BehaviorSubject<boolean>(false);
  }

  // Observables
  get messages$(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  get contacts$(): Observable<ChatContact[]> {
    return this.contactsSubject.asObservable();
  }

  get unreadCount$(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  get isChatOpen$(): Observable<boolean> {
    return this.isChatOpenSubject.asObservable();
  }

  // Get current values
  getMessages(): ChatMessage[] {
    return this.messagesSubject.getValue();
  }

  getUnreadCount(): number {
    return this.unreadCountSubject.getValue();
  }

  // Send message
  sendMessage(content: string): void {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      content,
      timestamp: new Date(),
      isRead: true
    };

    const currentMessages = this.getMessages();
    const updatedMessages = [...currentMessages, newMessage];
    
    this.updateMessages(updatedMessages);

    // Simulate agent response
    this.simulateAgentResponse();
  }

  // Send quick reply
  sendQuickReply(text: string): void {
    this.sendMessage(text);
  }

  // Toggle chat window
  toggleChat(): void {
    const currentState = this.isChatOpenSubject.getValue();
    this.isChatOpenSubject.next(!currentState);
    
    // Mark messages as read when opening chat
    if (!currentState) {
      this.markAllAsRead();
    }
  }

  // Open chat
  openChat(): void {
    this.isChatOpenSubject.next(true);
    this.markAllAsRead();
  }

  // Close chat
  closeChat(): void {
    this.isChatOpenSubject.next(false);
  }

  // Mark all messages as read
  markAllAsRead(): void {
    const messages = this.getMessages();
    const updatedMessages = messages.map(msg => ({
      ...msg,
      isRead: true
    }));
    
    this.updateMessages(updatedMessages);
    this.unreadCountSubject.next(0);
  }

  // Get quick replies
  getQuickReplies(): QuickReply[] {
    return [
      { id: 1, text: 'Track my order', icon: '🚚' },
      { id: 2, text: 'Cancel my order', icon: '❌' },
      { id: 3, text: 'Change delivery address', icon: '📍' },
      { id: 4, text: 'Payment issue', icon: '💳' },
      { id: 5, text: 'Refund status', icon: '💰' },
      { id: 6, text: 'Speak with an agent', icon: '👨‍💼' },
    ];
  }

  // Get common questions
  getCommonQuestions(): string[] {
    return [
      'How long will my delivery take?',
      'Can I modify my order?',
      'What are your delivery hours?',
      'Do you offer contactless delivery?',
      'How can I apply a coupon?',
    ];
  }

  // Simulate agent response
  private simulateAgentResponse(): void {
    setTimeout(() => {
      const responses = [
        "I'm checking that for you...",
        "Thanks for your message! Our team will get back to you shortly.",
        "I can help with that. Let me look into your order.",
        "Please share your order ID for faster assistance.",
        "Our delivery partner is on the way to your location.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'agent',
        content: randomResponse,
        timestamp: new Date(),
        isRead: this.isChatOpenSubject.getValue()
      };

      const currentMessages = this.getMessages();
      const updatedMessages = [...currentMessages, agentMessage];
      
      this.updateMessages(updatedMessages);
      
      // Update unread count if chat is closed
      if (!this.isChatOpenSubject.getValue()) {
        const unreadCount = updatedMessages.filter(m => !m.isRead && m.sender === 'agent').length;
        this.unreadCountSubject.next(unreadCount);
      }
    }, 1500);
  }

  // Update messages and save to localStorage
  private updateMessages(messages: ChatMessage[]): void {
    this.messagesSubject.next(messages);
    
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(messages));
    }
  }

  // Sample messages
  private getSampleMessages(): ChatMessage[] {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60000);
    
    return [
      {
        id: 1,
        sender: 'agent',
        content: 'Hello! Welcome to Meal to Heal support. How can I help you today?',
        timestamp: tenMinutesAgo,
        isRead: true
      },
      {
        id: 2,
        sender: 'user',
        content: 'Hi, I want to track my order #ORD-123456',
        timestamp: fiveMinutesAgo,
        isRead: true
      },
      {
        id: 3,
        sender: 'agent',
        content: 'Your order is being prepared and will be delivered in 25-30 minutes. You can track it from your orders page.',
        timestamp: now,
        isRead: false
      }
    ];
  }

  // Sample contacts
  private getSampleContacts(): ChatContact[] {
    const now = new Date();
    
    return [
      {
        id: 1,
        name: 'Customer Support',
        avatar: '👨‍💼',
        lastMessage: 'How can I help you today?',
        timestamp: new Date(now.getTime() - 5 * 60000),
        unreadCount: 0,
        isOnline: true,
        role: 'customer_support'
      },
      {
        id: 2,
        name: 'Delivery Support',
        avatar: '🚚',
        lastMessage: 'Your order is out for delivery',
        timestamp: new Date(now.getTime() - 30 * 60000),
        unreadCount: 1,
        isOnline: true,
        role: 'delivery_support'
      },
      {
        id: 3,
        name: 'Billing Support',
        avatar: '💰',
        lastMessage: 'Payment processed successfully',
        timestamp: new Date(now.getTime() - 120 * 60000),
        unreadCount: 0,
        isOnline: false,
        role: 'billing_support'
      }
    ];
  }
}
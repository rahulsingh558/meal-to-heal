import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { ChatMessage, QuickReply } from '../../models/chat';

@Component({
  standalone: true,
  selector: 'app-chat-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatWidgetComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;
  
  messages: ChatMessage[] = [];
  quickReplies: QuickReply[] = [];
  commonQuestions: string[] = [];
  newMessage = '';
  isChatOpen = false;
  unreadCount = 0;
  isTyping = false;
  selectedContact = 'Customer Support';
  showQuickReplies = true;
  
  private messagesSubscription!: Subscription;
  private chatOpenSubscription!: Subscription;
  private unreadSubscription!: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Subscribe to messages
    this.messagesSubscription = this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100);
    });

    // Subscribe to chat open state
    this.chatOpenSubscription = this.chatService.isChatOpen$.subscribe(isOpen => {
      this.isChatOpen = isOpen;
      if (isOpen) {
        setTimeout(() => {
          this.chatInput?.nativeElement?.focus();
        }, 300);
      }
    });

    // Subscribe to unread count
    this.unreadSubscription = this.chatService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });

    // Get quick replies and common questions
    this.quickReplies = this.chatService.getQuickReplies();
    this.commonQuestions = this.chatService.getCommonQuestions();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.chatOpenSubscription) {
      this.chatOpenSubscription.unsubscribe();
    }
    if (this.unreadSubscription) {
      this.unreadSubscription.unsubscribe();
    }
  }

  // Toggle chat window
  toggleChat(): void {
    this.chatService.toggleChat();
  }

  // Send message
  sendMessage(): void {
    const message = this.newMessage.trim();
    if (!message) return;

    this.chatService.sendMessage(message);
    this.newMessage = '';
    this.showQuickReplies = false;
    
    // Show typing indicator
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
    }, 1000);
  }

  // Send quick reply
  sendQuickReply(text: string): void {
    this.chatService.sendQuickReply(text);
    this.showQuickReplies = false;
  }

  // Send common question
  sendCommonQuestion(question: string): void {
    this.chatService.sendMessage(question);
    this.showQuickReplies = false;
  }

  // Format time
  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Check if message is from today
  isToday(date: Date): boolean {
    const today = new Date();
    const messageDate = new Date(date);
    return today.toDateString() === messageDate.toDateString();
  }

  // Scroll to bottom of messages
  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.messageContainer) {
          this.messageContainer.nativeElement.scrollTop = 
            this.messageContainer.nativeElement.scrollHeight;
        }
      }, 100);
    } catch(err) { }
  }

  // Handle Enter key - FIXED: Remove the event parameter since we don't use it
  @HostListener('document:keydown.enter')
  onEnterKey(): void {
    if (this.isChatOpen && this.newMessage.trim()) {
      this.sendMessage();
    }
  }

  // Handle Escape key - FIXED: Remove the event parameter since we don't use it
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isChatOpen) {
      this.chatService.closeChat();
    }
  }

  // Start new conversation
  startNewConversation(): void {
    // In a real app, this would reset chat context
    // For now, just show quick replies again
    this.showQuickReplies = true;
  }

  // Get today's date string
  getTodayDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Check if agent is online (simulate)
  isAgentOnline(): boolean {
    const hours = new Date().getHours();
    return hours >= 9 && hours < 21; // 9 AM to 9 PM
  }
}
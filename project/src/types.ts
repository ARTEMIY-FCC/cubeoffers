export interface Post {
  id: string;
  title: string;
  description: string;
  category: 'WTS' | 'WTB' | 'WTT' | 'Discussion';
  price?: number;
  location: string;
  author: string;
  contact: string;
  imageUrl?: string;
  createdAt: Date;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  joinedAt: Date;
  posts: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  postId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  postId: string;
  postTitle: string;
  participants: {
    buyer: { id: string; name: string };
    seller: { id: string; name: string };
  };
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  isActive: boolean;
}
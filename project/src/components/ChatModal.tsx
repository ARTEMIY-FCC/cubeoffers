import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, User, Clock } from 'lucide-react';
import { ChatConversation, ChatMessage, Post } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  currentUserId: string;
  currentUserName: string;
}

export default function ChatModal({ isOpen, onClose, post, currentUserId, currentUserName }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && post) {
      // Initialize or load conversation
      const existingConversation = loadConversation(post.id, currentUserId);
      setConversation(existingConversation);
    }
  }, [isOpen, post, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = (postId: string, userId: string): ChatConversation => {
    // In a real app, this would load from a database
    const conversationId = `${postId}-${userId}`;
    const existingData = localStorage.getItem(`chat-${conversationId}`);
    
    if (existingData) {
      const parsed = JSON.parse(existingData);
      return {
        ...parsed,
        messages: parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };
    }

    return {
      id: conversationId,
      postId,
      postTitle: post?.title || '',
      participants: {
        buyer: { id: userId, name: currentUserName },
        seller: { id: post?.author || '', name: post?.author || '' }
      },
      messages: [],
      isActive: true
    };
  };

  const saveConversation = (conv: ChatConversation) => {
    localStorage.setItem(`chat-${conv.id}`, JSON.stringify(conv));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversation || !post) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId: post.author === currentUserId ? conversation.participants.buyer.id : conversation.participants.seller.id,
      postId: post.id,
      message: message.trim(),
      timestamp: new Date(),
      isRead: false
    };

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastMessage: newMessage
    };

    setConversation(updatedConversation);
    saveConversation(updatedConversation);
    setMessage('');
  };

  if (!isOpen || !post) return null;

  const isCurrentUserSeller = post.author === currentUserName;
  const otherParticipant = isCurrentUserSeller 
    ? conversation?.participants.buyer 
    : conversation?.participants.seller;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Chat about: {post.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>
                  {isCurrentUserSeller ? 'Buyer' : 'Seller'}: {otherParticipant?.name || post.author}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Post Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-medium text-gray-900 truncate max-w-xs">
                  {post.title}
                </h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    post.category === 'WTS' ? 'bg-red-100 text-red-700' :
                    post.category === 'WTB' ? 'bg-blue-100 text-blue-700' :
                    post.category === 'WTT' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {post.category}
                  </span>
                  {post.price && <span className="font-semibold text-green-600">${post.price}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation?.messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
              <p className="text-gray-600">
                Send a message to {isCurrentUserSeller ? 'the buyer' : post.author} about this item.
              </p>
            </div>
          ) : (
            conversation?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.senderId === currentUserId
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <div className={`flex items-center space-x-1 mt-1 text-xs ${
                    msg.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${isCurrentUserSeller ? 'buyer' : post.author}...`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, User, X } from 'lucide-react';
import { ChatConversation } from '../types';

interface ChatListProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (conversation: ChatConversation) => void;
  currentUserId: string;
}

export default function ChatList({ isOpen, onClose, onSelectChat, currentUserId }: ChatListProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen, currentUserId]);

  const loadConversations = () => {
    // Load all conversations from localStorage
    const allConversations: ChatConversation[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('chat-')) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const conversation = JSON.parse(data);
            // Only include conversations where current user is a participant
            if (conversation.participants.buyer.id === currentUserId || 
                conversation.participants.seller.id === currentUserId) {
              allConversations.push({
                ...conversation,
                messages: conversation.messages.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                })),
                lastMessage: conversation.lastMessage ? {
                  ...conversation.lastMessage,
                  timestamp: new Date(conversation.lastMessage.timestamp)
                } : undefined
              });
            }
          }
        } catch (error) {
          console.error('Error parsing conversation:', error);
        }
      }
    }

    // Sort by last message timestamp
    allConversations.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp || new Date(0);
      const bTime = b.lastMessage?.timestamp || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });

    setConversations(allConversations);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Your Chats</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 text-sm px-4">
                Start chatting with sellers by clicking "Start Chat" on any post.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participants.buyer.id === currentUserId 
                  ? conversation.participants.seller 
                  : conversation.participants.buyer;
                
                const hasUnreadMessages = conversation.messages.some(
                  msg => !msg.isRead && msg.senderId !== currentUserId
                );

                return (
                  <button
                    key={conversation.id}
                    onClick={() => onSelectChat(conversation)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherParticipant.name}
                          </h3>
                          {hasUnreadMessages && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {conversation.postTitle}
                        </p>
                        {conversation.lastMessage && (
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage.message}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-400 ml-2">
                              <Clock className="h-3 w-3" />
                              <span>
                                {conversation.lastMessage.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
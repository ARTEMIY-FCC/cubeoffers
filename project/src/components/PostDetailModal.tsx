import React from 'react';
import { X, MapPin, Clock, Tag, DollarSign, MessageCircle } from 'lucide-react';
import { Post } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (post: Post) => void;
}

export default function PostDetailModal({ post, isOpen, onClose, onStartChat }: PostDetailModalProps) {
  if (!isOpen || !post) return null;

  const categoryColors = {
    WTS: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    WTB: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    WTT: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    Discussion: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  };

  const colors = categoryColors[post.category];
  const timeAgo = new Date(post.createdAt).toLocaleDateString();

  const handleStartChat = () => {
    onStartChat(post);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
              {post.category}
            </span>
            {post.price && (
              <div className="flex items-center space-x-1 text-green-600 font-semibold">
                <DollarSign className="h-5 w-5" />
                <span className="text-lg">${post.price}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {post.imageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-xl mb-6">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{post.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Posted on {timeAgo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>By</span>
                  <span className="font-medium text-gray-900">{post.author}</span>
                </div>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.description}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Seller</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Start a conversation with {post.author}</h3>
                    <p className="text-gray-600 text-sm">
                      Use our secure chat system to discuss details, negotiate prices, and arrange meetups.
                    </p>
                  </div>
                  <button 
                    onClick={handleStartChat}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Start Chat</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Safety Reminder</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Always use safe payment methods and meet in public places when possible. 
                    Be cautious of deals that seem too good to be true.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
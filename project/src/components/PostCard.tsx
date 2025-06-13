import React from 'react';
import { MapPin, Clock, Tag, DollarSign, MessageCircle } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const categoryColors = {
    WTS: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    WTB: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    WTT: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    Discussion: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  };

  const colors = categoryColors[post.category];
  const timeAgo = new Date(post.createdAt).toLocaleDateString();

  return (
    <div
      onClick={() => onClick(post)}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border border-gray-100"
    >
      {post.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-xl">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
            {post.category}
          </span>
          {post.price && (
            <div className="flex items-center space-x-1 text-green-600 font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>{post.price}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-blue-600">
            <MessageCircle className="h-4 w-4" />
            <span>Contact</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              By {post.author}
            </span>
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
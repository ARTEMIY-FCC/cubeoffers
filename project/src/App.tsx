import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import PostCard from './components/PostCard';
import CreatePostModal from './components/CreatePostModal';
import PostDetailModal from './components/PostDetailModal';
import ChatModal from './components/ChatModal';
import ChatList from './components/ChatList';
import { Post, ChatConversation } from './types';
import { mockPosts } from './data/mockData';

function App() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [chatPost, setChatPost] = useState<Post | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  // Mock current user - in a real app, this would come from authentication
  const currentUser = {
    id: 'user-123',
    name: 'CurrentUser'
  };

  // Filter posts based on category and search query
  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.location.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, activeCategory, searchQuery]);

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'createdAt'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPosts([post, ...posts]);
    setIsCreateModalOpen(false);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  const handleStartChat = (post: Post) => {
    setChatPost(post);
    setIsChatModalOpen(true);
  };

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setIsChatListOpen(false);
    // Find the post for this conversation
    const post = posts.find(p => p.id === conversation.postId);
    if (post) {
      setChatPost(post);
      setIsChatModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreatePost={() => setIsCreateModalOpen(true)}
        onOpenChats={() => setIsChatListOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CubeOffers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The ultimate marketplace for speedcubers. Buy, sell, trade cubes, and connect with the community through our integrated chat system.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-red-600">{posts.filter(p => p.category === 'WTS').length}</div>
            <div className="text-sm text-gray-600">For Sale</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600">{posts.filter(p => p.category === 'WTT').length}</div>
            <div className="text-sm text-gray-600">For Trade</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600">{posts.filter(p => p.category === 'Discussion').length}</div>
            <div className="text-sm text-gray-600">Discussions</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategory === 'all' ? 'All Posts' : 
                 activeCategory === 'WTS' ? 'Want to Sell' :
                 activeCategory === 'WTB' ? 'Want to Buy' :
                 activeCategory === 'WTT' ? 'Want to Trade' : 'Discussions'}
              </h2>
              <div className="text-sm text-gray-600">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 via-blue-400 to-green-400 rounded-lg opacity-50"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? `No posts match "${searchQuery}"` : 'No posts in this category yet'}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      <PostDetailModal
        post={selectedPost}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onStartChat={handleStartChat}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        post={chatPost}
        currentUserId={currentUser.id}
        currentUserName={currentUser.name}
      />

      <ChatList
        isOpen={isChatListOpen}
        onClose={() => setIsChatListOpen(false)}
        onSelectChat={handleSelectConversation}
        currentUserId={currentUser.id}
      />
    </div>
  );
}

export default App;
import React from 'react';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Posts', color: 'bg-gray-500' },
  { id: 'WTS', label: 'Want to Sell', color: 'bg-red-500' },
  { id: 'WTB', label: 'Want to Buy', color: 'bg-blue-500' },
  { id: 'WTT', label: 'Want to Trade', color: 'bg-green-500' },
  { id: 'Discussion', label: 'Discussion', color: 'bg-purple-500' }
];

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
              activeCategory === category.id
                ? 'bg-blue-50 border-2 border-blue-500 text-blue-900'
                : 'hover:bg-gray-50 border-2 border-transparent text-gray-700 hover:text-gray-900'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
            <span className="font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelect,
}) => {
  const categories = ['All', 'Medical', 'Disaster', 'Education', 'Environment'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category === 'All' ? '' : category)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            (category === 'All' ? !selectedCategory : category === selectedCategory)
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
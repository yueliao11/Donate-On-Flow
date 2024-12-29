import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SortSelectProps {
  value: string;
  onChange: (value: 'latest' | 'popular' | 'ending') => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'latest' | 'popular' | 'ending')}
        className="appearance-none w-full px-4 py-2 bg-white border border-gray-300 rounded-md pr-10"
      >
        <option value="latest">Latest</option>
        <option value="popular">Most Popular</option>
        <option value="ending">Ending Soon</option>
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  );
};
import React from 'react';
import { ShoppingBag, Coffee, Pizza, Utensils, Sandwich, Salad, IceCream, Fish } from 'lucide-react';
import { categories } from '../../data/mockData';

interface CategoryListProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
}

const CategoryList: React.FC<CategoryListProps> = ({ onSelectCategory, selectedCategory }) => {
  // Map for category icons
  const iconMap: Record<string, React.ReactNode> = {
    'ShoppingBag': <ShoppingBag className="w-6 h-6" />,
    'Coffee': <Coffee className="w-6 h-6" />,
    'Pizza': <Pizza className="w-6 h-6" />,
    'Utensils': <Utensils className="w-6 h-6" />,
    'Sandwich': <Sandwich className="w-6 h-6" />,
    'Salad': <Salad className="w-6 h-6" />,
    'IceCream': <IceCream className="w-6 h-6" />,
    'Fish': <Fish className="w-6 h-6" />
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-hide">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg transition-all ${
            selectedCategory === null 
              ? 'bg-orange-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Utensils className="w-6 h-6 mb-1" />
          <span className="text-sm">All</span>
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg transition-all ${
              selectedCategory === category.id 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {iconMap[category.icon]}
            <span className="text-sm mt-1">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
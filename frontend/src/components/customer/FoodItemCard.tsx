import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FoodItem } from '../../types';
import { useCart } from '../../context/CartContext';

interface FoodItemCardProps {
  item: FoodItem;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col md:flex-row">
      <div className="md:w-1/3 h-48 md:h-auto">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-600 mt-1">{item.description}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-semibold">${item.price.toFixed(2)}</div>
          
          {item.isAvailable ? (
            <div className="flex items-center">
              <div className="flex items-center border rounded-l-md overflow-hidden mr-2">
                <button 
                  onClick={decreaseQuantity}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 bg-white">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => addToCart(item, quantity)}
                className="bg-orange-500 text-white rounded-md px-4 py-2 hover:bg-orange-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <span className="text-red-500 font-medium">Currently Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link 
      to={`/restaurant/${restaurant.id}`}
      className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
    >
      <div className="relative h-48">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Currently Closed</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm">{restaurant.cuisineType}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-1" />
            <span className="text-gray-800 font-medium">{restaurant.rating}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{restaurant.estimatedDeliveryTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="text-sm">{restaurant.deliveryFee}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
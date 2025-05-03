import React from 'react';
import { MapPin, Navigation, DollarSign } from 'lucide-react';
import { Order } from '../../types';
import { restaurants } from '../../data/mockData';

interface AvailableOrderCardProps {
  order: Order;
  onAccept: (order: Order) => void;
  onDecline: (order: Order) => void;
}

const AvailableOrderCard: React.FC<AvailableOrderCardProps> = ({ 
  order, 
  onAccept, 
  onDecline 
}) => {
  const restaurant = restaurants.find(r => r.id === order.restaurantId);
  
  // In a real app, these would be calculated based on actual locations
  const distance = (Math.random() * 5 + 1).toFixed(1);
  const estimatedTime = Math.round(Number(distance) * 5);
  const deliveryFee = (Number(distance) * 0.5 + 2).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="font-semibold">{restaurant?.name}</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            ${deliveryFee}
          </span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Pickup from:</p>
              <p className="text-sm">{restaurant?.name}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Deliver to:</p>
              <p className="text-sm">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 text-sm">
          <div className="flex items-center">
            <Navigation className="w-4 h-4 text-gray-500 mr-1" />
            <span>{distance} miles</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
            <span>Total: ${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 divide-x border-t">
        <button 
          onClick={() => onDecline(order)}
          className="py-3 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Decline
        </button>
        <button 
          onClick={() => onAccept(order)}
          className="py-3 text-white bg-green-500 hover:bg-green-600 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default AvailableOrderCard;
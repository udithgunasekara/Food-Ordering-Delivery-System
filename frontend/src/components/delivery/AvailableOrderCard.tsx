import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, DollarSign, Clock } from 'lucide-react';
import { Order, OrderItem } from '../../types';
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
  const distance = (Math.random() * 5 + 1).toFixed(1);
  const deliveryFee = (Number(distance) * 0.5 + 2).toFixed(2);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    order.expiresAt ? Math.max(0, Math.floor((order.expiresAt - Date.now()) / 1000)) : null
  );

  useEffect(() => {
    if (!order.expiresAt) return;
    const interval = setInterval(() => {
      const secondsLeft = Math.max(0, Math.floor((order.expiresAt! - Date.now()) / 1000));
      setTimeLeft(secondsLeft);
      if (secondsLeft <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [order.expiresAt]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{restaurant?.name || 'Unknown Restaurant'}</h3>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-red-500">
              {timeLeft !== null ? `${timeLeft}s left` : 'No timeout'}
            </span>
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Pickup from:</p>
              <p className="text-sm">{restaurant?.name || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Deliver to:</p>
              <p className="text-sm">{order.deliveryAddress || 'Customer Address'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Items:</p>
            <ul className="text-sm">
              {order.items?.map((item: OrderItem) => (
                <li key={item.itemId}>
                  {item.name} x{item.quantity} - ${item.totalPrice.toFixed(2)}
                </li>
              )) || <li>No items listed</li>}
            </ul>
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

        <div className="mt-2 text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Fee: ${deliveryFee}
          </span>
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
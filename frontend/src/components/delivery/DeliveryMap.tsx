import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Order } from '../../types';
import { restaurants } from '../../data/mockData';

interface DeliveryMapProps {
  order: Order;
  currentStep: number;
  onUpdateStep: (step: number) => void;
}

const DeliveryMap: React.FC<DeliveryMapProps> = ({ order, currentStep, onUpdateStep }) => {
  const restaurant = restaurants.find(r => r.id === order.restaurantId);
  
  const steps = [
    { key: 'arrived-restaurant', label: 'Arrived at Restaurant' },
    { key: 'picked-up', label: 'Order Picked Up' },
    { key: 'arrived-customer', label: 'Arrived at Customer' },
    { key: 'delivered', label: 'Order Delivered' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Map Placeholder */}
      <div className="bg-gray-100 h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Navigation className="w-8 h-8 mx-auto mb-2" />
          <p>Interactive map would appear here</p>
          <p className="text-sm">Showing route to {currentStep < 2 ? restaurant?.name : order.deliveryAddress}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start space-x-4 mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {currentStep < 2 ? 'Pickup from:' : 'Deliver to:'}
            </p>
            <p className="font-medium">
              {currentStep < 2 ? restaurant?.name : order.deliveryAddress}
            </p>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        {currentStep < steps.length ? (
          <button 
            onClick={() => onUpdateStep(currentStep + 1)}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {steps[currentStep].label}
          </button>
        ) : (
          <div className="text-center text-green-500 font-semibold">
            Delivery completed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryMap;
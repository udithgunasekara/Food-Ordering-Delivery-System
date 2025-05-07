import React, { useEffect, useCallback } from 'react';
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

  const updateOrderStatus = useCallback(async () => {
    if (currentStep === steps.length - 1) {
      try {
        console.log('Updating order status to delivered for order:', order);
        const response = await fetch(`http://localhost:8080/api/order/update/${order.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...order,
            status: 'delivered'
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update order status');
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  }, [currentStep, order, steps.length]);

  useEffect(() => {
    // Call the API when order is delivered
    updateOrderStatus();
  }, [currentStep, updateOrderStatus]);

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css')
    ]).then(([L]) => {
      // Initialize the map
      const map = L.map('delivery-map').setView(
        [parseFloat(order.restaurantLatitude || '7.292115'), parseFloat(order.restaurantLongitude || '80.637551')],
        13
      );

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add restaurant marker
      L.marker([parseFloat(order.restaurantLatitude || '7.292115'), parseFloat(order.restaurantLongitude || '80.637551')])
        .addTo(map)
        .bindPopup(restaurant?.name || 'Restaurant')
        .openPopup();

      // Add customer marker
      L.marker([parseFloat(order.customerLatitude || '7.306230'), parseFloat(order.customerLongitude || '80.722139')])
        .addTo(map)
        .bindPopup('Customer Location');

      // Add polyline for route
      L.polyline([
        [parseFloat(order.restaurantLatitude || '7.292115'), parseFloat(order.restaurantLongitude || '80.637551')],
        [parseFloat(order.customerLatitude || '7.306230'), parseFloat(order.customerLongitude || '80.722139')]
      ], { color: 'blue' }).addTo(map);

      // Cleanup on unmount
      return () => {
        map.remove();
      };
    });
  }, [order, restaurant]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Map Container */}
      <div id="delivery-map" className="h-64"></div>
      
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
import React, { useState, useEffect } from 'react';
import { Check, Phone, MessageSquare } from 'lucide-react';
import { Order } from '../../types';

interface OrderTrackingProps {
  order: Order;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const [remainingTime, setRemainingTime] = useState<number>(30);
  const [currentStatus, setCurrentStatus] = useState<string>(order.status);

  // Status steps
  const steps = [
    { key: 'confirmed', label: 'Order Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out-for-delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  // Calculate progress based on current status
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStatus);
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex === -1) return 0;
    return (currentIndex / (steps.length - 1)) * 100;
  };

  // Simulate order progression
  useEffect(() => {
    if (['cancelled', 'delivered'].includes(currentStatus)) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          // Move to next status
          const currentIndex = getCurrentStepIndex();
          if (currentIndex < steps.length - 1) {
            setCurrentStatus(steps[currentIndex + 1].key);
            return 30; // Reset timer for next step
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStatus]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Order Tracking</h2>
      
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => {
            const isCompleted = getCurrentStepIndex() >= index;
            const isCurrent = getCurrentStepIndex() === index;
            
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-sm mt-1 ${isCurrent ? 'font-semibold' : ''}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Estimated Time */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">Estimated Time</p>
        <div className="text-3xl font-bold text-orange-500">
          {currentStatus === 'delivered' 
            ? 'Delivered!' 
            : `${remainingTime} minutes`}
        </div>
      </div>

      {/* Map Placeholder */}
      {currentStatus === 'out-for-delivery' && (
        <div className="mb-6 bg-gray-100 h-60 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Delivery tracking map would appear here</p>
        </div>
      )}
      
      {/* Contact Options */}
      {currentStatus !== 'delivered' && (
        <div className="flex justify-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
            <Phone className="w-5 h-5 mr-2" />
            Call
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            <MessageSquare className="w-5 h-5 mr-2" />
            Message
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
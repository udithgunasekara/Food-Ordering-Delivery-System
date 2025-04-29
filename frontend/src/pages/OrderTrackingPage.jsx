import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, CheckCircle, Truck, Package, Utensils, Home, Phone, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { mockOrders, mockDriverLocations } from '../data/orders';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState('');
  const [driverLocation, setDriverLocation] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // Fetch order data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockOrders.find(o => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Determine current step based on order status
        if (foundOrder.status === 'delivered') {
          setCurrentStep(4); // Delivered
        } else if (foundOrder.status === 'in_progress') {
          setCurrentStep(3); // On the way
          
          // Set ETA
          const etaDate = new Date(foundOrder.estimatedDelivery);
          setEta(etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          
          // Set initial driver location
          if (foundOrder.currentLocation) {
            setDriverLocation(foundOrder.currentLocation);
          }
        } else if (foundOrder.status === 'preparing') {
          setCurrentStep(1); // Confirmed & Preparing
        } else {
          setCurrentStep(0); // Order placed
        }
      }
      
      setLoading(false);
    }, 500);
  }, [orderId]);
  
  // Simulate driver location updates
  useEffect(() => {
    if (order && order.status === 'in_progress' && order.driver) {
      const driverId = order.driver.id;
      const locations = mockDriverLocations[driverId];
      
      if (locations && locations.length > 0) {
        let locationIndex = 0;
        
        const intervalId = setInterval(() => {
          if (locationIndex < locations.length) {
            setDriverLocation(locations[locationIndex]);
            locationIndex++;
          } else {
            // When all locations are exhausted, move to delivery step
            setCurrentStep(4);
            clearInterval(intervalId);
            setShowFeedback(true);
          }
        }, 5000); // Update every 5 seconds
        
        return () => clearInterval(intervalId);
      }
    }
  }, [order]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Render not found state
  if (!order) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <p className="mb-6 text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    );
  }
  
  // Order status steps
  const steps = [
    { label: 'Order Placed', icon: <Clock /> },
    { label: 'Preparing', icon: <Utensils /> },
    { label: 'Ready for Pickup', icon: <Package /> },
    { label: 'On the Way', icon: <Truck /> },
    { label: 'Delivered', icon: <Home /> }
  ];
  
  // Handle feedback submission
  const handleFeedback = (isPositive) => {
    // In a real app, this would send feedback to the server
    console.log(`Feedback submitted: ${isPositive ? 'positive' : 'negative'}`);
    setFeedbackSubmitted(true);
  };
  
  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600 mb-8">Order #{orderId}</p>
        
        {/* Order status timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary transform -translate-y-1/2 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
                    index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`mt-2 text-sm font-medium text-center ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order status details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                {currentStep === 4 ? 'Order Delivered' : 'Order Status'}
              </h2>
              
              {currentStep < 4 ? (
                <div>
                  <p className="mb-4">
                    {currentStep === 0 && 'Your order has been received and is being processed.'}
                    {currentStep === 1 && 'The restaurant is preparing your food.'}
                    {currentStep === 2 && 'Your food is ready and waiting for the driver.'}
                    {currentStep === 3 && (
                      <>Your food is on the way! Estimated delivery by <strong>{eta}</strong>.</>
                    )}
                  </p>
                  
                  {currentStep === 3 && order.driver && (
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-bold mb-3">Your Delivery Driver</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {order.driver.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{order.driver.name}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star size={14} className="text-yellow-400 mr-1" />
                              {order.driver.rating}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <a href={`tel:${order.driver.phone}`} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200">
                            <Phone size={18} />
                          </a>
                          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200">
                            <MessageSquare size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center text-green-600 mb-4">
                    <CheckCircle size={24} className="mr-2" />
                    <p className="font-medium">Your order has been delivered successfully!</p>
                  </div>
                  
                  {showFeedback && !feedbackSubmitted ? (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-bold mb-2">How was your delivery?</h3>
                      <p className="text-sm text-gray-600 mb-3">Let us know your experience with this delivery.</p>
                      <div className="flex space-x-3">
                        <button 
                          className="flex-1 py-2 border border-green-500 text-green-600 rounded-md flex items-center justify-center hover:bg-green-50"
                          onClick={() => handleFeedback(true)}
                        >
                          <ThumbsUp size={18} className="mr-2" />
                          Good
                        </button>
                        <button 
                          className="flex-1 py-2 border border-red-500 text-red-600 rounded-md flex items-center justify-center hover:bg-red-50"
                          onClick={() => handleFeedback(false)}
                        >
                          <ThumbsDown size={18} className="mr-2" />
                          Bad
                        </button>
                      </div>
                    </div>
                  ) : feedbackSubmitted && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      Thank you for your feedback!
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-6">
                    <Link to="/restaurants" className="btn btn-primary">
                      Order Again
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              
              <div className="mb-4">
                <div className="text-gray-600 mb-2">From {order.restaurantId}</div>
                <div className="text-sm text-gray-600 mb-4">{order.items.length} item{order.items.length !== 1 && 's'}</div>
                
                <div className="space-y-3 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                        {item.options && item.options.length > 0 && (
                          <ul className="ml-6 text-sm text-gray-600">
                            {item.options.map((option, idx) => (
                              <li key={idx}>
                                {option.name}: {option.choice} 
                                {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip</span>
                  <span>${order.tip.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Delivery Address</h3>
                <address className="not-italic text-gray-600">
                  {order.deliveryAddress.street}<br />
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Star = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default OrderTrackingPage;
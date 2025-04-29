import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { CreditCard, Plus, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

// Mock Stripe Elements
const StripeElements = ({ onSubmit, isProcessing }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formattedValue);
  };
  
  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      const formattedValue = value.length > 2 
        ? `${value.slice(0, 2)}/${value.slice(2)}`
        : value;
      setExpiryDate(formattedValue);
    }
  };
  
  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvc(value);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-2">Card Number</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className="input pl-10"
            maxLength="19"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-2">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            className="input"
            maxLength="5"
            required
          />
        </div>
        <div>
          <label htmlFor="cvc" className="block text-gray-700 font-medium mb-2">CVC</label>
          <input
            type="text"
            id="cvc"
            value={cvc}
            onChange={handleCvcChange}
            placeholder="123"
            className="input"
            maxLength="3"
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name on Card</label>
        <input
          type="text"
          id="name"
          placeholder="John Doe"
          className="input"
          required
        />
      </div>
      
      <button
        type="submit"
        className={`btn btn-primary w-full ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { cart, restaurant, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [savedCards, setSavedCards] = useState(user?.paymentMethods || []);
  const [selectedCard, setSelectedCard] = useState(savedCards.find(card => card.isDefault)?.id || '');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  
  // Calculate totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.09; // 9% tax rate
  const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
  const tip = 10; // Assuming default tip of $10
  const total = subtotal + tax + deliveryFee + tip;
  
  // Redirect to home if cart is empty
  useEffect(() => {
    if (!cart.length) {
      navigate('/');
    }
  }, [cart, navigate]);
  
  // Handle card selection
  const handleCardChange = (e) => {
    setSelectedCard(e.target.value);
    setShowNewCardForm(false);
  };
  
  // Handle new card toggle
  const handleNewCardToggle = () => {
    setShowNewCardForm(true);
    setSelectedCard('');
  };
  
  // Process payment
  const processPayment = () => {
    setError('');
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate to simulate real-world failures
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        // Generate a random order ID
        const newOrderId = `order-${Math.random().toString(36).substr(2, 9)}`;
        setOrderId(newOrderId);
        
        // Clear cart
        clearCart();
        
        // Navigate to tracking page
        navigate(`/track/${newOrderId}`);
      } else {
        setError('Payment failed. Please try again or use a different payment method.');
        setIsProcessing(false);
      }
    }, 2000);
  };
  
  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <button 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          onClick={() => navigate('/order')}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Order
        </button>
        
        <h1 className="text-3xl font-bold mb-8">Payment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Payment methods */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
              
              {savedCards.length > 0 && !showNewCardForm && (
                <div className="mb-6">
                  <div className="space-y-3 mb-4">
                    {savedCards.map(card => (
                      <label 
                        key={card.id} 
                        className={`border rounded-lg p-4 flex items-start cursor-pointer transition-colors ${selectedCard === card.id ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="card"
                          value={card.id}
                          checked={selectedCard === card.id}
                          onChange={handleCardChange}
                          className="mt-1 text-primary focus:ring-primary"
                        />
                        <div className="ml-3">
                          <div className="flex items-center mb-1">
                            <CreditCard size={20} className="mr-2 text-gray-500" />
                            <span className="font-medium">•••• •••• •••• {card.lastFour}</span>
                            {card.isDefault && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Expires {card.expiryMonth}/{card.expiryYear}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  <button 
                    className="text-primary hover:underline flex items-center"
                    onClick={handleNewCardToggle}
                  >
                    <Plus size={16} className="mr-1" />
                    Add new card
                  </button>
                </div>
              )}
              
              {(showNewCardForm || savedCards.length === 0) && (
                <div>
                  <h3 className="font-medium mb-4">Enter Card Details</h3>
                  <StripeElements 
                    onSubmit={processPayment}
                    isProcessing={isProcessing}
                  />
                  
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      className="text-primary focus:ring-primary rounded"
                    />
                    <label htmlFor="saveCard" className="ml-2 text-sm text-gray-600">
                      Save this card for future payments
                    </label>
                  </div>
                </div>
              )}
              
              {selectedCard && !showNewCardForm && (
                <button
                  className={`btn btn-primary w-full mt-6 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={processPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              )}
              
              <div className="flex items-center justify-center mt-6 text-sm text-gray-600">
                <Lock size={14} className="mr-1" />
                <span>Secure payment processed by Stripe</span>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="mb-4">
                <div className="text-gray-600 mb-2">From {restaurant?.name}</div>
                <div className="text-sm text-gray-600 mb-4">{cart.length} item{cart.length !== 1 && 's'}</div>
                
                <div className="max-h-48 overflow-y-auto mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between mb-2">
                      <div>
                        <span className="font-medium">{item.quantity}x</span> {item.name}
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (9%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip</span>
                  <span>${tip.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
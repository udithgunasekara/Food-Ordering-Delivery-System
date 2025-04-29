import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Trash2, Plus, Minus, ChevronRight, MapPin, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, restaurant, updateQuantity, removeItem, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0]?.id || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [tipAmount, setTipAmount] = useState(10);
  const [customTip, setCustomTip] = useState('');
  const [isUsingCustomTip, setIsUsingCustomTip] = useState(false);
  
  // Calculate totals
  const subtotal = getCartTotal();
  const tax = subtotal * 0.09; // 9% tax rate
  const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
  const tip = isUsingCustomTip ? (parseFloat(customTip) || 0) : tipAmount;
  const total = subtotal + tax + deliveryFee + tip;
  
  // Handle tip selection
  const handleTipSelection = (amount) => {
    setTipAmount(amount);
    setIsUsingCustomTip(false);
  };
  
  // Handle custom tip input
  const handleCustomTipChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomTip(value);
      setIsUsingCustomTip(true);
    }
  };
  
  // Handle address selection
  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };
  
  // Handle order notes change
  const handleOrderNotesChange = (e) => {
    setOrderNotes(e.target.value);
  };
  
  // Proceed to payment
  const proceedToPayment = () => {
    // For a real app, we would save the order details to state or context
    // For now, just navigate to the payment page
    navigate('/payment');
  };
  
  // Check if cart is empty
  if (cart.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6 text-gray-600">Add some delicious items from our restaurants!</p>
        <button onClick={() => navigate('/restaurants')} className="btn btn-primary">
          Browse Restaurants
        </button>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Order</h2>
              <span className="text-gray-600">From {restaurant?.name}</span>
            </div>
            
            <div className="divide-y">
              {cart.map(item => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-grow mb-3 sm:mb-0">
                    <div className="flex justify-between sm:block">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="sm:hidden font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    {item.options && item.options.length > 0 && (
                      <ul className="mt-1 text-sm text-gray-600">
                        {item.options.map((option, idx) => (
                          <li key={idx}>
                            {option.name}: {option.choice} 
                            {option.price > 0 && ` (+$${option.price.toFixed(2)})`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between sm:w-auto sm:justify-end">
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-3 min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="ml-6 flex items-center">
                      <span className="hidden sm:inline font-medium mr-4">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add more items link */}
            <div className="mt-6 text-center">
              <button
                className="text-primary hover:underline flex items-center justify-center mx-auto"
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              >
                Add more items <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Delivery address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            
            {user?.addresses && user.addresses.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {user.addresses.map(address => (
                    <label 
                      key={address.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddress === address.id ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={handleAddressChange}
                          className="mt-1 text-primary focus:ring-primary"
                        />
                        <div className="ml-3">
                          <div className="flex items-center mb-1">
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>{address.street}</div>
                            <div>{address.city}, {address.state} {address.zipCode}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <button className="text-primary hover:underline flex items-center">
                  <Plus size={16} className="mr-1" />
                  Add new address
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin size={24} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No addresses found</h3>
                <p className="text-gray-600 mb-4">Add a delivery address to continue</p>
                <button className="btn btn-primary">
                  Add Address
                </button>
              </div>
            )}
          </div>
          
          {/* Order notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Special Instructions</h2>
            <textarea
              className="input h-24 resize-none"
              placeholder="Add any special instructions for your order or delivery (optional)"
              value={orderNotes}
              onChange={handleOrderNotesChange}
            ></textarea>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
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
              <div className="flex justify-between font-medium">
                <span>Tip</span>
                <span>${tip.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Tip selection */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Add a tip for your delivery driver</p>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[0, 5, 10, 15].map(amount => (
                  <button
                    key={amount}
                    className={`py-2 px-3 rounded-md text-sm font-medium ${tipAmount === amount && !isUsingCustomTip ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => handleTipSelection(amount)}
                  >
                    {amount === 0 ? 'No Tip' : `$${amount}`}
                  </button>
                ))}
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Custom:</span>
                <div className="relative flex-grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    className={`input pl-7 ${isUsingCustomTip ? 'border-primary' : ''}`}
                    placeholder="Enter amount"
                    value={customTip}
                    onChange={handleCustomTipChange}
                    onClick={() => setIsUsingCustomTip(true)}
                  />
                </div>
              </div>
            </div>
            
            {/* Total */}
            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment button */}
            <button
              className="btn btn-primary w-full"
              onClick={proceedToPayment}
            >
              <CreditCard size={20} className="mr-2" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
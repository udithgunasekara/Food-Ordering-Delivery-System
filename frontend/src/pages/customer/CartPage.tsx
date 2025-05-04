// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
// import Header from '../../components/common/Header';
// import Footer from '../../components/common/Footer';
// import PaymentForm from '../../components/customer/PaymentForm';
// import { useCart } from '../../context/CartContext';

// const CartPage: React.FC = () => {
//   const { 
//     cartItems, 
//     updateQuantity, 
//     removeFromCart, 
//     cartSubtotal,
//     deliveryFee,
//     tax,
//     cartTotal,
//     clearCart
//   } = useCart();
//   const [deliveryAddress, setDeliveryAddress] = useState('');
//   const [customerEmail, setCustomerEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [countryCode, setCountryCode] = useState('+94'); // Default Sri Lanka
//   const [showPayment, setShowPayment] = useState(false);
//   const navigate = useNavigate();

//   // List of country codes (simplified for example)
//   const countryCodes = [
//     { code: '+94', name: 'Sri Lanka' },
//     { code: '+1', name: 'United States' },
//     { code: '+44', name: 'United Kingdom' },
//     { code: '+91', name: 'India' },
//     { code: '+61', name: 'Australia' },
//   ];

//   const handlePaymentSuccess = (paymentResponse: any) => {
//     console.log('Payment successful!', paymentResponse);
//     console.log('Payment details:', {
//       id: paymentResponse.id,
//       status: paymentResponse.status,
//       amount: paymentResponse.amount / 100,
//       created: new Date(paymentResponse.created * 1000).toLocaleString()
//     });
    
//     //alert(`Payment successful! Order placed. Payment ID: ${paymentResponse.id}`);
//     clearCart();
//     navigate('/orders');
//   };

//   const handlePaymentError = (error: string) => {
//     //alert(`Payment failed: ${error}`);
//   };

//   const handleProceedToPayment = () => {
//     if (!deliveryAddress.trim()) {
//       //alert('Please enter a delivery address');
//       return;
//     }
//     if (!customerEmail.trim()) {
//       //alert('Please enter an email address');
//       return;
//     }
//     if (!phoneNumber.trim()) {
//       //alert('Please enter a phone number');
//       return;
//     }
//     // Basic phone number validation (numeric and minimum length)
//     if (!/^\d{7,}$/.test(phoneNumber.replace(/\D/g, ''))) {
//       //alert('Please enter a valid phone number');
//       return;
//     }
//     setShowPayment(true);
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
      
//       <main className="flex-grow pt-24 pb-12">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center mb-6">
//             <Link to="/" className="text-orange-500 hover:text-orange-600 transition-colors">
//               <ArrowLeft className="w-5 h-5" />
//             </Link>
//             <h1 className="text-2xl font-bold ml-4">Your Cart</h1>
//           </div>
          
//           {cartItems.length > 0 ? (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Cart Items */}
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
                  
//                   <div className="divide-y">
//                     {cartItems.map((cartItem) => (
//                       <div 
//                         key={cartItem.item.id} 
//                         className="py-4 flex items-center"
//                       >
//                         <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
//                           <img 
//                             src={cartItem.item.imageUrl}
//                             alt={cartItem.item.name}
//                             className="h-full w-full object-cover"
//                           />
//                         </div>
                        
//                         <div className="ml-4 flex-1">
//                           <h3 className="font-medium">{cartItem.item.name}</h3>
//                           <p className="text-gray-500 text-sm">${cartItem.item.price.toFixed(2)}</p>
                          
//                           {cartItem.customizations && cartItem.customizations.length > 0 && (
//                             <div className="mt-1">
//                               <p className="text-xs text-gray-500">
//                                 {cartItem.customizations.map(c => c.choiceName).join(', ')}
//                               </p>
//                             </div>
//                           )}
//                         </div>
                        
//                         <div className="flex items-center">
//                           <button 
//                             onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
//                             className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                           >
//                             <Minus className="w-4 h-4" />
//                           </button>
//                           <span className="mx-3">{cartItem.quantity}</span>
//                           <button 
//                             onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
//                             className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                           >
//                             <Plus className="w-4 h-4" />
//                           </button>
//                         </div>
                        
//                         <button 
//                           onClick={() => removeFromCart(cartItem.item.id)}
//                           className="ml-4 text-red-500 hover:text-red-600 transition-colors"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Order Summary */}
//               <div>
//                 <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
//                   <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
//                   <div className="space-y-3 mb-6">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Subtotal</span>
//                       <span>${cartSubtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Delivery Fee</span>
//                       <span>${deliveryFee.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Tax</span>
//                       <span>${tax.toFixed(2)}</span>
//                     </div>
//                     <div className="border-t pt-3 flex justify-between font-semibold">
//                       <span>Total</span>
//                       <span>${cartTotal.toFixed(2)}</span>
//                     </div>
//                   </div>
                  
//                   {!showPayment ? (
//                     <>
//                       <div className="mb-4">
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                           Email Address
//                         </label>
//                         <input
//                           id="email"
//                           type="email"
//                           value={customerEmail}
//                           onChange={(e) => setCustomerEmail(e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                           placeholder="Enter your email address"
//                           required
//                         />
//                       </div>
                      
//                       <div className="mb-4">
//                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                           Phone Number
//                         </label>
//                         <div className="flex">
//                           <select
//                             value={countryCode}
//                             onChange={(e) => setCountryCode(e.target.value)}
//                             className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                           >
//                             {countryCodes.map(({ code, name }) => (
//                               <option key={code} value={code}>
//                                 {code} ({name})
//                               </option>
//                             ))}
//                           </select>
//                           <input
//                             id="phone"
//                             type="tel"
//                             value={phoneNumber}
//                             onChange={(e) => setPhoneNumber(e.target.value)}
//                             className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                             placeholder="Enter your phone number"
//                             required
//                           />
//                         </div>
//                       </div>
                      
//                       <div className="mb-6">
//                         <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                           Delivery Address
//                         </label>
//                         <textarea
//                           id="address"
//                           value={deliveryAddress}
//                           onChange={(e) => setDeliveryAddress(e.target.value)}
//                           rows={3}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//                           placeholder="Enter your delivery address"
//                           required
//                         />
//                       </div>
                      
//                       <button 
//                         onClick={handleProceedToPayment}
//                         disabled={!deliveryAddress.trim() || !customerEmail.trim() || !phoneNumber.trim()}
//                         className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                       >
//                         Proceed to Payment
//                       </button>
//                     </>
//                   ) : (
//                     <div>
//                       <div className="mb-4 p-3 bg-gray-50 rounded-md">
//                         <h3 className="font-medium text-sm mb-1">Delivery Information</h3>
//                         <p className="text-sm text-gray-600">{deliveryAddress}</p>
//                         <p className="text-sm text-gray-600 mt-1">{customerEmail}</p>
//                         <p className="text-sm text-gray-600 mt-1">{countryCode}{phoneNumber}</p>
//                       </div>
                      
//                       <PaymentForm
//                         amount={cartTotal}
//                         onSuccess={handlePaymentSuccess}
//                         onError={handlePaymentError}
//                         deliveryAddress={deliveryAddress}
//                         customerEmail={customerEmail}
//                         customerPhone={`${countryCode}${phoneNumber}`}
//                       />
                      
//                       <button 
//                         onClick={() => setShowPayment(false)}
//                         className="w-full mt-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                       >
//                         Back to Delivery Information
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center">
//               <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
//               <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
//               <Link 
//                 to="/"
//                 className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
//               >
//                 Browse Restaurants
//               </Link>
//             </div>
//           )}
//         </div>
//       </main>
      
//       <Footer />
//     </div>
//   );
// };

// export default CartPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PaymentForm from '../../components/customer/PaymentForm';
import { useCart } from '../../context/CartContext';

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal,
    deliveryFee,
    tax,
    cartTotal,
    clearCart
  } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+94');
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const countryCodes = [
    { code: '+94', name: 'Sri Lanka' },
    { code: '+1', name: 'United States' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+91', name: 'India' },
    { code: '+61', name: 'Australia' },
  ];

  const handlePaymentSuccess = (paymentResponse: any) => {
    console.log('Payment successful!', paymentResponse);
    console.log('Payment details:', {
      id: paymentResponse.id,
      status: paymentResponse.status,
      amount: paymentResponse.amount / 100,
      created: new Date(paymentResponse.created * 1000).toLocaleString()
    });

    clearCart();
    navigate('/orders');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
  };

  const handleProceedToPayment = () => {
    if (!deliveryAddress.trim() || !customerEmail.trim() || !phoneNumber.trim()) {
      return;
    }
  
    const orderData = {
      customerId: "CUS-12345", // Replace with actual ID if available
      restaurantId: "REST-98765", // Replace with actual restaurant ID
      items: cartItems.map(cartItem => ({
        itemId: cartItem.item.id,
        name: cartItem.item.name,
        quantity: cartItem.quantity,
        price: cartItem.item.price,
        totalPrice: cartItem.item.price * cartItem.quantity
      })),
      totalPrice: cartTotal
    };
  
    localStorage.setItem('orderData', JSON.stringify(orderData));
    console.log("Saved to localStorage:", orderData);
  
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-orange-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold ml-4">Your Cart</h1>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
                  <div className="divide-y">
                    {cartItems.map((cartItem) => (
                      <div key={cartItem.item.id} className="py-4 flex items-center">
                        <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                          <img 
                            src={cartItem.item.imageUrl}
                            alt={cartItem.item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{cartItem.item.name}</h3>
                          <p className="text-gray-500 text-sm">${cartItem.item.price.toFixed(2)}</p>
                          {cartItem.customizations && cartItem.customizations.length > 0 && (
                            <div className="mt-1">
                              <p className="text-xs text-gray-500">
                                {cartItem.customizations.map(c => c.choiceName).join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="mx-3">{cartItem.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {!showPayment ? (
                    <>
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="flex">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {countryCodes.map(({ code, name }) => (
                              <option key={code} value={code}>
                                {code} ({name})
                              </option>
                            ))}
                          </select>
                          <input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Delivery Address
                        </label>
                        <textarea
                          id="address"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter your delivery address"
                          required
                        />
                      </div>

                      <button 
                        onClick={handleProceedToPayment}
                        disabled={!deliveryAddress.trim() || !customerEmail.trim() || !phoneNumber.trim()}
                        className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Proceed to Payment
                      </button>
                    </>
                  ) : (
                    <div>
                      <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <h3 className="font-medium text-sm mb-1">Delivery Information</h3>
                        <p className="text-sm text-gray-600">{deliveryAddress}</p>
                        <p className="text-sm text-gray-600 mt-1">{customerEmail}</p>
                        <p className="text-sm text-gray-600 mt-1">{countryCode}{phoneNumber}</p>
                      </div>

                      <PaymentForm
                        amount={cartTotal}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        deliveryAddress={deliveryAddress}
                        customerEmail={customerEmail}
                        customerPhone={`${countryCode}${phoneNumber}`}
                      />

                      <button 
                        onClick={() => setShowPayment(false)}
                        className="w-full mt-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Back to Delivery Information
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link 
                to="/"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Browse Restaurants
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;

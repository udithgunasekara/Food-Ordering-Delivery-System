import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedRestaurant = localStorage.getItem('cartRestaurant');
    
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    
    if (storedRestaurant) {
      setRestaurant(JSON.parse(storedRestaurant));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartRestaurant');
    }
  }, [cart]);
  
  // Save restaurant to localStorage whenever it changes
  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
    }
  }, [restaurant]);
  
  // Add item to cart
  const addItem = (restaurantData, item) => {
    // If cart is empty or from the same restaurant
    if (cart.length === 0 || restaurant.id === restaurantData.id) {
      // Set current restaurant if not set
      if (!restaurant) {
        setRestaurant(restaurantData);
      }
      
      // Check if item already exists in cart
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        // Item doesn't exist, add with quantity = 1
        setCart([...cart, { ...item, quantity: 1 }]);
      }
      
      return { success: true };
    } else {
      // Show error if attempting to add from different restaurant
      return { success: false, message: 'Items in your cart are from another restaurant. Would you like to clear your cart and add this item instead?' };
    }
  };
  
  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    
    // Clear restaurant data if cart becomes empty
    if (updatedCart.length === 0) {
      setRestaurant(null);
    }
  };
  
  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
  };
  
  // Calculate cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  
  // Get total number of items in cart
  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    setRestaurant(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurant');
  };
  
  // Replace cart (for switching restaurants)
  const replaceCart = (restaurantData, item) => {
    clearCart();
    setRestaurant(restaurantData);
    setCart([{ ...item, quantity: 1 }]);
    return { success: true };
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      restaurant,
      addItem,
      removeItem,
      updateQuantity,
      getCartTotal,
      getItemCount,
      clearCart,
      replaceCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
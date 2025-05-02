import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: FoodItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  deliveryFee: number;
  tax: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(2.99);
  const [tax, setTax] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.item.price * item.quantity);
    }, 0);
    
    setCartSubtotal(subtotal);
    setTax(subtotal * 0.1); // Assuming 10% tax
    setCartTotal(subtotal + deliveryFee + (subtotal * 0.1));
  }, [cartItems, deliveryFee]);

  const addToCart = (item: FoodItem, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.item.id === item.id);

    if (existingItemIndex >= 0) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { item, quantity }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCartItems = cartItems.map(item => 
      item.item.id === itemId ? { ...item, quantity } : item
    );
    
    setCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartSubtotal,
        deliveryFee,
        tax
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
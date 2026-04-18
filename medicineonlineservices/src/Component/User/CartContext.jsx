

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Helper: Current User ID nikalne ke liye
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.userId : "guest";
  };

  // ✅ 1. Lazy Initialization: Refresh par yahan se data wapas aata hai
  const [cartItems, setCartItems] = useState(() => {
    const userId = getUserId();
    const savedCart = localStorage.getItem(`cart_${userId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedAddress, setSelectedAddress] = useState(null);

  // ✅ 2. Persistence: Jab bhi cartItems badle, use LocalStorage mein save karo
  useEffect(() => {
    const userId = getUserId();
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ 3. Sync Logic: Login ke waqt naye user ka data load karne ke liye
  const syncUserCart = () => {
    const userId = getUserId();
    const savedCart = localStorage.getItem(`cart_${userId}`);
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: amount } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ 4. Logout cleanup logic
  const clearCartState = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, 
      syncUserCart, clearCartState, selectedAddress, setSelectedAddress 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
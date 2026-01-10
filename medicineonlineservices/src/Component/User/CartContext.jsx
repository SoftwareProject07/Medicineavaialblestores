import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (medicine) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.cartId === medicine.cartId
      );

      if (existing) {
        // ✅ SAME MEDICINE → quantity increase
        return prev.map((item) =>
          item.cartId === medicine.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // ✅ NEW MEDICINE
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartId !== cartId)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item
  const addToCart = (item) => {
    setCartItems((prev) => {
      const exist = prev.find((i) => i.cartId === item.cartId);

      if (exist) {
        return prev.map((i) =>
          i.cartId === item.cartId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (cartId, qty) => {
    if (qty < 1) return;

    setCartItems((prev) =>
      prev.map((i) =>
        i.cartId === cartId
          ? {
              ...i,
              quantity: qty,
              totalPrice: qty * i.unitPrice
            }
          : i
      )
    );
  };

  // Remove item
  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

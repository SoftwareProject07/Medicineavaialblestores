
// import React, { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   // ✅ load cart from localStorage
//   const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem("cartItems");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // ✅ save cart on every change
//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // ✅ add to cart (quantity support)
//   const addToCart = (item) => {
//     setCartItems((prev) => {
//       const exists = prev.find((p) => p.cartId === item.cartId);

//       if (exists) {
//         return prev.map((p) =>
//           p.cartId === item.cartId
//             ? { ...p, quantity: p.quantity + 1 }
//             : p
//         );
//       }

//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   // ✅ remove single item
//   const removeFromCart = (cartId) => {
//     setCartItems((prev) =>
//       prev.filter((item) => item.cartId !== cartId)
//     );
//   };

//   // ✅ clear cart
//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("cartItems");
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);



import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const userKey = user?.email ? `cart_${user.email}` : "cart_guest";

  // ✅ load user-wise cart
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(userKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ✅ save cart per user
  useEffect(() => {
    if (userKey) {
      localStorage.setItem(userKey, JSON.stringify(cartItems));
    }
  }, [cartItems, userKey]);

  // ✅ add to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p.cartId === item.cartId);

      if (exists) {
        return prev.map((p) =>
          p.cartId === item.cartId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ✅ remove item
  const removeFromCart = (cartId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.cartId !== cartId)
    );
  };

  // ✅ clear cart (on logout)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(userKey);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // ✅ 1. Unique Key per User (e.g., cart_shivam12@gmail.com)
//   const getUserKey = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user?.email ? `cart_${user.email}` : "cart_guest";
//   };

//   // ✅ 2. Login change hone par data load karne ka function
//   const syncUserCart = useCallback(() => {
//     const key = getUserKey();
//     const savedCart = localStorage.getItem(key);
//     setCartItems(savedCart ? JSON.parse(savedCart) : []);
//   }, []);

//   useEffect(() => {
//     syncUserCart();
//     window.addEventListener("storage", syncUserCart);
//     return () => window.removeEventListener("storage", syncUserCart);
//   }, [syncUserCart]);

//   const addToCart = (item) => {
//     setCartItems((prev) => {
//       const exists = prev.find((p) => p.id === item.id);
//       let updated;
//       if (exists) {
//         updated = prev.map((p) => p.id === item.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p);
//       } else {
//         updated = [...prev, { ...item, quantity: 1 }];
//       }
//       localStorage.setItem(getUserKey(), JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const updateQuantity = (id, quantity) => {
//     setCartItems((prev) => {
//       const updated = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
//       localStorage.setItem(getUserKey(), JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => {
//       const updated = prev.filter((item) => item.id !== id);
//       localStorage.setItem(getUserKey(), JSON.stringify(updated));
//       return updated;
//     });
//   };

//   const clearCartOnSwitch = () => setCartItems([]);

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCartOnSwitch, syncUserCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);





//  2
// CartContext.js
// import React, { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   // 1. Initial State: Refresh hone par LocalStorage se data uthayein
//   const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem("myCartItems");
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   const [selectedAddress, setSelectedAddress] = useState(null);

//   // 2. Persistence: Jab bhi cartItems change ho, use LocalStorage mein save karein
//   useEffect(() => {
//     localStorage.setItem("myCartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Login ke waqt cart sync karne ke liye empty function (taki login error na de)
//   const syncUserCart = () => {
//     // Agar backend se cart lana hai toh yahan logic aayega
//     console.log("Cart synced with local storage");
//   };

//   const addToCart = (product) => {
//     setCartItems((prev) => {
//       const existing = prev.find((item) => item.id === product.id);
//       if (existing) {
//         return prev.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       }
//       return [...prev, { ...product, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (id, amount) => {
//     setCartItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, amount) } : item))
//     );
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // Logout ke waqt cart khali karne ke liye
//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("myCartItems");
//   };

//   return (
//     <CartContext.Provider value={{ 
//       cartItems, addToCart, removeFromCart, updateQuantity, 
//       selectedAddress, setSelectedAddress, syncUserCart, clearCart 
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);



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


// // import React, { createContext, useContext, useState, useEffect } from "react";

// // const CartContext = createContext();

// // export const CartProvider = ({ children }) => {
// //   // Helper: Current User ID nikalne ke liye
// //   const getUserId = () => {
// //     const user = JSON.parse(localStorage.getItem("user"));
// //     return user ? user.userId : "guest";
// //   };

// //   // ✅ 1. Lazy Initialization: Refresh par yahan se data wapas aata hai
// //   const [cartItems, setCartItems] = useState(() => {
// //     const userId = getUserId();
// //     const savedCart = localStorage.getItem(`cart_${userId}`);
// //     return savedCart ? JSON.parse(savedCart) : [];
// //   });

// //   //orderstatus code==
  

// //   const [selectedAddress, setSelectedAddress] = useState(null);

// //   // ✅ 2. Persistence: Jab bhi cartItems badle, use LocalStorage mein save karo
// //   useEffect(() => {
// //     const userId = getUserId();
// //     localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
// //   }, [cartItems]);

// //   // ✅ 3. Sync Logic: Login ke waqt naye user ka data load karne ke liye
// //   const syncUserCart = () => {
// //     const userId = getUserId();
// //     const savedCart = localStorage.getItem(`cart_${userId}`);
// //     setCartItems(savedCart ? JSON.parse(savedCart) : []);
// //   };

// //   const addToCart = (product) => {
// //     setCartItems((prev) => {
// //       const existing = prev.find((item) => item.id === product.id);
// //       if (existing) {
// //         return prev.map((item) =>
// //           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
// //         );
// //       }
// //       return [...prev, { ...product, quantity: 1 }];
// //     });
// //   };

// //   const updateQuantity = (id, amount) => {
// //     setCartItems((prev) =>
// //       prev.map((item) => (item.id === id ? { ...item, quantity: amount } : item))
// //     );
// //   };

// //   const removeFromCart = (id) => {
// //     setCartItems((prev) => prev.filter((item) => item.id !== id));
// //   };

// //   // ✅ 4. Logout cleanup logic
// //   const clearCartState = () => {
// //     setCartItems([]);
// //   };

// //   return (
// //     <CartContext.Provider value={{ 
// //       cartItems, addToCart, removeFromCart, updateQuantity, 
// //       syncUserCart, clearCartState, selectedAddress, setSelectedAddress 
// //     }}>
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => useContext(CartContext);




// import React, { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   // Helper: Current User ID nikalne ke liye
//   const getUserId = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     return user ? user.userId : "guest";
//   };

//   // ✅ 1. Lazy Initialization: Refresh par yahan se data wapas aata hai
//   const [cartItems, setCartItems] = useState(() => {
//     const userId = getUserId();
//     const savedCart = localStorage.getItem(`cart_${userId}`);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   //orderstatus code==
  

//   const [selectedAddress, setSelectedAddress] = useState(null);

//   // ✅ 2. Persistence: Jab bhi cartItems badle, use LocalStorage mein save karo
//   useEffect(() => {
//     const userId = getUserId();
//     localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
//   }, [cartItems]);

//   // ✅ 3. Sync Logic: Login ke waqt naye user ka data load karne ke liye
//   const syncUserCart = () => {
//     const userId = getUserId();
//     const savedCart = localStorage.getItem(`cart_${userId}`);
//     setCartItems(savedCart ? JSON.parse(savedCart) : []);
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
//       prev.map((item) => (item.id === id ? { ...item, quantity: amount } : item))
//     );
//   };

//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // ✅ 4. Logout cleanup logic
//   const clearCartState = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider value={{ 
//       cartItems, addToCart, removeFromCart, updateQuantity, 
//       syncUserCart, clearCartState, selectedAddress, setSelectedAddress 
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

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const oldQuantity = item.quantity || 1;
          const diff = newQuantity - oldQuantity; // Difference nikalne ke liye

          // Stock update in localStorage
          const savedStock = localStorage.getItem("med_stocks");
          if (savedStock) {
            const stockMap = JSON.parse(savedStock);
            const key = item.id || item.name;
            if (stockMap[key] !== undefined) {
              // Agar quantity kam hui hai toh stock badhega, zyada hui hai toh kam hoga
              stockMap[key] -= diff;
              localStorage.setItem("med_stocks", JSON.stringify(stockMap));
            }
          }

          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      
      if (itemToRemove) {
        // Stock wapas increase karne ka logic
        const savedStock = localStorage.getItem("med_stocks");
        if (savedStock) {
          const stockMap = JSON.parse(savedStock);
          const key = itemToRemove.id || itemToRemove.name;
          const qtyInCart = itemToRemove.quantity || 1;

          if (stockMap[key] !== undefined) {
            stockMap[key] += qtyInCart; // Stock me quantity wapas add ho jayegi
          } else {
            stockMap[key] = qtyInCart;
          }
          localStorage.setItem("med_stocks", JSON.stringify(stockMap));
        }
      }

      return prev.filter((item) => item.id !== id);
    });
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
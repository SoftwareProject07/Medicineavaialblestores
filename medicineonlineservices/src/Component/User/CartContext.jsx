// // import React, { createContext, useContext, useEffect, useState } from "react";

// // const CartContext = createContext();

// // export const CartProvider = ({ children }) => {
// //   const [cartItems, setCartItems] = useState([]);

// //   // 🔹 Load cart from localStorage
// //   useEffect(() => {
// //     const storedCart = localStorage.getItem("cart");
// //     if (storedCart) {
// //       setCartItems(JSON.parse(storedCart));
// //     }
// //   }, []);

// //   // 🔹 Save cart to localStorage
// //   useEffect(() => {
// //     localStorage.setItem("cart", JSON.stringify(cartItems));
// //   }, [cartItems]);

// //   // 🔹 ADD TO CART (SAFE)
// //   const addToCart = (medicine) => {
// //     if (!medicine) return;

// //     const id =
// //       medicine.MedicineId ??
// //       medicine.id ??
// //       medicine._id ??
// //       medicine.medicineId;

// //     if (!id) {
// //       console.error("❌ Medicine ID missing", medicine);
// //       return;
// //     }

// //     setCartItems((prev) => {
// //       const existing = prev.find((item) => item.id === id);

// //       if (existing) {
// //         return prev.map((item) =>
// //           item.id === id ? { ...item, qty: item.qty + 1 } : item
// //         );
// //       }

// //       return [
// //         ...prev,
// //         {
// //           id,
// //           name: medicine.MedicineName || medicine.name,
// //           price: medicine.Price || medicine.price,
// //           qty: 1,
// //         },
// //       ];
// //     });
// //   };

// //   // 🔹 REMOVE
// //   const removeFromCart = (id) => {
// //     setCartItems((prev) => prev.filter((item) => item.id !== id));
// //   };

// //   // 🔹 CLEAR
// //   const clearCart = () => {
// //     setCartItems([]);
// //     localStorage.removeItem("cart");
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{ cartItems, addToCart, removeFromCart, clearCart }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };

// // export const useCart = () => useContext(CartContext);
// import React, { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user ? user.id : "guest";

//   const STORAGE_KEY = `cart_${userId}`;

//   const [cartItems, setCartItems] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     return saved ? JSON.parse(saved) : [];
//   });

//   // 🔐 Save cart user-wise
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
//   }, [cartItems, STORAGE_KEY]);

//   // ➕ ADD TO CART
//   const addToCart = (item) => {
//     setCartItems((prev) => {
//       const existing = prev.find(p => p.cartId === item.cartId);

//       if (existing) {
//         return prev.map(p =>
//           p.cartId === item.cartId
//             ? { ...p, quantity: p.quantity + 1 }
//             : p
//         );
//       }

//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   // ➖ REMOVE
//   const removeFromCart = (id) => {
//     setCartItems(prev => prev.filter(item => item.cartId !== id));
//   };

//   // ❌ CLEAR (on logout if needed)
//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem(STORAGE_KEY);
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);




// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useAuth } from "./AuthContext";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { user } = useAuth(); // ✅ REACTIVE USER
//   const userEmail = user?.email;
//   const cartKey = userEmail ? `cart_${userEmail}` : null;

//   const [cartItems, setCartItems] = useState([]);

//   // ✅ USER CHANGE → LOAD CORRECT CART
//   useEffect(() => {
//     if (!cartKey) {
//       setCartItems([]);
//       return;
//     }

//     const storedCart = localStorage.getItem(cartKey);
//     setCartItems(storedCart ? JSON.parse(storedCart) : []);
//   }, [cartKey]);

//   // ✅ SAVE CART
//   useEffect(() => {
//     if (cartKey) {
//       localStorage.setItem(cartKey, JSON.stringify(cartItems));
//     }
//   }, [cartItems, cartKey]);

//   const addToCart = (medicine) => {
//     setCartItems((prev) => {
//       const found = prev.find(i => i.cartId === medicine.cartId);
//       if (found) {
//         return prev.map(i =>
//           i.cartId === medicine.cartId
//             ? { ...i, quantity: i.quantity + 1 }
//             : i
//         );
//       }
//       return [...prev, { ...medicine, quantity: 1 }];
//     });
//   };

//   const clearCart = () => {
//     if (cartKey) localStorage.removeItem(cartKey);
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  // 🔑 USER BASED KEY
  const cartKey = user?.email ? `cart_${user.email}` : null;

  const [cartItems, setCartItems] = useState([]);

  // 🔹 Load cart WHEN USER CHANGES
  useEffect(() => {
    if (!cartKey) {
      setCartItems([]);
      return;
    }

    const stored = localStorage.getItem(cartKey);
    setCartItems(stored ? JSON.parse(stored) : []);
  }, [cartKey]);

  // 🔹 Save cart USER-WISE
  useEffect(() => {
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i._id === item._id);

      if (exists) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (cartKey) localStorage.removeItem(cartKey);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

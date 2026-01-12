// import React, { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // 🔹 Load cart from localStorage
//   useEffect(() => {
//     const storedCart = localStorage.getItem("cart");
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, []);

//   // 🔹 Save cart to localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // 🔹 ADD TO CART (SAFE)
//   const addToCart = (medicine) => {
//     if (!medicine) return;

//     const id =
//       medicine.MedicineId ??
//       medicine.id ??
//       medicine._id ??
//       medicine.medicineId;

//     if (!id) {
//       console.error("❌ Medicine ID missing", medicine);
//       return;
//     }

//     setCartItems((prev) => {
//       const existing = prev.find((item) => item.id === id);

//       if (existing) {
//         return prev.map((item) =>
//           item.id === id ? { ...item, qty: item.qty + 1 } : item
//         );
//       }

//       return [
//         ...prev,
//         {
//           id,
//           name: medicine.MedicineName || medicine.name,
//           price: medicine.Price || medicine.price,
//           qty: 1,
//         },
//       ];
//     });
//   };

//   // 🔹 REMOVE
//   const removeFromCart = (id) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // 🔹 CLEAR
//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("cart");
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : "guest";

  const STORAGE_KEY = `cart_${userId}`;

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 🔐 Save cart user-wise
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, STORAGE_KEY]);

  // ➕ ADD TO CART
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find(p => p.cartId === item.cartId);

      if (existing) {
        return prev.map(p =>
          p.cartId === item.cartId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ➖ REMOVE
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.cartId !== id));
  };

  // ❌ CLEAR (on logout if needed)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

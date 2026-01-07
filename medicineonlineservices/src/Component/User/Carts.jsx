import React from "react";
import { useCart } from "./CartContext";
import CartItem from "./CartItem";
// import CartItem from "./CartItem"; // ✅ FIXED PATH

export default function Carts() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // ✅ Grand Total Calculation
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Cart</h3>

      {/* Empty Cart */}
      {cartItems.length === 0 && (
        <p className="text-muted">Cart is empty</p>
      )}

      {/* Cart Items */}
      {cartItems.map((item) => (
        <carts
          key={item.id}
          item={item}
          onUpdate={updateQuantity}
          onRemove={removeFromCart}
        />
      ))}

      {/* Grand Total */}
      {cartItems.length > 0 && (
        <h4 className="text-end mt-3">
          Grand Total: ₹{grandTotal}
        </h4>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
//import CartItem from "./CartItem";

export default function Carts() {
  const [cart, setCart] = useState([]);
  const userId = 1;

  const BASE_URL = "https://localhost:5001/api/cart";

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const res = await axios.get(`${BASE_URL}/${userId}`);
    setCart(res.data);
  };

  const handleUpdate = async (cartId, quantity) => {
    if (quantity <= 0) return;

    await axios.put(`${BASE_URL}/update`, {
      cartId,
      quantity
    });

    loadCart();
  };

  const handleRemove = async (cartId) => {
    await axios.delete(`${BASE_URL}/remove/${cartId}`);
    loadCart();
  };

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  return (
    <div style={{ width: "60%", margin: "auto" }}>
      <h2>🛒 My Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => (
        <CartItem
          key={item.cartId}
          item={item}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
        />
      ))}

      <hr />
      <h3>Grand Total: ₹{grandTotal}</h3>
    </div>
  );
}

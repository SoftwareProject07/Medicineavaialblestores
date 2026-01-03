
import React from 'react'


export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div style={styles.card}>
      {/* Direct API Image URL */}
      <img
        src={item.imageUrl}
        alt={item.medicineName}
        width="80"
      />

      <div style={{ flex: 1 }}>
        <h4>{item.medicineName}</h4>
        <p>Unit Price: ₹{item.unitPrice}</p>
        <p>Discount: ₹{item.discount}</p>

        <div>
          <button onClick={() => onUpdate(item.cartId, item.quantity - 1)}>
            -
          </button>

          <span style={{ margin: "0 10px" }}>{item.quantity}</span>

          <button onClick={() => onUpdate(item.cartId, item.quantity + 1)}>
            +
          </button>
        </div>

        <b>Total: ₹{item.totalPrice}</b>
      </div>

      <button
        onClick={() => onRemove(item.cartId)}
        style={styles.remove}
      >
        ❌
      </button>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    padding: 15,
    border: "1px solid #ddd",
    marginBottom: 10
  },
  remove: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  }
};

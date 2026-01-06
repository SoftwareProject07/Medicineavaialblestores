export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div style={{ display: "flex", marginBottom: 10 }}>
      <img src={item.imageUrl} width="80" />

      <div style={{ flex: 1, marginLeft: 10 }}>
        <h5>{item.medicineName}</h5>
        <p>₹{item.unitPrice}</p>

        <button onClick={() => onUpdate(item.cartId, item.quantity - 1)}>
          -
        </button>
        <span style={{ margin: "0 10px" }}>{item.quantity}</span>
        <button onClick={() => onUpdate(item.cartId, item.quantity + 1)}>
          +
        </button>

        <p>Total: ₹{item.totalPrice}</p>
      </div>

      <button onClick={() => onRemove(item.cartId)}>❌</button>
    </div>
  );
}

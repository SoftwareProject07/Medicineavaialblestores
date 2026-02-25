import React from "react";

export default function CartItem({ item, handleQuantity, remove }) {
  return (
    <tr className="align-middle">
      <td className="fw-bold">{item.medicineName}</td>
      <td>₹{item.unitPrice}</td>
      <td>
        <div className="d-flex align-items-center border rounded-pill p-1 bg-light" style={{ width: "fit-content" }}>
          {/* Minus Button */}
          <button 
            className="btn btn-sm btn-white rounded-circle shadow-sm border fw-bold" 
            style={{ width: "28px", height: "28px" }}
            onClick={() => handleQuantity(item.cartId, item.quantity, -1)}
            disabled={item.quantity <= 1}
          > - </button>

          <span className="mx-3 fw-bold">{item.quantity}</span>

          {/* Plus Button */}
          <button 
            className="btn btn-sm btn-white rounded-circle shadow-sm border fw-bold" 
            style={{ width: "28px", height: "28px" }}
            onClick={() => handleQuantity(item.cartId, item.quantity, 1)}
          > + </button>
        </div>
      </td>
      <td className="fw-bold text-dark">₹{(item.unitPrice * item.quantity).toFixed(2)}</td>
      
      <td>
        {/* Soft Delete Button */}
        <button 
          className="btn btn-sm btn-danger px-3 rounded-pill shadow-sm" 
          onClick={() => remove(item.cartId)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}



// CartItem.jsx
// import React from 'react';

// const CartItem = ({ item, removeFromCart, updateQuantity }) => {
//   return (
//     // Aapka existing JSX code...
//     <tr>
//       <td>{item.name}</td>
//       {/* ... rest of the code */}
//     </tr>
//   );
// };

// // YEH LINE MISSING HO SAKTI HAI:
// export default CartItem;
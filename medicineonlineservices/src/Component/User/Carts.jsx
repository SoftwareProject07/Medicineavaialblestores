// import React from "react";
// import { useCart } from "./CartContext";
// import CartItem from "./CartItem";
// // import CartItem from "./CartItem"; // ✅ FIXED PATH

// export default function Carts() {
//   const { cartItems, updateQuantity, removeFromCart } = useCart();

//   // ✅ Grand Total Calculation
//   const grandTotal = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="container mt-4">
//       <h3 className="mb-3">My Cart</h3>

//       {/* Empty Cart */}
//       {cartItems.length === 0 && (
//         <p className="text-muted">Cart is empty</p>
//       )}

//       {/* Cart Items */}
//       {cartItems.map((item) => (
//         <carts
//           key={item.id}
//           item={item}
//           onUpdate={updateQuantity}
//           onRemove={removeFromCart}
//         />
//       ))}

//       {/* Grand Total */}
//       {cartItems.length > 0 && (
//         <h4 className="text-end mt-3">
//           Grand Total: ₹{grandTotal}
//         </h4>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import "../styles/dashboardsprofiles.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [openDashboard, setOpenDashboard] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="app-container">
      {/* ============ SIDEBAR (SAME AS DASHBOARD) ============ */}
      <div className="sidebar">
        <div className="brand">
                    <Link to="/dashboards">
          
          <img src="/AKMedizostore.png" alt="logo" width="45" /></Link>
          <span>
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </span>
        </div>

        <ul>
          <li className="menu-group">
            <button
              className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard <span>{openDashboard ? "▾" : "▸"}</span>
            </button>

            {openDashboard && (
              <ul className="submenu">
                <li><Link to="/medication-tracker">Medication Tracker</Link></li>
                <li><Link to="/test-reports">Test Reports</Link></li>
                <li><Link to="/health-history">Health History</Link></li>
                <li><Link to="/monthly-progress">Monthly Progress</Link></li>
                <li><Link to="/prescriptions">Prescriptions</Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/support">Help & Support</Link></li>
                <li><Link to="/settings">Settings</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/medicinedisplay" className="btn btn-success mb-2">
              Medicines
            </Link>
          </li>

          <li>
            <Link to="/carts" className="btn btn-success mb-2">
              Medicine Cart
            </Link>
          </li>

          <li>
            <Link to="/customerdetails" className="btn btn-success mb-2">
              Patient Details
            </Link>
          </li>

          <li>
            <Link to="/header">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </Link>
          </li>
        </ul>
      </div>

      {/* ============ MAIN CONTENT (CART) ============ */}
      <div className="main-content">
        <h2>Medicine Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="table-container">
            <table className="med-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cartId}>
                    <td>{item.medicineName}</td>
                    <td>₹{item.unitPrice}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        style={{ width: "60px" }}
                        onChange={(e) =>
                          updateQuantity(item.cartId, +e.target.value)
                        }
                      />
                    </td>
                    <td>₹{item.unitPrice * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.cartId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 className="mt-3">Total Amount: ₹{totalAmount}</h4>

            <Link to="/customerdetails" className="btn btn-primary mt-2">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

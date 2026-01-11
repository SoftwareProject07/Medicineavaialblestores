import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import "../styles/dashboardsprofiles.css";

export default function MedicineDisplay() {
  const { addToCart, cartItems } = useCart();
  const [openDashboard, setOpenDashboard] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ TOTAL CART QUANTITY (IMPORTANT)
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const meds = [
    {
      cartId: 1,
      medicineName: "Paracetamol",
      unitPrice: 20,
      discount: 0,
      imageUrl: "https://via.placeholder.com/100",
    },
    {
      cartId: 2,
      medicineName: "Vitamin C",
      unitPrice: 50,
      discount: 5,
      imageUrl: "https://via.placeholder.com/100",
    },
  ];

  return (
    <div className="app-container">
      {/* ============ SIDEBAR ============ */}
      <div className="sidebar">
        <div className="brand">
          <img src="/AKMedizostore.png" alt="logo" width="45" />
          <span>
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </span>
        </div>

        <ul>
          <li>
            <button
              className="btn btn-success mb-2 w-100"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard {openDashboard ? "▾" : "▸"}
            </button>

            {openDashboard && (
              <ul className="submenu">
                <li><Link to="/history">History</Link></li>
                <li><Link to="/settings">Settings</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/medicinedisplay" className="btn btn-success mb-2">
              Medicines
            </Link>
          </li>

          {/* 🛒 CART COUNT FIXED */}
          <li>
            <Link
              to="/carts"
              className="btn btn-success mb-2 d-flex justify-content-between align-items-center"
            >
              <span>Medicine Cart</span>
              {totalQuantity > 0 && (
                <span
                  style={{
                    background: "red",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: "2px 8px",
                    fontSize: "12px",
                  }}
                >
                  {totalQuantity}
                </span>
              )}
            </Link>
          </li>

          {/* <li>
            <Link to="/customerdetails" className="btn btn-success mb-2">
              Patient Details
            </Link>
          </li> */}

          <li>
            <Link to="/header">Logout</Link>
          </li>
        </ul>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="main-content">
        <h2>Available Medicines</h2>

        <div className="cards">
          {meds.map((med) => (
            <div className="card blue" key={med.cartId}>
              <img src={med.imageUrl} alt={med.medicineName} />

              <h5>{med.medicineName}</h5>
              <p>₹{med.unitPrice}</p>

              {med.discount > 0 && (
                <p className="text-success">Discount ₹{med.discount}</p>
              )}

              <button
                className="btn btn-light"
                onClick={() => addToCart(med)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

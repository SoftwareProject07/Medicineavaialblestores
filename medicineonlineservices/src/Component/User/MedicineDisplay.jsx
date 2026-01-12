import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import "../styles/dashboardsprofiles.css";
// import { useCart } from "../Component/User/CartContext";

export default function MedicineDisplay() {
  const { addToCart, cartItems } = useCart();
  const [openDashboard, setOpenDashboard] = useState(false);
  const [user, setUser] = useState(null);
// const { addToCart } = useCart();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ TOTAL CART QUANTITY
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
         <Link to="/dashboards"  >
           <img src="/AKMedizostore.png" alt="logo" width="55" /></Link>

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

          {/* <li>
            <Link to="/medicinedisplay" className="btn btn-success mb-2">
              Medicines
            </Link>
          </li> */}

          {/* 🛒 CART */}
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

          <li>OrdersPayment</li>
          <li>CustomerTracking</li>
          <li>OrderStatus</li>
          <li>Customer Profile</li>

          <li>
            <Link to="/header">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </Link>
          </li>
        </ul>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="main-content">
        <header>
          <div className="header-right">
            <span className="nav-icon">🔔</span>
            <span className="nav-icon">⚙️</span>
          </div>
        </header>

        {/* <h2>
          Welcome back, {user ? `${user.firstName} ${user.lastName}` : "User"}
        </h2> */}

        <h2 className="mt-3">Available Medicines</h2>

        <div className="cards">
          {meds.map((med) => (
            <div className="card blue" key={med.cartId}>
              <img src={med.imageUrl} alt={med.medicineName} />

              <h5>{med.medicineName}</h5>
              <p>₹{med.unitPrice}</p>

              {med.discount > 0 && (
                <p className="text-success">
                  Discount ₹{med.discount}
                </p>
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

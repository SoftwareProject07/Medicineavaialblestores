import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useCart } from "../User/CartContext";

import "../styles/dashboardsprofiles.css";

/* ---------- SAMPLE DATA ---------- */
const weightData = [
  { date: "May 01", weight: 180 },
  { date: "May 10", weight: 178 },
  { date: "May 20", weight: 176 },
  { date: "Jun 01", weight: 175 }
];

const glucoseData = [
  { day: "Yesterday", value: 185 },
  { day: "2 Days Ago", value: 105 },
  { day: "Last Week", value: 115 },
  { day: "Today", value: 110 }
];

const bpData = [
  { label: "Normal", value: 40 },
  { label: "Elevated", value: 25 },
  { label: "High", value: 35 }
];

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];
// Customer Side  Dashboard.jsx

export default function Dashboard(userId) { // customer dashboard
  const { cartItems } = useCart(); // ✅ CART ITEMS

  const [openDashboard, setOpenDashboard] = useState(false);
  const[openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [medications, setMedications] = useState([]);
  const [user, setUser] = useState(null);

  /* ---------- LOAD USER ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------- LOAD MEDICATIONS ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("medications");
    if (saved) {
      setMedications(JSON.parse(saved));
    } else {
      setMedications([
        {
          id: 1,
          name: "Kefalur 500mg",
          frequency: "8 hour",
          dosage: "1 Tablet",
          taken: true,
          meal: "After",
          nextDose: "8:00 AM",
          status: "On Time"
        }
      ]);
    }
  }, []);

  /* ---------- CART COUNT ---------- */
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="app-container">
      {/* ---------- SIDEBAR ---------- */}
<div className="sidebar">
  <div className="brand">
    <Link to="/dashboards">
      <img src="/AKMedizostore.png" alt="logo" width="55" />
    </Link>
    <span className="user-name">
      {user ? `${user.firstName} ${user.lastName}` : "User"}
    </span>
  </div>

  <ul className="sidebar-menu">
    {/* DASHBOARD DROPDOWN */}
    <li className="menu-group">
      <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenDashboard(!openDashboard)}>
        <div className="btn-content">
          <i className="fas fa-th-large"></i> Dashboard
        </div>
        <span>{openDashboard ? "▾" : "▸"}</span>
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

    {/* MASTER UPDATE DROPDOWN */}
    <li className="menu-group">
      <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
        <div className="btn-content">
          <i className="fas fa-edit"></i> Master Update
        </div>
        <span>{openMasterUpdate ? "▾" : "▸"}</span>
      </button>
      {openMasterUpdate && (
        <ul className="submenu">
          <li>
            <Link to="/deliveryaddress">
              <i className="fas fa-map-marker-alt"></i> Delivery Address
            </Link>
          </li>
              <li>
                      <Link to="/CompletePayments" className="sidebar-btn active-btn">
                        <div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div>
                      </Link>
                    </li>
                           <li>
                            <Link to="/">
                              <i className="fas fa-map-marker-alt"></i> Refund Order Amount
                            </Link>
                          </li>
        </ul>
      )}
    </li>

    {/* SINGLE BUTTONS */}
    <li>
      <Link to="/medicinedisplay" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-capsules"></i> Medicines</div>
      </Link>
    </li>

    <li>
      <Link to="/carts" className="sidebar-btn">
        <div className="btn-content">
          <i className="fas fa-shopping-cart"></i> My Cart
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </div>
      </Link>
    </li>

    {/* <li>
      <Link to="/CompletePayments" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div>
      </Link>
    </li> */}
      <li>
      <Link to="/orders" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i>OrderStatus</div>
      </Link>
    </li>
  

    <li>
      <Link to="/profile" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-user"></i> Customer Profile</div>
      </Link>
    </li>

    <li className="logout-item">
      <Link to="/header" className="sidebar-btn logout">
        <div className="btn-content"><i className="fas fa-sign-out-alt"></i> Log Out</div>
      </Link>
    </li>
  </ul>
</div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="main-content">
        <header>
          <div className="header-right">
            {user?.photo && (
              <img
                src={
                  `https://ecommerencesite.onrender.com/api/uploads/${user.photo}`
                 // `http://localhost:5256/apiuploads/${user.photo}`
                }
                alt="Profile"
                className="nav-user-photo"
              />
            )}
            <span className="nav-icon">🔔</span>
            <span className="nav-icon">⚙️</span>
          </div>
        </header>

        <h2>
          Welcome back, {user ? `${user.firstName} ${user.lastName}` : "User"}
        </h2>

        {/* ---------- DASHBOARD CARDS ---------- */}
        <div className="cards">
          <div className="card blue">Medication Tracker</div>
          <div className="card green">Test Reports</div>
          <div className="card pink">Health History</div>
          <div className="card purple">Monthly Progress</div>
        </div>

        {/* ---------- CHARTS ---------- */}
        <div className="reports">
          <div className="box">
            <h4>Blood Glucose</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={glucoseData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="box">
            <h4>Weight Progress</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weightData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="box">
            <h4>Blood Pressure Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bpData} dataKey="value" outerRadius={80} label>
                  {bpData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------- CART MEDICINES TABLE ---------- */}
        <div className="table-container">
          <h3>Medicines in Cart</h3>

          {cartItems.length === 0 ? (
            <p>No medicines added to cart</p>
          ) : (
            <table className="med-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cartId}>
                    <td>{item.name}</td>
                    <td>₹{item.unitPrice}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
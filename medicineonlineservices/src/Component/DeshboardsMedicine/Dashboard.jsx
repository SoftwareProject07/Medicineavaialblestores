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

export default function Dashboard() {
  const { cartItems } = useCart();

  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [medications, setMedications] = useState([]);
  const [user, setUser] = useState(null);

  /* ---------- NOTIFICATION STATES ---------- */
  const [notifications, setNotifications] = useState([]);
  const [showNotifBox, setShowNotifBox] = useState(false);

  /* ---------- LOAD USER ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------- NOTIFICATION LOGIC ---------- */
  useEffect(() => {
    const checkNotifs = () => {
      // Admin side uses 'customer_notifications' as the key
      const data = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
      setNotifications(data);
    };

    checkNotifs();
    // Poll for new notifications every 3 seconds
    const interval = setInterval(checkNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotifClick = () => {
    setShowNotifBox(!showNotifBox);
    // When opening the box, mark all as read
    if (!showNotifBox && notifications.length > 0) {
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      localStorage.setItem('customer_notifications', JSON.stringify(updated));
      setNotifications(updated);
    }
  };

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

  return (
    <div className="app-container">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar">
        <div className="brand">
          <Link to="/dashboards">
            <img src="/AKMedizostore.png" alt="logo" width="55" />
          </Link>
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

          <li className="menu-group">
            <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
              <div className="btn-content">
                <i className="fas fa-edit"></i> Master Update
              </div>
              <span>{openMasterUpdate ? "▾" : "▸"}</span>
            </button>
            {openMasterUpdate && (
              <ul className="submenu">
                <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt"></i> Delivery Address</Link></li>
                <li><Link to="/CompletePayments" className="sidebar-btn active-btn"><i className="fas fa-credit-card"></i> Order Payment</Link></li>
                <li><Link to="/"><i className="fas fa-map-marker-alt"></i> Refund Order Amount</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/medicinedisplay" className="btn btn-success mb-2">Medicines</Link></li>

          <li>
            <Link to="/carts" className="nav-link">
              <i className="fas fa-shopping-cart me-2"></i> My Cart
              {cartItems.length > 0 && (
                <span className="cart-count badge bg-danger rounded-pill ms-2">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </li>

          <li><Link to="/orders" className="btn btn-success mb-2">OrderStatus</Link></li>
          <li><Link to="/feedbackcustomers" className="btn btn-success mb-2">CustomerFeedback</Link></li>
          <li><Link to="/customeraddmedicines" className="btn btn-success mb-2">UnvailableAddMedicine</Link></li>
          <li><Link to="/profile" className="btn btn-success">CustomerProfile</Link></li>
                    <li><Link to="/customerhelpissues" className="btn btn-success">customerhelpissues</Link></li>


          <li className="mt-3">
            <Link to="/header" className="text-danger text-decoration-none">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </Link>
          </li>
        </ul>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="main-content">
        <header>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user?.photo && (
              <img
                src={`https://ecommerencesite.onrender.com/api/uploads/${user.photo}`}
                alt="Profile"
                className="nav-user-photo"
              />
            )}

            {/* ---------- NOTIFICATION ICON ---------- */}
            {/* <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleNotifClick}>
              <span className="nav-icon" style={{ fontSize: '24px' }}>🔔</span>
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-2px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
                  {unreadCount}
                </span>
              )}

              {showNotifBox && (
                <div style={{ position: 'absolute', top: '35px', right: '0', background: '#222', border: '1px solid #444', width: '250px', zIndex: 1000, borderRadius: '8px', padding: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                  <p style={{ fontSize: '12px', borderBottom: '1px solid #444', paddingBottom: '8px', color: '#00ff88', fontWeight: 'bold', margin: '0 0 10px 0' }}>Notifications</p>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                      notifications.slice().reverse().map((n, i) => (
                        <div key={i} style={{ fontSize: '13px', color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                          <span style={{ color: '#00ff88' }}>📩</span> {n.message}
                          <br />
                          <small style={{ color: '#777', fontSize: '10px' }}>{n.time}</small>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: '12px', color: '#777', textAlign: 'center' }}>No new messages</p>
                    )}
                  </div>
                </div>
              )}
            </div> */}
{/* ---------- NOTIFICATION & HELP SECTION ---------- */}
<div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>

  {/* 1. Naya Help Status Icon (Jo aapne maanga tha) */}
  {/* <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowHelpBox(!showHelpBox)}>
    <span style={{ fontSize: '22px' }}>🛠️</span>
    {helpIssues.some(i => (i.customerHelpStatus || i.CustomerHelpStatus) === "Confirm Sending") && (
       <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#00ff88', width: '10px', height: '10px', borderRadius: '50%' }}></span>
    )}
  </div> */}

  {/* 2. Notification Bell (Jisme message dikhega) */}
  <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleNotifClick}>
    <span className="nav-icon" style={{ fontSize: '24px' }}>🔔</span>
    {unreadCount > 0 && (
      <span style={{ position: 'absolute', top: '-5px', right: '-2px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
        {unreadCount}
      </span>
    )}

    {showNotifBox && (
      <div style={{ position: 'absolute', top: '35px', right: '0', background: '#222', border: '1px solid #444', width: '280px', zIndex: 1000, borderRadius: '8px', padding: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
        <p style={{ fontSize: '12px', borderBottom: '1px solid #444', paddingBottom: '8px', color: '#00ff88', fontWeight: 'bold', margin: '0 0 10px 0' }}>Notifications</p>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {notifications.length > 0 ? (
            notifications.slice().reverse().map((n, i) => (
              <div key={i} style={{ fontSize: '13px', color: '#fff', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                <span style={{ color: '#00ff88' }}>📞</span> {n.message}
                <br />
                <small style={{ color: '#777', fontSize: '10px' }}>{n.time}</small>
              </div>
            ))
          ) : (
            <p style={{ fontSize: '12px', color: '#777', textAlign: 'center' }}>No new messages</p>
          )}
        </div>
      </div>
    )}
  </div>
</div>
            <span className="nav-icon" style={{ fontSize: '24px', cursor: 'pointer' }}>⚙️</span>
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
                <Bar dataKey="value" fill="#0088FE" />
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
                <Line type="monotone" dataKey="weight" stroke="#00C49F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="box">
            <h4>Blood Pressure Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bpData} dataKey="value" outerRadius={70} label>
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
            <p style={{ color: '#777' }}>No medicines added to cart</p>
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
                  <tr key={item.cartId || item.id}>
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




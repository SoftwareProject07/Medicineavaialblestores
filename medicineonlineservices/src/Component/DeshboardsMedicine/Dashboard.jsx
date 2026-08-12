import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

// FontAwesome Icons CSS (यदि आपकी index.html में नहीं है, तो आप इसे इस्तेमाल कर सकते हैं)
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
  const location = useLocation();

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
      const data = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
      setNotifications(data);
    };

    checkNotifs();
    const interval = setInterval(checkNotifs, 3000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotifClick = () => {
    setShowNotifBox(!showNotifBox);
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

  // हेल्पर फंक्शन: एक्टिव लिंक चेक करने के लिए
  const isActive = (path) => location.pathname === path;

  // यूजर के नाम का पहला अक्षर निकालने के लिए
  const getInitial = () => {
    if (user && user.firstName) return user.firstName.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* ---------- MODERN INLINE SIDEBAR STYLES ---------- */}
      <style>{`
        .modern-sidebar {
          width: 280px;
          height: 100vh;
          background-color: #ffffff;
          border-right: 1px solid #edf2f7;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 16px;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          box-sizing: border-box;
        }
        .modern-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid #edf2f7;
          margin-bottom: 20px;
          text-decoration: none;
        }
        .modern-brand span {
          font-weight: 700;
          color: #0fa462;
          font-size: 1.25rem;
        }
        .modern-nav-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
          overflow-y: auto;
        }
        .modern-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          color: #2d3748;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modern-nav-item:hover {
          background-color: #e8f7f0;
          color: #0fa462;
        }
        .modern-nav-item.active {
          background-color: #0fa462;
          color: #ffffff;
        }
        .modern-link-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .modern-link-content i {
          font-size: 1.15rem;
          width: 20px;
          text-align: center;
        }
        .modern-dropdown-toggle {
          border: 1px solid #edf2f7;
          background-color: #fafafa;
        }
        .modern-submenu {
          list-style: none;
          padding: 4px 0 4px 34px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .modern-submenu a {
          color: #718096;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 8px 12px;
          border-radius: 6px;
          display: block;
          font-weight: 500;
        }
        .modern-submenu a:hover {
          background-color: #f7fafc;
          color: #0fa462;
        }
        .modern-sidebar-footer {
          margin-top: auto;
          border-top: 1px solid #edf2f7;
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .modern-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background-color: #f8fafc;
          border-radius: 12px;
          border: 1px solid #edf2f7;
        }
        .modern-avatar {
          width: 40px;
          height: 40px;
          background-color: #e8f7f0;
          color: #0fa462;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .modern-user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .modern-user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #2d3748;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .modern-user-role {
          font-size: 0.75rem;
          color: #718096;
          font-weight: 500;
        }
        .modern-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          color: #e53e3e;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .modern-logout-btn:hover {
          background- color: #fff5f5;
        }
        .modern-main-layout {
          margin-left: 280px;
          width: calc(100% - 280px);
          padding: 24px;
          box-sizing: border-box;
        }
      `}</style>

     {/* ---------- SIDEBAR ---------- */}
      <div className="modern-sidebar">
        <div>
          {/* Logo & Brand */}
          <Link to="/dashboards" className="modern-brand">
            <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
            <span>AK Medistore</span>
          </Link>

          {/* Nav List */}
          <ul className="modern-nav-menu">
            
            {/* Dashboard Accordion */}
            <li>
              <button
                className={`modern-nav-item ${isActive("/dashboards") ? "active" : ""}`}
                onClick={() => setOpenDashboard(!openDashboard)}
              >
                <div className="modern-link-content">
                  <i className="fa-solid fa-chart-pie"></i>
                  <span>Dashboard</span>
                </div>
                <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>

              {openDashboard && (
                <ul className="modern-submenu">
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

            {/* Master Update Accordion */}
            <li>
              <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>
              {openMasterUpdate && (
                <ul className="modern-submenu">
                  <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt me-2"></i>Delivery Address</Link></li>
                  {/* <li><Link to="/CompletePayments"><i className="fas fa-credit-card me-2"></i>Order Payment</Link></li> */}
                  <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
                 <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                  
                </ul>
              )}
            </li>

            {/* Medicines */}
            <li>
              <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pills"></i>
                  <span>Medicines</span>
                </div>
              </Link>
            </li>

            {/* My Cart Link */}
            <li>
              <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-shopping-cart"></i>
                  <span>My Cart</span>
                </div>
                {cartItems.length > 0 && (
                  <span className="badge bg-danger rounded-pill">{cartItems.length}</span>
                )}
              </Link>
            </li>

            {/* Order Status */}
            <li>
              <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-truck"></i>
                  <span>Orders</span>
                </div>
              </Link>
            </li>

            {/* Customer Feedback */}
            <li>
              <Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-comment-dots"></i>
                  <span>Customer Feedback</span>
                </div>
              </Link>
            </li>

            {/* Unavailable Add Medicine */}
            <li>
              <Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>Unavailable Medicines</span>
                </div>
              </Link>
            </li>

            {/* Customer Profile */}
            <li>
              <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </li>

            {/* Customer Help Issues */}
            {/* <li>
              <Link to="/customerhelpissues" className={`modern-nav-item ${isActive("/customerhelpissues") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-headset"></i>
                  <span>Customer Help Issues</span>
                </div>
              </Link>
            </li> */}

          </ul>
        </div>

        {/* Footer Section */}
        <div className="modern-sidebar-footer">
          {/* Active User profile card */}
          <div className="modern-user-card">
            <div className="modern-avatar">
              {getInitial()}
            </div>
            <div className="modern-user-info">
              <span className="modern-user-name">
                {user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}
              </span>
              <span className="modern-user-role">Customer Account</span>
            </div>
          </div>

          {/* LogOut Link */}
          <Link to="/header" className="modern-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* ---------- MAIN CONTENT WORKSPACE ---------- */}
      <div className="modern-main-layout">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #edf2f7' }}>
          <div></div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user?.photo && (
              <img
                src={`https://ecommerencesite.onrender.com/api/uploads/${user.photo}`}
                alt="Profile"
                className="nav-user-photo"
                style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
              />
            )}

            {/* ---------- NOTIFICATION & HELP SECTION ---------- */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
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
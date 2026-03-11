import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/CustomerProfiles.css"; 

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(true);
  // FIX 1: Define cartItems so the code doesn't crash
  const [cartItems, setCartItems] = useState([]); 
  const { user, token, logout } = useAuth();
    const[openMasterUpdate, setOpenMasterUpdate] = useState(false);
  
  useEffect(() => {
    if (!user?.userId) return;

    // FIX 2: Use BACKTICKS (`) instead of double quotes (") for the URL
    axios.get(
      `https://ecommerencesite.onrender.com/api/USERMEDICINE/customer-profile?userId=${user.userId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    .then(res => {
      setProfile(res.data);
    })
    .catch((err) => {
      console.error("Fetch failed", err);
    });
  }, [user, token]); // Removed 'logout' from dependency to avoid unnecessary re-runs

  if (!profile) return <h3 className="loading-text">Loading Profile Data...</h3>;

  return (
    <div className="app-container">
<div className="sidebar">
        <div className="brand">
          <Link to="/dashboards" className="text-decoration-none">
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

          {/* MEDICINES */}
          <li>
            <Link to="/medicinedisplay" className="sidebar-btn">
              <div className="btn-content"><i className="fas fa-capsules"></i> Medicines</div>
            </Link>
          </li>

          {/* CART */}
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

          {/* ORDER PAYMENT */}
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
    {/* <li>
      <Link to="/CompletePayments" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i>CustomerTracking</div>
      </Link>
    </li> */}
          {/* PROFILE (ACTIVE) */}
          <li>
            <Link to="/profile" className="sidebar-btn active-btn">
              <div className="btn-content"><i className="fas fa-user-circle"></i> Customer Profile</div>
            </Link>
          </li>

          {/* LOGOUT */}
          <li className="logout-item">
            <Link to="/header" className="sidebar-btn logout">
              <div className="btn-content"><i className="fas fa-sign-out-alt"></i> Log Out</div>
            </Link>
          </li>
        </ul>
      </div>

      <main className="content-area">
        <div className="profile-display-card">
          <div className="profile-card-header"></div>
          <div className="profile-card-body">
            <div className="data-row">
              <span className="label">User ID:</span>
              <span className="value">#{profile.id}</span>
            </div>
            <div className="data-row">
              <span className="label">Full Name:</span>
              <span className="value">{profile.firstName} {profile.middleName || ""} {profile.lastName}</span>
            </div>
            <div className="data-row">
              <span className="label">Email Address:</span>
              <span className="value">{profile.email}</span>
            </div>
            <div className="data-row">
              <span className="label">Mobile Number:</span>
              <span className="value">{profile.mobileNumber}</span>
            </div>
            <div className="data-row">
              <span className="label">Account Type:</span>
              <span className="value">{profile.type}</span>
            </div>
            <div className="data-row">
              <span className="label">Available Funds:</span>
              <span className="value">₹{profile.fund}</span>
            </div>
            <div className="data-row border-0">
              <span className="label">Member Since:</span>
              <span className="value">{new Date(profile.createdOn).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
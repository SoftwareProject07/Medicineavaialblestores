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
            <li>
              <Link to="/medicinedisplay" className="btn btn-success mb-2">
                Medicines
              </Link>
            </li>

            {/* ✅ CART WITH COUNT */}
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
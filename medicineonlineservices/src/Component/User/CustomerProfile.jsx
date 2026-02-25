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
 
           <li>
             <Link to="/medicinedisplay" className="btn btn-success mb-2">
               Medicines
             </Link>
           </li>
 
           {/* ✅ CART WITH COUNT */}
            <Link to="/carts" className="nav-link">
                      <i className="fas fa-shopping-cart me-2"></i> My Cart
                      {cartItems.length > 0 && (
                        <span className="cart-count badge bg-danger rounded-pill ms-2">
                          {cartItems.length}
                        </span>
                      )}
                    </Link>
           {/* deliveryaddress */}
          {/* <li>Delivery Address</li> */}
            <li>
             <Link to="/deliveryaddress" className="btn btn-success mb-2">
               Delivery Address
             </Link>
           </li>
             {/* <Link to="/carts" className="nav-link">
                      <i className="fas fa-shopping-cart me-2"></i> My Cart TESTING
                      {cartItems.length > 0 && (
                        <span className="cart-count badge bg-danger rounded-pill ms-2">
                          {cartItems.length}
                        </span>
                      )}
                    </Link> */}
           <li><Link to="/CompletePayments" className="btn btn-success mb-2">
              ORDER PAYMENT
             </Link></li>
            <li>OrderItem</li>
 
           <li>CustomerTracking</li>
 
           <Link to="/profile"  className="btn btn-success">CustomerProfile</Link>
 
         {/* <Link to="/medicinelist" className="btn btn-success mb-2" ><li>Medicine List</li></Link> */}
 
           <li>
             <Link to="/header">
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
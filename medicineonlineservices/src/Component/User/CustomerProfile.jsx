// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import "../styles/CustomerProfiles.css"; 

// export default function CustomerProfile() {
//   const [profile, setProfile] = useState(null);
//   const [openDashboard, setOpenDashboard] = useState(true);
//   // FIX 1: Define cartItems so the code doesn't crash
//   const [cartItems, setCartItems] = useState([]); 
//   const { user, token, logout } = useAuth();
//     const[openMasterUpdate, setOpenMasterUpdate] = useState(false);
  
//   useEffect(() => {
//     if (!user?.userId) return;

//     // FIX 2: Use BACKTICKS (`) instead of double quotes (") for the URL
//     axios.get(
//       `https://ecommerencesite.onrender.com/api/USERMEDICINE/customer-profile?userId=${user.userId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     )
//     .then(res => {
//       setProfile(res.data);
//     })
//     .catch((err) => {
//       console.error("Fetch failed", err);
//     });
//   }, [user, token]); // Removed 'logout' from dependency to avoid unnecessary re-runs

//   if (!profile) return <h3 className="loading-text">Loading Profile Data...</h3>;

//   return (
//     <div className="app-container">
//  <div className="sidebar">
//           <div className="brand">
//             <Link to="/dashboards">
//               <img src="/AKMedizostore.png" alt="logo" width="55" />
//             </Link>
//             <span>
//               {user ? `${user.firstName} ${user.lastName}` : "User"}
//             </span>
//           </div>

//           <ul>
//                                                   <Link to="/dashboards"   className="modern-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #edf2f7', marginBottom: '20px', textDecoration: 'none' }} >
            
//             <li className="menu-group">
//               <button
//                 className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
//                 onClick={() => setOpenDashboard(!openDashboard)}
//               >
//                 Dashboard <span>{openDashboard ? "▾" : "▸"}</span>
//               </button>

//               {openDashboard && (
//                 <ul className="submenu">
//                   <li><Link to="/medication-tracker">Medication Tracker</Link></li>
//                   <li><Link to="/test-reports">Test Reports</Link></li>
//                   <li><Link to="/health-history">Health History</Link></li>
//                   <li><Link to="/monthly-progress">Monthly Progress</Link></li>
//                   <li><Link to="/prescriptions">Prescriptions</Link></li>
//                   <li><Link to="/history">History</Link></li>
//                   <li><Link to="/support">Help & Support</Link></li>
//                   <li><Link to="/settings">Settings</Link></li>
//                 </ul>
//               )}
//             </li>
//             </Link>
//     {/* MASTER UPDATE DROPDOWN */}
//       <li className="menu-group">
//         <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//           <div className="btn-content">
//             <i className="fas fa-edit"></i> Master Update
//           </div>
//           <span>{openMasterUpdate ? "▾" : "▸"}</span>
//         </button>
//         {openMasterUpdate && (
//           <ul className="submenu">
//             <li>
//               <Link to="/deliveryaddress">
//                 <i className="fas fa-map-marker-alt"></i> Delivery Address
//               </Link>
//             </li>
//                 {/* <li>
//                         <Link to="/CompletePayments" className="sidebar-btn active-btn">
//                           <div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div>
//                         </Link>
//                       </li> */}
//                                              <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
//                                                                                                                      <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                                             
                           
//           </ul>
//         )}
//       </li>
//             <li>
//               <Link to="/medicinedisplay" className="btn btn-success mb-2">
//                 Medicines
//               </Link>
//             </li>

//             {/* ✅ CART WITH COUNT */}
//              <li>
//                        <Link to="/carts" className="nav-link">
//                          <i className="fas fa-shopping-cart me-2"></i> My Cart
//                          {cartItems.length > 0 && (
//                            <span className="cart-count badge bg-danger rounded-pill ms-2">
//                              {cartItems.length}
//                            </span>
//                          )}
//                        </Link>
//                      </li>
           
//                      <li><Link to="/order" className="btn btn-success mb-2">OrderS</Link></li>
//                      <li><Link to="/feedbackcustomers" className="btn btn-success mb-2">CustomerFeedback</Link></li>
//                      <li><Link to="/customeraddmedicines" className="btn btn-success mb-2">UnvailableAddMedicine</Link></li>
//                      <li><Link to="/profile" className="btn btn-success">CustomerProfile</Link></li>
//                     {/* <li><Link to="/customerhelpissues" className="btn btn-success">customerhelpissues</Link></li> */}
           
           
//                      <li className="mt-3">
//                        <Link to="/header" className="text-danger text-decoration-none">
//                          <i className="fas fa-sign-out-alt"></i> LogOut
//                        </Link>
//                      </li>
//                    </ul>
//                  </div>
           

//       <main className="content-area ">
//         <div className="profile-display-card">
//           <div className="profile-card-header"></div>
//           <div className="profile-card-body">
//             <div className="data-row">
//               <span className="label">User ID:</span>
//               <span className="value">#{profile.id}</span>
//             </div>
//             <div className="data-row">
//               <span className="label">Full Name:</span>
//               <span className="value">{profile.firstName} {profile.middleName || ""} {profile.lastName}</span>
//             </div>
//             <div className="data-row">
//               <span className="label">Email Address:</span>
//               <span className="value">{profile.email}</span>
//             </div>
//             <div className="data-row">
//               <span className="label">Mobile Number:</span>
//               <span className="value">{profile.mobileNumber}</span>
//             </div>
//             <div className="data-row">
//               <span className="label">Account Type:</span>
//               <span className="value">{profile.type}</span>
//             </div>
//             <div className="data-row">
//               <span className="label">Available Funds:</span>
//               <span className="value">₹{profile.fund}</span>
//             </div>
//             <div className="data-row border-0">
//               <span className="label">Member Since:</span>
//               <span className="value">{new Date(profile.createdOn).toLocaleDateString()}</span>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/CustomerProfiles.css"; 

export default function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [cartItems, setCartItems] = useState([]); 
  const { user, token } = useAuth();
  
  useEffect(() => {
    if (!user?.userId) return;

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
  }, [user, token]);

  // Helper for user initials avatar
  const getInitial = () => {
    if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (profile && profile.firstName) {
      return profile.firstName.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (!profile) return <h3 className="loading-text">Loading Profile Data...</h3>;

  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .modern-sidebar { width: 270px; height: 100vh; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 18px; position: fixed; left: 0; top: 0; z-index: 1000; box-sizing: border-box; overflow-y: auto; }
        .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; margin-bottom: 18px; text-decoration: none; }
        .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
        .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; color: #475569; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
        .modern-nav-item:hover { background-color: #f0fdf4; color: #0fa462; }
        .modern-nav-item.active { background-color: #0fa462; color: #ffffff; box-shadow: 0 4px 12px rgba(15, 164, 98, 0.2); }
        .modern-link-content { display: flex; align-items: center; gap: 12px; }
        .modern-submenu { list-style: none; padding: 6px 0 6px 32px; display: flex; flex-direction: column; gap: 4px; }
        .modern-submenu a { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; transition: all 0.15s ease; }
        .modern-submenu a:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
        .modern-sidebar-footer { margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; flex-direction: column; gap: 10px; }
        .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
        .modern-avatar { width: 38px; height: 38px; background-color: #dcfce7; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
        .modern-user-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .modern-user-role { font-size: 0.72rem; color: #64748b; font-weight: 500; }
        .modern-logout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #ef4444; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 8px; transition: background 0.2s; }
        .modern-logout-btn:hover { background-color: #fef2f2; }
        .modern-main-layout { margin-left: 270px; width: calc(100% - 270px); padding: 32px; box-sizing: border-box; }
      `}</style>

      {/* --- SIDEBAR --- */}
      <div className="modern-sidebar">
        <div>
          <Link to="/dashboards" className="modern-brand">
            <img src="/AKMedizostore.png" alt="logo" width="36" height="36" style={{ objectFit: 'contain' }} />
            <span>AK Medistore</span>
          </Link>

          <ul className="modern-nav-menu">
            <li>
              <button 
                className={`modern-nav-item ${openDashboard ? "active" : ""}`} 
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

            <li>
              <button 
                className={`modern-nav-item ${openMasterUpdate ? "active" : ""}`} 
                onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
              >
                <div className="modern-link-content">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>

              {openMasterUpdate && (
                <ul className="modern-submenu">
                  <li><Link to="/deliveryaddress">Delivery Address</Link></li>
                  <li><Link to="/addbankrefundableamounts">Refund Bank Details</Link></li>
                  <li><Link to="/bankdetailsrefundlist">Bankdetailsrefundlist</Link></li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/medicinedisplay" className="modern-nav-item">
                <div className="modern-link-content">
                  <i className="fa-solid fa-pills"></i>
                  <span>Medicines</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/carts" className="modern-nav-item">
                <div className="modern-link-content">
                  <i className="fa-solid fa-shopping-cart"></i>
                  <span>My Cart</span>
                </div>
                {cartItems.length > 0 && (
                  <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </li>

            <li>
              <Link to="/order" className="modern-nav-item">
                <div className="modern-link-content">
                  <i className="fa-solid fa-truck"></i>
                  <span>Orders</span>
                </div>
              </Link>
            </li>

            {/* <li>
              <Link to="/feedbackcustomers" className="modern-nav-item">
                <div className="modern-link-content">
                  <i className="fa-solid fa-comments"></i>
                  <span>CustomerFeedback</span>
                </div>
              </Link>
            </li> */}

            <li>
              <Link to="/customeraddmedicines" className="modern-nav-item">
                <div className="modern-link-content">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>UnvailableAddMedicine</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/profile" className="modern-nav-item active">
                <div className="modern-link-content">
                  <i className="fa-solid fa-user"></i>
                  <span>CustomerProfile</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="modern-sidebar-footer">
          <div className="modern-user-card">
            <div className="modern-avatar">{getInitial()}</div>
            <div className="modern-user-info">
              <span className="modern-user-name">
                {user ? `${user.firstName} ${user.lastName}` : (profile ? `${profile.firstName} ${profile.lastName}` : "User")}
              </span>
              <span className="modern-user-role">Customer Account</span>
            </div>
          </div>
          <Link to="/header" className="modern-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="modern-main-layout">
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
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../User/CartContext";
// import { 
//   X, Trash2, Edit, Plus, MapPin, LogOut, 
//   Home, Briefcase, HelpCircle, Phone, Navigation, 
//   User as UserIcon, LayoutDashboard, ShoppingBag, ChevronRight, Mail, Globe, Map
// } from "lucide-react";

// const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

// export default function DeliveryAddress() {
//   const navigate = useNavigate();
//   const { setSelectedAddress, cartItems } = useCart();

//   // --- States ---
//   const [addresses, setAddresses] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [openDashboard, setOpenDashboard] = useState(true);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(true);
//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const [user] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const initialForm = {
//     fullName: "", 
//     gender: "selectgender",
//     email: user?.email || "", 
//     phoneNumber: "", 
//     address: "", 
//     customerCity: "", 
//     customerState: "", 
//     customerZipCode: "", 
//     age: 0, 
//     addressType: "Home"  
//   };

//   const [formData, setFormData] = useState(initialForm);

//   // --- Functions ---
//   const handleTypeChange = (type) => {
//     if (showEditPopup) setEditData({ ...editData, addressType: type });
//     else setFormData({ ...formData, addressType: type });
//   };

//   const currentType = showEditPopup ? editData?.addressType : formData.addressType;

//   // Automatic Pincode Fetching
//   useEffect(() => {
//     const zip = showEditPopup ? editData?.customerZipCode : formData.customerZipCode;
//     if (zip?.length === 6) {
//       const fetchPincodeDetails = async () => {
//         try {
//           const response = await axios.get(`https://api.postalpincode.in/pincode/${zip}`);
//           if (response.data[0].Status === "Success") {
//             const postOffice = response.data[0].PostOffice[0];
//             const update = { 
//               customerCity: postOffice.District, 
//               customerState: postOffice.State 
//             };
//             if (showEditPopup) setEditData(prev => ({ ...prev, ...update }));
//             else setFormData(prev => ({ ...prev, ...update }));
//           }
//         } catch (error) { console.error("Pincode API Error", error); }
//       };
//       fetchPincodeDetails();
//     }
//   }, [formData.customerZipCode, editData?.customerZipCode, showEditPopup]);

//   const fetchAddresses = async () => {
//     if (!user?.email) { 
//       setLoading(false); 
//       return; 
//     }
//     try {
//       const res = await axios.get(`${API}/GetAllPatients_Customers`);
//       const raw = res.data?.data || res.data || [];
      
//       const filtered = raw.filter(
//         item => item.email?.trim().toLowerCase() === user?.email?.trim().toLowerCase()
//       );
      
//       setAddresses(filtered.sort((a, b) => a.patient_CustomerId - b.patient_CustomerId));
//     } catch (err) { 
//       console.error("Fetch Error:", err); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   useEffect(() => { fetchAddresses(); }, [user]);

//   const handleFinalSave = async (isUpdate) => {
//     const data = isUpdate ? editData : formData;
//     if (data.customerState !== "Bihar") {
//       alert("❌ Delivery Service is currently only available in Bihar.");
//       return;
//     }
//     try {
//       if (isUpdate) {
//         await axios.put(`${API}/UpdatePatient_Customer`, editData);
//       } else {
//         await axios.post(`${API}/AddPatient_Customer`, { ...formData, patient_CustomerId: 0 });
//       }
//       setShowEditPopup(false); 
//       setShowAddPopup(false);
//       setFormData(initialForm);
//       fetchAddresses();
//       alert("✅ Address Saved Successfully!");
//     } catch (err) { alert("Action Failed. Please check connection."); }
//   };

//  const handleDelete = async (id) => {
//     if (window.confirm("Delete this address?")) {
//       try {
//         await axios.delete(`https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/DeletePatient/${id}`);
//         fetchAddresses();
//         alert("✅ Address Deleted Successfully!");
//       } catch (err) { 
//         console.error("Delete Error:", err.response || err.message);
//         alert("Failed to delete. Please check network/API route setup.");
//       }
//     }
//   };

//   if (loading) return <div className="vh-100 bg-dark d-flex justify-content-center align-items-center text-success fw-bold">Loading...</div>;

//   return (
//     <>
//       {/* <style>{`
//         :root {
//             --primary-green: #0fa462;
//             --hover-bg: #e8f7f0;
//             --text-dark: #2d3748;
//             --text-gray: #718096;
//             --danger-red: #e53e3e;
//             --border-color: #edf2f7;
//         }

//         .modal-body-custom input, 
//         .modal-body-custom select, 
//         .modal-body-custom textarea {
//             color: #ffffff !important;
//             background-color: #121212 !important;
//         }

//         .modal-body-custom input::placeholder, 
//         .modal-body-custom textarea::placeholder {
//             color: #a0aec0 !important;
//             opacity: 1;
//         }

//         .custom-sidebar {
//             width: 280px;
//             height: 100vh;
//             background-color: #ffffff;
//             border-right: 1px solid var(--border-color);
//             display: flex;
//             flex-direction: column;
//             justify-content: space-between;
//             padding: 24px 16px;
//             position: fixed;
//             left: 0;
//             top: 0;
//             z-index: 1000;
//             overflow-y: auto;
//         }

//         .brand-header {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             padding-bottom: 20px;
//             border-bottom: 1px solid var(--border-color);
//             margin-bottom: 20px;
//         }

//         .brand-logo {
//             color: var(--primary-green);
//             font-size: 1.4rem;
//         }

//         .brand-name {
//             font-weight: 700;
//             color: var(--primary-green);
//             font-size: 1.25rem;
//             letter-spacing: -0.5px;
//             text-decoration: none;
//         }

//         .nav-menu {
//             display: flex;
//             flex-direction: column;
//             gap: 6px;
//             flex-grow: 1;
//         }

//         .nav-item {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             padding: 10px 14px;
//             color: var(--text-dark);
//             text-decoration: none;
//             border-radius: 10px;
//             font-weight: 600;
//             font-size: 0.9rem;
//             transition: all 0.2s ease;
//             background: transparent;
//             border: none;
//             width: 100%;
//             text-align: left;
//             cursor: pointer;
//         }

//         .nav-item.active {
//             background-color: var(--primary-green);
//             color: #ffffff !important;
//         }

//         .nav-item:not(.active):hover {
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
//         }

//         .nav-link-left {
//             display: flex;
//             align-items: center;
//             gap: 14px;
//         }

//         .submenu-container {
//             display: flex;
//             flex-direction: column;
//             gap: 4px;
//             padding-left: 20px;
//             margin-top: 4px;
//             margin-bottom: 4px;
//         }

//         .sidebar-footer {
//             margin-top: auto;
//             border-top: 1px solid var(--border-color);
//             padding-top: 16px;
//             display: flex;
//             flex-direction: column;
//             gap: 12px;
//         }

//         .user-profile-card {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             padding: 10px;
//             background-color: #f8fafc;
//             border-radius: 12px;
//             border: 1px solid var(--border-color);
//         }

//         .user-avatar {
//             width: 38px;
//             height: 38px;
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: 700;
//             font-size: 1rem;
//         }

//         .user-info {
//             display: flex;
//             flex-direction: column;
//             overflow: hidden;
//         }

//         .user-name {
//             font-weight: 600;
//             font-size: 0.85rem;
//             color: var(--text-dark);
//             white-space: nowrap;
//             text-overflow: ellipsis;
//             overflow: hidden;
//         }

//         .user-role {
//             font-size: 0.7rem;
//             color: var(--text-gray);
//             font-weight: 500;
//         }

//         .logout-btn {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             padding: 10px 14px;
//             color: var(--danger-red);
//             text-decoration: none;
//             font-weight: 600;
//             font-size: 0.9rem;
//             border-radius: 10px;
//             transition: background 0.2s;
//         }

//         .logout-btn:hover {
//             background-color: #fff5f5;
//         }

//         .main-workspace {
//             margin-left: 280px;
//             width: calc(100% - 280px);
//         }
//       `}</style> */}
      

//       {/* <div className="d-flex bg-dark text-white min-vh-100 overflow-hidden w-100">
        
//         <div className="custom-sidebar">
//           <div>
//             <div className="brand-header">
//               <i className="fa-solid fa-bag-shopping brand-logo"></i>
//               <Link to="/dashboards" className="brand-name">AK Medistore</Link>
//             </div>

//             <nav className="nav-menu">
//                                                     <Link to="/dashboards"   className="modern-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #edf2f7', marginBottom: '20px', textDecoration: 'none' }} >
              
//               <button 
//                 className="nav-item dropdown-toggle" 
//                 onClick={() => setOpenDashboard(!openDashboard)}
//               >
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid fa-chevron-${openDashboard ? "down" : "right"}`} style={{fontSize: '0.75rem'}}></i>
//               </button>

//               {openDashboard && (
//                 <div className="submenu-container">
//                   <Link to="/medication-tracker" className="nav-item" style={{fontSize: '0.85rem'}}>Medication Tracker</Link>
//                   <Link to="/test-reports" className="nav-item" style={{fontSize: '0.85rem'}}>Test Reports</Link>
//                   <Link to="/health-history" className="nav-item" style={{fontSize: '0.85rem'}}>Health History</Link>
//                   <Link to="/monthly-progress" className="nav-item" style={{fontSize: '0.85rem'}}>Monthly Progress</Link>
//                   <Link to="/prescriptions" className="nav-item" style={{fontSize: '0.85rem'}}>Prescriptions</Link>
//                   <Link to="/history" className="nav-item" style={{fontSize: '0.85rem'}}>History</Link>
//                   <Link to="/support" className="nav-item" style={{fontSize: '0.85rem'}}>Help & Support</Link>
//                   <Link to="/settings" className="nav-item" style={{fontSize: '0.85rem'}}>Settings</Link>
//                 </div>
//               )}
// </Link>
//               <button 
//                 className="nav-item dropdown-toggle" 
//                 onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
//               >
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid fa-chevron-${openMasterUpdate ? "down" : "right"}`} style={{fontSize: '0.75rem'}}></i>
//               </button>

//               {openMasterUpdate && (
//                 <div className="submenu-container">
//                   <Link to="/deliveryaddress" className="nav-item active" style={{fontSize: '0.85rem'}}>
//                     <i className="fa-solid fa-map-marker-alt me-2"></i> Delivery Address
//                   </Link>
//                   <li><Link to="/addbankrefundableamounts" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
//                   <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
//                 </div>
//               )}

//               <Link to="/medicinedisplay" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-pills"></i>
//                   <span>Medicines</span>
//                 </div>
//               </Link>

//               <Link to="/carts" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-shopping-cart"></i>
//                   <span>My Cart</span>
//                 </div>
//                 {cartItems.length > 0 && (
//                   <span className="badge bg-danger rounded-pill">
//                     {cartItems.length}
//                   </span>
//                 )}
//               </Link>

//               <Link to="/order" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-truck"></i>
//                   <span>Orders</span>
//                 </div>
//               </Link>

//               <Link to="/profile" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-user"></i>
//                   <span>Customer Profile</span>
//                 </div>
//               </Link>
//             </nav>
//           </div>

//           <div className="sidebar-footer">
//             <div className="user-profile-card">
//               <div className="user-avatar">
//                 {user ? (user.firstName ? user.firstName.charAt(0).toUpperCase() : "U") : "U"}
//               </div>
//               <div className="user-info">
//                 <span className="user-name">
//                   {user ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
//                 </span>
//                 <span className="user-role">Customer Account</span>
//               </div>
//             </div>

//             <Link to="/header" className="logout-btn">
//               <i className="fa-solid fa-right-from-bracket"></i>
//               <span>Log Out</span>
//             </Link>
//           </div>
//         </div> */}





//     <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: "'Inter', sans-serif" }}>
//       <style>{`
//         .modern-sidebar { width: 270px; height: 100vh; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 18px; position: fixed; left: 0; top: 0; z-index: 1000; box-sizing: border-box; overflow-y: auto; }
//         .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; margin-bottom: 18px; text-decoration: none; }
//         .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
//         .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
//         .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; color: #475569; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
//         .modern-nav-item:hover { background-color: #f0fdf4; color: #0fa462; }
//         .modern-nav-item.active { background-color: #0fa462; color: #ffffff; box-shadow: 0 4px 12px rgba(15, 164, 98, 0.2); }
//         .modern-link-content { display: flex; align-items: center; gap: 12px; }
//         .modern-submenu { list-style: none; padding: 6px 0 6px 32px; display: flex; flex-direction: column; gap: 4px; }
//         .modern-submenu button { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; background: none; border: none; text-align: left; width: 100%; cursor: pointer; transition: all 0.15s ease; }
//         .modern-submenu button:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
//         .modern-sidebar-footer { margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; flex-direction: column; gap: 10px; }
//         .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
//         .modern-avatar { width: 38px; height: 38px; background-color: #dcfce7; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
//         .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
//         .modern-user-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
//         .modern-user-role { font-size: 0.72rem; color: #64748b; font-weight: 500; }
//         .modern-logout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #ef4444; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 8px; transition: background 0.2s; }
//         .modern-logout-btn:hover { background-color: #fef2f2; }
//         .modern-main-layout { margin-left: 270px; width: calc(100% - 270px); padding: 32px; box-sizing: border-box; }
//         .stat-card { padding: 22px; border-radius: 14px; color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); transition: transform 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px; }
//         .stat-card:hover { transform: translateY(-3px); }
//         .custom-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
//         .custom-modal-box { background: white; padding: 24px; border-radius: 16px; width: 100%; max-width: 850px; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: left; }
//         .settings-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
//         .settings-label { font-weight: 600; color: #1e293b; font-size: 0.95rem; }
//         .settings-desc { font-size: 0.8rem; color: #64748b; margin-top: 2px; }
//         .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left; }
//         .data-table th { background: #f8fafc; color: #475569; padding: 10px 12px; font-size: 0.85rem; border-bottom: 2px solid #e2e8f0; }
//         .data-table td { padding: 10px 12px; font-size: 0.85rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
//         .data-table tr:hover { background: #f1f5f9; }
        
//         .lab-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
//         .lab-item-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s; }
//         .lab-item-card:hover { border-color: #0fa462; box-shadow: 0 6px 12px rgba(15, 164, 98, 0.08); }
//         .lab-tab-btn { padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; color: #475569; transition: all 0.2s; }
//         .lab-tab-btn.active { background: #0fa462; color: #fff; border-color: #0fa462; }
        
//         .form-group { margin-bottom: 14px; }
//         .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px; }
//         .form-control { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem; box-sizing: border-box; outline: none; }
//         .form-control:focus { border-color: #0fa462; box-shadow: 0 0 0 3px rgba(15, 164, 98, 0.1); }
        
//         .tracker-step { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 8px; border-left: 4px solid #cbd5e1; }
//         .tracker-step.completed { background: #f0fdf4; border-left-color: #0fa462; }
//       `}</style>

//       {/* SIDEBAR */}
//       <div className="modern-sidebar">
//         <div>
//           <Link to="/dashboards" className="modern-brand">
//             <img src="/AKMedizostore.png" alt="logo" width="36" height="36" style={{ objectFit: 'contain' }} />
//             <span>AK Medistore</span>
//           </Link>

//           <ul className="modern-nav-menu">
//             <li>
//               <button className={`modern-nav-item ${openDashboard ? "active" : ""}`} onClick={() => setOpenDashboard(!openDashboard)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>

//               {openDashboard && (
//                 <ul className="modern-submenu">
//                   <li><button onClick={() => fetchModalData("med", "AllMedicationtracker")}>Medication Tracker</button></li>
//                   <li><button onClick={() => fetchModalData("test", "AllTestReports")}>Test Reports</button></li>
//                   <li><button onClick={() => fetchModalData("health", "AllHealthHistory")}>Health History</button></li>
//                   <li><button onClick={() => fetchModalData("monthly", "AllMonthlyProgress")}>Monthly Progress</button></li>
//                   <li><button onClick={() => fetchModalData("prescriptions", "AllPrescriptions")}>Prescriptions</button></li>
//                   <li><button onClick={() => fetchModalData("history", "AllHistory")}>History</button></li>
//                   <li><button onClick={() => fetchModalData("support", "AllticketHelpSupport")}>Help & Support</button></li>
//                   <li><button onClick={() => setActiveModal("settings")}>Settings</button></li>
//                   <li><button onClick={() => fetchModalData("lab", "AllOffersAsync")} style={{ color: "#0fa462", fontWeight: "700" }}>🧪 LAB TEST PANEL</button></li>
//                 </ul>
//               )}
//             </li>

//             <li>
//               <button className="modern-nav-item" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openMasterUpdate && (
//                 <ul className="modern-submenu">
//                   <li><button onClick={() => window.location.href="/deliveryaddress"}>Delivery Address</button></li>
//                   <li><button onClick={() => window.location.href="/addbankrefundableamounts"}>Refund Bank Details</button></li>
//                  <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                  
//                 </ul>
//               )}
//             </li>

//             <li><Link to="/medicinedisplay" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
//             <li>
//               <Link to="/carts" className="modern-nav-item">
//                 <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
//                 {cartItems.length > 0 && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>{cartItems.length}</span>}
//               </Link>
//             </li>
//             <li><Link to="/order" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div></Link></li>
//               <li>
//                           <Link to="/customeraddmedicines"className="modern-nav-item"><div className="modern-link-content">
//                             {/* <div className="modern-link-content"> */}
//                               <i className="fa-solid fa-circle-exclamation"></i>
//                               <span>Unavailable Medicines</span>
//                             </div>
//                           </Link>
//                         </li>
//   <li>
//               <Link to="/profile" className="modern-nav-item"><div className="modern-link-content">
//                 {/* <div className="modern-link-content"> */}
//                   <i className="fa-solid fa-user"></i>
//                   <span>Customer Profile</span>
//                 </div>
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* <div className="modern-sidebar-footer">
//           <div className="modern-user-card">
//             <div className="modern-avatar">{getInitial()}</div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
//               <span className="modern-user-role">Customer Account</span>
//             </div>
//           </div> */}


//              <div className="sidebar-footer">
//             <div className="user-profile-card">
//               <div className="user-avatar">
//                 {user ? (user.firstName ? user.firstName.charAt(0).toUpperCase() : "U") : "U"}
//               </div>
//               <div className="user-info">
//                 <span className="user-name">
//                   {user ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
//                 </span>
//                 <span className="user-role">Customer Account</span>
//               </div>
//             </div>
//           <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
//         </div>
//       </div>




//       {/* =============================MAIN HEAD=========================== */}
//         <div className="flex-grow-1 p-4 overflow-auto main-workspace">
//           <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
//             <h4 className="fw-bold m-0 d-flex align-items-center gap-2"><MapPin className="text-success" /> My Delivery Addresses</h4>
//             <button className="btn btn-success px-4 rounded-pill fw-bold" onClick={() => { setFormData(initialForm); setShowAddPopup(true); }}><Plus size={18}/> ADD NEW</button>
//           </div>

//           <div className="row">
//             {addresses.length === 0 ? (
//               <div className="text-center text-muted py-5">No delivery addresses found. Click "ADD NEW" to create one.</div>
//             ) : (
//               addresses.map((addr, idx) => (
//                 <div key={addr.patient_CustomerId} className="col-12 mb-3">
//                   <div className={`p-4 border rounded-4 cursor-pointer transition-all ${selectedIndex === idx ? "border-success bg-success bg-opacity-10 shadow-lg" : "border-secondary bg-black"}`} onClick={() => setSelectedIndex(idx)}>
//                     <div className="d-flex justify-content-between">
//                       <div className="w-100">
//                         <div className="d-flex align-items-center gap-2 mb-2">
//                           <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || 'Home'}</span>
//                           <span className="badge bg-dark border border-success text-success" style={{fontSize: '10px'}}>{addr.gender}</span>
//                         </div>
//                         <h6 className="fw-bold text-white mb-1">{addr.fullName}</h6>
//                         <div className="small text-white-50 mb-1"><Mail size={14} className="me-2"/>{addr.email}</div>
//                         <div className="small text-info mb-1"><Phone size={14} className="me-2"/>{addr.phoneNumber}</div>
//                         <div className="small text-white-50 mb-3"><Navigation size={14} className="me-2"/>{addr.address}</div>
                        
//                         <div className="pt-2 border-top border-secondary row g-0 text-center">
//                             <div className="col-4 border-end border-secondary"><small className="d-block text-muted">CITY</small><span className="text-success small">{addr.customerCity}</span></div>
//                             <div className="col-4 border-end border-secondary"><small className="d-block text-muted">STATE</small><span className="text-white small">{addr.customerState}</span></div>
//                             <div className="col-4"><small className="d-block text-muted">PIN</small><span className="text-warning small">{addr.customerZipCode}</span></div>
//                         </div>
//                       </div>
//                       <div className="d-flex flex-column gap-2 ms-3">
//                         <button className="btn btn-sm btn-outline-info border-0" onClick={(e) => { e.stopPropagation(); setEditData(addr); setShowEditPopup(true); }}><Edit size={18}/></button>
//                         <button className="btn btn-sm btn-outline-danger border-0" onClick={(e) => { e.stopPropagation(); handleDelete(addr.patient_CustomerId); }}><Trash2 size={18}/></button>
//                       </div>
//                     </div>
//                     {selectedIndex === idx && (
//                       <button className="btn btn-warning w-100 mt-3 fw-bold py-2 shadow" onClick={() => { setSelectedAddress(addr); navigate("/carts"); }}>DELIVER HERE <ChevronRight size={16}/></button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* --- ADD/EDIT MODAL --- */}
//         {(showEditPopup || showAddPopup) && (
//           <div className="modal-overlay d-flex justify-content-center align-items-center p-3" style={{position:'fixed', inset:0, background: 'rgba(0,0,0,0.85)', zIndex: 1200}}>
//             <div className="bg-dark p-4 rounded-4 border border-secondary shadow-lg overflow-auto modal-body-custom" style={{width: '100%', maxWidth: '500px', maxHeight: '90vh'}}>
//               <h5 className="text-success fw-bold mb-4">{showEditPopup ? "✏️ Edit Address" : "🏠 Add New Address"}</h5>
              
//               <div className="row g-3">
//                 <div className="col-12 mb-2">
//                   <label className="small text-light mb-2 d-block fw-semibold">Save Address As:</label>
//                   <div className="d-flex gap-2">
//                     {['Home', 'Office', 'Other'].map(type => (
//                       <button 
//                         key={type} 
//                         type="button"
//                         onClick={() => handleTypeChange(type)} 
//                         className={`btn flex-grow-1 py-2 fw-bold border d-flex align-items-center justify-content-center gap-2 ${currentType === type ? 'btn-success border-success' : 'btn-outline-secondary text-light'}`}
//                       >
//                         {type === 'Home' && <Home size={16}/>}
//                         {type === 'Office' && <Briefcase size={16}/>}
//                         {type === 'Other' && <MapPin size={16}/>}
//                         {type}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="col-12">
//                   <label className="small text-light mb-1 fw-semibold">Full Name</label>
//                   <input 
//                     className="form-control" 
//                     placeholder="Enter Full Name" 
//                     value={showEditPopup ? editData.fullName : formData.fullName} 
//                     onChange={e => showEditPopup ? setEditData({...editData, fullName: e.target.value}) : setFormData({...formData, fullName: e.target.value})} 
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="small text-light mb-1 fw-semibold">Gender</label>
//                   <select 
//                     className="form-select" 
//                     value={showEditPopup ? editData.gender : formData.gender} 
//                     onChange={e => showEditPopup ? setEditData({...editData, gender: e.target.value}) : setFormData({...formData, gender: e.target.value})}
//                   >
//                    <option value="selectgender">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Trigender">Trigender</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>

//                 <div className="col-md-6">
//                   <label className="small text-light mb-1 fw-semibold">Email</label>
//                   <input 
//                     className="form-control" 
//                     placeholder="Enter Email"
//                     value={showEditPopup ? editData.email : formData.email} 
//                     onChange={e => showEditPopup ? setEditData({...editData, email: e.target.value}) : setFormData({...formData, email: e.target.value})} 
//                   />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="small text-light mb-1 fw-semibold">Mobile Number</label>
//                   <input 
//                     className="form-control" 
//                     placeholder="10-digit mobile" 
//                     maxLength="10" 
//                     value={showEditPopup ? editData.phoneNumber : formData.phoneNumber} 
//                     onChange={e => showEditPopup ? setEditData({...editData, phoneNumber: e.target.value}) : setFormData({...formData, phoneNumber: e.target.value})} 
//                   />
//                 </div>

//                 <div className="col-md-6">
//                    <label className="small text-success mb-1 fw-bold">Zip Code</label>
//                     <input 
//                       className="form-control" 
//                       placeholder="e.g. 845401" 
//                       maxLength="6" 
//                       value={showEditPopup ? editData.customerZipCode : formData.customerZipCode} 
//                       onChange={e => {
//                         const val = e.target.value.replace(/\D/g, "");
//                         showEditPopup ? setEditData({...editData, customerZipCode: val}) : setFormData({...formData, customerZipCode: val});
//                       }} 
//                     />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="small text-light mb-1 fw-semibold">City</label>
//                   <input className="form-control" placeholder="City auto-fills" value={showEditPopup ? editData.customerCity : formData.customerCity} readOnly />
//                 </div>

//                 <div className="col-md-6">
//                   <label className="small text-light mb-1 fw-semibold">State</label>
//                   <input className="form-control" placeholder="State auto-fills" value={showEditPopup ? editData.customerState : formData.customerState} readOnly />
//                 </div>

//                 {(showEditPopup ? editData.customerState : formData.customerState) && (showEditPopup ? editData.customerState : formData.customerState) !== "Bihar" && (
//                     <div className="alert alert-danger p-2 small mb-3">
//                         ⚠️ Medicine delivery is only available in <strong>Bihar</strong>. 
//                     </div>
//                 )}  

//                 <div className="col-12">
//                   <label className="small text-light mb-1 fw-semibold">Full Address (House No, Building, Street)</label>
//                   <textarea 
//                     className="form-control" 
//                     placeholder="Enter street address, building name, house no." 
//                     rows="2" 
//                     value={showEditPopup ? editData.address : formData.address} 
//                     onChange={e => showEditPopup ? setEditData({...editData, address: e.target.value}) : setFormData({...formData, address: e.target.value})} 
//                   />
//                 </div>
//               </div>
              
//               <div className="d-flex gap-2 mt-4 pt-3 border-top border-secondary">
//                 <button className="btn btn-success flex-grow-1 py-2 fw-bold" onClick={() => handleFinalSave(showEditPopup)}>SAVE ADDRESS</button>
//                 <button className="btn btn-outline-secondary flex-grow-1 py-2" onClick={() => { setShowEditPopup(false); setShowAddPopup(false); }}>CANCEL</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../User/CartContext";
import { 
  X, Trash2, Edit, Plus, MapPin, LogOut, 
  Home, Briefcase, HelpCircle, Phone, Navigation, 
  User as UserIcon, LayoutDashboard, ShoppingBag, ChevronRight, Mail, Globe, Map
} from "lucide-react";

const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

export default function DeliveryAddress() {
  const navigate = useNavigate();
  const { setSelectedAddress, cartItems } = useCart();

  // --- States ---
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState([]);

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const initialForm = {
    fullName: "", 
    gender: "selectgender",
    email: user?.email || "", 
    phoneNumber: "", 
    address: "", 
    customerCity: "", 
    customerState: "", 
    customerZipCode: "", 
    age: "", 
    addressType: "Home"  
  };

  const [formData, setFormData] = useState(initialForm);

  // --- Address Type Selection Handler ---
  const handleTypeChange = (type) => {
    if (showEditPopup) {
      setEditData((prev) => ({ ...prev, addressType: type, AddressType: type }));
    } else {
      setFormData((prev) => ({ ...prev, addressType: type, AddressType: type }));
    }
  };

  const currentType = showEditPopup ? (editData?.addressType || editData?.AddressType || "Home") : (formData.addressType || "Home");

  const fetchModalData = async (type, endpoint) => {
    setActiveModal(type);
    try {
      const res = await axios.get(`https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/${endpoint}`);
      setModalData(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Modal Fetch Error:", err);
      setModalData([]);
    }
  };

  // --- Automatic Pincode Fetching with Strict Bihar Check ---
  useEffect(() => {
    const zip = showEditPopup ? editData?.customerZipCode : formData.customerZipCode;
    if (zip?.length === 6) {
      const fetchPincodeDetails = async () => {
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${zip}`);
          if (response.data[0].Status === "Success") {
            const postOffice = response.data[0].PostOffice[0];
            const fetchedState = postOffice.State;
            const fetchedCity = postOffice.District;

            // Agar State Bihar nahi hai to warning alert
            if (fetchedState.trim().toLowerCase() !== "bihar") {
              alert("⚠️ COMING SOON MEDICINE AVAILABLE");
            }

            const update = { 
              customerCity: fetchedCity, 
              customerState: fetchedState 
            };

            if (showEditPopup) setEditData(prev => ({ ...prev, ...update }));
            else setFormData(prev => ({ ...prev, ...update }));
          } else {
            alert("❌ Invalid Pincode!");
          }
        } catch (error) { 
          console.error("Pincode API Error", error); 
        }
      };
      fetchPincodeDetails();
    }
  }, [formData.customerZipCode, editData?.customerZipCode, showEditPopup]);

  const fetchAddresses = async () => {
    if (!user?.email) { 
      setLoading(false); 
      return; 
    }
    try {
      const res = await axios.get(`${API}/GetAllPatients_Customers`);
      const raw = res.data?.data || res.data || [];
      
      const filtered = raw.filter(
        item => item.email?.trim().toLowerCase() === user?.email?.trim().toLowerCase()
      );
      
      setAddresses(filtered.sort((a, b) => a.patient_CustomerId - b.patient_CustomerId));
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchAddresses(); }, [user]);

  // --- Final Save Validation ---
  const handleFinalSave = async (isUpdate) => {
    const data = isUpdate ? editData : formData;
    
    // Strict State Validation Check
    if (!data.customerState || data.customerState.trim().toLowerCase() !== "bihar") {
      alert("❌ COMING SOON MEDICINE AVAILABLE");
      return;
    }

    const payload = {
      ...data,
      addressType: data.addressType || data.AddressType || "Home",
      AddressType: data.addressType || data.AddressType || "Home",
      patient_CustomerId: isUpdate ? data.patient_CustomerId : 0
    };

    try {
      if (isUpdate) {
        await axios.put(`${API}/UpdatePatient_Customer`, payload);
      } else {
        await axios.post(`${API}/AddPatient_Customer`, payload);
      }
      setShowEditPopup(false); 
      setShowAddPopup(false);
      setFormData(initialForm);
      fetchAddresses();
      alert("✅ Address Saved Successfully!");
    } catch (err) { alert("Action Failed. Please check connection."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this address?")) {
      try {
        await axios.delete(`https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/DeletePatient/${id}`);
        fetchAddresses();
        alert("✅ Address Deleted Successfully!");
      } catch (err) { 
        console.error("Delete Error:", err.response || err.message);
        alert("Failed to delete. Please check network/API route setup.");
      }
    }
  };

  if (loading) return <div className="vh-100 bg-dark d-flex justify-content-center align-items-center text-success fw-bold">Loading...</div>;

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
        .modern-submenu button { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; background: none; border: none; text-align: left; width: 100%; cursor: pointer; transition: all 0.15s ease; }
        .modern-submenu button:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
        .sidebar-footer { margin-top: auto; border-top: 1px solid #f1f5f9; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .user-profile-card { display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
        .user-avatar { width: 38px; height: 38px; background-color: #dcfce7; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem; }
        .user-info { display: flex; flex-direction: column; overflow: hidden; }
        .user-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .user-role { font-size: 0.7rem; color: #64748b; font-weight: 500; }
        .modern-logout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #ef4444; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 8px; transition: background 0.2s; }
        .modern-logout-btn:hover { background-color: #fef2f2; }
        .main-workspace { margin-left: 270px; width: calc(100% - 270px); padding: 32px; box-sizing: border-box; }
        
        /* Fixed Form Input & Autofill Text Color Fixes */
        .modal-body-custom input, 
        .modal-body-custom select, 
        .modal-body-custom textarea { 
          color: #ffffff !important; 
          background-color: #1e293b !important; 
          border: 1px solid #475569 !important;
        }
        .modal-body-custom input:-webkit-autofill,
        .modal-body-custom input:-webkit-autofill:hover, 
        .modal-body-custom input:-webkit-autofill:focus, 
        .modal-body-custom input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #1e293b inset !important;
          -webkit-text-fill-color: #ffffff !important;
        }
        .modal-body-custom input:focus, 
        .modal-body-custom select:focus, 
        .modal-body-custom textarea:focus {
          border-color: #0fa462 !important;
          box-shadow: 0 0 0 2px rgba(15, 164, 98, 0.25) !important;
        }
        .modal-body-custom input::placeholder, 
        .modal-body-custom textarea::placeholder { 
          color: #94a3b8 !important; 
          opacity: 1 !important; 
        }
        .modal-body-custom option {
          background-color: #1e293b !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* SIDEBAR (UNTOUCHED) */}
      <div className="modern-sidebar">
        <div>
          <Link to="/dashboards" className="modern-brand">
            <img src="/AKMedizostore.png" alt="logo" width="36" height="36" style={{ objectFit: 'contain' }} />
            <span>AK Medistore</span>
          </Link>

          <ul className="modern-nav-menu">
            <li>
              <button className={`modern-nav-item ${openDashboard ? "active" : ""}`} onClick={() => setOpenDashboard(!openDashboard)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-chart-pie"></i>
                  <span>Dashboard</span>
                </div>
                <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>

              {openDashboard && (
                <ul className="modern-submenu">
                  <li><button onClick={() => fetchModalData("med", "AllMedicationtracker")}>Medication Tracker</button></li>
                  <li><button onClick={() => fetchModalData("test", "AllTestReports")}>Test Reports</button></li>
                  <li><button onClick={() => fetchModalData("health", "AllHealthHistory")}>Health History</button></li>
                  <li><button onClick={() => fetchModalData("monthly", "AllMonthlyProgress")}>Monthly Progress</button></li>
                  <li><button onClick={() => fetchModalData("prescriptions", "AllPrescriptions")}>Prescriptions</button></li>
                  <li><button onClick={() => fetchModalData("history", "AllHistory")}>History</button></li>
                  <li><button onClick={() => fetchModalData("support", "AllticketHelpSupport")}>Help & Support</button></li>
                  <li><button onClick={() => setActiveModal("settings")}>Settings</button></li>
                  <li><button onClick={() => fetchModalData("lab", "AllOffersAsync")} style={{ color: "#0fa462", fontWeight: "700" }}>🧪 LAB TEST PANEL</button></li>
                </ul>
              )}
            </li>

            <li>
              <button className="modern-nav-item" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>
              {openMasterUpdate && (
                <ul className="modern-submenu">
                  <li><button onClick={() => window.location.href="/deliveryaddress"}>Delivery Address</button></li>
                  <li><button onClick={() => window.location.href="/addbankrefundableamounts"}>Refund Bank Details</button></li>
                  <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                </ul>
              )}
            </li>

            <li><Link to="/medicinedisplay" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
            <li>
              <Link to="/carts" className="modern-nav-item">
                <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
                {cartItems.length > 0 && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>{cartItems.length}</span>}
              </Link>
            </li>
            <li><Link to="/order" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div></Link></li>
            <li>
              <Link to="/customeraddmedicines" className="modern-nav-item">
                <div className="modern-link-content">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>Unavailable Medicines</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="modern-nav-item">
                <div className="modern-link-content">
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">
              {user ? (user.firstName ? user.firstName.charAt(0).toUpperCase() : "U") : "U"}
            </div>
            <div className="user-info">
              <span className="user-name">
                {user ? `${user.firstName} ${user.lastName || ""}` : "Guest User"}
              </span>
              <span className="user-role">Customer Account</span>
            </div>
          </div>
          <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-grow-1 p-4 overflow-auto main-workspace">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
          <h4 className="fw-bold m-0 d-flex align-items-center gap-2 text-dark"><MapPin className="text-success" /> My Delivery Addresses</h4>
          <button className="btn btn-success px-4 rounded-pill fw-bold" onClick={() => { setFormData(initialForm); setShowAddPopup(true); }}><Plus size={18}/> ADD NEW</button>
        </div>

        <div className="row">
          {addresses.length === 0 ? (
            <div className="text-center text-muted py-5">No delivery addresses found. Click "ADD NEW" to create one.</div>
          ) : (
            addresses.map((addr, idx) => (
              <div key={addr.patient_CustomerId} className="col-12 mb-3">
                <div className={`p-4 border rounded-4 cursor-pointer transition-all ${selectedIndex === idx ? "border-success bg-success bg-opacity-10 shadow-lg" : "border-secondary bg-black"}`} onClick={() => setSelectedIndex(idx)}>
                  <div className="d-flex justify-content-between">
                    <div className="w-100">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        {/* Selected Address Type Show Here */}
                        <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || addr.AddressType || 'Home'}</span>
                        <span className="badge bg-dark border border-success text-success" style={{fontSize: '10px'}}>{addr.gender}</span>
                      </div>
                      <h6 className="fw-bold text-white mb-1">{addr.fullName}</h6>
                      <div className="small text-white-50 mb-1"><Mail size={14} className="me-2"/>{addr.email}</div>
                      <div className="small text-info mb-1"><Phone size={14} className="me-2"/>{addr.phoneNumber}</div>
                      <div className="small text-white-50 mb-3"><Navigation size={14} className="me-2"/>{addr.address}</div>
                      
                      <div className="pt-2 border-top border-secondary row g-0 text-center">
                          <div className="col-4 border-end border-secondary"><small className="d-block text-muted">CITY</small><span className="text-success small">{addr.customerCity || "N/A"}</span></div>
                          <div className="col-4 border-end border-secondary"><small className="d-block text-muted">STATE</small><span className="text-white small">{addr.customerState || "N/A"}</span></div>
                          <div className="col-4"><small className="d-block text-muted">PIN</small><span className="text-warning small">{addr.customerZipCode || "N/A"}</span></div>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 ms-3">
                      <button className="btn btn-sm btn-outline-info border-0" onClick={(e) => { e.stopPropagation(); setEditData(addr); setShowEditPopup(true); }}><Edit size={18}/></button>
                      <button className="btn btn-sm btn-outline-danger border-0" onClick={(e) => { e.stopPropagation(); handleDelete(addr.patient_CustomerId); }}><Trash2 size={18}/></button>
                    </div>
                  </div>
                  {selectedIndex === idx && (
                    <button className="btn btn-warning w-100 mt-3 fw-bold py-2 shadow" onClick={() => { setSelectedAddress(addr); navigate("/carts"); }}>DELIVER HERE <ChevronRight size={16}/></button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {(showEditPopup || showAddPopup) && (
        <div className="modal-overlay d-flex justify-content-center align-items-center p-3" style={{position:'fixed', inset:0, background: 'rgba(0,0,0,0.85)', zIndex: 1200}}>
          <div className="bg-dark p-4 rounded-4 border border-secondary shadow-lg overflow-auto modal-body-custom" style={{width: '100%', maxWidth: '500px', maxHeight: '90vh'}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-success fw-bold m-0">{showEditPopup ? "✏️ Edit Address" : "🏠 Add New Address"}</h5>
              <button className="btn btn-sm text-white" onClick={() => { setShowEditPopup(false); setShowAddPopup(false); }}><X size={20}/></button>
            </div>
            
            <div className="row g-3">
              <div className="col-12 mb-2">
                <label className="small text-light mb-2 d-block fw-semibold">Save Address As:</label>
                <div className="d-flex gap-2">
                  {['Home', 'Office', 'Other'].map(type => (
                    <button 
                      key={type} 
                      type="button" 
                      className={`btn btn-sm flex-fill fw-bold ${currentType === type ? 'btn-success' : 'btn-outline-secondary text-white'}`}
                      onClick={() => handleTypeChange(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-12">
                <label className="small text-light mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={showEditPopup ? (editData?.fullName || "") : formData.fullName} 
                  onChange={(e) => showEditPopup ? setEditData({...editData, fullName: e.target.value}) : setFormData({...formData, fullName: e.target.value})} 
                  placeholder="Enter full name"
                />
              </div>

              <div className="col-md-6">
                <label className="small text-light mb-1">Gender</label>
                <select 
                  className="form-control" 
                  value={showEditPopup ? (editData?.gender || "selectgender") : formData.gender}
                  onChange={(e) => showEditPopup ? setEditData({...editData, gender: e.target.value}) : setFormData({...formData, gender: e.target.value})}
                >
                  <option value="selectgender" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="small text-light mb-1">Age</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={showEditPopup ? (editData?.age || 0) : formData.age} 
                  onChange={(e) => showEditPopup ? setEditData({...editData, age: Number(e.target.value)}) : setFormData({...formData, age: Number(e.target.value)})} 
                  placeholder="Age"
                />
              </div>

              <div className="col-md-6">
                <label className="small text-light mb-1">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={showEditPopup ? (editData?.email || "") : formData.email} 
                  onChange={(e) => showEditPopup ? setEditData({...editData, email: e.target.value}) : setFormData({...formData, email: e.target.value})} 
                  placeholder="Email"
                />
              </div>

              <div className="col-md-6">
                <label className="small text-light mb-1">Phone Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  MaxLength="10"  
                  value={showEditPopup ? (editData?.phoneNumber || "") : formData.phoneNumber} 
                  onChange={(e) => showEditPopup ? setEditData({...editData, phoneNumber: e.target.value}) : setFormData({...formData, phoneNumber: e.target.value})} 
                  placeholder="Phone Number"
                />
              </div>

              <div className="col-12">
                <label className="small text-light mb-1">Street Address</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  value={showEditPopup ? (editData?.address || "") : formData.address} 
                  onChange={(e) => showEditPopup ? setEditData({...editData, address: e.target.value}) : setFormData({...formData, address: e.target.value})} 
                  placeholder="House no, street, landmark"
                ></textarea>
              </div>

              <div className="col-md-4">
                <label className="small text-light mb-1">Pincode</label>
                <input 
                  type="text" 
                  maxLength="6" 
                  className="form-control" 
                  value={showEditPopup ? (editData?.customerZipCode || "") : formData.customerZipCode} 
                  onChange={(e) => showEditPopup ? setEditData({...editData, customerZipCode: e.target.value}) : setFormData({...formData, customerZipCode: e.target.value})} 
                  placeholder="6 digits"
                />
              </div>

              <div className="col-md-4">
                <label className="small text-light mb-1">City</label>
                <input 
                  type="text" 
                  className="form-control" 
                  readOnly 
                  value={showEditPopup ? (editData?.customerCity || "") : formData.customerCity} 
                  placeholder="Auto-fetched"
                />
              </div>

              <div className="col-md-4">
                <label className="small text-light mb-1">State</label>
                <input 
                  type="text" 
                  className="form-control" 
                  readOnly 
                  value={showEditPopup ? (editData?.customerState || "") : formData.customerState} 
                  placeholder="Auto-fetched"
                />
              </div>

              <div className="col-12 mt-4 d-flex gap-2">
                <button className="btn btn-secondary flex-fill" onClick={() => { setShowEditPopup(false); setShowAddPopup(false); }}>Cancel</button>
                <button className="btn btn-success flex-fill fw-bold" onClick={() => handleFinalSave(showEditPopup)}>Save Address</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
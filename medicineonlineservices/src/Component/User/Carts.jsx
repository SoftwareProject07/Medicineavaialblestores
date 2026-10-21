// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import { Plus, Minus, Trash2, Edit2, ChevronLeft, Trash, Check, MapPin } from "lucide-react";
// import axios from "axios";

// const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

// export default function Carts() {
//   const { cartItems, removeFromCart, updateQuantity, selectedAddress, setSelectedAddress } = useCart();
  
//   const [user, setUser] = useState(null);
//   const [openDashboard, setOpenDashboard] = useState(false);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//   const [allAddresses, setAllAddresses] = useState([]);

//   const navigate = useNavigate();

//   // Load User and Fetch Logged-in Customer Addresses from API
//   const fetchCustomerAddresses = async (currentUserEmail) => {
//     if (!currentUserEmail) return;
//     try {
//       const res = await axios.get(`${API}/GetAllPatients_Customers`);
//       const raw = res.data?.data || res.data || [];
//       const filtered = raw.filter(item => item.email?.toLowerCase() === currentUserEmail.toLowerCase());
//       setAllAddresses(filtered);
      
//       if (!selectedAddress && filtered.length > 0) {
//         setSelectedAddress(filtered[0]);
//         localStorage.setItem("selectedDeliveryAddress", JSON.stringify(filtered[0]));
//       }
//     } catch (err) {
//       console.error("Error fetching cart addresses:", err);
//     }
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//         if (parsedUser?.email) {
//           fetchCustomerAddresses(parsedUser.email);
//         }
//       } catch (e) {
//         console.error("Error parsing user from localStorage", e);
//       }
//     }

//     if (!selectedAddress) {
//       const savedStoredAddr = localStorage.getItem("selectedDeliveryAddress");
//       if (savedStoredAddr && savedStoredAddr !== "undefined" && savedStoredAddr !== "null") {
//         try {
//           setSelectedAddress(JSON.parse(savedStoredAddr));
//         } catch (e) {
//           console.error("Error parsing stored address", e);
//         }
//       }
//     }
//   }, []);

//   const handleOpenModal = () => {
//     if (user?.email) {
//       fetchCustomerAddresses(user.email);
//     }
//     setIsAddressModalOpen(true);
//   };

//   const handleSelectAddressObj = (addr) => {
//     setSelectedAddress(addr);
//     localStorage.setItem("selectedDeliveryAddress", JSON.stringify(addr));
//     setIsAddressModalOpen(false);
//   };

//   // --- QUANTITY DECREASE HANDLER ---
//   const handleDecrease = (item) => {
//     if (item.quantity <= 1) {
//       removeFromCart(item.id);
//     } else {
//       updateQuantity(item.id, item.quantity - 1);
//     }
//   };

//   // --- PRICE CALCULATIONS ---
//   const totalMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
//   const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
//   const finalPayableAmount = subtotal + 7 - 8;

//   const userInitial = user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "U";
//   const fullName = user ? `${user.firstName} ${user.lastName || ""}` : "User Account";

//   return (
//     <>
//       <style>{`
//         :root {
//             --primary-green: #0fa462;
//             --hover-bg: #e8f7f0;
//             --text-dark: #2d3748;
//             --text-gray: #718096;
//             --danger-red: #e53e3e;
//             --border-color: #edf2f7;
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
//             padding: 12px 14px;
//             color: var(--text-dark);
//             text-decoration: none;
//             border-radius: 10px;
//             font-weight: 600;
//             font-size: 0.95rem;
//             transition: all 0.2s ease;
//             background: transparent;
//             border: none;
//             width: 100%;
//             text-align: left;
//             cursor: pointer;
//         }

//         .nav-item.active {
//             background-color: var(--primary-green);
//             color: #ffffff;
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

//         .nav-item.dropdown-toggle-btn {
//             border: 1px solid var(--border-color);
//             background-color: #fafafa;
//         }

//         .submenu-container {
//             display: flex;
//             flex-direction: column;
//             gap: 4px;
//             padding-left: 20px;
//             margin-top: 4px;
//             margin-bottom: 6px;
//         }

//         .submenu-item {
//             display: flex;
//             align-items: center;
//             gap: 10px;
//             padding: 8px 12px;
//             color: var(--text-gray);
//             text-decoration: none;
//             font-size: 0.88rem;
//             font-weight: 500;
//             border-radius: 8px;
//             transition: all 0.2s;
//         }

//         .submenu-item:hover {
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
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
//             padding: 12px;
//             background-color: #f8fafc;
//             border-radius: 12px;
//             border: 1px solid var(--border-color);
//         }

//         .user-avatar {
//             width: 40px;
//             height: 40px;
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: 700;
//             font-size: 1.1rem;
//             flex-shrink: 0;
//         }

//         .user-info {
//             display: flex;
//             flex-direction: column;
//             overflow: hidden;
//         }

//         .user-name {
//             font-weight: 600;
//             font-size: 0.9rem;
//             color: var(--text-dark);
//             white-space: nowrap;
//             text-overflow: ellipsis;
//             overflow: hidden;
//         }

//         .user-role {
//             font-size: 0.75rem;
//             color: var(--text-gray);
//             font-weight: 500;
//         }

//         .logout-btn {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             padding: 12px 14px;
//             color: var(--danger-red);
//             text-decoration: none;
//             font-weight: 600;
//             font-size: 0.95rem;
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
//       `}</style>

//       <div className="d-flex bg-dark min-vh-100 text-white w-100">
        
//         {/* ---------- SIDEBAR ---------- */}
//         <div className="custom-sidebar">
//           <div>
//             <div className="brand-header">
//               <i className="fa-solid fa-bag-shopping brand-logo"></i>
//               <Link to="/dashboards" className="brand-name">AK Medistore</Link>
//             </div>

//             <nav className="nav-menu">
//               <div>
//                 <button 
//                   className={`nav-item dropdown-toggle-btn ${openDashboard ? 'active' : ''}`} 
//                   onClick={() => setOpenDashboard(!openDashboard)}
//                 >
//                   <div className="nav-link-left">
//                     <i className="fa-solid fa-chart-pie"></i>
//                     <span>Dashboard</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-${openDashboard ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//                 </button>

//                 {openDashboard && (
//                   <div className="submenu-container">
//                     <Link to="/medication-tracker" className="submenu-item"><i className="fa-solid fa-pills"></i> Medication Tracker</Link>
//                     <Link to="/test-reports" className="submenu-item"><i className="fa-solid fa-file-medical"></i> Test Reports</Link>
//                     <Link to="/health-history" className="submenu-item"><i className="fa-solid fa-heart-pulse"></i> Health History</Link>
//                     <Link to="/monthly-progress" className="submenu-item"><i className="fa-solid fa-chart-line"></i> Monthly Progress</Link>
//                     <Link to="/prescriptions" className="submenu-item"><i className="fa-solid fa-prescription"></i> Prescriptions</Link>
//                     <Link to="/history" className="submenu-item"><i className="fa-solid fa-clock-rotate-left"></i> History</Link>
//                     <Link to="/support" className="submenu-item"><i className="fa-solid fa-headset"></i> Help & Support</Link>
//                     <Link to="/settings" className="submenu-item"><i className="fa-solid fa-gear"></i> Settings</Link>
                    

//                      {/* <li><button onClick={() => fetchModalData("med", "AllMedicationtracker")}>Medication Tracker</button></li>
//                   <li><button onClick={() => fetchModalData("test", "AllTestReports")}>Test Reports</button></li>
//                   <li><button onClick={() => fetchModalData("health", "AllHealthHistory")}>Health History</button></li>
//                   <li><button onClick={() => fetchModalData("monthly", "AllMonthlyProgress")}>Monthly Progress</button></li>
//                   <li><button onClick={() => fetchModalData("prescriptions", "AllPrescriptions")}>Prescriptions</button></li>
//                   <li><button onClick={() => fetchModalData("history", "AllHistory")}>History</button></li>
//                   <li><button onClick={() => fetchModalData("support", "AllticketHelpSupport")}>Help & Support</button></li>
//                   <li><button onClick={() => setActiveModal("settings")}>Settings</button></li>
//                   <li><button onClick={() => fetchModalData("lab", "AllOffersAsync")} style={{ color: "#0fa462", fontWeight: "700" }}>🧪 LAB TEST PANEL</button></li> */}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <button 
//                   className={`nav-item dropdown-toggle-btn ${openMasterUpdate ? 'active' : ''}`} 
//                   onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
//                 >
//                   <div className="nav-link-left">
//                     <i className="fa-solid fa-pen-to-square"></i>
//                     <span>Master Update</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-${openMasterUpdate ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//                 </button>

//                 {openMasterUpdate && (
//                   <div className="submenu-container">
//                     <Link to="/deliveryaddress" className="submenu-item">
//                       <i className="fa-solid fa-map-marker-alt"></i> Delivery Address
//                     </Link>
//                     <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
//                     <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
//                   </div>
//                 )}
//               </div>

//               <Link to="/medicinedisplay" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-pills"></i>
//                   <span>Medicines</span>
//                 </div>
//               </Link>

//               <Link to="/carts" className="nav-item active">
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

//               <Link to="/feedbackcustomers" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-comment-dots"></i>
//                   <span>Customer Feedback</span>
//                 </div>
//               </Link>

//               <Link to="/customeraddmedicines" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-circle-exclamation"></i>
//                   <span>Unavailable Medicines</span>
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
//               <div className="user-avatar">{userInitial}</div>
//               <div className="user-info">
//                 <span className="user-name">{fullName}</span>
//                 <span className="user-role">Customer Account</span>
//               </div>
//             </div>

//             <Link to="/header" className="logout-btn">
//               <i className="fa-solid fa-right-from-bracket"></i>
//               <span>Log Out</span>
//             </Link>
//           </div>
//         </div>

//         {/* --- MAIN CONTENT WORKSPACE --- */}
//         <div className="main-workspace flex-grow-1 d-flex flex-column position-relative" style={{ height: '100vh', overflowY: 'auto' }}>
          
//           <div className="p-3 bg-dark border-bottom border-secondary d-flex align-items-center sticky-top shadow-sm">
//             <ChevronLeft className="me-3 cursor-pointer text-info" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
//             <h5 className="mb-0 fw-bold">Store Cart ({cartItems.length})</h5>
//           </div>

//           <div className="p-4" style={{ marginBottom: '180px' }}>
//             <h6 className="mb-4 fw-bold">Medicine - Local Store</h6>
//             {cartItems.map((item) => (
//                <div key={item.id} className="bg-secondary bg-opacity-10 p-3 rounded-3 mb-3 border border-secondary shadow-sm">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         <div className="bg-white rounded p-1" style={{width: '60px', height: '60px'}}>
//                             <img src={item.image || "/medicine-placeholder.png"} className="w-100 h-100 object-fit-contain" alt="" />
//                         </div>
//                         <div className="ms-3">
//                             <h6 className="mb-0 fw-bold small">{item.name}</h6>
//                             <div className="mt-1">
//                                 <span className="fw-bold me-2">₹{item.unitPrice}</span>
//                                 <span className="text-muted text-decoration-line-through small">₹{item.unitPrice + 30}</span>
//                                 <span className="text-success small fw-bold ms-2">15% off</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="d-flex align-items-center border border-secondary rounded-pill px-2 bg-dark" style={{ height: '32px' }}>
//                         <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => handleDecrease(item)}><Minus size={14} /></button>
//                         <span className="mx-3 fw-bold small">{item.quantity}</span>
//                         <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
//                     </div>
//                 </div>
//                </div>
//             ))}
//           </div>

//           {/* --- STICKY FOOTER --- */}
//           <div className="fixed-bottom bg-dark border-top border-secondary shadow-lg" style={{ left: '280px' }}>
//             <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
//               <div>
//                 <h6 className="mb-0 small fw-bold text-muted">Delivery Address</h6>
//                 <div className="text-success small fw-bold mt-1">
//                   {selectedAddress ? (
//                     <span>Deliver to: <strong className="text-white">{selectedAddress.fullName}</strong>, {selectedAddress.customerZipCode || selectedAddress.pincode} ({selectedAddress.addressType || 'Home'})</span>
//                   ) : (
//                     <span className="text-warning">Please select a delivery address</span>
//                   )}
//                 </div>
//               </div>
//               <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={handleOpenModal}>
//                 Change
//               </button>
//             </div>
            
//             <div className="p-3 d-flex align-items-center justify-content-between">
//               <div className="d-flex flex-column">
//                 <span className="text-muted text-decoration-line-through small mb-0">₹{totalMRP}</span>
//                 <h4 className="mb-0 fw-bold text-white">₹{finalPayableAmount}</h4>
//               </div>
              
//               <button 
//                 className={`btn btn-lg px-5 fw-bold ${selectedAddress ? 'btn-primary shadow' : 'btn-secondary disabled'}`} 
//                 onClick={() => {
//                   if (selectedAddress) {
//                     localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
//                     localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
//                     navigate("/CompletePayments", { 
//                       state: { 
//                         selectedAddress: selectedAddress,
//                         cartItems: cartItems,
//                         finalPayableAmount: finalPayableAmount 
//                       } 
//                     });
//                   }
//                 }}
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>

//           {/* --- FLIPKART STYLE ADDRESS SELECTION MODAL --- */}
//           {isAddressModalOpen && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
//               <div className="bg-dark border border-secondary p-4 rounded-4 shadow-lg" style={{ width: '600px', maxWidth: '95%' }}>
                
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
//                   <h5 className="mb-0 fw-bold text-white">Select delivery address</h5>
//                   <button className="btn btn-outline-light btn-sm rounded-circle" onClick={() => setIsAddressModalOpen(false)}>✕</button>
//                 </div>

//                 <div className="mb-3">
//                   <button className="btn btn-outline-success w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
//                     <Plus size={18}/> Add New Address
//                   </button>
//                 </div>

//                 <div className="overflow-auto pe-2" style={{ maxHeight: '380px' }}>
//                   {allAddresses && allAddresses.length > 0 ? (
//                     allAddresses.map((addr) => {
//                       const isSelected = selectedAddress?.patient_CustomerId === addr.patient_CustomerId || selectedAddress?.id === addr.id;
//                       return (
//                         <div 
//                           key={addr.patient_CustomerId || addr.id || Math.random()} 
//                           className={`p-3 border rounded-3 mb-3 cursor-pointer transition-all ${isSelected ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-black'}`}
//                           style={{ cursor: 'pointer' }}
//                           onClick={() => handleSelectAddressObj(addr)}
//                         >
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div>
//                               <div className="d-flex align-items-center gap-2 mb-2">
//                                 <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || 'Home'}</span>
//                                 {isSelected && <span className="badge bg-success text-white" style={{fontSize: '10px'}}>Selected</span>}
//                               </div>
//                               <h6 className="mb-1 fw-bold text-white">{addr.fullName} <span className="text-info fw-normal ms-2 small">{addr.phoneNumber || addr.mobileNumber}</span></h6>
//                               <p className="text-white-50 mb-2 small">{addr.address}, {addr.customerCity || addr.city}, {addr.customerState || addr.state} - <strong className="text-warning">{addr.customerZipCode || addr.pincode}</strong></p>
//                             </div>
                            
//                             <div className="form-check">
//                               <input 
//                                 className="form-check-input bg-dark border-secondary" 
//                                 type="radio" 
//                                 checked={isSelected} 
//                                 onChange={() => handleSelectAddressObj(addr)} 
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="text-center py-5 text-muted">
//                       <p className="mb-3">No delivery address found for your account.</p>
//                       <button className="btn btn-sm btn-success fw-bold px-4" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
//                         Add Address Now
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-end">
//                   <button className="btn btn-outline-secondary btn-sm px-4 fw-bold" onClick={() => setIsAddressModalOpen(false)}>CLOSE</button>
//                 </div>

//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );

// }

//2...........................................



// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import { Plus, Minus, Trash2, Edit2, ChevronLeft, Trash, Check, MapPin, X } from "lucide-react";
// import axios from "axios";

// const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

// export default function Carts() {
//   const { cartItems, removeFromCart, updateQuantity, selectedAddress, setSelectedAddress } = useCart();
  
//   const [user, setUser] = useState(null);
//   const [openDashboard, setOpenDashboard] = useState(false);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//   const [allAddresses, setAllAddresses] = useState([]);

//   // States for dynamic modals from Sidebar
//   const [activeModal, setActiveModal] = useState(null); 
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalData, setModalData] = useState([]);
//   const [labTab, setLabTab] = useState("packages");
//   const [searchQuery, setSearchQuery] = useState("");

//   // State for individual Row View Details modal
//   const [selectedRowDetail, setSelectedRowDetail] = useState(null);

//   const navigate = useNavigate();

//   const fetchCustomerAddresses = async (currentUserEmail) => {
//     if (!currentUserEmail) return;
//     try {
//       const res = await axios.get(`${API}/GetAllPatients_Customers`);
//       const raw = res.data?.data || res.data || [];
//       const filtered = raw.filter(item => item.email?.toLowerCase() === currentUserEmail.toLowerCase());
//       setAllAddresses(filtered);
      
//       if (!selectedAddress && filtered.length > 0) {
//         setSelectedAddress(filtered[0]);
//         localStorage.setItem("selectedDeliveryAddress", JSON.stringify(filtered[0]));
//       }
//     } catch (err) {
//       console.error("Error fetching cart addresses:", err);
//     }
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//         if (parsedUser?.email) {
//           fetchCustomerAddresses(parsedUser.email);
//         }
//       } catch (e) {
//         console.error("Error parsing user from localStorage", e);
//       }
//     }

//     if (!selectedAddress) {
//       const savedStoredAddr = localStorage.getItem("selectedDeliveryAddress");
//       if (savedStoredAddr && savedStoredAddr !== "undefined" && savedStoredAddr !== "null") {
//         try {
//           setSelectedAddress(JSON.parse(savedStoredAddr));
//         } catch (e) {
//           console.error("Error parsing stored address", e);
//         }
//       }
//     }
//   }, []);

//   const handleOpenModal = () => {
//     if (user?.email) {
//       fetchCustomerAddresses(user.email);
//     }
//     setIsAddressModalOpen(true);
//   };

//   const handleSelectAddressObj = (addr) => {
//     setSelectedAddress(addr);
//     localStorage.setItem("selectedDeliveryAddress", JSON.stringify(addr));
//     setIsAddressModalOpen(false);
//   };

//   const fetchModalData = (modalType, titleName) => {
//     setActiveModal(modalType);
//     setModalTitle(titleName);

//     if (modalType === "med") {
//       setModalData([
//         { id: 1, name: "Paracetamol 650mg", description: "Take 1 tablet after breakfast", status: "Active", time: "09:00 AM", dosage: "1 Tablet" }
//       ]);
//     } else if (modalType === "test") {
//       setModalData([
//         { id: 1, name: "Kidney Function Test (KFT)", description: "Serum Creatinine, Urea, Uric Acid levels normal.", status: "Normal", date: "2026-09-20", lab: "AIIMS Diagnostics" }
//       ]);
//     } else if (modalType === "health") {
//       setModalData([
//         { id: "HLT-01", name: "Seasonal Allergy", description: "Mild pollen allergy reported in spring season.", status: "Stable", doctor: "Dr. Sharma" }
//       ]);
//     } else if (modalType === "monthly") {
//       setModalData([
//         { id: 1, name: "September Health Progress", description: "Blood pressure and sugar levels in control.", status: "Active", score: "92/100" }
//       ]);
//     } else if (modalType === "prescriptions") {
//       setModalData([
//         { id: 1, name: "Dr. A. Verma Prescription", description: "Antibiotics & multivitamins course for 5 days.", status: "Valid", date: "2026-09-10" }
//       ]);
//     } else if (modalType === "history") {
//       setModalData([
//         { id: 1, name: "General Checkup", description: "Routine health screening completed successfully.", status: "Completed", date: "2026-08-15" }
//       ]);
//     } else if (modalType === "support") {
//       setModalData([
//         { id: 5, name: "Delivery Delay Inquiry", description: "Order #10294 delayed due to heavy rain.", status: "OPEN", priority: "High" },
//         { id: 3, name: "Refund Request", description: "Refund initiated for cancelled medicine item.", status: "OPEN", priority: "Medium" }
//       ]);
//     } else if (modalType === "lab") {
//       setModalData([
//         { id: 1, name: "Ultrasound Whole Abdomen", description: "Complete abdominal scan with digital report", price: 1200, type: "Home Collection" },
//         { id: 2, name: "Complete Blood Count (CBC)", description: "Includes hemoglobin, RBC, WBC count", price: 350, type: "Home Collection" }
//       ]);
//     }
//   };

//   const handleDecrease = (item) => {
//     if (item.quantity <= 1) {
//       removeFromCart(item.id);
//     } else {
//       updateQuantity(item.id, item.quantity - 1);
//     }
//   };

//   const totalMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
//   const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
//   const finalPayableAmount = subtotal + 7 - 8;

//   const userInitial = user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "U";
//   const fullName = user ? `${user.firstName} ${user.lastName || ""}` : "User Account";

//   return (
//     <>
//       <style>{`
//         :root {
//             --primary-green: #0fa462;
//             --hover-bg: #e8f7f0;
//             --text-dark: #2d3748;
//             --text-gray: #718096;
//             --danger-red: #e53e3e;
//             --border-color: #edf2f7;
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
//             padding: 12px 14px;
//             color: var(--text-dark);
//             text-decoration: none;
//             border-radius: 10px;
//             font-weight: 600;
//             font-size: 0.95rem;
//             transition: all 0.2s ease;
//             background: transparent;
//             border: none;
//             width: 100%;
//             text-align: left;
//             cursor: pointer;
//         }

//         .nav-item.active {
//             background-color: var(--primary-green);
//             color: #ffffff;
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

//         .nav-item.dropdown-toggle-btn {
//             border: 1px solid var(--border-color);
//             background-color: #fafafa;
//         }

//         .submenu-container {
//             display: flex;
//             flex-direction: column;
//             gap: 4px;
//             padding-left: 20px;
//             margin-top: 4px;
//             margin-bottom: 6px;
//         }

//         .submenu-item {
//             display: flex;
//             align-items: center;
//             gap: 10px;
//             padding: 8px 12px;
//             color: var(--text-gray);
//             text-decoration: none;
//             font-size: 0.88rem;
//             font-weight: 500;
//             border-radius: 8px;
//             transition: all 0.2s;
//             background: transparent;
//             border: none;
//             width: 100%;
//             text-align: left;
//             cursor: pointer;
//         }

//         .submenu-item:hover {
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
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
//             padding: 12px;
//             background-color: #f8fafc;
//             border-radius: 12px;
//             border: 1px solid var(--border-color);
//         }

//         .user-avatar {
//             width: 40px;
//             height: 40px;
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: 700;
//             font-size: 1.1rem;
//             flex-shrink: 0;
//         }

//         .user-info {
//             display: flex;
//             flex-direction: column;
//             overflow: hidden;
//         }

//         .user-name {
//             font-weight: 600;
//             font-size: 0.9rem;
//             color: var(--text-dark);
//             white-space: nowrap;
//             text-overflow: ellipsis;
//             overflow: hidden;
//         }

//         .user-role {
//             font-size: 0.75rem;
//             color: var(--text-gray);
//             font-weight: 500;
//         }

//         .logout-btn {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             padding: 12px 14px;
//             color: var(--danger-red);
//             text-decoration: none;
//             font-weight: 600;
//             font-size: 0.95rem;
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
//       `}</style>

//       <div className="d-flex bg-dark min-vh-100 text-white w-100">
        
//         {/* --- SIDEBAR --- */}
//         <div className="custom-sidebar">
//           <div>
//             <div className="brand-header">
//               <i className="fa-solid fa-bag-shopping brand-logo"></i>
//               <Link to="/dashboards" className="brand-name">AK Medistore</Link>
//             </div>

//             <nav className="nav-menu">
//               <div>
//                 <button 
//                   className={`nav-item dropdown-toggle-btn ${openDashboard ? 'active' : ''}`} 
//                   onClick={() => setOpenDashboard(!openDashboard)}
//                 >
//                   <div className="nav-link-left">
//                     <i className="fa-solid fa-chart-pie"></i>
//                     <span>Dashboard</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-${openDashboard ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//                 </button>

//                 {openDashboard && (
//                   <div className="submenu-container">
//                     <button onClick={() => fetchModalData("med", "AllMedicationtracker")} className="submenu-item">
//                       <i className="fa-solid fa-pills"></i> Medication Tracker
//                     </button>
//                     <button onClick={() => fetchModalData("test", "AllTestReports")} className="submenu-item">
//                       <i className="fa-solid fa-file-medical"></i> Test Reports
//                     </button>
//                     <button onClick={() => fetchModalData("health", "AllHealthHistory")} className="submenu-item">
//                       <i className="fa-solid fa-heart-pulse"></i> Health History
//                     </button>
//                     <button onClick={() => fetchModalData("monthly", "AllMonthlyProgress")} className="submenu-item">
//                       <i className="fa-solid fa-chart-line"></i> Monthly Progress
//                     </button>
//                     <button onClick={() => fetchModalData("prescriptions", "AllPrescriptions")} className="submenu-item">
//                       <i className="fa-solid fa-prescription"></i> Prescriptions
//                     </button>
//                     <button onClick={() => fetchModalData("history", "AllHistory")} className="submenu-item">
//                       <i className="fa-solid fa-clock-rotate-left"></i> History
//                     </button>
//                     <button onClick={() => fetchModalData("support", "AllticketHelpSupport")} className="submenu-item">
//                       <i className="fa-solid fa-headset"></i> Help & Support
//                     </button>
//                     <button onClick={() => setActiveModal("settings")} className="submenu-item">
//                       <i className="fa-solid fa-gear"></i> Settings
//                     </button>
//                     <button onClick={() => fetchModalData("lab", "AllOffersAsync")} className="submenu-item" style={{ color: "#0fa462", fontWeight: "700" }}>
//                       🧪 LAB TEST PANEL
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <button 
//                   className={`nav-item dropdown-toggle-btn ${openMasterUpdate ? 'active' : ''}`} 
//                   onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
//                 >
//                   <div className="nav-link-left">
//                     <i className="fa-solid fa-pen-to-square"></i>
//                     <span>Master Update</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-${openMasterUpdate ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//                 </button>

//                 {openMasterUpdate && (
//                   <div className="submenu-container">
//                     <Link to="/deliveryaddress" className="submenu-item">
//                       <i className="fa-solid fa-map-marker-alt"></i> Delivery Address
//                     </Link>
//                     <Link to="/addbankrefundableamounts" className="submenu-item"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link>
//                     <Link to="/bankdetailsrefundlist" className="submenu-item" style={{ color: '#0fa462', fontWeight: '600' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link>
//                   </div>
//                 )}
//               </div>

//               <Link to="/medicinedisplay" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-pills"></i>
//                   <span>Medicines</span>
//                 </div>
//               </Link>

//               <Link to="/carts" className="nav-item active">
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

//               <Link to="/feedbackcustomers" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-comment-dots"></i>
//                   <span>Customer Feedback</span>
//                 </div>
//               </Link>

//               <Link to="/customeraddmedicines" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-circle-exclamation"></i>
//                   <span>Unavailable Medicines</span>
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
//               <div className="user-avatar">{userInitial}</div>
//               <div className="user-info">
//                 <span className="user-name">{fullName}</span>
//                 <span className="user-role">Customer Account</span>
//               </div>
//             </div>

//             <Link to="/header" className="logout-btn">
//               <i className="fa-solid fa-right-from-bracket"></i>
//               <span>Log Out</span>
//             </Link>
//           </div>
//         </div>

//         {/* --- MAIN CONTENT WORKSPACE --- */}
//         <div className="main-workspace flex-grow-1 d-flex flex-column position-relative" style={{ height: '100vh', overflowY: 'auto' }}>
          
//           <div className="p-3 bg-dark border-bottom border-secondary d-flex align-items-center sticky-top shadow-sm">
//             <ChevronLeft className="me-3 cursor-pointer text-info" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
//             <h5 className="mb-0 fw-bold">Store Cart ({cartItems.length})</h5>
//           </div>

//           <div className="p-4" style={{ marginBottom: '180px' }}>
//             <h6 className="mb-4 fw-bold">Medicine - Local Store</h6>
//             {cartItems.map((item) => (
//                <div key={item.id} className="bg-secondary bg-opacity-10 p-3 rounded-3 mb-3 border border-secondary shadow-sm">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         <div className="bg-white rounded p-1" style={{width: '60px', height: '60px'}}>
//                             <img src={item.image || "/medicine-placeholder.png"} className="w-100 h-100 object-fit-contain" alt="" />
//                         </div>
//                         <div className="ms-3">
//                             <h6 className="mb-0 fw-bold small">{item.name}</h6>
//                             <div className="mt-1">
//                                 <span className="fw-bold me-2">₹{item.unitPrice}</span>
//                                 <span className="text-muted text-decoration-line-through small">₹{item.unitPrice + 30}</span>
//                                 <span className="text-success small fw-bold ms-2">15% off</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="d-flex align-items-center border border-secondary rounded-pill px-2 bg-dark" style={{ height: '32px' }}>
//                         <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => handleDecrease(item)}><Minus size={14} /></button>
//                         <span className="mx-3 fw-bold small">{item.quantity}</span>
//                         <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
//                     </div>
//                 </div>
//                </div>
//             ))}
//           </div>

//           {/* --- STICKY FOOTER --- */}
//           <div className="fixed-bottom bg-dark border-top border-secondary shadow-lg" style={{ left: '280px' }}>
//             <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
//               <div>
//                 <h6 className="mb-0 small fw-bold text-muted">Delivery Address</h6>
//                 <div className="text-success small fw-bold mt-1">
//                   {selectedAddress ? (
//                     <span>Deliver to: <strong className="text-white">{selectedAddress.fullName}</strong>, {selectedAddress.customerZipCode || selectedAddress.pincode} ({selectedAddress.addressType || 'Home'})</span>
//                   ) : (
//                     <span className="text-warning">Please select a delivery address</span>
//                   )}
//                 </div>
//               </div>
//               <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={handleOpenModal}>
//                 Change
//               </button>
//             </div>
            
//             <div className="p-3 d-flex align-items-center justify-content-between">
//               <div className="d-flex flex-column">
//                 <span className="text-muted text-decoration-line-through small mb-0">₹{totalMRP}</span>
//                 <h4 className="mb-0 fw-bold text-white">₹{finalPayableAmount}</h4>
//               </div>
              
//               <button 
//                 className={`btn btn-lg px-5 fw-bold ${selectedAddress ? 'btn-primary shadow' : 'btn-secondary disabled'}`} 
//                 onClick={() => {
//                   if (selectedAddress) {
//                     localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
//                     localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
//                     navigate("/CompletePayments", { 
//                       state: { 
//                         selectedAddress: selectedAddress,
//                         cartItems: cartItems,
//                         finalPayableAmount: finalPayableAmount 
//                       } 
//                     });
//                   }
//                 }}
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>

//           {/* --- ADDRESS SELECTION MODAL --- */}
//           {isAddressModalOpen && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
//               <div className="bg-dark border border-secondary p-4 rounded-4 shadow-lg text-white" style={{ width: '600px', maxWidth: '95%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
//                   <h5 className="mb-0 fw-bold">Select delivery address</h5>
//                   <button className="btn btn-outline-light btn-sm rounded-circle" onClick={() => setIsAddressModalOpen(false)}>✕</button>
//                 </div>

//                 <div className="mb-3">
//                   <button className="btn btn-outline-success w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
//                     <Plus size={18}/> Add New Address
//                   </button>
//                 </div>

//                 <div className="overflow-auto pe-2" style={{ maxHeight: '380px' }}>
//                   {allAddresses && allAddresses.length > 0 ? (
//                     allAddresses.map((addr) => {
//                       const isSelected = selectedAddress?.patient_CustomerId === addr.patient_CustomerId || selectedAddress?.id === addr.id;
//                       return (
//                         <div 
//                           key={addr.patient_CustomerId || addr.id || Math.random()} 
//                           className={`p-3 border rounded-3 mb-3 cursor-pointer transition-all ${isSelected ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-black'}`}
//                           style={{ cursor: 'pointer' }}
//                           onClick={() => handleSelectAddressObj(addr)}
//                         >
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div>
//                               <div className="d-flex align-items-center gap-2 mb-2">
//                                 <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || 'Home'}</span>
//                                 {isSelected && <span className="badge bg-success text-white" style={{fontSize: '10px'}}>Selected</span>}
//                               </div>
//                               <h6 className="mb-1 fw-bold text-white">{addr.fullName} <span className="text-info fw-normal ms-2 small">{addr.phoneNumber || addr.mobileNumber}</span></h6>
//                               <p className="text-white-50 mb-2 small">{addr.address}, {addr.customerCity || addr.city}, {addr.customerState || addr.state} - <strong className="text-warning">{addr.customerZipCode || addr.pincode}</strong></p>
//                             </div>
                            
//                             <div className="form-check">
//                               <input 
//                                 className="form-check-input bg-dark border-secondary" 
//                                 type="radio" 
//                                 checked={isSelected} 
//                                 onChange={() => handleSelectAddressObj(addr)} 
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="text-center py-5 text-muted">
//                       <p className="mb-3">No delivery address found for your account.</p>
//                       <button className="btn btn-sm btn-success fw-bold px-4" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
//                         Add Address Now
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-end">
//                   <button className="btn btn-outline-secondary btn-sm px-4 fw-bold" onClick={() => setIsAddressModalOpen(false)}>CLOSE</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- DYNAMIC SIDEBAR DETAILS & ACTION LIST MODAL (Table Format) --- */}
//           {activeModal && activeModal !== 'lab' && activeModal !== 'settings' && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '750px', maxWidth: '95%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                   <h5 className="mb-0 fw-bold text-uppercase">{modalTitle.replace("All", "")} Details & Action List</h5>
//                   <button className="btn btn-sm btn-light border" onClick={() => setActiveModal(null)}><X size={16} /></button>
//                 </div>

//                 <div className="table-responsive">
//                   <table className="table align-middle">
//                     <thead className="table-light">
//                       <tr>
//                         <th>S.No.</th>
//                         <th>ID / Ref</th>
//                         <th>Name / Title</th>
//                         <th>Details & Description</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {modalData.map((row, index) => (
//                         <tr key={index}>
//                           <td className="text-success fw-bold">#{index + 1}</td>
//                           <td>{row.id}</td>
//                           <td className="fw-bold">{row.name}</td>
//                           <td className="text-muted small">{row.description}</td>
//                           <td><span className="badge bg-success bg-opacity-75 text-white">{row.status}</span></td>
//                           <td>
//                             <button 
//                               className="btn btn-success btn-sm px-3 fw-bold" 
//                               style={{ fontSize: '12px' }}
//                               onClick={() => setSelectedRowDetail(row)}
//                             >
//                               View Details
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="d-flex justify-content-end mt-3">
//                   <button className="btn btn-secondary btn-sm px-4" onClick={() => setActiveModal(null)}>Close</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- INDIVIDUAL ROW VIEW DETAILS POPUP MODAL --- */}
//           {selectedRowDetail && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.8)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '450px', maxWidth: '90%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                   <h6 className="mb-0 fw-bold text-success">📋 Detailed Record Information</h6>
//                   <button className="btn btn-sm btn-light border" onClick={() => setSelectedRowDetail(null)}><X size={16} /></button>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Record ID / Ref:</p>
//                   <h6 className="fw-bold">{selectedRowDetail.id}</h6>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Name / Title:</p>
//                   <h6 className="fw-bold text-dark">{selectedRowDetail.name}</h6>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Description & Notes:</p>
//                   <p className="p-2 bg-light rounded border small mb-0">{selectedRowDetail.description}</p>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Current Status:</p>
//                   <span className="badge bg-success">{selectedRowDetail.status}</span>
//                 </div>
//                 <div className="d-flex justify-content-end mt-4">
//                   <button className="btn btn-dark btn-sm px-4 fw-bold" onClick={() => setSelectedRowDetail(null)}>Done</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- LAB TEST PANEL MODAL --- */}
//           {activeModal === 'lab' && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '750px', maxWidth: '95%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                   <h5 className="mb-0 fw-bold">🧪 Lab Test Hub: Categories & Health Packages</h5>
//                   <button className="btn btn-sm btn-light border" onClick={() => setActiveModal(null)}><X size={16} /></button>
//                 </div>

//                 <div className="d-flex gap-2 mb-3">
//                   <button className={`btn btn-sm ${labTab === 'packages' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setLabTab('packages')}>🔥 Health Packages / Offers</button>
//                   <button className={`btn btn-sm ${labTab === 'blood' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setLabTab('blood')}>🩸 Blood Tests (Home Collection)</button>
//                   <button className={`btn btn-sm ${labTab === 'radiology' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setLabTab('radiology')}>🩻 Radiology / Lab Visit</button>
//                 </div>

//                 <div className="mb-3">
//                   <input 
//                     type="text" 
//                     className="form-control" 
//                     placeholder="Search specific test, disease or health package..." 
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                 </div>

//                 <div className="row g-3 overflow-auto" style={{ maxHeight: '350px' }}>
//                   {modalData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((test, index) => (
//                     <div className="col-md-6" key={index}>
//                       <div className="border rounded-3 p-3 position-relative bg-light">
//                         <div className="d-flex justify-content-between align-items-start">
//                           <h6 className="fw-bold mb-1">{test.name}</h6>
//                           <span className="badge bg-info text-dark" style={{fontSize: '10px'}}>{test.type}</span>
//                         </div>
//                         <p className="text-muted small mb-3">{test.description}</p>
//                         <div className="d-flex justify-content-between align-items-center">
//                           <span className="fw-bold text-success fs-5">₹{test.price}</span>
//                           <button className="btn btn-success btn-sm px-3 fw-bold">Book Now</button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- SETTINGS MODAL --- */}
//           {activeModal === 'settings' && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '650px', maxWidth: '95%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                   <h5 className="mb-0 fw-bold">⚙️ Account Settings & Customer Preferences</h5>
//                   <button className="btn btn-sm btn-light border" onClick={() => setActiveModal(null)}><X size={16} /></button>
//                 </div>

//                 <div className="border rounded-3 p-3 mb-3 bg-light">
//                   <h6 className="fw-bold small text-muted mb-2">🎨 Appearance & Theme Settings</h6>
//                   <div className="form-check mb-2">
//                     <input className="form-check-input" type="checkbox" id="darkModeCheck" />
//                     <label className="form-check-label small" htmlFor="darkModeCheck">
//                       <strong>Dark / Light Mode</strong>
//                       <div className="text-muted" style={{fontSize: '11px'}}>Switch dashboard theme appearance</div>
//                     </label>
//                   </div>
//                   <div className="form-check">
//                     <input className="form-check-input" type="checkbox" id="syncThemeCheck" defaultChecked />
//                     <label className="form-check-label small" htmlFor="syncThemeCheck">
//                       <strong>Automatic System Theme Sync</strong>
//                       <div className="text-muted" style={{fontSize: '11px'}}>Match theme automatically with your device settings</div>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="border rounded-3 p-3 mb-3 bg-light">
//                   <h6 className="fw-bold small text-muted mb-2">🔔 Notification & Communication Preferences</h6>
//                   <div className="form-check">
//                     <input className="form-check-input" type="checkbox" id="notifCheck" defaultChecked />
//                     <label className="form-check-label small" htmlFor="notifCheck">
//                       <strong>Push & SMS Notifications</strong>
//                       <div className="text-muted" style={{fontSize: '11px'}}>Get real-time updates for lab reports, phlebotomist tracking & reminders</div>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="d-flex justify-content-end gap-2">
//                   <button className="btn btn-secondary btn-sm px-4" onClick={() => setActiveModal(null)}>Cancel</button>
//                   <button className="btn btn-success btn-sm px-4 fw-bold" onClick={() => setActiveModal(null)}>Save Changes</button>
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }





//3////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import { Plus, Minus, Trash2, Edit2, ChevronLeft, Trash, Check, MapPin, X } from "lucide-react";
// import axios from "axios";

// const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

// // Sample Lab Tests Data for Lab Test Hub
// const allLabTests = [
//   { id: 1, name: "Ultrasound Whole Abdomen", category: "radiology", type: "Lab Visit", price: 1200, description: "Complete abdominal scan with digital report", tag: "Lab Visit" },
//   { id: 2, name: "Complete Blood Count (CBC)", category: "blood", type: "Home Collection", price: 350, description: "Includes hemoglobin, RBC, WBC count", tag: "Home Collection" },
//   { id: 3, name: "Lipid Profile", category: "package", type: "Health Packages / Offers", price: 600, description: "Cholesterol, Triglycerides, HDL, LDL levels", tag: "Offers" },
//   { id: 4, name: "Thyroid Profile (T3, T4, TSH)", category: "blood", type: "Blood Tests (Home Collection)", price: 450, description: "Evaluates thyroid gland performance", tag: "Home Collection" },
//   { id: 5, name: "X-Ray Chest", category: "radiology", type: "Radiology / Lab Visit", price: 500, description: "Chest X-Ray with digital imaging", tag: "Lab Visit" },
// ];

// export default function Carts() {
//   const { cartItems, removeFromCart, updateQuantity, selectedAddress, setSelectedAddress } = useCart();
  
//   const [user, setUser] = useState(null);
//   const [openDashboard, setOpenDashboard] = useState(false);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//   const [allAddresses, setAllAddresses] = useState([]);

//   // States for dynamic modals from Sidebar
//   const [activeModal, setActiveModal] = useState(null); 
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalData, setModalData] = useState([]);

//   // State for individual Row View Details modal
//   const [selectedRowDetail, setSelectedRowDetail] = useState(null);

//   // States for Lab Test Hub & Booking Form
//   const [labTab, setLabTab] = useState("package"); // 'package', 'blood', 'radiology'
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedTest, setSelectedTest] = useState(null); // Triggers Booking Form when clicked

//   // Booking Form State
//   const [bookingForm, setBookingForm] = useState({
//     fullName: "",
//     mobile: "",
//     age: "",
//     gender: "Male",
//     sampleMode: "Home Collection",
//     address: "",
//     pincode: "",
//     date: "",
//     timeSlot: "07:00 AM - 09:00 AM"
//   });

//   const navigate = useNavigate();

//   const fetchCustomerAddresses = async (currentUserEmail) => {
//     if (!currentUserEmail) return;
//     try {
//       const res = await axios.get(`${API}/GetAllPatients_Customers`);
//       const raw = res.data?.data || res.data || [];
//       const filtered = raw.filter(item => item.email?.toLowerCase() === currentUserEmail.toLowerCase());
//       setAllAddresses(filtered);
      
//       if (!selectedAddress && filtered.length > 0) {
//         setSelectedAddress(filtered[0]);
//         localStorage.setItem("selectedDeliveryAddress", JSON.stringify(filtered[0]));
//       }
//     } catch (err) {
//       console.error("Error fetching cart addresses:", err);
//     }
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//         if (parsedUser?.email) {
//           fetchCustomerAddresses(parsedUser.email);
//         }
//       } catch (e) {
//         console.error("Error parsing user from localStorage", e);
//       }
//     }

//     if (!selectedAddress) {
//       const savedStoredAddr = localStorage.getItem("selectedDeliveryAddress");
//       if (savedStoredAddr && savedStoredAddr !== "undefined" && savedStoredAddr !== "null") {
//         try {
//           setSelectedAddress(JSON.parse(savedStoredAddr));
//         } catch (e) {
//           console.error("Error parsing stored address", e);
//         }
//       }
//     }
//   }, []);

//   const handleOpenModal = () => {
//     if (user?.email) {
//       fetchCustomerAddresses(user.email);
//     }
//     setIsAddressModalOpen(true);
//   };

//   const handleSelectAddressObj = (addr) => {
//     setSelectedAddress(addr);
//     localStorage.setItem("selectedDeliveryAddress", JSON.stringify(addr));
//     setIsAddressModalOpen(false);
//   };

//   const fetchModalData = (modalType, titleName) => {
//     setActiveModal(modalType);
//     setModalTitle(titleName);
//     setSelectedTest(null); // Reset lab booking form view

//     if (modalType === "med") {
//       setModalData([
//         { id: 1, name: "Paracetamol 650mg", description: "Take 1 tablet after breakfast", status: "Active", time: "09:00 AM", dosage: "1 Tablet" }
//       ]);
//     } else if (modalType === "test") {
//       setModalData([
//         { id: 1, name: "Kidney Function Test (KFT)", description: "Serum Creatinine, Urea, Uric Acid levels normal.", status: "Normal", date: "2026-09-20", lab: "AIIMS Diagnostics" }
//       ]);
//     } else if (modalType === "health") {
//       setModalData([
//         { id: "HLT-01", name: "Seasonal Allergy", description: "Mild pollen allergy reported in spring season.", status: "Stable", doctor: "Dr. Sharma" }
//       ]);
//     } else if (modalType === "monthly") {
//       setModalData([
//         { id: 1, name: "September Health Progress", description: "Blood pressure and sugar levels in control.", status: "Active", score: "92/100" }
//       ]);
//     } else if (modalType === "prescriptions") {
//       setModalData([
//         { id: 1, name: "Dr. A. Verma Prescription", description: "Antibiotics & multivitamins course for 5 days.", status: "Valid", date: "2026-09-10" }
//       ]);
//     } else if (modalType === "history") {
//       setModalData([
//         { id: 1, name: "General Checkup", description: "Routine health screening completed successfully.", status: "Completed", date: "2026-08-15" }
//       ]);
//     } else if (modalType === "support") {
//       setModalData([
//         { id: 5, name: "Delivery Delay Inquiry", description: "Order #10294 delayed due to heavy rain.", status: "OPEN", priority: "High" },
//         { id: 3, name: "Refund Request", description: "Refund initiated for cancelled medicine item.", status: "OPEN", priority: "Medium" }
//       ]);
//     }
//   };

//   const handleDecrease = (item) => {
//     if (item.quantity <= 1) {
//       removeFromCart(item.id);
//     } else {
//       updateQuantity(item.id, item.quantity - 1);
//     }
//   };

//   // Filter Lab Tests based on active tab and search query
//   const filteredLabTests = allLabTests.filter(test => {
//     const matchesTab = 
//       (labTab === 'package' && test.category === 'package') ||
//       (labTab === 'blood' && test.category === 'blood') ||
//       (labTab === 'radiology' && test.category === 'radiology');
    
//     const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesTab && matchesSearch;
//   });

//   const handleBookingFormSubmit = (e) => {
//     e.preventDefault();
//     if (!bookingForm.pincode || !bookingForm.fullName || !bookingForm.mobile) {
//       alert('Kripya sabhi mandatory fields (Name, Mobile, Pincode) bharein!');
//       return;
//     }
//     alert(`Lab Test Booking Confirmed successfully for ${selectedTest.name}!`);
//     setSelectedTest(null);
//     setActiveModal(null);
//   };

//   const totalMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
//   const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
//   const finalPayableAmount = subtotal + 7 - 8;

//   const userInitial = user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "U";
//   const fullName = user ? `${user.firstName} ${user.lastName || ""}` : "User Account";

//   return (
//     <>
//       <style>{`
//         :root {
//             --primary-green: #0fa462;
//             --hover-bg: #e8f7f0;
//             --text-dark: #2d3748;
//             --text-gray: #718096;
//             --danger-red: #e53e3e;
//             --border-color: #edf2f7;
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
//             padding: 12px 14px;
//             color: var(--text-dark);
//             text-decoration: none;
//             border-radius: 10px;
//             font-weight: 600;
//             font-size: 0.95rem;
//             transition: all 0.2s ease;
//             background: transparent;
//             border: none;
//             width: 100%;
//             text-align: left;
//             cursor: pointer;
//         }

//         .nav-item.active {
//             background-color: var(--primary-green);
//             color: #ffffff;
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

//         .nav-item.dropdown-toggle-btn {
//             border: 1px solid var(--border-color);
//             background-color: #fafafa;
//         }

//         .submenu-container {
//             display: flex;
//             flex-direction: column;
//             gap: 4px;
//             padding-left: 20px;
//             margin-top: 4px;
//             margin-bottom: 6px;
//         }

//         .submenu-item {
//             display: flex;
//             align-items: center;
//             gap: 10px;
//             padding: 8px 12px;
//             color: var(--text-gray);
//             text-decoration: none;
//             font-size: 0.88rem;
//             font-weight: 500;
//             border-radius: 8px;
//             transition: all 0.2s;
//             background: transparent;
//             border: none;
//             width: 100%;
//             text-align: left;
//             cursor: pointer;
//         }

//         .submenu-item:hover {
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
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
//             padding: 12px;
//             background-color: #f8fafc;
//             border-radius: 12px;
//             border: 1px solid var(--border-color);
//         }

//         .user-avatar {
//             width: 40px;
//             height: 40px;
//             background-color: var(--hover-bg);
//             color: var(--primary-green);
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: 700;
//             font-size: 1.1rem;
//             flex-shrink: 0;
//         }

//         .user-info {
//             display: flex;
//             flex-direction: column;
//             overflow: hidden;
//         }

//         .user-name {
//             font-weight: 600;
//             font-size: 0.9rem;
//             color: var(--text-dark);
//             white-space: nowrap;
//             text-overflow: ellipsis;
//             overflow: hidden;
//         }

//         .user-role {
//             font-size: 0.75rem;
//             color: var(--text-gray);
//             font-weight: 500;
//         }

//         .logout-btn {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             padding: 12px 14px;
//             color: var(--danger-red);
//             text-decoration: none;
//             font-weight: 600;
//             font-size: 0.95rem;
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
//       `}</style>

//       <div className="d-flex bg-dark min-vh-100 text-white w-100">
        
//         {/* --- SIDEBAR --- */}
//         <div className="custom-sidebar">
//           <div>
//             <div className="brand-header">
//               <i className="fa-solid fa-bag-shopping brand-logo"></i>
//               <Link to="/dashboards" className="brand-name">AK Medistore</Link>
//             </div>

//             <nav className="nav-menu">
//               <div>
//                 <button 
//                   className={`nav-item dropdown-toggle-btn ${openDashboard ? 'active' : ''}`} 
//                   onClick={() => setOpenDashboard(!openDashboard)}
//                 >
//                   <div className="nav-link-left">
//                     <i className="fa-solid fa-chart-pie"></i>
//                     <span>Dashboard</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-${openDashboard ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//                 </button>

//                 {openDashboard && (
//                   <div className="submenu-container">
//                     <button onClick={() => fetchModalData("med", "AllMedicationtracker")} className="submenu-item">
//                       <i className="fa-solid fa-pills"></i> Medication Tracker
//                     </button>
//                     <button onClick={() => fetchModalData("test", "AllTestReports")} className="submenu-item">
//                       <i className="fa-solid fa-file-medical"></i> Test Reports
//                     </button>
//                     <button onClick={() => fetchModalData("health", "AllHealthHistory")} className="submenu-item">
//                       <i className="fa-solid fa-heart-pulse"></i> Health History
//                     </button>
//                     <button onClick={() => fetchModalData("monthly", "AllMonthlyProgress")} className="submenu-item">
//                       <i className="fa-solid fa-chart-line"></i> Monthly Progress
//                     </button>
//                     <button onClick={() => fetchModalData("prescriptions", "AllPrescriptions")} className="submenu-item">
//                       <i className="fa-solid fa-prescription"></i> Prescriptions
//                     </button>
//                     <button onClick={() => fetchModalData("history", "AllHistory")} className="submenu-item">
//                       <i className="fa-solid fa-clock-rotate-left"></i> History
//                     </button>
//                     <button onClick={() => fetchModalData("support", "AllticketHelpSupport")} className="submenu-item">
//                       <i className="fa-solid fa-headset"></i> Help & Support
//                     </button>
//                     <button onClick={() => setActiveModal("settings")} className="submenu-item">
//                       <i className="fa-solid fa-gear"></i> Settings
//                     </button>
//                     <button onClick={() => { setActiveModal("lab"); setSelectedTest(null); }} className="submenu-item" style={{ color: "#0fa462", fontWeight: "700" }}>
//                       🧪 LAB TEST PANEL
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <button 
//                   className={`nav-item dropdown-toggle-btn ${openMasterUpdate ? 'active' : ''}`} 
//                   onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
//                 >
//                   <div className="nav-link-left">
//                     <i className="fa-solid fa-pen-to-square"></i>
//                     <span>Master Update</span>
//                   </div>
//                   <i className={`fa-solid fa-chevron-${openMasterUpdate ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//                 </button>

//                 {openMasterUpdate && (
//                   <div className="submenu-container">
//                     <Link to="/deliveryaddress" className="submenu-item">
//                       <i className="fa-solid fa-map-marker-alt"></i> Delivery Address
//                     </Link>
//                     <Link to="/addbankrefundableamounts" className="submenu-item"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link>
//                     <Link to="/bankdetailsrefundlist" className="submenu-item" style={{ color: '#0fa462', fontWeight: '600' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link>
//                   </div>
//                 )}
//               </div>

//               <Link to="/medicinedisplay" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-pills"></i>
//                   <span>Medicines</span>
//                 </div>
//               </Link>

//               <Link to="/carts" className="nav-item active">
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

//               {/* <Link to="/feedbackcustomers" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-comment-dots"></i>
//                   <span>Customer Feedback</span>
//                 </div>
//               </Link> */}

//               <Link to="/customeraddmedicines" className="nav-item">
//                 <div className="nav-link-left">
//                   <i className="fa-solid fa-circle-exclamation"></i>
//                   <span>Unavailable Medicines</span>
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
//               <div className="user-avatar">{userInitial}</div>
//               <div className="user-info">
//                 <span className="user-name">{fullName}</span>
//                 <span className="user-role">Customer Account</span>
//               </div>
//             </div>

//             <Link to="/header" className="logout-btn">
//               <i className="fa-solid fa-right-from-bracket"></i>
//               <span>Log Out</span>
//             </Link>
//           </div>
//         </div>

//         {/* --- MAIN CONTENT WORKSPACE --- */}
//         <div className="main-workspace flex-grow-1 d-flex flex-column position-relative" style={{ height: '100vh', overflowY: 'auto' }}>
          
//           <div className="p-3 bg-dark border-bottom border-secondary d-flex align-items-center sticky-top shadow-sm">
//             <ChevronLeft className="me-3 cursor-pointer text-info" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
//             <h5 className="mb-0 fw-bold">Store Cart ({cartItems.length})</h5>
//           </div>

//           <div className="p-4" style={{ marginBottom: '180px' }}>
//             <h6 className="mb-4 fw-bold">Medicine - Local Store</h6>
//             {cartItems.map((item) => (
//                <div key={item.id} className="bg-secondary bg-opacity-10 p-3 rounded-3 mb-3 border border-secondary shadow-sm">
//                 <div className="d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         <div className="bg-white rounded p-1" style={{width: '60px', height: '60px'}}>
//                             <img src={item.image || "/medicine-placeholder.png"} className="w-100 h-100 object-fit-contain" alt="" />
//                         </div>
//                         <div className="ms-3">
//                             <h6 className="mb-0 fw-bold small">{item.name}</h6>
//                             <div className="mt-1">
//                                 <span className="fw-bold me-2">₹{item.unitPrice}</span>
//                                 <span className="text-muted text-decoration-line-through small">₹{item.unitPrice + 30}</span>
//                                 <span className="text-success small fw-bold ms-2">15% off</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="d-flex align-items-center border border-secondary rounded-pill px-2 bg-dark" style={{ height: '32px' }}>
//                         <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => handleDecrease(item)}><Minus size={14} /></button>
//                         <span className="mx-3 fw-bold small">{item.quantity}</span>
//                         <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
//                     </div>
//                 </div>
//                </div>
//             ))}
//           </div>

//           {/* --- STICKY FOOTER --- */}
//           <div className="fixed-bottom bg-dark border-top border-secondary shadow-lg" style={{ left: '280px' }}>
//             <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
//               <div>
//                 <h6 className="mb-0 small fw-bold text-muted">Delivery Address</h6>
//                 <div className="text-success small fw-bold mt-1">
//                   {selectedAddress ? (
//                     <span>Deliver to: <strong className="text-white">{selectedAddress.fullName}</strong>, {selectedAddress.customerZipCode || selectedAddress.pincode} ({selectedAddress.addressType || 'Home'})</span>
//                   ) : (
//                     <span className="text-warning">Please select a delivery address</span>
//                   )}
//                 </div>
//               </div>
//               <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={handleOpenModal}>
//                 Change
//               </button>
//             </div>
            
//             <div className="p-3 d-flex align-items-center justify-content-between">
//               <div className="d-flex flex-column">
//                 <span className="text-muted text-decoration-line-through small mb-0">₹{totalMRP}</span>
//                 <h4 className="mb-0 fw-bold text-white">₹{finalPayableAmount}</h4>
//               </div>
              
//               <button 
//                 className={`btn btn-lg px-5 fw-bold ${selectedAddress ? 'btn-primary shadow' : 'btn-secondary disabled'}`} 
//                 onClick={() => {
//                   if (selectedAddress) {
//                     localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
//                     localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
//                     navigate("/CompletePayments", { 
//                       state: { 
//                         selectedAddress: selectedAddress,
//                         cartItems: cartItems,
//                         finalPayableAmount: finalPayableAmount 
//                       } 
//                     });
//                   }
//                 }}
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>

//           {/* --- ADDRESS SELECTION MODAL --- */}
//           {isAddressModalOpen && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
//               <div className="bg-dark border border-secondary p-4 rounded-4 shadow-lg text-white" style={{ width: '600px', maxWidth: '95%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
//                   <h5 className="mb-0 fw-bold">Select delivery address</h5>
//                   <button className="btn btn-outline-light btn-sm rounded-circle" onClick={() => setIsAddressModalOpen(false)}>✕</button>
//                 </div>

//                 <div className="mb-3">
//                   <button className="btn btn-outline-success w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
//                     <Plus size={18}/> Add New Address
//                   </button>
//                 </div>

//                 <div className="overflow-auto pe-2" style={{ maxHeight: '380px' }}>
//                   {allAddresses && allAddresses.length > 0 ? (
//                     allAddresses.map((addr) => {
//                       const isSelected = selectedAddress?.patient_CustomerId === addr.patient_CustomerId || selectedAddress?.id === addr.id;
//                       return (
//                         <div 
//                           key={addr.patient_CustomerId || addr.id || Math.random()} 
//                           className={`p-3 border rounded-3 mb-3 cursor-pointer transition-all ${isSelected ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-black'}`}
//                           style={{ cursor: 'pointer' }}
//                           onClick={() => handleSelectAddressObj(addr)}
//                         >
//                           <div className="d-flex justify-content-between align-items-start">
//                             <div>
//                               <div className="d-flex align-items-center gap-2 mb-2">
//                                 <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || 'Home'}</span>
//                                 {isSelected && <span className="badge bg-success text-white" style={{fontSize: '10px'}}>Selected</span>}
//                               </div>
//                               <h6 className="mb-1 fw-bold text-white">{addr.fullName} <span className="text-info fw-normal ms-2 small">{addr.phoneNumber || addr.mobileNumber}</span></h6>
//                               <p className="text-white-50 mb-2 small">{addr.address}, {addr.customerCity || addr.city}, {addr.customerState || addr.state} - <strong className="text-warning">{addr.customerZipCode || addr.pincode}</strong></p>
//                             </div>
                            
//                             <div className="form-check">
//                               <input 
//                                 className="form-check-input bg-dark border-secondary" 
//                                 type="radio" 
//                                 checked={isSelected} 
//                                 onChange={() => handleSelectAddressObj(addr)} 
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="text-center py-5 text-muted">
//                       <p className="mb-3">No delivery address found for your account.</p>
//                       <button className="btn btn-sm btn-success fw-bold px-4" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
//                         Add Address Now
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-end">
//                   <button className="btn btn-outline-secondary btn-sm px-4 fw-bold" onClick={() => setIsAddressModalOpen(false)}>CLOSE</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- STANDARD SIDEBAR DETAILS MODAL --- */}
//           {activeModal && activeModal !== 'lab' && activeModal !== 'settings' && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '750px', maxWidth: '95%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                   <h5 className="mb-0 fw-bold text-uppercase">{modalTitle.replace("All", "")} Details & Action List</h5>
//                   <button className="btn btn-sm btn-light border" onClick={() => setActiveModal(null)}><X size={16} /></button>
//                 </div>

//                 <div className="table-responsive">
//                   <table className="table align-middle">
//                     <thead className="table-light">
//                       <tr>
//                         <th>S.No.</th>
//                         <th>ID / Ref</th>
//                         <th>Name / Title</th>
//                         <th>Details & Description</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {modalData.map((row, index) => (
//                         <tr key={index}>
//                           <td className="text-success fw-bold">#{index + 1}</td>
//                           <td>{row.id}</td>
//                           <td className="fw-bold">{row.name}</td>
//                           <td className="text-muted small">{row.description}</td>
//                           <td><span className="badge bg-success bg-opacity-75 text-white">{row.status}</span></td>
//                           <td>
//                             <button 
//                               className="btn btn-success btn-sm px-3 fw-bold" 
//                               style={{ fontSize: '12px' }}
//                               onClick={() => setSelectedRowDetail(row)}
//                             >
//                               View Details
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className="d-flex justify-content-end mt-3">
//                   <button className="btn btn-secondary btn-sm px-4" onClick={() => setActiveModal(null)}>Close</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- INDIVIDUAL ROW VIEW DETAILS POPUP MODAL --- */}
//           {selectedRowDetail && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.8)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '450px', maxWidth: '90%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                   <h6 className="mb-0 fw-bold text-success">📋 Detailed Record Information</h6>
//                   <button className="btn btn-sm btn-light border" onClick={() => setSelectedRowDetail(null)}><X size={16} /></button>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Record ID / Ref:</p>
//                   <h6 className="fw-bold">{selectedRowDetail.id}</h6>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Name / Title:</p>
//                   <h6 className="fw-bold text-dark">{selectedRowDetail.name}</h6>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Description & Notes:</p>
//                   <p className="p-2 bg-light rounded border small mb-0">{selectedRowDetail.description}</p>
//                 </div>
//                 <div className="mb-3">
//                   <p className="mb-1 text-muted small">Current Status:</p>
//                   <span className="badge bg-success">{selectedRowDetail.status}</span>
//                 </div>
//                 <div className="d-flex justify-content-end mt-4">
//                   <button className="btn btn-dark btn-sm px-4 fw-bold" onClick={() => setSelectedRowDetail(null)}>Done</button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* --- LAB TEST HUB MODAL & PATIENT BOOKING FORM --- */}
//           {activeModal === 'lab' && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '750px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                
//                 {/* Condition: If no test is selected, show Lab Test Hub list & categories */}
//                 {!selectedTest ? (
//                   <>
//                     <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                       <h5 className="mb-0 fw-bold">🧪 Lab Test Hub: Categories & Health Packages</h5>
//                       <button className="btn btn-sm btn-light border" onClick={() => setActiveModal(null)}><X size={16} /></button>
//                     </div>

//                     <div className="d-flex gap-2 mb-3">
//                       <button className={`btn btn-sm ${labTab === 'package' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setLabTab('package')}>🔥 Health Packages / Offers</button>
//                       <button className={`btn btn-sm ${labTab === 'blood' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setLabTab('blood')}>🩸 Blood Tests (Home Collection)</button>
//                       <button className={`btn btn-sm ${labTab === 'radiology' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setLabTab('radiology')}>🩻 Radiology / Lab Visit</button>
//                     </div>

//                     <div className="mb-3">
//                       <input 
//                         type="text" 
//                         className="form-control" 
//                         placeholder="Search specific test, disease or health package..." 
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                       />
//                     </div>

//                     <div className="row g-3" style={{ minHeight: '220px' }}>
//                       {filteredLabTests.length > 0 ? (
//                         filteredLabTests.map((test) => (
//                           <div className="col-md-6" key={test.id}>
//                             <div className="border rounded-3 p-3 position-relative bg-light h-100 d-flex flex-column justify-content-between">
//                               <div>
//                                 <div className="d-flex justify-content-between align-items-start">
//                                   <h6 className="fw-bold mb-1">{test.name}</h6>
//                                   <span className="badge bg-info text-dark" style={{fontSize: '10px'}}>{test.tag}</span>
//                                 </div>
//                                 <p className="text-muted small mb-3">{test.description}</p>
//                               </div>
//                               <div className="d-flex justify-content-between align-items-center mt-2">
//                                 <span className="fw-bold text-success fs-5">₹{test.price}</span>
//                                 <button className="btn btn-success btn-sm px-3 fw-bold" onClick={() => setSelectedTest(test)}>Book Now</button>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="col-12 text-center py-5 text-muted">
//                           <p className="mb-0">No lab tests found matching your search.</p>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 ) : (
//                   /* Condition: If a test is selected, show Patient Details & Booking Form */
//                   <>
//                     <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                       <h5 className="mb-0 fw-bold">📝 Patient Details & Booking: {selectedTest.name}</h5>
//                       <button className="btn btn-sm btn-light border" onClick={() => setSelectedTest(null)}><X size={16} /></button>
//                     </div>

//                     <form onSubmit={handleBookingFormSubmit} className="d-flex flex-column gap-3">
//                       <div className="bg-light p-3 rounded border d-flex justify-content-between align-items-center">
//                         <div>
//                           <span className="text-muted small d-block">Selected Test / Package</span>
//                           <strong className="text-dark">{selectedTest.name}</strong>
//                         </div>
//                         <span className="text-success fw-bold fs-5">₹{selectedTest.price}</span>
//                       </div>

//                       <div className="row g-2">
//                         <div className="col-md-6">
//                           <label className="form-label small fw-bold">Patient Full Name *</label>
//                           <input type="text" className="form-control" name="fullName" placeholder="Enter full name" value={bookingForm.fullName} onChange={(e) => setBookingForm({...bookingForm, fullName: e.target.value})} required />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label small fw-bold">Mobile Number (For Updates) *</label>
//                           <input type="text" className="form-control" name="mobile" placeholder="10-digit mobile number" value={bookingForm.mobile} onChange={(e) => setBookingForm({...bookingForm, mobile: e.target.value})} required />
//                         </div>
//                       </div>

//                       <div className="row g-2">
//                         <div className="col-md-6">
//                           <label className="form-label small fw-bold">Age & Gender</label>
//                           <div className="input-group">
//                             <input type="number" className="form-control" placeholder="Age" value={bookingForm.age} onChange={(e) => setBookingForm({...bookingForm, age: e.target.value})} />
//                             <select className="form-select" value={bookingForm.gender} onChange={(e) => setBookingForm({...bookingForm, gender: e.target.value})}>
//                               <option value="Male">Male</option>
//                               <option value="Female">Female</option>
//                               <option value="Other">Other</option>
//                             </select>
//                           </div>
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label small fw-bold">Sample Collection Mode</label>
//                           <select className="form-select" value={bookingForm.sampleMode} onChange={(e) => setBookingForm({...bookingForm, sampleMode: e.target.value})}>
//                             <option value="Home Collection">Home Collection</option>
//                             <option value="Lab Visit">Lab Visit</option>
//                           </select>
//                         </div>
//                       </div>

//                       <div>
//                         <label className="form-label small fw-bold">Full Address (House No, Street, Area) *</label>
//                         <input type="text" className="form-control" placeholder="Enter complete address" value={bookingForm.address} onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})} required />
//                       </div>

//                       <div className="row g-2">
//                         <div className="col-md-6">
//                           <label className="form-label small fw-bold">Pincode (Required) *</label>
//                           <input type="text" className="form-control" placeholder="Enter 6-digit pincode" value={bookingForm.pincode} onChange={(e) => setBookingForm({...bookingForm, pincode: e.target.value})} required />
//                         </div>
//                         <div className="col-md-6">
//                           <label className="form-label small fw-bold">Appointment Date *</label>
//                           <input type="date" className="form-control" value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} required />
//                         </div>
//                       </div>

//                       <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
//                         <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={() => setSelectedTest(null)}>Back to Tests</button>
//                         <button type="submit" className="btn btn-success btn-sm px-4 fw-bold">Confirm Booking & Pay</button>
//                       </div>
//                     </form>
//                   </>
//                 )}

//               </div>
//             </div>
//           )}

//           {/* --- SETTINGS MODAL --- */}
//           {activeModal === 'settings' && (
//             <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
//               <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '650px', maxWidth: '95%' }}>
//                 <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
//                   <h5 className="mb-0 fw-bold">⚙️ Account Settings & Customer Preferences</h5>
//                   <button className="btn btn-sm btn-light border" onClick={() => setActiveModal(null)}><X size={16} /></button>
//                 </div>

//                 <div className="border rounded-3 p-3 mb-3 bg-light">
//                   <h6 className="fw-bold small text-muted mb-2">🎨 Appearance & Theme Settings</h6>
//                   <div className="form-check mb-2">
//                     <input className="form-check-input" type="checkbox" id="darkModeCheck" />
//                     <label className="form-check-label small" htmlFor="darkModeCheck">
//                       <strong>Dark / Light Mode</strong>
//                       <div className="text-muted" style={{fontSize: '11px'}}>Switch dashboard theme appearance</div>
//                     </label>
//                   </div>
//                   <div className="form-check">
//                     <input className="form-check-input" type="checkbox" id="syncThemeCheck" defaultChecked />
//                     <label className="form-check-label small" htmlFor="syncThemeCheck">
//                       <strong>Automatic System Theme Sync</strong>
//                       <div className="text-muted" style={{fontSize: '11px'}}>Match theme automatically with your device settings</div>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="border rounded-3 p-3 mb-3 bg-light">
//                   <h6 className="fw-bold small text-muted mb-2">🔔 Notification & Communication Preferences</h6>
//                   <div className="form-check">
//                     <input className="form-check-input" type="checkbox" id="notifCheck" defaultChecked />
//                     <label className="form-check-label small" htmlFor="notifCheck">
//                       <strong>Push & SMS Notifications</strong>
//                       <div className="text-muted" style={{fontSize: '11px'}}>Get real-time updates for lab reports, phlebotomist tracking & reminders</div>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="d-flex justify-content-end gap-2">
//                   <button className="btn btn-secondary btn-sm px-4" onClick={() => setActiveModal(null)}>Cancel</button>
//                   <button className="btn btn-success btn-sm px-4 fw-bold" onClick={() => setActiveModal(null)}>Save Changes</button>
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { Plus, Minus, Trash2, Edit2, ChevronLeft, Trash, Check, MapPin, X } from "lucide-react";
import axios from "axios";

const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

const allLabTests = [
  { id: 1, name: "Ultrasound Whole Abdomen", category: "radiology", type: "Lab Visit", price: 1200, description: "Complete abdominal scan with digital report", tag: "Lab Visit" },
  { id: 2, name: "Complete Blood Count (CBC)", category: "blood", type: "Home Collection", price: 350, description: "Includes hemoglobin, RBC, WBC count", tag: "Home Collection" },
  { id: 3, name: "Lipid Profile", category: "package", type: "Health Packages / Offers", price: 600, description: "Cholesterol, Triglycerides, HDL, LDL levels", tag: "Offers" },
  { id: 4, name: "Thyroid Profile (T3, T4, TSH)", category: "blood", type: "Blood Tests (Home Collection)", price: 450, description: "Evaluates thyroid gland performance", tag: "Home Collection" },
  { id: 5, name: "X-Ray Chest", category: "radiology", type: "Radiology / Lab Visit", price: 500, description: "Chest X-Ray with digital imaging", tag: "Lab Visit" },
];

export default function Carts() {
  const { cartItems, removeFromCart, updateQuantity, selectedAddress, setSelectedAddress } = useCart();
  
  const [user, setUser] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);

  const [activeModal, setActiveModal] = useState(null); 
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [selectedRowDetail, setSelectedRowDetail] = useState(null);

  const navigate = useNavigate();

  const fetchCustomerAddresses = async (currentUserEmail) => {
    if (!currentUserEmail) return;
    try {
      const res = await axios.get(`${API}/GetAllPatients_Customers`);
      const raw = res.data?.data || res.data || [];
      const filtered = raw.filter(item => item.email?.toLowerCase() === currentUserEmail.toLowerCase());
      setAllAddresses(filtered);
      
      if (!selectedAddress && filtered.length > 0) {
        setSelectedAddress(filtered[0]);
        localStorage.setItem("selectedDeliveryAddress", JSON.stringify(filtered[0]));
      }
    } catch (err) {
      console.error("Error fetching cart addresses:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser?.email) {
          fetchCustomerAddresses(parsedUser.email);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    if (!selectedAddress) {
      const savedStoredAddr = localStorage.getItem("selectedDeliveryAddress");
      if (savedStoredAddr && savedStoredAddr !== "undefined" && savedStoredAddr !== "null") {
        try {
          setSelectedAddress(JSON.parse(savedStoredAddr));
        } catch (e) {
          console.error("Error parsing stored address", e);
        }
      }
    }
  }, []);

  const handleOpenModal = () => {
    if (user?.email) {
      fetchCustomerAddresses(user.email);
    }
    setIsAddressModalOpen(true);
  };

  const handleSelectAddressObj = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem("selectedDeliveryAddress", JSON.stringify(addr));
    setIsAddressModalOpen(false);
  };

  const fetchModalData = (modalType, titleName) => {
    setActiveModal(modalType);
    setModalTitle(titleName);

    if (modalType === "med") {
      setModalData([
        { id: 1, name: "Paracetamol 650mg", description: "Take 1 tablet after breakfast", status: "Active", time: "09:00 AM", dosage: "1 Tablet" }
      ]);
    } else if (modalType === "test") {
      setModalData([
        { id: 1, name: "Kidney Function Test (KFT)", description: "Serum Creatinine, Urea, Uric Acid levels normal.", status: "Normal", date: "2026-09-20", lab: "AIIMS Diagnostics" }
      ]);
    } else if (modalType === "health") {
      setModalData([
        { id: "HLT-01", name: "Seasonal Allergy", description: "Mild pollen allergy reported in spring season.", status: "Stable", doctor: "Dr. Sharma" }
      ]);
    } else if (modalType === "monthly") {
      setModalData([
        { id: 1, name: "September Health Progress", description: "Blood pressure and sugar levels in control.", status: "Active", score: "92/100" }
      ]);
    } else if (modalType === "prescriptions") {
      setModalData([
        { id: 1, name: "Dr. A. Verma Prescription", description: "Antibiotics & multivitamins course for 5 days.", status: "Valid", date: "2026-09-10" }
      ]);
    } else if (modalType === "history") {
      setModalData([
        { id: 1, name: "General Checkup", description: "Routine health screening completed successfully.", status: "Completed", date: "2026-08-15" }
      ]);
    } else if (modalType === "support") {
      setModalData([
        { id: 5, name: "Delivery Delay Inquiry", description: "Order #10294 delayed due to heavy rain.", status: "OPEN", priority: "High" },
        { id: 3, name: "Refund Request", description: "Refund initiated for cancelled medicine item.", status: "OPEN", priority: "Medium" }
      ]);
    }
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  // --- EXACT TOTAL AMOUNT CALCULATION (BINA KISI EXTRA MINUS/PLUS KE) ---
  const finalPayableAmount = cartItems.reduce((acc, item) => {
    const price = Number(item.unitPrice || item.price || 0);
    const qty = Number(item.quantity) || 1;
    return acc + (price * qty);
  }, 0);

  const totalMRP = cartItems.reduce((acc, item) => {
    const price = Number(item.unitPrice || item.price || 0);
    const qty = Number(item.quantity) || 1;
    return acc + ((price + 30) * qty);
  }, 0);

  const userInitial = user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "U";
  const fullName = user ? `${user.firstName} ${user.lastName || ""}` : "User Account";

  return (
    <>
      <style>{`
        :root {
            --primary-green: #0fa462;
            --hover-bg: #e8f7f0;
            --text-dark: #2d3748;
            --text-gray: #718096;
            --danger-red: #e53e3e;
            --border-color: #edf2f7;
        }

        .custom-sidebar {
            width: 280px;
            height: 100vh;
            background-color: #ffffff;
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 24px 16px;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
            overflow-y: auto;
        }

        .brand-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .brand-logo {
            color: var(--primary-green);
            font-size: 1.4rem;
        }

        .brand-name {
            font-weight: 700;
            color: var(--primary-green);
            font-size: 1.25rem;
            letter-spacing: -0.5px;
            text-decoration: none;
        }

        .nav-menu {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;
        }

        .nav-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            color: var(--text-dark);
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
        }

        .nav-item.active {
            background-color: var(--primary-green);
            color: #ffffff;
        }

        .nav-item:not(.active):hover {
            background-color: var(--hover-bg);
            color: var(--primary-green);
        }

        .nav-link-left {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .nav-item.dropdown-toggle-btn {
            border: 1px solid var(--border-color);
            background-color: #fafafa;
        }

        .submenu-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding-left: 20px;
            margin-top: 4px;
            margin-bottom: 6px;
        }

        .submenu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            color: var(--text-gray);
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.2s;
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
        }

        .submenu-item:hover {
            background-color: var(--hover-bg);
            color: var(--primary-green);
        }

        .sidebar-footer {
            margin-top: auto;
            border-top: 1px solid var(--border-color);
            padding-top: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .user-profile-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background-color: #f8fafc;
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            background-color: var(--hover-bg);
            color: var(--primary-green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
            flex-shrink: 0;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .user-name {
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text-dark);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .user-role {
            font-size: 0.75rem;
            color: var(--text-gray);
            font-weight: 500;
        }

        .logout-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            color: var(--danger-red);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            border-radius: 10px;
            transition: background 0.2s;
        }

        .logout-btn:hover {
            background-color: #fff5f5;
        }

        .main-workspace {
            margin-left: 280px;
            width: calc(100% - 280px);
        }
      `}</style>

      <div className="d-flex bg-dark min-vh-100 text-white w-100">
        
        {/* --- SIDEBAR --- */}
        <div className="custom-sidebar">
          <div>
            <div className="brand-header">
              <i className="fa-solid fa-bag-shopping brand-logo"></i>
              <Link to="/dashboards" className="brand-name">AK Medistore</Link>
            </div>

            <nav className="nav-menu">
              <div>
                <button 
                  className={`nav-item dropdown-toggle-btn ${openDashboard ? 'active' : ''}`} 
                  onClick={() => setOpenDashboard(!openDashboard)}
                >
                  <div className="nav-link-left">
                    <i className="fa-solid fa-chart-pie"></i>
                    <span>Dashboard</span>
                  </div>
                  <i className={`fa-solid fa-chevron-${openDashboard ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
                </button>

                {openDashboard && (
                  <div className="submenu-container">
                    <button onClick={() => fetchModalData("med", "AllMedicationtracker")} className="submenu-item">
                      <i className="fa-solid fa-pills"></i> Medication Tracker
                    </button>
                    <button onClick={() => fetchModalData("test", "AllTestReports")} className="submenu-item">
                      <i className="fa-solid fa-file-medical"></i> Test Reports
                    </button>
                    <button onClick={() => fetchModalData("health", "AllHealthHistory")} className="submenu-item">
                      <i className="fa-solid fa-heart-pulse"></i> Health History
                    </button>
                    <button onClick={() => fetchModalData("monthly", "AllMonthlyProgress")} className="submenu-item">
                      <i className="fa-solid fa-chart-line"></i> Monthly Progress
                    </button>
                    <button onClick={() => fetchModalData("prescriptions", "AllPrescriptions")} className="submenu-item">
                      <i className="fa-solid fa-prescription"></i> Prescriptions
                    </button>
                    <button onClick={() => fetchModalData("history", "AllHistory")} className="submenu-item">
                      <i className="fa-solid fa-clock-rotate-left"></i> History
                    </button>
                    <button onClick={() => fetchModalData("support", "AllticketHelpSupport")} className="submenu-item">
                      <i className="fa-solid fa-headset"></i> Help & Support
                    </button>
                    <button onClick={() => setActiveModal("settings")} className="submenu-item">
                      <i className="fa-solid fa-gear"></i> Settings
                    </button>
                    <button onClick={() => { setActiveModal("lab"); }} className="submenu-item" style={{ color: "#0fa462", fontWeight: "700" }}>
                      🧪 LAB TEST PANEL
                    </button>
                  </div>
                )}
              </div>

              <div>
                <button 
                  className={`nav-item dropdown-toggle-btn ${openMasterUpdate ? 'active' : ''}`} 
                  onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
                >
                  <div className="nav-link-left">
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Master Update</span>
                  </div>
                  <i className={`fa-solid fa-chevron-${openMasterUpdate ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
                </button>

                {openMasterUpdate && (
                  <div className="submenu-container">
                    <Link to="/deliveryaddress" className="submenu-item">
                      <i className="fa-solid fa-map-marker-alt"></i> Delivery Address
                    </Link>
                    <Link to="/addbankrefundableamounts" className="submenu-item"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link>
                    <Link to="/bankdetailsrefundlist" className="submenu-item" style={{ color: '#0fa462', fontWeight: '600' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link>
                  </div>
                )}
              </div>

              <Link to="/medicinedisplay" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-pills"></i>
                  <span>Medicines</span>
                </div>
              </Link>

              <Link to="/carts" className="nav-item active">
                <div className="nav-link-left">
                  <i className="fa-solid fa-shopping-cart"></i>
                  <span>My Cart</span>
                </div>
                {cartItems.length > 0 && (
                  <span className="badge bg-danger rounded-pill">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link to="/order" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-truck"></i>
                  <span>Orders</span>
                </div>
              </Link>

              <Link to="/customeraddmedicines" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>Unavailable Medicines</span>
                </div>
              </Link>

              <Link to="/profile" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </nav>
          </div>

          <div className="sidebar-footer">
            <div className="user-profile-card">
              <div className="user-avatar">{userInitial}</div>
              <div className="user-info">
                <span className="user-name">{fullName}</span>
                <span className="user-role">Customer Account</span>
              </div>
            </div>

            <Link to="/header" className="logout-btn">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Log Out</span>
            </Link>
          </div>
        </div>

        {/* --- MAIN CONTENT WORKSPACE --- */}
        <div className="main-workspace flex-grow-1 d-flex flex-column position-relative" style={{ height: '100vh', overflowY: 'auto' }}>
          
          <div className="p-3 bg-dark border-bottom border-secondary d-flex align-items-center sticky-top shadow-sm">
            <ChevronLeft className="me-3 cursor-pointer text-info" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
            <h5 className="mb-0 fw-bold">Store Cart ({cartItems.length})</h5>
          </div>

          <div className="p-4" style={{ marginBottom: '180px' }}>
            <h6 className="mb-4 fw-bold">Medicine - Local Store</h6>
            {cartItems.map((item) => (
               <div key={item.id} className="bg-secondary bg-opacity-10 p-3 rounded-3 mb-3 border border-secondary shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="bg-white rounded p-1" style={{width: '60px', height: '60px'}}>
                            <img src={item.image || "/medicine-placeholder.png"} className="w-100 h-100 object-fit-contain" alt="" />
                        </div>
                        <div className="ms-3">
                            <h6 className="mb-0 fw-bold small">{item.name}</h6>
                            <div className="mt-1">
                                <span className="fw-bold me-2">₹{item.unitPrice}</span>
                                <span className="text-muted text-decoration-line-through small">₹{item.unitPrice + 30}</span>
                                <span className="text-success small fw-bold ms-2">15% off</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center border border-secondary rounded-pill px-2 bg-dark" style={{ height: '32px' }}>
                        <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => handleDecrease(item)}><Minus size={14} /></button>
                        <span className="mx-3 fw-bold small">{item.quantity}</span>
                        <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                    </div>
                </div>
               </div>
            ))}
          </div>

          {/* --- STICKY FOOTER --- */}
          <div className="fixed-bottom bg-dark border-top border-secondary shadow-lg" style={{ left: '280px' }}>
            <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
              <div>
                <h6 className="mb-0 small fw-bold text-muted">Delivery Address</h6>
                <div className="text-success small fw-bold mt-1">
                  {selectedAddress ? (
                    <span>Deliver to: <strong className="text-white">{selectedAddress.fullName}</strong>, {selectedAddress.customerZipCode || selectedAddress.pincode} ({selectedAddress.addressType || 'Home'})</span>
                  ) : (
                    <span className="text-warning">Please select a delivery address</span>
                  )}
                </div>
              </div>
              <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={handleOpenModal}>
                Change
              </button>
            </div>
            
            <div className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column">
                <span className="text-muted text-decoration-line-through small mb-0">₹{totalMRP}</span>
                {/* EXACT TOTAL AMOUNT SHOW HOGA (JAISE 100) */}
                <h4 className="mb-0 fw-bold text-white">₹{finalPayableAmount}</h4>
              </div>
              
              <button 
                className={`btn btn-lg px-5 fw-bold ${selectedAddress ? 'btn-primary shadow' : 'btn-secondary disabled'}`} 
                onClick={() => {
                  if (selectedAddress) {
                    localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
                    localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
                    navigate("/CompletePayments", { 
                      state: { 
                        selectedAddress: selectedAddress,
                        cartItems: cartItems,
                        finalPayableAmount: finalPayableAmount 
                      } 
                    });
                  }
                }}
              >
                Proceed
              </button>
            </div>
          </div>

          {/* --- ADDRESS SELECTION MODAL --- */}
          {isAddressModalOpen && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
              <div className="bg-dark border border-secondary p-4 rounded-4 shadow-lg text-white" style={{ width: '600px', maxWidth: '95%' }}>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
                  <h5 className="mb-0 fw-bold">Select delivery address</h5>
                  <button className="btn btn-outline-light btn-sm rounded-circle" onClick={() => setIsAddressModalOpen(false)}>✕</button>
                </div>

                <div className="mb-3">
                  <button className="btn btn-outline-success w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
                    <Plus size={18}/> Add New Address
                  </button>
                </div>

                <div className="overflow-auto pe-2" style={{ maxHeight: '380px' }}>
                  {allAddresses && allAddresses.length > 0 ? (
                    allAddresses.map((addr) => {
                      const isSelected = selectedAddress?.patient_CustomerId === addr.patient_CustomerId || selectedAddress?.id === addr.id;
                      return (
                        <div 
                          key={addr.patient_CustomerId || addr.id || Math.random()} 
                          className={`p-3 border rounded-3 mb-3 cursor-pointer transition-all ${isSelected ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-black'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSelectAddressObj(addr)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || 'Home'}</span>
                                {isSelected && <span className="badge bg-success text-white" style={{fontSize: '10px'}}>Selected</span>}
                              </div>
                              <h6 className="mb-1 fw-bold text-white">{addr.fullName} <span className="text-info fw-normal ms-2 small">{addr.phoneNumber || addr.mobileNumber}</span></h6>
                              <p className="text-white-50 mb-2 small">{addr.address}, {addr.customerCity || addr.city}, {addr.customerState || addr.state} <strong className="text-warning">{addr.customerZipCode || addr.pincode}</strong></p>
                            </div>
                            
                            <div className="form-check">
                              <input 
                                className="form-check-input bg-dark border-secondary" 
                                type="radio" 
                                checked={isSelected} 
                                onChange={() => handleSelectAddressObj(addr)} 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <p className="mb-3">No delivery address found for your account.</p>
                      <button className="btn btn-sm btn-success fw-bold px-4" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
                        Add Address Now
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-end">
                  <button className="btn btn-outline-secondary btn-sm px-4 fw-bold" onClick={() => setIsAddressModalOpen(false)}>CLOSE</button>
                </div>
              </div>
            </div>
          )}

          {/* --- STANDARD SIDEBAR DETAILS MODAL --- */}
          {activeModal && activeModal !== 'lab' && activeModal !== 'settings' && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
              <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '750px', maxWidth: '95%' }}>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h5 className="mb-0 fw-bold text-uppercase">{modalTitle.replace("All", "")} Details & Action List</h5>
                  <button className="btn btn-sm btn-light border" onClick={() => setActiveModal(null)}><X size={16} /></button>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>S.No.</th>
                        <th>ID / Ref</th>
                        <th>Name / Title</th>
                        <th>Details & Description</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalData.map((row, index) => (
                        <tr key={index}>
                          <td className="text-success fw-bold">#{index + 1}</td>
                          <td>{row.id}</td>
                          <td className="fw-bold">{row.name}</td>
                          <td className="text-muted small">{row.description}</td>
                          <td><span className="badge bg-success bg-opacity-75 text-white">{row.status}</span></td>
                          <td>
                            <button 
                              className="btn btn-success btn-sm px-3 fw-bold" 
                              style={{ fontSize: '12px' }}
                              onClick={() => setSelectedRowDetail(row)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-secondary btn-sm px-4" onClick={() => setActiveModal(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* --- INDIVIDUAL ROW VIEW DETAILS POPUP MODAL --- */}
          {selectedRowDetail && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-dark" style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}>
              <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: '500px', maxWidth: '90%' }}>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h5 className="mb-0 fw-bold">Item Detailed Information</h5>
                  <button className="btn btn-sm btn-light border" onClick={() => setSelectedRowDetail(null)}><X size={16} /></button>
                </div>
                <div>
                  <p><strong>Name:</strong> {selectedRowDetail.name}</p>
                  <p><strong>Description:</strong> {selectedRowDetail.description}</p>
                  <p><strong>Status:</strong> <span className="badge bg-success">{selectedRowDetail.status}</span></p>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-primary btn-sm px-4" onClick={() => setSelectedRowDetail(null)}>Close</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
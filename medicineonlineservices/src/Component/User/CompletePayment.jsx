// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import Swal from "sweetalert2";
// import "../styles/CompletePayments.css";

// export default function CompletePayment() {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const { cartItems, clearCartState } = useCart();

//   // --- STATE MANAGEMENT ---
//   const [user, setUser] = useState(null);
//   const [activeMethod, setActiveMethod] = useState("UPI");
  
//   // Sidebar Accordion States
//   const [openDashboard, setOpenDashboard] = useState(false);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  
//   // Validation States & Dynamic Data States
//   const [upiId, setUpiId] = useState("");
//   const [isUpiVerified, setIsUpiVerified] = useState(false);
  
//   const [cardData, setCardData] = useState({
//     number: "",
//     expiry: "",
//     cvv: "",
//     name: ""
//   });
//   const [isCardVerified, setIsCardVerified] = useState(false);

//   // QR Code Payment State
//   const [isQrPaid, setIsQrPaid] = useState(false);

//   // Wallet States
//   const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
//   const [selectedWallet, setSelectedWallet] = useState("");
//   const [walletBalance, setWalletBalance] = useState(null);
//   const [medicineCoins, setMedicineCoins] = useState(150);

//   // Net Banking States
//   const [savedBanks, setSavedBanks] = useState([]);
//   const [selectedBankName, setSelectedBankName] = useState("");

//   // --- API DATA FETCHING ---
//   useEffect(() => {
//     fetch('https://ecommerencesite.onrender.com/api/bankselectmodelsAPI/GetAllBankSelect')
//       .then(res => res.json())
//       .then(data => {
//         const uniqueNames = [...new Set(data.map(item => item.bankName).filter(name => name && name.trim() !== ""))];
//         setSavedBanks(uniqueNames);
//       })
//       .catch(err => console.error('Error fetching bank select details:', err));

//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   // --- USER PROFILE HELPERS ---
//   const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Gautam Dev";
//   const userInitial = fullName ? fullName.charAt(0).toUpperCase() : "G";

//   // --- PRICE CALCULATIONS ---
//   const [priceDetails] = useState(() => {
//     const totalMRP = cartItems.reduce((acc, item) => acc + ((item.mrp || item.unitPrice || 12) * (item.quantity || 1)), 0);
//     const effectiveMRP = totalMRP > 0 ? totalMRP : (location.state?.priceDetails?.mrp || 12);
    
//     const discount = 1;
//     const platformFee = 7;
//     const couponApplied = 10;
    
//     const finalTotal = effectiveMRP - discount + platformFee - couponApplied;

//     return location.state?.priceDetails || {
//       mrp: effectiveMRP,
//       discount: discount,
//       fee: platformFee,
//       coupon: couponApplied,
//       totalAmount: finalTotal > 0 ? finalTotal : 8
//     };
//   });

//   const totalMRP = priceDetails.mrp;
//   const discount = priceDetails.discount;
//   const platformFee = priceDetails.fee;
//   const couponApplied = priceDetails.coupon;
//   const finalTotal = priceDetails.totalAmount;

//   // --- WALLET LOGIN FLOW ---
//   const handleWalletSelect = (walletName) => {
//     setSelectedWallet(walletName);
//     setWalletDropdownOpen(false);

//     Swal.fire({
//       title: `<span style="color: #800020; font-size: 20px;">Sign in to ${walletName}</span>`,
//       html: `
//         <div style="text-align: left; padding: 5px;">
//           <div style="margin-bottom: 12px;">
//             <label style="display: block; font-weight: bold; font-size: 13px; color: #333; margin-bottom: 5px;">User ID / Mobile : *</label>
//             <input type="text" id="swal-wallet-userid" class="swal2-input" placeholder="Enter User ID or Mobile" style="margin: 0; width: 100%; height: 38px;" />
//           </div>
//           <div style="margin-bottom: 8px;">
//             <label style="display: block; font-weight: bold; font-size: 13px; color: #333; margin-bottom: 5px;">Password : *</label>
//             <input type="password" id="swal-wallet-password" class="swal2-input" placeholder="Enter Password" style="margin: 0; width: 100%; height: 38px;" />
//           </div>
//         </div>
//       `,
//       showCancelButton: true,
//       confirmButtonText: 'Sign In & Check Wallet',
//       confirmButtonColor: '#0fa462',
//       focusConfirm: false,
//       preConfirm: () => {
//         const userId = document.getElementById('swal-wallet-userid').value.trim();
//         const password = document.getElementById('swal-wallet-password').value.trim();
//         if (!userId || !password) {
//           Swal.showValidationMessage('⚠️ Please enter both User ID and Password!');
//           return false;
//         }
//         return { userId };
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const simulatedBalance = (Math.random() * 2500 + 500).toFixed(2);
//         setWalletBalance(simulatedBalance);
//         setActiveMethod("MEDICINE_WALLET");

//         Swal.fire({
//           icon: 'success',
//           title: `${walletName} Connected!`,
//           html: `<b>Real-Time Wallet Balance:</b> <span style="color: #0fa462; font-size: 18px;">₹${simulatedBalance}</span>`
//         });
//       }
//     });
//   };

//   const handleUpiVerify = () => {
//     if (upiId.includes("@")) {
//       setIsUpiVerified(true);
//       Swal.fire({ icon: 'success', title: 'UPI Verified', timer: 1000, showConfirmButton: false });
//     } else {
//       Swal.fire({ icon: 'error', title: 'Invalid UPI ID' });
//     }
//   };

//   const handleCardVerify = () => {
//     if (cardData.number.length === 16 && cardData.expiry.includes("/")) {
//       setIsCardVerified(true);
//       Swal.fire({ icon: 'success', title: 'Card Validated' });
//     } else {
//       Swal.fire({ icon: 'warning', title: 'Error', text: 'Check card details again.' });
//     }
//   };

//   const handleNetBankingLoginClick = () => {
//     const generatedTxOtp = Math.floor(100000 + Math.random() * 900000).toString();

//     Swal.fire({
//       title: `<span style="color: #800020; font-size: 20px;">${selectedBankName} Internet Banking</span>`,
//       html: `
//         <div style="text-align: left; padding: 5px;">
//           <div style="margin-bottom: 12px;">
//             <label style="display: block; font-weight: bold; font-size: 13px;">User ID : *</label>
//             <input type="text" id="swal-userid" class="swal2-input" placeholder="Enter User ID" style="margin: 0; width: 100%; height: 38px;" />
//           </div>
//           <div style="margin-bottom: 12px;">
//             <label style="display: block; font-weight: bold; font-size: 13px;">Password : *</label>
//             <input type="password" id="swal-password" class="swal2-input" placeholder="Enter Password" style="margin: 0; width: 100%; height: 38px;" />
//           </div>
//           <div style="background: #e8f7f0; color: #0fa462; padding: 8px; font-weight: bold; font-size: 12px; margin-bottom: 5px;">
//             💬 Testing OTP: <b>${generatedTxOtp}</b>
//           </div>
//           <label style="font-weight: bold; font-size: 12px;">Enter OTP : *</label>
//           <input type="text" id="swal-txotp" class="swal2-input" placeholder="Enter 6-digit OTP" maxLength="6" style="margin: 0; width: 100%; height: 35px;" />
//         </div>
//       `,
//       showCancelButton: true,
//       confirmButtonText: 'Verify & Pay',
//       confirmButtonColor: '#0fa462',
//       preConfirm: () => {
//         const userId = document.getElementById('swal-userid').value.trim();
//         const password = document.getElementById('swal-password').value.trim();
//         const enteredTxOtp = document.getElementById('swal-txotp').value.trim();
        
//         if (!userId || !password) {
//           Swal.showValidationMessage('⚠️ Enter both User ID and Password!');
//           return false;
//         }
//         if (enteredTxOtp !== generatedTxOtp) {
//           Swal.showValidationMessage(`❌ Invalid OTP! (Hint: ${generatedTxOtp})`);
//           return false;
//         }
//         return userId;
//       }
//     }).then((paymentResult) => {
//       if (paymentResult.isConfirmed) {
//         executeOrderSaving(`NB_USER_${paymentResult.value}_PAID`);
//       }
//     });
//   };

//   // --- ORDER EXECUTION & CART CLEARING ---
//   const executeOrderSaving = async (cardNumberPayloadOverride) => {
//     // Strict Validation: Ensure no non-COD payment method can bypass payment/verification
//     if (activeMethod !== "COD") {
//       if (activeMethod === "UPI" && !isUpiVerified) {
//         Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please verify your UPI ID before paying.' });
//         return;
//       }
//       if (activeMethod === "CARD" && !isCardVerified) {
//         Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please verify your card details before paying.' });
//         return;
//       }
//       if (activeMethod === "MEDICINE_WALLET" && !walletBalance) {
//         Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please sign in to your wallet first.' });
//         return;
//       }
//       if (activeMethod === "QRCODE" && !isQrPaid) {
//         Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please complete the QR code payment first.' });
//         return;
//       }
//       if (activeMethod === "NB" && !selectedBankName) {
//         Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please select a bank and complete net banking login.' });
//         return;
//       }
//     }

//     Swal.fire({
//       title: 'Processing Payment...',
//       text: 'Placing order & updating systems...',
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//     });

//     let cardNumberPayload = cardNumberPayloadOverride || `${activeMethod}_MODE`;
//     let expiryPayload = "N/A";
//     let cvvPayload = "000";
//     let holderNamePayload = fullName;

//     if (activeMethod === "CARD") {
//       cardNumberPayload = cardData.number;
//       expiryPayload = cardData.expiry;
//       cvvPayload = cardData.cvv;
//       holderNamePayload = cardData.name || holderNamePayload;
//     } else if (activeMethod === "UPI") {
//       cardNumberPayload = upiId;
//     } else if (activeMethod === "MEDICINE_WALLET") {
//       cardNumberPayload = `${selectedWallet}_WALLET_PAID`;
//     } else if (activeMethod === "QRCODE") {
//       cardNumberPayload = "QRCODE_UPI_PAID";
//     }

//     const dynamicPaymentMethodName = activeMethod === "NB" 
//       ? `Net Banking (${selectedBankName})` 
//       : activeMethod === "MEDICINE_WALLET" 
//         ? `${selectedWallet} Wallet` 
//         : activeMethod === "COD"
//           ? "Cash on Delivery (COD)"
//           : activeMethod === "QRCODE"
//             ? "QR Code Payment"
//             : activeMethod;

//     const orderPayload = {
//       bankName: dynamicPaymentMethodName,
//       cardNumber: cardNumberPayload,
//       expiryDate: expiryPayload,
//       cvv: cvvPayload,
//       cardholderName: holderNamePayload
//     };

//     try {
//       const response = await fetch('https://ecommerencesite.onrender.com/api/BankdetailsWebapi/AdminCreatBank', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderPayload),
//       });

//       if (response.ok) {
//         if (typeof clearCartState === 'function') {
//           clearCartState();
//         }

//         setMedicineCoins(prev => prev + 15);
//         Swal.fire({
//           icon: 'success',
//           title: 'Payment Successful & Order Placed!',
//           text: `Paid via ${dynamicPaymentMethodName}!`,
//         }).then(() => {
//           navigate("/Orderstatus", { 
//             state: { 
//               orderId: Math.floor(100000 + Math.random() * 900000),
//               cartItems: cartItems,
//               totalMRP: totalMRP,
//               totalDiscount: discount,
//               platformFee: platformFee,
//               couponDiscount: couponApplied,
//               finalPayableAmount: finalTotal,
//               paymentMode: dynamicPaymentMethodName,
//               paymentMethodUsed: dynamicPaymentMethodName 
//             } 
//           });
//         });
//       } else {
//         throw new Error("Server Error");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Transaction Failed',
//         text: 'API connection error or server timeout. Your cart items are saved.',
//       });
//     }
//   };

//   return (
//     <div className="app-container" style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#121212", margin: 0, padding: 0 }}>
      
//       {/* SIDEBAR NAVIGATION */}
//       <div className="modern-sidebar" style={{ width: '280px', height: '100vh', background: '#fff', position: 'fixed', left: 0, top: 0, padding: '24px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto', zIndex: 1000 }}>
//         <div>
//           <Link to="/dashboards" className="modern-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '20px' }}>
//             <img src="/AKMedizostore.png" alt="logo" width="40" height="40" />
//             <span style={{ fontWeight: '700', color: '#0fa462', fontSize: '1.25rem' }}>AK Medistore</span>
//           </Link>

//           <nav className="nav-menu" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//             <div>
//               <button 
//                 className={`nav-item dropdown-toggle-btn ${openDashboard ? 'active' : ''}`} 
//                 onClick={() => setOpenDashboard(!openDashboard)}
//                 style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}
//               >
//                 <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid fa-chevron-${openDashboard ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//               </button>

//               {openDashboard && (
//                 <div className="submenu-container" style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', gap: '6px', marginTop: '6px' }}>
//                   <Link to="/medication-tracker" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-pills me-2"></i> Medication Tracker</Link>
//                   <Link to="/test-reports" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-file-medical me-2"></i> Test Reports</Link>
//                   <Link to="/health-history" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-heart-pulse me-2"></i> Health History</Link>
//                   <Link to="/monthly-progress" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-chart-line me-2"></i> Monthly Progress</Link>
//                   <Link to="/prescriptions" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-prescription me-2"></i> Prescriptions</Link>
//                   <Link to="/history" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-clock-rotate-left me-2"></i> History</Link>
//                   <Link to="/support" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-headset me-2"></i> Help & Support</Link>
//                   <Link to="/settings" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-gear me-2"></i> Settings</Link>
//                 </div>
//               )}
//             </div>

//             <div>
//               <button 
//                 className={`nav-item dropdown-toggle-btn ${openMasterUpdate ? 'active' : ''}`} 
//                 onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
//                 style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}
//               >
//                 <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid fa-chevron-${openMasterUpdate ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
//               </button>

//               {openMasterUpdate && (
//                 <div className="submenu-container" style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', gap: '6px', marginTop: '6px' }}>
//                   <Link to="/deliveryaddress" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>
//                     <i className="fa-solid fa-map-marker-alt me-2"></i> Delivery Address
//                   </Link>
//                   <Link to="/addbankrefundableamounts" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Refund Bank Details</Link>
//                   <Link to="/bankdetailsrefundlist" className="submenu-item" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link>
//                 </div>
//               )}
//             </div>

//             <Link to="/medicinedisplay" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
//               <i className="fa-solid fa-pills"></i>
//               <span>Medicines</span>
//             </Link>

//             <Link to="/carts" className="modern-nav-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', color: '#2d3748', textDecoration: 'none', fontWeight: '600' }}>
//               <span><i className="fa-solid fa-shopping-cart me-2"></i> My Cart</span>
//               {cartItems.length > 0 && <span className="badge bg-danger rounded-pill">{cartItems.length}</span>}
//             </Link>

//             <Link to="/order" className="modern-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#2d3748', textDecoration: 'none', fontWeight: '600' }}>
//               <span><i className="fa-solid fa-truck me-2"></i> Orders</span>
//             </Link>

//             <Link to="/feedbackcustomers" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
//               <i className="fa-solid fa-comment-dots"></i>
//               <span>Customer Feedback</span>
//             </Link>

//             <Link to="/customeraddmedicines" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
//               <i className="fa-solid fa-circle-exclamation"></i>
//               <span>Unavailable Medicines</span>
//             </Link>

//             <Link to="/profile" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
//               <i className="fa-solid fa-user"></i>
//               <span>Customer Profile</span>
//             </Link>
//           </nav>
//         </div>

//         <div className="sidebar-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
//           <div className="user-profile-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
//             <div className="user-avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#0fa462', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{userInitial}</div>
//             <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
//               <span className="user-name" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2d3748' }}>{fullName}</span>
//               <span className="user-role" style={{ fontSize: '0.75rem', color: '#718096' }}>Customer Account</span>
//             </div>
//           </div>

//           <Link to="/header" className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#e53e3e', fontWeight: '600', fontSize: '0.9rem' }}>
//             <i className="fa-solid fa-right-from-bracket"></i>
//             <span>Log Out</span>
//           </Link>
//         </div>
//       </div>

//       {/* CHECKOUT INTERFACE AREA */}
//       <div style={{ marginLeft: '280px', width: 'calc(100% - 280px)', padding: '24px', boxSizing: 'border-box', backgroundColor: '#121212', color: '#fff' }}>
//         <div className="bg-success text-center py-3 rounded mb-4">
//           <h4 className="m-0">AK MEDICINE - CHECKOUT</h4>
//         </div>

//         <div className="d-flex gap-4 justify-content-between">
//           {/* PAYMENT OPTIONS SELECTOR */}
//           <div className="bg-secondary bg-opacity-25 rounded p-3" style={{ width: '240px' }}>
//             <h6 className="mb-3">Select Method</h6>
//             {["UPI", "CARD", "QRCODE"].map(m => (
//               <div key={m} onClick={() => setActiveMethod(m)} 
//                 className={`p-3 mb-2 rounded border ${activeMethod === m ? "bg-success border-white" : "bg-dark border-secondary"}`}
//                 style={{ cursor: 'pointer' }}>
//                 {m}
//               </div>
//             ))}

//             <div className="mb-2">
//               <div onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
//                 className={`p-3 rounded border d-flex justify-content-between align-items-center ${activeMethod === "MEDICINE_WALLET" ? "bg-success border-white" : "bg-dark border-secondary"}`}
//                 style={{ cursor: 'pointer' }}>
//                 <span>MedicineWallet</span>
//                 <i className={`fa-solid ${walletDropdownOpen ? "fa-chevron-down" : "fa-chevron-right"}`}></i>
//               </div>

//               {walletDropdownOpen && (
//                 <div className="bg-dark p-2 mt-1 rounded border border-secondary d-flex flex-column gap-2">
//                   {["Airtel", "Amazon", "Paytm"].map((wallet) => (
//                     <div key={wallet} onClick={() => handleWalletSelect(wallet)}
//                       className="p-2 rounded text-white bg-secondary bg-opacity-50"
//                       style={{ cursor: 'pointer', fontSize: '13px' }}>
//                       🔗 {wallet} Wallet
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {["NB", "COD"].map(m => (
//               <div key={m} onClick={() => setActiveMethod(m)} 
//                 className={`p-3 mb-2 rounded border ${activeMethod === m ? "bg-success border-white" : "bg-dark border-secondary"}`}
//                 style={{ cursor: 'pointer' }}>
//                 {m}
//               </div>
//             ))}
//           </div>

//           {/* ACTIVE METHOD CONFIGURATION FORM */}
//           <div className="bg-secondary bg-opacity-10 p-4 rounded border border-secondary flex-grow-1">
//             {activeMethod === "UPI" && (
//               <div>
//                 <h5>UPI Payment</h5>
//                 <div className="d-flex gap-2 mt-3">
//                   <input type="text" className="form-control" placeholder="user@bank" onChange={(e) => {setUpiId(e.target.value); setIsUpiVerified(false);}} />
//                   <button className="btn btn-warning" onClick={handleUpiVerify}>Verify</button>
//                 </div>
//                 <button className="btn btn-success w-100 mt-4 py-3" disabled={!isUpiVerified} onClick={() => executeOrderSaving(null)}>Pay Now</button>
//               </div>
//             )}

//             {activeMethod === "CARD" && (
//               <div>
//                 <h5>Card Details</h5>
//                 <input type="text" className="form-control mb-2" placeholder="Card Number (16 digits)" maxLength="16" onChange={(e) => setCardData({...cardData, number: e.target.value})} />
//                 <div className="d-flex gap-2 mb-2">
//                   <input type="text" className="form-control" placeholder="MM/YY" onChange={(e) => setCardData({...cardData, expiry: e.target.value})} />
//                   <input type="password" className="form-control" placeholder="CVV" maxLength="3" onChange={(e) => setCardData({...cardData, cvv: e.target.value})} />
//                 </div>
//                 <input type="text" className="form-control mb-3" placeholder="Cardholder Name" onChange={(e) => setCardData({...cardData, name: e.target.value})} />
//                 <button className="btn btn-success w-100 py-3" onClick={isCardVerified ? () => executeOrderSaving(null) : handleCardVerify}>
//                   {isCardVerified ? "Complete Payment" : "Verify Card"}
//                 </button>
//               </div>
//             )}

//             {activeMethod === "QRCODE" && (
//               <div className="text-center">
//                 <h5>Scan & Pay via UPI QR</h5>
//                 <p className="text-white-50">Scan the genuine UPI QR code below using any UPI payment app for ₹{finalTotal}</p>
//                 <div className="bg-white p-3 rounded d-inline-block mb-3">
//                   <img 
//                     src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=ak@upi&pn=AK%20Medistore&am=${finalTotal}&cu=INR`} 
//                     alt="Genuine UPI QR Code" 
//                   />
//                 </div>
//                 <div className="text-success small mb-3">
//                   {isQrPaid ? "✅ Payment Verified!" : "⏳ Awaiting scan & payment..."}
//                 </div>
//                 <button 
//                   className="btn btn-success w-100 py-3" 
//                   onClick={() => {
//                     setIsQrPaid(true);
//                     executeOrderSaving(null);
//                   }}
//                 >
//                   Simulate Successful Scan & Pay Now
//                 </button>
//               </div>
//             )}

//             {activeMethod === "MEDICINE_WALLET" && (
//               <div>
//                 <h5>{selectedWallet} Wallet Checkout</h5>
//                 <div className="p-3 mb-3 bg-dark rounded border border-success">
//                   <p className="m-0"><strong>Connected:</strong> {selectedWallet}</p>
//                   <p className="m-0 mt-2 text-warning"><strong>Available Wallet Balance:</strong> ₹{walletBalance || "0.00"}</p>
//                 </div>
//                 <button className="btn btn-success w-100 py-3" onClick={() => executeOrderSaving(null)}>
//                   Pay ₹{finalTotal} via Wallet
//                 </button>
//               </div>
//             )}

//             {activeMethod === "NB" && (
//               <div>
//                 <h5>Net Banking Selection</h5>
//                 <div className="mt-3 mb-3">
//                   <label className="form-label text-white-50">Select Your Bank</label>
//                   <select className="form-select bg-dark text-white border-secondary" value={selectedBankName} onChange={(e) => setSelectedBankName(e.target.value)}>
//                     <option value="">-- Choose Bank --</option>
//                     {savedBanks.map((bank, idx) => (
//                       <option key={idx} value={bank}>{bank}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <button className="btn btn-success w-100 py-3" disabled={!selectedBankName} onClick={handleNetBankingLoginClick}>
//                   Proceed to Net Banking Login
//                 </button>
//               </div>
//             )}

//             {activeMethod === "COD" && (
//               <div className="text-center py-4">
//                 <h5>Cash on Delivery (COD)</h5>
//                 <p className="text-white-50 mt-2">Pay cash directly to the delivery partner upon arrival. No upfront payment required.</p>
//                 <button className="btn btn-success w-100 py-3 mt-3" onClick={() => executeOrderSaving(null)}>Place COD Order</button>
//               </div>
//             )}
//           </div>

//           {/* BILLING SUMMARY WIDGET */}
//           <div className="bg-dark p-3 rounded border border-secondary" style={{ width: '300px' }}>
//             <h6 className="mb-3 opacity-75">PRICE DETAILS</h6>
//             <hr className="border-secondary mb-3" />
//             <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{totalMRP}</span></div>
//             <div className="d-flex justify-content-between mb-2 text-success"><span>Discount</span><span>-₹{discount}</span></div>
//             <div className="d-flex justify-content-between mb-2"><span>Platform Fee</span><span>₹{platformFee}</span></div>
//             <div className="d-flex justify-content-between mb-3 text-success"><span>Coupon</span><span>-₹{couponApplied}</span></div>
//             <hr className="border-secondary mb-3" />
//             <div className="d-flex justify-content-between fw-bold mb-3"><span>Total Amount</span><span>₹{finalTotal}</span></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { QRCodeSVG } from "qrcode.react";
import Swal from "sweetalert2";
import "../styles/CompletePayments.css";

export default function CompletePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cartItems, clearCartState } = useCart();

  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [activeMethod, setActiveMethod] = useState("UPI");
  
  // Sidebar Accordion States
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  
  // Validation States & Dynamic Data States
  const [upiId, setUpiId] = useState("");
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [isCardVerified, setIsCardVerified] = useState(false);

  // QR Code Payment State & Polling
  const [isQrPaid, setIsQrPaid] = useState(false);

  // Wallet States
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [medicineCoins, setMedicineCoins] = useState(150);

  // Net Banking States
  const [savedBanks, setSavedBanks] = useState([]);
  const [selectedBankName, setSelectedBankName] = useState("");

  // --- API DATA FETCHING ---
  useEffect(() => {
    fetch('https://ecommerencesite.onrender.com/api/bankselectmodelsAPI/GetAllBankSelect')
      .then(res => res.json())
      .then(data => {
        const uniqueNames = [...new Set(data.map(item => item.bankName).filter(name => name && name.trim() !== ""))];
        setSavedBanks(uniqueNames);
      })
      .catch(err => console.error('Error fetching bank select details:', err));

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- QR CODE AUTO-POLLING FOR REAL PAYMENTS ---
  useEffect(() => {
    let intervalId;
    if (activeMethod === "QRCODE" && !isQrPaid) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch('https://ecommerencesite.onrender.com/api/BankdetailsWebapi/CheckPaymentStatus');
          if (res.ok) {
            const data = await res.json();
            if (data.isPaid || data.status === "SUCCESS") {
              clearInterval(intervalId);
              setIsQrPaid(true);
              executeOrderSaving("QRCODE_UPI_PAID");
            }
          }
        } catch (e) {
          // Silent catch for network drops during poll
        }
      }, 4000);
    }
    return () => clearInterval(intervalId);
  }, [activeMethod, isQrPaid]);

  // --- USER PROFILE HELPERS ---
  const fullName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Gautam Dev";
  const userInitial = fullName ? fullName.charAt(0).toUpperCase() : "G";

  // --- PRICE CALCULATIONS ---
  const [priceDetails] = useState(() => {
    const totalMRP = cartItems.reduce((acc, item) => acc + ((item.mrp || item.unitPrice || 12) * (item.quantity || 1)), 0);
    const effectiveMRP = totalMRP > 0 ? totalMRP : (location.state?.priceDetails?.mrp || 12);
    
    const discount = 1;
    const platformFee = 7;
    const couponApplied = 10;
    
    const finalTotal = effectiveMRP - discount + platformFee - couponApplied;

    return location.state?.priceDetails || {
      mrp: effectiveMRP,
      discount: discount,
      fee: platformFee,
      coupon: couponApplied,
      totalAmount: finalTotal > 0 ? finalTotal : 8
    };
  });

  const totalMRP = priceDetails.mrp;
  const discount = priceDetails.discount;
  const platformFee = priceDetails.fee;
  const couponApplied = priceDetails.coupon;
  const finalTotal = priceDetails.totalAmount;

  // --- WALLET LOGIN FLOW ---
  const handleWalletSelect = (walletName) => {
    setSelectedWallet(walletName);
    setWalletDropdownOpen(false);

    Swal.fire({
      title: `<span style="color: #800020; font-size: 20px;">Sign in to ${walletName}</span>`,
      html: `
        <div style="text-align: left; padding: 5px;">
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: bold; font-size: 13px; color: #333; margin-bottom: 5px;">User ID / Mobile : *</label>
            <input type="text" id="swal-wallet-userid" class="swal2-input" placeholder="Enter User ID or Mobile" style="margin: 0; width: 100%; height: 38px;" />
          </div>
          <div style="margin-bottom: 8px;">
            <label style="display: block; font-weight: bold; font-size: 13px; color: #333; margin-bottom: 5px;">Password : *</label>
            <input type="password" id="swal-wallet-password" class="swal2-input" placeholder="Enter Password" style="margin: 0; width: 100%; height: 38px;" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sign In & Check Wallet',
      confirmButtonColor: '#0fa462',
      focusConfirm: false,
      preConfirm: () => {
        const userId = document.getElementById('swal-wallet-userid').value.trim();
        const password = document.getElementById('swal-wallet-password').value.trim();
        if (!userId || !password) {
          Swal.showValidationMessage('⚠️ Please enter both User ID and Password!');
          return false;
        }
        return { userId };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const simulatedBalance = (Math.random() * 2500 + 500).toFixed(2);
        setWalletBalance(simulatedBalance);
        setActiveMethod("MEDICINE_WALLET");

        Swal.fire({
          icon: 'success',
          title: `${walletName} Connected!`,
          html: `<b>Real-Time Wallet Balance:</b> <span style="color: #0fa462; font-size: 18px;">₹${simulatedBalance}</span>`
        });
      }
    });
  };

  const handleUpiVerify = () => {
    if (upiId.includes("@")) {
      setIsUpiVerified(true);
      Swal.fire({ icon: 'success', title: 'UPI Verified', timer: 1000, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'error', title: 'Invalid UPI ID' });
    }
  };

  const handleCardVerify = () => {
    if (cardData.number.length === 16 && cardData.expiry.includes("/")) {
      setIsCardVerified(true);
      Swal.fire({ icon: 'success', title: 'Card Validated' });
    } else {
      Swal.fire({ icon: 'warning', title: 'Error', text: 'Check card details again.' });
    }
  };

  const handleNetBankingLoginClick = () => {
    const generatedTxOtp = Math.floor(100000 + Math.random() * 900000).toString();

    Swal.fire({
      title: `<span style="color: #800020; font-size: 20px;">${selectedBankName} Internet Banking</span>`,
      html: `
        <div style="text-align: left; padding: 5px;">
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: bold; font-size: 13px;">User ID : *</label>
            <input type="text" id="swal-userid" class="swal2-input" placeholder="Enter User ID" style="margin: 0; width: 100%; height: 38px;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: bold; font-size: 13px;">Password : *</label>
            <input type="password" id="swal-password" class="swal2-input" placeholder="Enter Password" style="margin: 0; width: 100%; height: 38px;" />
          </div>
          <div style="background: #e8f7f0; color: #0fa462; padding: 8px; font-weight: bold; font-size: 12px; margin-bottom: 5px;">
            💬 Testing OTP: <b>${generatedTxOtp}</b>
          </div>
          <label style="font-weight: bold; font-size: 12px;">Enter OTP : *</label>
          <input type="text" id="swal-txotp" class="swal2-input" placeholder="Enter 6-digit OTP" maxLength="6" style="margin: 0; width: 100%; height: 35px;" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Verify & Pay',
      confirmButtonColor: '#0fa462',
      preConfirm: () => {
        const userId = document.getElementById('swal-userid').value.trim();
        const password = document.getElementById('swal-password').value.trim();
        const enteredTxOtp = document.getElementById('swal-txotp').value.trim();
        
        if (!userId || !password) {
          Swal.showValidationMessage('⚠️ Enter both User ID and Password!');
          return false;
        }
        if (enteredTxOtp !== generatedTxOtp) {
          Swal.showValidationMessage(`❌ Invalid OTP! (Hint: ${generatedTxOtp})`);
          return false;
        }
        return userId;
      }
    }).then((paymentResult) => {
      if (paymentResult.isConfirmed) {
        executeOrderSaving(`NB_USER_${paymentResult.value}_PAID`);
      }
    });
  };

  // --- ORDER EXECUTION & CART CLEARING ---
  const executeOrderSaving = async (cardNumberPayloadOverride) => {
    if (activeMethod !== "COD") {
      if (activeMethod === "UPI" && !isUpiVerified) {
        Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please verify your UPI ID before paying.' });
        return;
      }
      if (activeMethod === "CARD" && !isCardVerified) {
        Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please verify your card details before paying.' });
        return;
      }
      if (activeMethod === "MEDICINE_WALLET" && !walletBalance) {
        Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please sign in to your wallet first.' });
        return;
      }
      if (activeMethod === "NB" && !selectedBankName) {
        Swal.fire({ icon: 'warning', title: 'Action Required', text: 'Please select a bank and complete net banking login.' });
        return;
      }
    }

    Swal.fire({
      title: 'Processing Payment...',
      text: 'Placing order & updating systems...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    let cardNumberPayload = cardNumberPayloadOverride || `${activeMethod}_MODE`;
    let expiryPayload = "N/A";
    let cvvPayload = "000";
    let holderNamePayload = fullName;

    if (activeMethod === "CARD") {
      cardNumberPayload = cardData.number;
      expiryPayload = cardData.expiry;
      cvvPayload = cardData.cvv;
      holderNamePayload = cardData.name || holderNamePayload;
    } else if (activeMethod === "UPI") {
      cardNumberPayload = upiId;
    } else if (activeMethod === "MEDICINE_WALLET") {
      cardNumberPayload = `${selectedWallet}_WALLET_PAID`;
    } else if (activeMethod === "QRCODE") {
      cardNumberPayload = "QRCODE_UPI_PAID";
    }

    const dynamicPaymentMethodName = activeMethod === "NB" 
      ? `Net Banking (${selectedBankName})` 
      : activeMethod === "MEDICINE_WALLET" 
        ? `${selectedWallet} Wallet` 
        : activeMethod === "COD"
          ? "Cash on Delivery (COD)"
          : activeMethod === "QRCODE"
            ? "QR Code Payment"
            : activeMethod;

    const orderPayload = {
      bankName: dynamicPaymentMethodName,
      cardNumber: cardNumberPayload,
      expiryDate: expiryPayload,
      cvv: cvvPayload,
      cardholderName: holderNamePayload
    };

    try {
      const response = await fetch('https://ecommerencesite.onrender.com/api/BankdetailsWebapi/AdminCreatBank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        if (typeof clearCartState === 'function') {
          clearCartState();
        }

        setMedicineCoins(prev => prev + 15);
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful & Order Placed!',
          text: `Paid via ${dynamicPaymentMethodName}!`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate("/Orderstatus", { 
            state: { 
              orderId: Math.floor(100000 + Math.random() * 900000),
              cartItems: cartItems,
              totalMRP: totalMRP,
              totalDiscount: discount,
              platformFee: platformFee,
              couponDiscount: couponApplied,
              finalPayableAmount: finalTotal,
              paymentMode: dynamicPaymentMethodName,
              paymentMethodUsed: dynamicPaymentMethodName 
            } 
          });
        });
      } else {
        throw new Error("Server Error");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Transaction Failed',
        text: 'API connection error or server timeout. Your cart items are saved.',
      });
    }
  };

  return (
    <div className="app-container" style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#121212", margin: 0, padding: 0 }}>
      
      {/* SIDEBAR NAVIGATION */}
      <div className="modern-sidebar" style={{ width: '280px', height: '100vh', background: '#fff', position: 'fixed', left: 0, top: 0, padding: '24px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto', zIndex: 1000 }}>
        <div>
          <Link to="/dashboards" className="modern-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '20px' }}>
            <img src="/AKMedizostore.png" alt="logo" width="40" height="40" />
            <span style={{ fontWeight: '700', color: '#0fa462', fontSize: '1.25rem' }}>AK Medistore</span>
          </Link>

          <nav className="nav-menu" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <button 
                className={`nav-item dropdown-toggle-btn ${openDashboard ? 'active' : ''}`} 
                onClick={() => setOpenDashboard(!openDashboard)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}
              >
                <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-chart-pie"></i>
                  <span>Dashboard</span>
                </div>
                <i className={`fa-solid fa-chevron-${openDashboard ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
              </button>

              {openDashboard && (
                <div className="submenu-container" style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', gap: '6px', marginTop: '6px' }}>
                  <Link to="/medication-tracker" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-pills me-2"></i> Medication Tracker</Link>
                  <Link to="/test-reports" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-file-medical me-2"></i> Test Reports</Link>
                  <Link to="/health-history" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-heart-pulse me-2"></i> Health History</Link>
                  <Link to="/monthly-progress" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-chart-line me-2"></i> Monthly Progress</Link>
                  <Link to="/prescriptions" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-prescription me-2"></i> Prescriptions</Link>
                  <Link to="/history" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-clock-rotate-left me-2"></i> History</Link>
                  <Link to="/support" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-headset me-2"></i> Help & Support</Link>
                  <Link to="/settings" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fa-solid fa-gear me-2"></i> Settings</Link>
                </div>
              )}
            </div>

            <div>
              <button 
                className={`nav-item dropdown-toggle-btn ${openMasterUpdate ? 'active' : ''}`} 
                onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}
              >
                <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid fa-chevron-${openMasterUpdate ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
              </button>

              {openMasterUpdate && (
                <div className="submenu-container" style={{ display: 'flex', flexDirection: 'column', paddingLeft: '20px', gap: '6px', marginTop: '6px' }}>
                  <Link to="/deliveryaddress" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}>
                    <i className="fa-solid fa-map-marker-alt me-2"></i> Delivery Address
                  </Link>
                  <Link to="/addbankrefundableamounts" className="submenu-item" style={{ textDecoration: 'none', color: '#4a5568', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Refund Bank Details</Link>
                  <Link to="/bankdetailsrefundlist" className="submenu-item" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link>
                </div>
              )}
            </div>

            <Link to="/medicinedisplay" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
              <i className="fa-solid fa-pills"></i>
              <span>Medicines</span>
            </Link>

            <Link to="/carts" className="modern-nav-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', color: '#2d3748', textDecoration: 'none', fontWeight: '600' }}>
              <span><i className="fa-solid fa-shopping-cart me-2"></i> My Cart</span>
              {cartItems.length > 0 && <span className="badge bg-danger rounded-pill">{cartItems.length}</span>}
            </Link>

            <Link to="/order" className="modern-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', color: '#2d3748', textDecoration: 'none', fontWeight: '600' }}>
              <span><i className="fa-solid fa-truck me-2"></i> Orders</span>
            </Link>

            <Link to="/feedbackcustomers" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
              <i className="fa-solid fa-comment-dots"></i>
              <span>Customer Feedback</span>
            </Link>

            <Link to="/customeraddmedicines" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>Unavailable Medicines</span>
            </Link>

            <Link to="/profile" className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', textDecoration: 'none', color: '#2d3748', fontWeight: '600' }}>
              <i className="fa-solid fa-user"></i>
              <span>Customer Profile</span>
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <div className="user-profile-card" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="user-avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#0fa462', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{userInitial}</div>
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-name" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2d3748' }}>{fullName}</span>
              <span className="user-role" style={{ fontSize: '0.75rem', color: '#718096' }}>Customer Account</span>
            </div>
          </div>

          <Link to="/header" className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#e53e3e', fontWeight: '600', fontSize: '0.9rem' }}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* CHECKOUT INTERFACE AREA */}
      <div style={{ marginLeft: '280px', width: 'calc(100% - 280px)', padding: '24px', boxSizing: 'border-box', backgroundColor: '#121212', color: '#fff' }}>
        <div className="bg-success text-center py-3 rounded mb-4">
          <h4 className="m-0">AK MEDICINE - CHECKOUT</h4>
        </div>

        <div className="d-flex gap-4 justify-content-between">
          {/* PAYMENT OPTIONS SELECTOR */}
          <div className="bg-secondary bg-opacity-25 rounded p-3" style={{ width: '240px' }}>
            <h6 className="mb-3">Select Method</h6>
            {["UPI", "CARD", "QRCODE"].map(m => (
              <div key={m} onClick={() => setActiveMethod(m)} 
                className={`p-3 mb-2 rounded border ${activeMethod === m ? "bg-success border-white" : "bg-dark border-secondary"}`}
                style={{ cursor: 'pointer' }}>
                {m}
              </div>
            ))}

            <div className="mb-2">
              <div onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className={`p-3 rounded border d-flex justify-content-between align-items-center ${activeMethod === "MEDICINE_WALLET" ? "bg-success border-white" : "bg-dark border-secondary"}`}
                style={{ cursor: 'pointer' }}>
                <span>MedicineWallet</span>
                <i className={`fa-solid ${walletDropdownOpen ? "fa-chevron-down" : "fa-chevron-right"}`}></i>
              </div>

              {walletDropdownOpen && (
                <div className="bg-dark p-2 mt-1 rounded border border-secondary d-flex flex-column gap-2">
                  {["Airtel", "Amazon", "Paytm"].map((wallet) => (
                    <div key={wallet} onClick={() => handleWalletSelect(wallet)}
                      className="p-2 rounded text-white bg-secondary bg-opacity-50"
                      style={{ cursor: 'pointer', fontSize: '13px' }}>
                      🔗 {wallet} Wallet
                    </div>
                  ))}
                </div>
              )}
            </div>

            {["NB", "COD"].map(m => (
              <div key={m} onClick={() => setActiveMethod(m)} 
                className={`p-3 mb-2 rounded border ${activeMethod === m ? "bg-success border-white" : "bg-dark border-secondary"}`}
                style={{ cursor: 'pointer' }}>
                {m}
              </div>
            ))}
          </div>

          {/* ACTIVE METHOD CONFIGURATION FORM */}
          <div className="bg-secondary bg-opacity-10 p-4 rounded border border-secondary flex-grow-1">
            {activeMethod === "UPI" && (
              <div>
                <h5>UPI Payment</h5>
                <div className="d-flex gap-2 mt-3">
                  <input type="text" className="form-control" placeholder="user@bank" onChange={(e) => {setUpiId(e.target.value); setIsUpiVerified(false);}} />
                  <button className="btn btn-warning" onClick={handleUpiVerify}>Verify</button>
                </div>
                <button className="btn btn-success w-100 mt-4 py-3" disabled={!isUpiVerified} onClick={() => executeOrderSaving(null)}>Pay Now</button>
              </div>
            )}

            {activeMethod === "CARD" && (
              <div>
                <h5>Card Details</h5>
                <input type="text" className="form-control mb-2" placeholder="Card Number (16 digits)" maxLength="16" onChange={(e) => setCardData({...cardData, number: e.target.value})} />
                <div className="d-flex gap-2 mb-2">
                  <input type="text" className="form-control" placeholder="MM/YY" onChange={(e) => setCardData({...cardData, expiry: e.target.value})} />
                  <input type="password" className="form-control" placeholder="CVV" maxLength="3" onChange={(e) => setCardData({...cardData, cvv: e.target.value})} />
                </div>
                <input type="text" className="form-control mb-3" placeholder="Cardholder Name" onChange={(e) => setCardData({...cardData, name: e.target.value})} />
                <button className="btn btn-success w-100 py-3" onClick={isCardVerified ? () => executeOrderSaving(null) : handleCardVerify}>
                  {isCardVerified ? "Complete Payment" : "Verify Card"}
                </button>
              </div>
            )}

            {activeMethod === "QRCODE" && (
              <div className="text-center">
                <h5>Scan & Pay via UPI QR Code</h5>
                <p className="text-white-50">Scan this QR code with Google Pay, PhonePe, Paytm or any UPI app. Exact amount (₹{Number(finalTotal).toFixed(2)}) will pre-fill automatically.</p>
                
                <div className="bg-white p-3 rounded d-inline-block mb-3 shadow position-relative">
                  <QRCodeSVG 
                    value={`upi://pay?pa=akmedistore@oksbi&pn=AK%20Medistore&am=${Number(finalTotal).toFixed(2)}&cu=INR`}
                    size={180}
                    level={"M"}
                    includeMargin={true}
                  />
                  {isQrPaid && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      background: 'rgba(15, 164, 98, 0.9)', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: '4px'
                    }}>
                      <i className="fa-solid fa-circle-check fa-3x mb-2"></i>
                      <span className="fw-bold">Paid Successfully!</span>
                    </div>
                  )}
                </div>

                <div className="text-warning small mb-3 fw-bold">
                  {isQrPaid ? "✅ Payment verified! Redirecting to order status..." : "📱 Waiting for payment scan... Open GPay/PhonePe and scan above code."}
                </div>
              </div>
            )}

            {activeMethod === "MEDICINE_WALLET" && (
              <div>
                <h5>{selectedWallet} Wallet Checkout</h5>
                <div className="p-3 mb-3 bg-dark rounded border border-success">
                  <p className="m-0"><strong>Connected:</strong> {selectedWallet}</p>
                  <p className="m-0 mt-2 text-warning"><strong>Available Wallet Balance:</strong> ₹{walletBalance || "0.00"}</p>
                </div>
                <button className="btn btn-success w-100 py-3" onClick={() => executeOrderSaving(null)}>
                  Pay ₹{finalTotal} via Wallet
                </button>
              </div>
            )}

            {activeMethod === "NB" && (
              <div>
                <h5>Net Banking Selection</h5>
                <div className="mt-3 mb-3">
                  <label className="form-label text-white-50">Select Your Bank</label>
                  <select className="form-select bg-dark text-white border-secondary" value={selectedBankName} onChange={(e) => setSelectedBankName(e.target.value)}>
                    <option value="">-- Choose Bank --</option>
                    {savedBanks.map((bank, idx) => (
                      <option key={idx} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-success w-100 py-3" disabled={!selectedBankName} onClick={handleNetBankingLoginClick}>
                  Proceed to Net Banking Login
                </button>
              </div>
            )}

            {activeMethod === "COD" && (
              <div className="text-center py-4">
                <h5>Cash on Delivery (COD)</h5>
                <p className="text-white-50 mt-2">Pay cash directly to the delivery partner upon arrival. No upfront payment required.</p>
                <button className="btn btn-success w-100 py-3 mt-3" onClick={() => executeOrderSaving(null)}>Place COD Order</button>
              </div>
            )}
          </div>

          {/* BILLING SUMMARY WIDGET */}
          <div className="bg-dark p-3 rounded border border-secondary" style={{ width: '300px' }}>
            <h6 className="mb-3 opacity-75">PRICE DETAILS</h6>
            <hr className="border-secondary mb-3" />
            <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{totalMRP}</span></div>
            <div className="d-flex justify-content-between mb-2 text-success"><span>Discount</span><span>-₹{discount}</span></div>
            <div className="d-flex justify-content-between mb-2"><span>Platform Fee</span><span>₹{platformFee}</span></div>
            <div className="d-flex justify-content-between mb-3 text-success"><span>Coupon</span><span>-₹{couponApplied}</span></div>
            <hr className="border-secondary mb-3" />
            <div className="d-flex justify-content-between fw-bold mb-3"><span>Total Amount</span><span>₹{finalTotal}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
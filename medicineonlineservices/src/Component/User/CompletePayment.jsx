import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import Swal from "sweetalert2";
import "../styles/CompletePayments.css";

export default function CompletePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [activeMethod, setActiveMethod] = useState("UPI");
  
  // UI State
  const [openDashboard, setOpenDashboard] = useState(true);
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

  // Net Banking Dynamic Bank Names List State
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

  // --- HELPER FUNCTIONS ---
  const isActive = (path) => location.pathname === path;

  const getInitial = () => {
    if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return "G";
  };

  // --- PRICE CALCULATIONS ---
  const totalMRP = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
  const discount = totalMRP > 0 ? 30 : 0;
  const platformFee = 7;
  const couponApplied = 8;
  const finalTotal = totalMRP - discount + platformFee - couponApplied;

  const priceDetails = location.state?.priceDetails || {
    mrp: totalMRP,
    discount: discount,
    fee: platformFee,
    coupon: couponApplied,
    totalAmount: finalTotal
  };

  // --- LOGIC HANDLERS ---
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
    Swal.fire({
      title: `<span style="color: #800020; font-size: 20px;">Welcome to ${selectedBankName} Internet Banking</span>`,
      html: `
        <div style="text-align: left; font-family: Arial, sans-serif; padding: 5px;">
          <div style="background: #800020; color: white; padding: 8px 12px; font-weight: bold; font-size: 14px; margin-bottom: 15px;">
            Existing users login 🔒
          </div>
          
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: bold; font-size: 13px; color: #333; margin-bottom: 5px;">
              User ID : <span style="color: red;">*</span>
            </label>
            <input type="text" id="swal-userid" class="swal2-input" placeholder="Enter User ID (e.g. gautam123)" style="margin: 0; width: 100%; height: 38px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 8px;">
            <label style="display: block; font-weight: bold; font-size: 13px; color: #333; margin-bottom: 5px;">
              Password / MPIN : <span style="color: red;">*</span>
            </label>
            <input type="password" id="swal-password" class="swal2-input" placeholder="Enter Password (e.g. secure123)" style="margin: 0; width: 100%; height: 38px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;" />
          </div>

          <div style="text-align: right; margin-bottom: 15px;">
            <a href="#" id="swal-forget-link" style="font-size: 12px; color: #0066cc; text-decoration: none;">Forgot User ID / Password?</a>
          </div>

          <div style="background: #f9f9f9; border: 1px solid #eee; padding: 10px; font-size: 11px; color: #666; border-radius: 4px;">
            <strong>Security tips:</strong> Do not reveal passwords over phone/email. Always verify the secure padlock symbol in the address bar.
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Login & Pay',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0fa462',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      didOpen: () => {
        const forgetLink = document.getElementById('swal-forget-link');
        if (forgetLink) {
          forgetLink.addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire({
              title: 'Password Recovery',
              text: `Enter your registered mobile number for ${selectedBankName} recovery:`,
              input: 'text',
              inputPlaceholder: '10-digit mobile number',
              showCancelButton: true,
              confirmButtonText: 'Send OTP',
              confirmButtonColor: '#0fa462'
            }).then((recoveryRes) => {
              if (recoveryRes.isConfirmed && recoveryRes.value) {
                if (recoveryRes.value.length === 10) {
                  Swal.fire('OTP Sent!', 'Recovery instructions sent to your registered mobile.', 'success');
                } else {
                  Swal.fire('Error', 'Please enter a valid 10-digit mobile number.', 'error');
                }
              }
            });
          });
        }
      },
      preConfirm: () => {
        const userId = document.getElementById('swal-userid').value.trim();
        const password = document.getElementById('swal-password').value.trim();

        if (!userId || !password) {
          Swal.showValidationMessage('⚠️ Please enter both User ID and Password!');
          return false;
        }

        const validTestUsers = ["gautam123", "user123", "admin", "pnb123"];
        const correctPassword = "password123";

        if (!validTestUsers.includes(userId.toLowerCase())) {
          Swal.showValidationMessage('❌ Incorrect User ID! Please check your User ID or use Forgot option.');
          return false;
        }

        if (password !== correctPassword) {
          Swal.showValidationMessage('❌ Incorrect Password! Please enter the correct password or reset it.');
          return false;
        }

        return { userId, password };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        executeOrderSaving(`NB_USER_${result.value.userId}`);
      }
    });
  };

  const executeOrderSaving = async (cardNumberPayloadOverride) => {
    Swal.fire({
      title: 'Authenticating & Saving...',
      text: 'Please wait while we process your transaction...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    let cardNumberPayload = cardNumberPayloadOverride || "COD_MODE";
    let expiryPayload = "N/A";
    let cvvPayload = "000";
    let holderNamePayload = user ? `${user.firstName} ${user.lastName}` : "Gautam Dev";

    if (activeMethod === "CARD") {
      cardNumberPayload = cardData.number;
      expiryPayload = cardData.expiry;
      cvvPayload = cardData.cvv;
      holderNamePayload = cardData.name || holderNamePayload;
    } else if (activeMethod === "UPI") {
      cardNumberPayload = upiId;
    } else if (activeMethod === "NB" && selectedBankName) {
      expiryPayload = "N/A";
      cvvPayload = "000";
    }

    const orderPayload = {
      bankName: activeMethod === "NB" ? selectedBankName : activeMethod,
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
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          text: 'Net Banking authentication verified and transaction saved.',
        }).then(() => {
          navigate("/orders");
        });
      } else {
        throw new Error("Server Error");
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'API connection error.',
      });
    }
  };

  return (
    <div className="app-container" style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#121212", margin: 0, padding: 0, overflowX: "hidden" }}>
      
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
          background-color: #fff5f5;
        }
        .modern-main-layout {
          margin-left: 280px;
          width: calc(100% - 280px);
          min-height: 100vh;
          padding: 24px;
          box-sizing: border-box;
          background-color: #121212;
        }
      `}</style>

      {/* ---------- SIDEBAR ---------- */}
      <div className="modern-sidebar">
        <div>
          <Link to="/dashboards" className="modern-brand">
            <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
            <span>AK Medistore</span>
          </Link>

          <ul className="modern-nav-menu">
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
                  <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
                  <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pills"></i>
                  <span>Medicines</span>
                </div>
              </Link>
            </li>

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

            <li>
              <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-truck"></i>
                  <span>Orders</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-comment-dots"></i>
                  <span>Customer Feedback</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>Unavailable Medicines</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="modern-sidebar-footer">
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

          <Link to="/header" className="modern-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* ---------- MAIN CONTENT AREA (Full Width Stretched) ---------- */}
      <div className="modern-main-layout text-white">
        <div className="fk-page-wrapper w-100">
          <div className="fk-top-header text-center py-3 bg-success rounded mb-4 w-100">
            <h4 className="m-0">AK MEDICINE - CHECKOUT</h4>
          </div>

          <div className="fk-main-body w-100">
            <div className="fk-payment-container d-flex gap-4 w-100 justify-content-between align-items-stretch" style={{ flexWrap: "nowrap" }}>
              
              {/* LEFT: PAYMENT METHODS */}
              <div className="fk-left-sidebar bg-secondary bg-opacity-25 rounded p-3 flex-shrink-0" style={{width: '240px'}}>
                <h6 className="mb-4">Select Method</h6>
                {["UPI", "CARD", "QRCODE", "NB", "COD"].map(m => (
                  <div key={m} onClick={() => setActiveMethod(m)} 
                    className={`p-3 mb-2 rounded border ${activeMethod === m ? "bg-success border-white" : "bg-dark border-secondary"}`}
                    style={{ cursor: 'pointer' }}>
                    {m}
                  </div>
                ))}
              </div>

              {/* CENTER: FORMS (Fluid width allocation expanding completely) */}
              <div className="fk-center-content bg-secondary bg-opacity-10 p-4 rounded border border-secondary" style={{ flex: '1 1 auto', minWidth: '0' }}>
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
                    <input type="text" className="form-control mb-2" placeholder="Card Number" maxLength="16" onChange={(e) => setCardData({...cardData, number: e.target.value})} />
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
                    <p>Scan to Pay ₹{priceDetails.totalAmount}</p>
                    <img className="bg-white p-2 rounded mb-3" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=ak@upi&am=${priceDetails.totalAmount}`} alt="QR" />
                    <button className="btn btn-success w-100 py-3" onClick={() => executeOrderSaving(null)}>Confirm Payment</button>
                  </div>
                )}

                {activeMethod === "NB" && (
                  <div className="py-2">
                    <h5>Net Banking - Select Bank Name</h5>
                    <div className="mt-3 mb-3">
                      <label className="form-label text-white-50">Choose Bank Name</label>
                      <select 
                        className="form-select bg-dark text-white border-secondary"
                        value={selectedBankName}
                        onChange={(e) => setSelectedBankName(e.target.value)}
                      >
                        <option value="">-- Select Bank Name --</option>
                        {savedBanks.map((bankName, index) => (
                          <option key={index} value={bankName}>
                            {bankName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedBankName && (
                      <div className="p-3 mb-3 bg-dark rounded border border-secondary text-white-50" style={{fontSize: '14px'}}>
                        <p className="m-0"><strong>Selected Bank:</strong> {selectedBankName}</p>
                        <p className="m-0 mt-1 text-success">Credential login ready via {selectedBankName} portal.</p>
                      </div>
                    )}

                    <button 
                      className="btn btn-success w-100 py-3 mt-2" 
                      disabled={!selectedBankName}
                      onClick={handleNetBankingLoginClick}
                    >
                      Login & Pay via {selectedBankName || "Bank"}
                    </button>
                  </div>
                )}

                {activeMethod === "COD" && (
                  <div className="text-center py-4">
                    <h5>Confirm Cash on Delivery (COD) Order</h5>
                    <p className="text-white-50 mt-2">Pay securely with cash upon delivery at your doorstep.</p>
                    <button className="btn btn-success w-100 py-3 mt-3" onClick={() => executeOrderSaving(null)}>Place Order</button>
                  </div>
                )}
              </div>

              {/* RIGHT: BILLING SUMMARY */}
              <div className="fk-right-sidebar bg-dark p-3 rounded border border-secondary flex-shrink-0" style={{width: '320px'}}>
                <h6 className="mb-3 text-uppercase opacity-75" style={{fontSize: '13px', letterSpacing: '1px'}}>Price Details</h6>
                <hr className="border-secondary mb-3" />
                
                <div className="d-flex justify-content-between mb-3">
                  <span style={{fontSize: '15px'}}>Total MRP</span>
                  <span>₹{priceDetails.mrp}</span>
                </div>

                <div className="d-flex justify-content-between mb-3 text-success">
                  <span style={{fontSize: '15px'}}>Discount</span>
                  <span>-₹{priceDetails.discount}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span style={{fontSize: '15px'}}>Platform Fee</span>
                  <span>₹{priceDetails.fee}</span>
                </div>

                <div className="d-flex justify-content-between mb-3 text-success">
                  <span style={{fontSize: '15px'}}>Coupon Applied</span>
                  <span>-₹{priceDetails.coupon}</span>
                </div>

                <hr className="border-secondary" />

                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                  <h4 className="fw-bold m-0" style={{fontSize: '22px'}}>Total</h4>
                  <h4 className="fw-bold m-0" style={{fontSize: '22px'}}>₹{priceDetails.totalAmount}</h4>
                </div>

                <div className="alert alert-success bg-success bg-opacity-10 text-success border-0 text-center py-2" style={{fontSize: '14px', borderRadius: '8px'}}>
                  You save ₹{priceDetails.discount + priceDetails.coupon} on this order!
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
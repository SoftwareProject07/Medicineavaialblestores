import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext"; 
import "../styles/CompletePayments.css";

export default function CompletePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);

  // --- STATE MANAGEMENT ---
  const [activeMethod, setActiveMethod] = useState("UPI"); // Controls which method is shown
  const [upiId, setUpiId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);

  // --- DYNAMIC DATA RETRIEVAL ---
  const fallbackMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
  const fallbackSelling = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
  const fallbackDiscount = cartItems.reduce((acc, item) => acc + (30 * (item.quantity || 1)), 0);

  const { priceDetails } = location.state || {
    priceDetails: {
      mrp: fallbackMRP,
      discount: fallbackDiscount,
      platformFee: 7,
      coupons: 8,
      totalAmount: (fallbackSelling + 7 - 8)
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Reset verification if user changes the UPI ID text
  useEffect(() => {
    setIsVerified(false);
  }, [upiId]);

  const handleVerify = () => {
    if (upiId.includes("@") && upiId.length > 3) {
      setIsVerified(true);
    } else {
      alert("Please enter a valid UPI ID");
    }
  };

  const handleOrderCompletion = () => {
    alert(`Order Placed Successfully via ${activeMethod}!`);
    navigate("/orders");
  };

  return (
    <div className="app-container bg-dark min-vh-100 text-white">
      {/* 1. SIDEBAR */}
   <div className="sidebar">
     <div className="brand">
       <Link to="/dashboards">
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
   
       {/* SINGLE BUTTONS */}
       <li>
         <Link to="/medicinedisplay" className="sidebar-btn">
           <div className="btn-content"><i className="fas fa-capsules"></i> Medicines</div>
         </Link>
       </li>
   
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
     
   
       <li>
         <Link to="/profile" className="sidebar-btn">
           <div className="btn-content"><i className="fas fa-user"></i> Customer Profile</div>
         </Link>
       </li>
   
       <li className="logout-item">
         <Link to="/header" className="sidebar-btn logout">
           <div className="btn-content"><i className="fas fa-sign-out-alt"></i> Log Out</div>
         </Link>
       </li>
     </ul>
   </div>
   

      {/* 2. MAIN CONTENT */}
      <div className="main-content-area">
        <div className="fk-page-wrapper">
          <div className="fk-top-header">
            <div className="fk-header-content">AK MEDICINE</div>
          </div>

          <div className="fk-main-body">
            <div className="fk-payment-container">
              
              {/* Column 1: Payment Options (Left Sidebar) */}
              <div className="fk-left-sidebar">
                <div className="fk-section-header">
                  <span className="back-arrow" onClick={() => navigate(-1)} style={{cursor:'pointer'}}>←</span>
                  <span className="header-title">Complete Payment</span>
                </div>
                
                {/* UPI Option */}
                <div className={`fk-method-row ${activeMethod === "UPI" ? "active" : ""}`} onClick={() => setActiveMethod("UPI")}>
                  <div className="fk-icon-sq">UPI</div>
                  <div className="fk-method-details">
                    <p className="m-title">UPI</p>
                    <p className="m-sub">Pay by any UPI app</p>
                  </div>
                </div>

                {/* Card Option */}
                <div className={`fk-method-row ${activeMethod === "CARD" ? "active" : ""}`} onClick={() => setActiveMethod("CARD")}>
                  <div className="fk-icon-sq">CARD</div>
                  <div className="fk-method-details">
                    <p className="m-title">Credit / Debit / ATM Card</p>
                    <p className="m-sub">Add and secure cards</p>
                  </div>
                </div>

                {/* COD Option */}
                <div className={`fk-method-row ${activeMethod === "COD" ? "active" : ""}`} onClick={() => setActiveMethod("COD")}>
                  <div className="fk-icon-sq">COD</div>
                  <p className="m-title">Cash on Delivery</p>
                </div>

                {/* Net Banking Option */}
                <div className={`fk-method-row ${activeMethod === "NB" ? "active" : ""}`} onClick={() => setActiveMethod("NB")}>
                  <div className="fk-icon-sq">NB</div>
                  <p className="m-title">Net Banking</p>
                </div>
              </div>




              {/* CENTER: DYNAMIC INPUT AREA */}
              <div className="fk-center-content">
                <div className="fk-upi-card">
                  
                  {/* --- CASE 1: UPI --- */}
                  {activeMethod === "UPI" && (
                    <>
                      <div className="fk-selection-header">
                        <div className="radio-outer"><div className="radio-inner"></div></div>
                        <span>Add new UPI ID</span>
                      </div>
                      <div className="fk-input-area">
                        <label>UPI ID</label>
                        <div className="fk-input-flex">
                          <input
                            type="text"
                            placeholder="Enter UPI ID"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                          <button className="fk-verify-btn" onClick={handleVerify}>Verify</button>
                        </div>
                        {isVerified && <small className="text-success fw-bold mt-1 d-block">ID Verified Successfully</small>}
                      </div>
                      <button 
                        className={`fk-pay-btn ${isVerified ? "enabled" : ""}`} 
                        disabled={!isVerified}
                        onClick={handleOrderCompletion}
                      >
                        Pay ₹{priceDetails.totalAmount}
                      </button>
                    </>
                  )}

                  {/* --- CASE 2: CARD --- */}
                  {activeMethod === "CARD" && (
                    <div className="fk-card-details-form">
                      <h6>Enter Card Details</h6>
                      <div className="fk-input-group mt-3">
                        <input type="text" placeholder="Card Number" className="form-control mb-2" maxLength="16" />
                        <div className="d-flex gap-2">
                          <input type="text" placeholder="MM/YY" className="form-control" maxLength="5" />
                          <input type="password" placeholder="CVV" className="form-control" maxLength="3" />
                        </div>
                        <input type="text" placeholder="Name on Card" className="form-control mt-2" />
                      </div>
                      <button className="fk-pay-btn enabled mt-4" onClick={handleOrderCompletion}>
                        Pay ₹{priceDetails.totalAmount}
                      </button>
                    </div>
                  )}

                  {/* --- CASE 3: COD --- */}
                  {activeMethod === "COD" && (
                    <div className="cod-confirm text-center p-3">
                      <div className="cod-icon mb-3">
                        <i className="fas fa-hand-holding-usd fa-3x text-success"></i>
                      </div>
                      <h5>Cash on Delivery</h5>
                      <p className="text-muted">You can pay via Cash/UPI at the time of delivery.</p>
                      <button className="fk-pay-btn enabled mt-3" onClick={handleOrderCompletion}>
                        Confirm Order (Pay ₹{priceDetails.totalAmount})
                      </button>
                    </div>
                  )}

                  {/* --- CASE 4: NET BANKING --- */}
                  {activeMethod === "NB" && (
                    <div className="nb-selection p-2">
                      <h6>Select Your Bank</h6>
                      <select className="form-select bg-dark text-white border-secondary mt-3">
                        <option>SBI Bank</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                      </select>
                      <button className="fk-pay-btn enabled mt-4" onClick={handleOrderCompletion}>
                        Pay ₹{priceDetails.totalAmount}
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* RIGHT: DYNAMIC PRICE DETAILS (Fixed) */}
              <div className="fk-right-sidebar">
                <div className="price-header">
                  <span>PRICE DETAILS</span>
                  <span className="secure-tag">🔒 Secure</span>
                </div>

                <div className="price-body">
                  <div className="p-row">
                    <span>MRP</span>
                    <span>₹{priceDetails.mrp}</span>
                  </div>
                  <div className="p-row sub">
                    <span>Platform Fee</span>
                    <span>₹{priceDetails.platformFee}</span>
                  </div>
                  <div className="p-row green">
                    <span>MRP Discount</span>
                    <span>-₹{priceDetails.discount}</span>
                  </div>
                  <div className="p-row green">
                    <span>Coupons</span>
                    <span>-₹{priceDetails.coupons}</span>
                  </div>
                  <hr className="border-secondary" />
                  <div className="p-total-row">
                    <span>Total Amount</span>
                    <span>₹{priceDetails.totalAmount}</span>
                  </div>
                  <div className="savings-msg mt-3 text-success small fw-bold text-center">
                    You will save ₹{priceDetails.discount + priceDetails.coupons} on this order
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
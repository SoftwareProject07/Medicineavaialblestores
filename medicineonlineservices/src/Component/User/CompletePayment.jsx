import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext"; 
import "../styles/CompletePayments.css";

export default function CompletePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [banks, setBanks] = useState([]);
  const [activeMethod, setActiveMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [showBarcode, setShowBarcode] = useState(true);

  // --- API DATA FETCHING ---
  useEffect(() => {
    // Fetch Banks for Net Banking
    fetch('https://ecommerencesite.onrender.com/api/bankselectmodelsAPI/GetAllBankSelect') 
        .then(response => response.json())
        .then(data => setBanks(data))
        .catch(error => console.error('Error fetching banks:', error));

    // User session retrieval
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Reset verification if UPI ID changes
  useEffect(() => {
    setIsVerified(false);
  }, [upiId]);

  // --- PRICE CALCULATIONS ---
  const fallbackMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
  const fallbackSelling = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
  const fallbackDiscount = cartItems.reduce((acc, item) => acc + (30 * (item.quantity || 1)), 0);

  const priceDetails = location.state?.priceDetails || {
    mrp: fallbackMRP,
    discount: fallbackDiscount,
    platformFee: 7,
    coupons: 8,
    totalAmount: (fallbackSelling + 7 - 8)
  };

  // --- HANDLERS ---
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
          <span>{user ? `${user.firstName} ${user.lastName}` : "User"}</span>
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
    
              <li className="menu-group">
                <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
                  <div className="btn-content">
                    <i className="fas fa-edit"></i> Master Update
                  </div>
                  <span>{openMasterUpdate ? "▾" : "▸"}</span>
                </button>
                {openMasterUpdate && (
                  <ul className="submenu">
                    <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt"></i> Delivery Address</Link></li>
                    <li><Link to="/CompletePayments" className="sidebar-btn active-btn"><i className="fas fa-credit-card"></i> Order Payment</Link></li>
                    <li><Link to="/"><i className="fas fa-map-marker-alt"></i> Refund Order Amount</Link></li>
                  </ul>
                )}
              </li>
    
              <li><Link to="/medicinedisplay" className="btn btn-success mb-2">Medicines</Link></li>
    
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

      {/* 2. MAIN CONTENT */}
      <div className="main-content-area">
        <div className="fk-page-wrapper">
          <div className="fk-top-header"><div className="fk-header-content">AK MEDICINE</div></div>

          <div className="fk-main-body">
            <div className="fk-payment-container">
              
              {/* LEFT SIDEBAR - METHODS */}
              <div className="fk-left-sidebar">
                <div className="fk-section-header">
                  <span className="back-arrow" onClick={() => navigate(-1)} style={{cursor:'pointer'}}>←</span>
                  <span className="header-title">Complete Payment</span>
                </div>
                
                <div className={`fk-method-row ${activeMethod === "UPI" ? "active" : ""}`} onClick={() => setActiveMethod("UPI")}>
                  <div className="fk-icon-sq">UPI</div>
                  <div className="fk-method-details"><p className="m-title">UPI</p><p className="m-sub">Pay via App</p></div>
                </div>

                <div className={`fk-method-row ${activeMethod === "QRCODE" ? "active" : ""}`} onClick={() => { setActiveMethod("QRCODE"); setShowBarcode(true); }}>
                  <div className="fk-icon-sq">QR</div>
                  <div className="fk-method-details"><p className="m-title">QR Code</p><p className="m-sub">Scan & Pay</p></div>
                </div>

                <div className={`fk-method-row ${activeMethod === "CARD" ? "active" : ""}`} onClick={() => setActiveMethod("CARD")}>
                  <div className="fk-icon-sq">CARD</div>
                  <div className="fk-method-details"><p className="m-title">Debit/Credit Card</p></div>
                </div>

                <div className={`fk-method-row ${activeMethod === "NB" ? "active" : ""}`} onClick={() => setActiveMethod("NB")}>
                  <div className="fk-icon-sq">NB</div>
                  <div className="fk-method-details"><p className="m-title">Net Banking</p></div>
                </div>

                <div className={`fk-method-row ${activeMethod === "COD" ? "active" : ""}`} onClick={() => setActiveMethod("COD")}>
                  <div className="fk-icon-sq">COD</div>
                  <div className="fk-method-details"><p className="m-title">Cash on Delivery</p></div>
                </div>
              </div>

              {/* CENTER CONTENT - LOGIC AREA */}
              <div className="fk-center-content">
                <div className="fk-upi-card">
                  
                  {/* UPI Method */}
                  {activeMethod === "UPI" && (
                    <div className="p-3">
                      <h6>Add new UPI ID</h6>
                      <div className="fk-input-flex mt-3">
                        <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                        <button className="fk-verify-btn" onClick={handleVerify}>Verify</button>
                      </div>
                      {isVerified && <small className="text-success fw-bold mt-1 d-block">ID Verified Successfully</small>}
                      <button className={`fk-pay-btn mt-4 ${isVerified ? "enabled" : ""}`} disabled={!isVerified} onClick={handleOrderCompletion}>Pay ₹{priceDetails.totalAmount}</button>
                    </div>
                  )}

                  {/* Card Method */}
                  {activeMethod === "CARD" && (
                    <div className="fk-card-details-form p-3">
                      <h6>Enter Card Details</h6>
                      <div className="fk-input-group mt-3">
                        <input type="text" placeholder="Card Number" className="form-control mb-2" maxLength="16" />
                        <div className="d-flex gap-2">
                          <input type="text" placeholder="MM/YY" className="form-control" maxLength="5" />
                          <input type="password" placeholder="CVV" className="form-control" maxLength="3" />
                        </div>
                        <input type="text" placeholder="Name on Card" className="form-control mt-2" />
                      </div>
                      <button className="fk-pay-btn enabled mt-4" onClick={handleOrderCompletion}>Pay ₹{priceDetails.totalAmount}</button>
                    </div>
                  )}

                  {/* Net Banking Method */}
                  {activeMethod === "NB" && (
                    <div className="nb-selection p-3">
                      <h6>Select Your Bank</h6>
                      <select className="form-select bg-dark text-white border-secondary mt-3">
                        <option value="">-- Choose a Bank --</option>
                        {banks.map((bank) => (
                          <option key={bank.bankselectid} value={bank.bankselectid}>{bank.bankName}</option>
                        ))}
                      </select>
                      <button className="fk-pay-btn enabled mt-4" onClick={handleOrderCompletion}>Pay ₹{priceDetails.totalAmount}</button>
                    </div>
                  )}

                  {/* QR Code Method */}
                  {activeMethod === "QRCODE" && (
                    <div className="text-center p-3">
                      {showBarcode ? (
                        <div onClick={() => setShowBarcode(false)} style={{ cursor: 'pointer' }}>
                          <h6 className="mb-3">Scan this Barcode to Pay</h6>
                          <div className="bg-white p-3 d-inline-block rounded shadow">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=akmedicine@bank&am=${priceDetails.totalAmount}`} 
                              alt="Barcode" 
                            />
                          </div>
                          <p className="text-muted mt-3 small">Click on the Barcode to reveal Amount & Confirm</p>
                        </div>
                      ) : (
                        <div className="amount-reveal py-4">
                          <h5 className="text-success fw-bold mb-3">Barcode Scanned!</h5>
                          <h2 className="mb-4">Payable: ₹{priceDetails.totalAmount}</h2>
                          <button className="fk-pay-btn enabled w-100" onClick={handleOrderCompletion}>Confirm Payment & Order</button>
                          <button className="btn btn-link text-white mt-2" onClick={() => setShowBarcode(true)}>Show Barcode Again</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* COD Method */}
                  {activeMethod === "COD" && (
                    <div className="cod-confirm text-center p-3">
                      <i className="fas fa-hand-holding-usd fa-3x text-success mb-3"></i>
                      <h5>Cash on Delivery</h5>
                      <p className="text-muted">Pay at the time of delivery.</p>
                      <button className="fk-pay-btn enabled mt-3" onClick={handleOrderCompletion}>Confirm Order (Pay ₹{priceDetails.totalAmount})</button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDEBAR - PRICE DETAILS */}
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
                    You will save ₹{(priceDetails.discount || 0) + (priceDetails.coupons || 0)} on this order
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
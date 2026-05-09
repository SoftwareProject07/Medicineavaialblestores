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
  const [banks, setBanks] = useState([]);
  const [activeMethod, setActiveMethod] = useState("UPI");
  
  // UI State
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);

  // Validation States
  const [upiId, setUpiId] = useState("");
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [isCardVerified, setIsCardVerified] = useState(false);

  // --- API DATA FETCHING ---
  useEffect(() => {
    fetch('https://ecommerencesite.onrender.com/api/bankselectmodelsAPI/GetAllBankSelect')
      .then(res => res.json())
      .then(data => setBanks(data))
      .catch(err => console.error('Error fetching banks:', err));

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- UPDATED PRICE CALCULATIONS (AS PER SCREENSHOT) ---
  const totalMRP = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
  const discount = totalMRP > 0 ? 30 : 0; // Screenshot ke hisaab se ₹30 discount
  const platformFee = 7;                   // Screenshot ke hisaab se ₹7 fee
  const couponApplied = 8;                 // Screenshot ke hisaab se ₹8 coupon
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

  const handleOrderCompletion = async () => {
    Swal.fire({
      title: 'Saving Transaction...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const orderPayload = {
      bankName: activeMethod,
      cardNumber: activeMethod === "CARD" ? cardData.number : (activeMethod === "UPI" ? upiId : "COD_MODE"),
      expiryDate: activeMethod === "CARD" ? cardData.expiry : "N/A",
      cvv: activeMethod === "CARD" ? cardData.cvv : "000",
      cardholderName: user ? `${user.firstName} ${user.lastName}` : "Guest User"
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
          title: 'Order Placed!',
          text: 'Transaction details saved successfully.',
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
    <div className="app-container bg-dark min-vh-100 text-white">
      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <div className="main-content-area p-4">
        <div className="fk-page-wrapper">
          <div className="fk-top-header text-center py-2 bg-success rounded mb-4">
            <h4 className="m-0">AK MEDICINE - CHECKOUT</h4>
          </div>

          <div className="fk-main-body">
            <div className="fk-payment-container d-flex gap-4">
              
              {/* LEFT: PAYMENT METHODS */}
              <div className="fk-left-sidebar bg-secondary bg-opacity-25 rounded p-3" style={{width: '300px'}}>
                <h6 className="mb-4">Select Method</h6>
                {["UPI", "CARD", "QRCODE", "NB", "COD"].map(m => (
                  <div key={m} onClick={() => setActiveMethod(m)} 
                    className={`p-3 mb-2 rounded cursor-pointer border ${activeMethod === m ? "bg-success border-white" : "bg-dark border-secondary"}`}>
                    {m}
                  </div>
                ))}
              </div>

              {/* CENTER: FORMS */}
              <div className="fk-center-content flex-grow-1 bg-secondary bg-opacity-10 p-4 rounded border border-secondary">
                {activeMethod === "UPI" && (
                  <div>
                    <h5>UPI Payment</h5>
                    <div className="d-flex gap-2 mt-3">
                      <input type="text" className="form-control" placeholder="user@bank" onChange={(e) => {setUpiId(e.target.value); setIsUpiVerified(false);}} />
                      <button className="btn btn-warning" onClick={handleUpiVerify}>Verify</button>
                    </div>
                    <button className="btn btn-success w-100 mt-4 py-3" disabled={!isUpiVerified} onClick={handleOrderCompletion}>Pay Now</button>
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
                    <button className="btn btn-success w-100 py-3" onClick={isCardVerified ? handleOrderCompletion : handleCardVerify}>
                      {isCardVerified ? "Complete Payment" : "Verify Card"}
                    </button>
                  </div>
                )}

                {activeMethod === "QRCODE" && (
                  <div className="text-center">
                    <p>Scan to Pay ₹{priceDetails.totalAmount}</p>
                    <img className="bg-white p-2 rounded mb-3" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=ak@upi&am=${priceDetails.totalAmount}`} alt="QR" />
                    <button className="btn btn-success w-100 py-3" onClick={handleOrderCompletion}>Confirm Payment</button>
                  </div>
                )}

                {(activeMethod === "NB" || activeMethod === "COD") && (
                  <div className="text-center py-4">
                    <h5>Confirm {activeMethod} Order</h5>
                    <button className="btn btn-success w-100 py-3 mt-3" onClick={handleOrderCompletion}>Place Order</button>
                  </div>
                )}
              </div>

              {/* RIGHT: BILLING SUMMARY (EXACTLY LIKE SCREENSHOT) */}
              <div className="fk-right-sidebar bg-dark p-3 rounded border border-secondary" style={{width: '320px'}}>
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
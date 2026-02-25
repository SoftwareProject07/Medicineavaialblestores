import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CompletePayments.css'; 

export default function CompletePayment({ cartItems = [] }) {
  const [upiId, setUpiId] = useState("");
  const [openDashboard, setOpenDashboard] = useState(true);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="app-container">
      {/* ---------- LEFT SIDEBAR ---------- */}
      <div className="sidebar">
        <div className="brand">
         <Link to="/dashboards" className="text-decoration-none d-flex align-items-center gap-2">
                    <img src="/AKMedizostore.png" alt="logo" width="50" />
                    <span className="user-name text-truncate text-success fw-bold">
                      {user ? `${user.firstName} ${user.lastName}` : "User"}
                    </span>
                  </Link>
        </div>

        <ul className="sidebar-nav">
          <li className="menu-group">
            <button className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center w-100"
              onClick={() => setOpenDashboard(!openDashboard)}>
              Dashboard <span>{openDashboard ? "▾" : "▸"}</span>
            </button>
            {openDashboard && (
              <ul className="submenu">
                <li><Link to="/medication-tracker">Medication Tracker</Link></li>
                <li><Link to="/test-reports">Test Reports</Link></li>
                <li><Link to="/prescriptions">Prescriptions</Link></li>
                <li><Link to="/support">Help & Support</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/medicinedisplay" className="btn btn-success mb-2 w-100 d-block text-center">Medicines</Link></li>
          <li><Link to="/carts" className="nav-link sidebar-cart">
             <i className="fas fa-shopping-cart me-2"></i> My Cart
             {cartItems.length > 0 && <span className="cart-count badge bg-danger ms-2">{cartItems.length}</span>}
          </Link></li>
          <li><Link to="/deliveryaddress" className="btn btn-success mb-2 w-100 d-block text-center">Address</Link></li>
          <li><Link to="/CompletePayments" className="btn btn-success mb-2 w-100 d-block text-center">ORDER PAYMENT</Link></li>
          <li className="logout-item"><Link to="/header"><i className="fas fa-sign-out-alt"></i> LogOut</Link></li>
        </ul>
      </div>

      {/* ---------- MAIN PAYMENT AREA ---------- */}
      <div className="main-content-area">
        <div className="fk-page-wrapper">
          <div className="fk-top-header">
            <div className="fk-header-content">AK MEDICINE</div>
          </div>

          <div className="fk-main-body">
            <div className="fk-payment-container">
              
              {/* Column 1: Payment Options List */}
              <div className="fk-left-sidebar">
                <div className="fk-section-header">
                  <span className="back-arrow">←</span>
                  <span className="header-title">Complete Payment</span>
                </div>
                
                {/* UPI Option */}
                <div className="fk-method-row active">
                  <div className="fk-icon-sq">UPI</div>
                  <div className="fk-method-details">
                    <p className="m-title">UPI</p>
                    <p className="m-sub">Pay by any UPI app</p>
                    <p className="m-offer">Get upto ₹30 cashback</p>
                  </div>
                </div>

                {/* Card Option */}
                <div className="fk-method-row">
                  <div className="fk-icon-sq">CARD</div>
                  <div className="fk-method-details">
                    <p className="m-title">Credit / Debit / ATM Card</p>
                    <p className="m-sub">Add and secure cards</p>
                  </div>
                </div>

                {/* COD Option */}
                <div className="fk-method-row">
                  <div className="fk-icon-sq">COD</div>
                  <p className="m-title">Cash on Delivery</p>
                </div>

                {/* Gift Card Option */}
                <div className="fk-method-row">
                  <div className="fk-icon-sq">GIFT</div>
                  <p className="m-title">Have a Flipkart Gift Card?</p>
                </div>

                {/* Net Banking Option */}
                <div className="fk-method-row">
                  <div className="fk-icon-sq">NB</div>
                  <p className="m-title">Net Banking</p>
                </div>

                {/* EMI Option (Disabled) */}
                <div className="fk-method-row disabled">
                  <div className="fk-icon-sq">EMI</div>
                  <p className="m-title">EMI (Unavailable)</p>
                </div>
              </div>

              {/* Column 2: Selection Content (UPI Input) */}
              <div className="fk-center-content">
                <div className="fk-upi-card">
                  <div className="fk-selection-header">
                    <div className="radio-outer"><div className="radio-inner"></div></div>
                    <span className="selection-text">Add new UPI ID</span>
                  </div>
                  <div className="fk-input-area">
                    <label className="border-label">UPI ID</label>
                    <div className="fk-input-flex">
                      <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e)=>setUpiId(e.target.value)} />
                      <button className="fk-verify-btn">Verify</button>
                    </div>
                  </div>
                  <button className={`fk-pay-btn ${upiId ? 'enabled' : ''}`}>Pay ₹199</button>
                </div>
              </div>

              {/* Column 3: Price Details */}
              <div className="fk-right-sidebar">
                <div className="price-header">
                  <span>PRICE DETAILS</span>
                  <span className="secure-tag">🔒 100% Secure</span>
                </div>
                <div className="price-body">
                  <div className="p-row"><span>MRP</span><span>₹999</span></div>
                  <div className="p-row sub"><span>Platform Fee</span><span>₹7</span></div>
                  <div className="p-row green"><span>MRP Discount</span><span>-₹799</span></div>
                  <div className="p-row green"><span>Coupons</span><span>-₹8</span></div>
                  <div className="p-total-row"><span>Total Amount</span><span>₹199</span></div>
                  <div className="fk-cashback-banner">
                    <p className="b-bold">5% Cashback</p>
                    <p className="b-small">Claim with payment offers</p>
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
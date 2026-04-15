import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomerHelpIssue() {
  const navigate = useNavigate();

  // --- States ---
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false); // Added missing state
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartItems] = useState([]); // Added to prevent error in sidebar

  // --- Form State ---
  const [helpIssue, setHelpIssue] = useState({
    CustomerHelpName: '',
    CustomerHelpEmail: '',
    CustomerHelpMessage: '',
    CustomerHelpStatus: 'Pending',
    MobileNumber: ''
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHelpIssue({ ...helpIssue, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const apiUrl = "https://ecommerencesite.onrender.com/api/CustomerHelpIssueAPI/AddCustomerHelpIssue";

    try {
      const response = await axios.post(apiUrl, helpIssue, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200 || response.status === 201) {
        alert("Success! Your issue has been recorded.");
        setHelpIssue({
          CustomerHelpName: '',
          CustomerHelpEmail: '',
          CustomerHelpMessage: '',
          CustomerHelpStatus: 'Pending',
          MobileNumber: ''
        });
      }
    } catch (error) {
      console.error("Submission Error:", error.response || error);
      alert("Submission failed. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      
      {/* --- SIDEBAR --- */}
      <div className="sidebar">
        <div className="brand">
          <Link to="/dashboards">
            <img src="/AKMedizostore.png" alt="logo" width="50" />
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

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow-1 p-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow border-0">
                <div className="card-header bg-success text-white py-3">
                  <h4 className="mb-0 text-center"><i className="fas fa-headset me-2"></i>Help & Support</h4>
                </div>
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">Full Name</label>
                        <input type="text" className="form-control" name="CustomerHelpName" value={helpIssue.CustomerHelpName} onChange={handleChange} placeholder="Enter your name" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold small">Mobile Number</label>
                        <input type="text" className="form-control" name="MobileNumber" value={helpIssue.MobileNumber} onChange={handleChange} placeholder="Enter the MobileNumber" required />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold small">Email Address</label>
                        <input type="email" className="form-control" name="CustomerHelpEmail" value={helpIssue.CustomerHelpEmail} onChange={handleChange} placeholder="Enter your email" required />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold small">Your Message</label>
                        <textarea className="form-control" name="CustomerHelpMessage" rows="4" value={helpIssue.CustomerHelpMessage} onChange={handleChange} placeholder="How can we help you?" required></textarea>
                      </div>
                      <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-success btn-lg w-100 shadow" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                          ) : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
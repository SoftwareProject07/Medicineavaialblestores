import React, { useState, useEffect } from 'react'; // useEffect import kiya
import { Link, useNavigate } from 'react-router-dom';

export default function FeedbackCustomer() {
    const navigate = useNavigate();
    
    /* ---------- STATES ---------- */
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        starStatus: '0'
    });

    const [loading, setLoading] = useState(false);
    const [openDashboard, setOpenDashboard] = useState(true);
    const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
    const [user, setUser] = useState(null);
    const [cartItems] = useState([]); // Cart count logic ke liye

    /* ---------- LOAD USER FROM LOCALSTORAGE ---------- */
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("User parsing error:", error);
            }
        }
    }, []);

    /* ---------- HANDLERS ---------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRating = (ratingValue) => {
        setFormData({ ...formData, starStatus: ratingValue.toString() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.starStatus === '0') {
            alert("Please select a rating!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                "https://ecommerencesite.onrender.com/api/FeedbackCustomerApi/AddFeedback",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                alert("Dhanyawad! Feedback successfully add ho gaya.");
                // Redirect to Dashboard
                navigate('/dashboards'); 
            } else {
                const errorData = await response.text();
                alert("Error: " + errorData);
            }
        } catch (error) {
            console.error("Connection Error:", error);
            alert("Backend server se connect nahi ho paya.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}> 
            
            {/* --- SIDEBAR START --- */}
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
                      <li>
                        <Link to="/medicinedisplay" className="btn btn-success mb-2">
                          Medicines
                        </Link>
                      </li>
          
                      {/* ✅ CART WITH COUNT */}
                       <Link to="/carts" className="nav-link">
                                 <i className="fas fa-shopping-cart me-2"></i> My Cart
                                 {cartItems.length > 0 && (
                                   <span className="cart-count badge bg-danger rounded-pill ms-2">
                                     {cartItems.length}
                                   </span>
                                 )}
                               </Link>
          {/* 
                       <li>
                        <Link to="/deliveryaddress" className="btn btn-success mb-2">
                          Delivery Address
                        </Link>
                      </li> */}
                     
                      {/* <li><Link to="/CompletePayments" className="btn btn-success mb-2">
                         ORDER PAYMENT
                        </Link></li> */}
                       <li ><Link to="/orders" className="btn btn-success mb-2">OrderStatus </Link></li>
                          <li><Link to="/feedbackcustomers" className="btn btn-success mb-2">CustomerFeedback</Link></li>
                      {/* <li>CustomerTracking</li> */}
          
                      <Link to="/profile"  className="btn btn-success">CustomerProfile</Link>
          
          
                      <li>
                        <Link to="/header">
                          <i className="fas fa-sign-out-alt"></i>  LogOut
                        </Link>
                      </li>
                    </ul>
                  </div>
            {/* --- SIDEBAR END --- */}

            {/* --- MAIN CONTENT (FORM) --- */}
            <div className="flex-grow-1 p-4 bg-light">
                <div className="container mt-4">
                    <div className="card shadow-lg mx-auto border-0" style={{ maxWidth: '480px', borderRadius: '15px' }}>
                        <div className="card-header bg-primary text-white text-center py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                            <h4 className="mb-0 fw-bold">Share Your Feedback</h4>
                        </div>
                        <div className="card-body p-4 bg-dark text-white" style={{ borderRadius: '0 0 15px 15px' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small text-uppercase fw-bold">Full Name</label>
                                    <input type="text" name="name" className="form-control bg-secondary text-white border-0 py-2" 
                                        placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small text-uppercase fw-bold">Email Address</label>
                                    <input type="email" name="email" className="form-control bg-secondary text-white border-0 py-2" 
                                        placeholder="email@example.com" value={formData.email} onChange={handleChange} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block small text-uppercase fw-bold text-center">Your Rating</label>
                                    <div className="d-flex justify-content-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} onClick={() => handleRating(star)}
                                                style={{ cursor: 'pointer', fontSize: '2.5rem', transition: '0.2s' }}
                                                className={star <= parseInt(formData.starStatus) ? "text-warning" : "text-muted"}
                                            >★</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small text-uppercase fw-bold">Message</label>
                                    <textarea name="message" className="form-control bg-secondary text-white border-0 py-2" rows="4" 
                                        placeholder="How was your experience?" value={formData.message} onChange={handleChange} required></textarea>
                                </div>

                                <button type="submit" disabled={loading} className="btn btn-primary w-100 py-2 mt-2 fw-bold shadow-sm">
                                    {loading ? "Please Wait..." : "Submit Feedback"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
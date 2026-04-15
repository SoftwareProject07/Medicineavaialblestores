import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported

export default function CustomerAddMedicine() {
  // --- Sidebar States ---
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  
  // Mock data (Replace with your actual Auth/Context data)
  const [user, setUser] = useState(null);
  const [cartItems] = useState([]);

  // --- Form State ---
  const [medicineRequest, setMedicineRequest] = useState({
    customerName: '',
    medicineName: '',
    medicineDescription: ''
  });
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicineRequest({ ...medicineRequest, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const apiUrl = 
    "https://ecommerencesite.onrender.com/api/CustomerAddMedicineAPI/AddCustomerAddedMedicine";

    try {
      const response = await axios.post(apiUrl, medicineRequest);
      if (response.status === 200 || response.status === 201) {
        alert("Success! Your medicine request has been submitted.");
        setMedicineRequest({ customerName: '', medicineName: '', medicineDescription: '' });
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Error: Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex">
      {/* --- SIDEBAR --- */}
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
     
     
               <li className="mt-3">
                 <Link to="/header" className="text-danger text-decoration-none">
                   <i className="fas fa-sign-out-alt"></i> LogOut
                 </Link>
               </li>
             </ul>
           </div>
      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow-1 p-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-0 shadow-lg">
                <div className="card-header bg-success text-white py-3">
                  <h5 className="mb-0 text-center">Medicine Not Available? Tell Us!</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Customer Name</label>
                      <input
                        type="text"
                        className="form-control shadow-sm"
                        name="customerName"
                        value={medicineRequest.customerName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Medicine Name Needed</label>
                      <input
                        type="text"
                        className="form-control shadow-sm"
                        name="medicineName"
                        value={medicineRequest.medicineName}
                        onChange={handleChange}
                        placeholder="e.g. Paracetamol 500mg"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">Description (Optional)</label>
                      <textarea
                        className="form-control shadow-sm"
                        name="medicineDescription"
                        rows="3"
                        value={medicineRequest.medicineDescription}
                        onChange={handleChange}
                        placeholder="Add details about brand, power, or quantity..."
                      ></textarea>
                    </div>

                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-success btn-lg" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : 'Submit Request'}
                      </button>
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
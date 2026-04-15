import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminUnavailableMedicinecustomer() {
  const navigate = useNavigate();

  // --- UI States ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(true); // Added missing state

  // --- Fetch Data from API ---
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    const apiUrl = "https://ecommerencesite.onrender.com/api/CustomerAddMedicineAPI/GetAllCustomerAddedMedicines";
    try {
      const response = await axios.get(apiUrl);
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicine requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* --- SIDEBAR --- */}
      <div style={{ 
        width: '260px', 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        position: 'fixed', 
        height: '100vh', 
        zIndex: 100 
      }}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>

        <ul className="nav flex-column mt-4">
          <li className="mb-3">
            <div 
              className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between align-items-center" 
              onClick={handleShopToggle} 
              style={{ cursor: 'pointer' }}
            >
              <span style={{ fontSize: '11px' }}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
              <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
            </div>
          </li>
          
          <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
                      <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
                    <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>

               <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>

                      <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                      <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                     <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>

                       <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Admin Registeartion Form  </Link></li>

                                              <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>

                      <li className="mt-3">
                          <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
                              <i className="fas fa-sign-out-alt"></i> LogOut
                          </button>
                      </li>
        </ul>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {/* Added marginLeft to prevent content from hiding under fixed sidebar */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: '260px' }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark">Customer Requested Medicines</h2>
            <button className="btn btn-success shadow-sm" onClick={fetchMedicines} disabled={loading}>
              <i className={`fas fa-sync me-2 ${loading ? 'fa-spin' : ''}`}></i>
              {loading ? "Refreshing..." : "Refresh List"}
            </button>
          </div>

          <div className="card shadow border-0 rounded-3">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Customer Name</th>
                      <th>Medicine Name</th>
                      <th>Description</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div className="spinner-border text-success" role="status"></div>
                          <p className="mt-2 text-muted">Fetching latest requests...</p>
                        </td>
                      </tr>
                    ) : medicines.length > 0 ? (
                      medicines.map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="ps-4 text-muted">{index + 1}</td>
                          <td className="fw-bold">{item.customerName}</td>
                          <td>
                            <span className="badge rounded-pill bg-info text-dark px-3">
                              {item.medicineName}
                            </span>
                          </td>
                          <td className="text-muted small" style={{ maxWidth: '300px' }}>
                            {item.medicineDescription || "No additional details"}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-primary me-2">
                              <i className="fas fa-check me-1"></i> Resolve
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <i className="fas fa-inbox fa-3x text-light mb-3"></i>
                          <p className="text-muted">No new medicine requests found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function AdminUnavailableMedicinecustomer() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Sidebar States ---
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");

  // --- UI States ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Sidebar Active Class Helpers ---
  const getNavLinkClass = (path) => {
    const baseClass = "d-flex align-items-center gap-3 px-3 py-2 text-decoration-none rounded text-white-50 ";
    return baseClass + (location.pathname === path ? "bg-success text-white" : "hover-sidebar-menu");
  };

  const getSubLinkClass = (path) => {
    const baseClass = "d-flex align-items-center px-3 py-2 text-decoration-none text-white-50 rounded mb-1 position-relative ";
    return baseClass + (location.pathname === path ? "text-success fw-bold" : "hover-sidebar-menu");
  };

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
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* ---------- SIDEBAR ---------- */}
      <div style={{ 
        width: '280px', 
        backgroundColor: '#16161a', 
        padding: '24px 16px', 
        position: 'fixed',
        height: '100vh', 
        zIndex: 100, 
        overflowY: 'auto',
        borderRight: '1px solid #232329'
      }}>
        {/* ब्रांड लोगो */}
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        {/* ग्लोबल शॉप स्टेटस स्विच */}
        <div className="px-2 mb-4">
          <div 
            onClick={handleShopToggle} 
            className="p-2.5 rounded d-flex align-items-center justify-content-between transition-all" 
            style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
          >
            <div className="d-flex flex-column">
              <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
              <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
            </div>
            <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
          </div>
        </div>

        {/* नेविगेशन लिंक्स */}
        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          {/* 1. OPERATIONS CENTER DROPDOWN */}
          <div className="mt-2">
            <div 
              onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-sliders-h"></i> Master Config
              </span>
              <i className={`fas fa-chevron-right transition-transform ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {masterDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Add Item Type
                </Link>

                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAssignedTO
                </Link>


                <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                  AddDoctorAssignTo
                                </Link>
          
               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>

                 <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels ' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Language Master           
                              </Link>
              </div>
            )}
          </div>
        
          {/* 2. MASTER CONFIGURATION DROPDOWN */}
          <div>
            <div 
              onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-boxes"></i> Operations Registry
              </span>
              <i className={`fas fa-chevron-right transition-transform ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {listsDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
                <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
                <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link></li>
                <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
                <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
                <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link></li>
                <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link></li>
                <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link></li> 
                <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li>
                <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link></li>
                <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link></li>
                                  <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
                          <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
 <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
                    <li>    <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
            </Link></li>

             <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

              </div>
            )}
          </div>

          {/* टर्मिनेट / लॉगआउट एक्शन */}
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
            <button 
              type="button" 
              onClick={() => navigate('/header')} 
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded hover-sidebar-logout"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: '300px' }}>
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
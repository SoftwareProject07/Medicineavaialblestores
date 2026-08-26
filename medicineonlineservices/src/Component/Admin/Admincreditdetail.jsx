import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function AdminCreditDetail() {
  const [bankDetails, setBankDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);

  // Sidebar State & Hooks Setup
  const [isShopOpen, setIsShopOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  // Active Sidebar class styling helpers
  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none ${
      isActive ? "bg-success text-white fw-bold" : "text-white-50 hover-sidebar-menu"
    }`;
  };

  const getSubLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `position-relative px-3 py-1.5 rounded text-decoration-none d-block text-truncate ${
      isActive ? "text-success fw-bold" : "text-white-50 hover-sidebar-menu"
    }`;
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('https://ecommerencesite.onrender.com/api/BankdetailsWebapi/GetAllBankDetails');
      setBankDetails(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); 
    return () => clearInterval(interval);
  }, []);

  // AUTOMATIC ACTION ENGINE
  useEffect(() => {
    const processAutomations = () => {
      const currentTime = new Date().getTime();

      bankDetails.forEach((item) => {
        if (item.status === "Pending" || !item.status) {
          const transactionTime = new Date(item.timestamp || new Date()).getTime(); 
          const diffInMinutes = (currentTime - transactionTime) / 60000;

          if (diffInMinutes >= 5) {
            handleAutoAction(item);
          }
        }
      });
    };

    if (bankDetails.length > 0) processAutomations();
  }, [bankDetails]);

  const handleAutoAction = async (item) => {
    let finalStatus = "";
    let customerMsg = "";

    if (item.isRefundRequested) {
      const gstRate = 0.18;
      const deduction = item.amount * gstRate;
      const finalRefund = item.amount - deduction;
      finalStatus = "Refunded (Rollback)";
      customerMsg = `Rollback Successful: ₹${finalRefund.toFixed(2)} aapke account me bhej diye gaye hain (18% GST ₹${deduction.toFixed(2)} deducted).`;
    } 
    else if (item.amount <= 0 || item.type === "invalid") {
      finalStatus = "Failed";
      customerMsg = "Transaction Failed: Kripya bank balance ya details check karein.";
    } 
    else {
      finalStatus = "Accepted";
      customerMsg = `Aapka ₹${item.amount} ka payment safaltapurvak prapt ho gaya hai!`;
    }

    await updateBackend(item.id, finalStatus, customerMsg);
  };

  const updateBackend = async (id, status, msg) => {
    try {
      await axios.post(`https://ecommerencesite.onrender.com/api/BankdetailsWebapi/UpdateStatus`, {
        id: id,
        status: status,
        message: msg
      });
      fetchTransactions(); 
    } catch (err) {
      console.error("Auto-update failed", err);
    }
  };

  if (loading) return <div className="text-center mt-5 text-white">Loading Automation System...</div>;

  return (
    <div style={{ display: "flex", backgroundColor: "#212529", minHeight: "100vh" }}>
      
      {/* --- SIDEBAR --- */}
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
        {/* Brand Logo */}
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        {/* Global Shop Status Switch */}
        <div className="px-2 mb-4">
          <div 
            onClick={handleShopToggle} 
            className="p-2 rounded d-flex align-items-center justify-content-between transition-all" 
            style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px', padding: '10px' }}
          >
            <div className="d-flex flex-column">
              <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
              <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
            </div>
            <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          {/* 1. MASTER CONFIGURATION DROPDOWN */}
          <div className="mt-2">
            <div 
              onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
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


{/* 
                <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                  AddDoctorAssignTo
                                </Link> */}
             
               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>
          
              <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Language Master   
                </Link>
                         <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/statenamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                         StateName Master  
                              </Link>
<Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/citynamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                CityName Master           
                              </Link> 
               <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addaccountmastertypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Accountant Master Types             
                              </Link> 
              </div>
            )}
          </div>

          {/* 2. OPERATIONS REGISTRY DROPDOWN */}
          <div className="mt-2">
            <div 
              onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-boxes"></i> Operations Registry
              </span>
              <i className={`fas fa-chevron-right transition-transform ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {listsDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px', gap: '4px' }}>
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
                {/* <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li> */}
                <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link></li>
                <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link></li>
                <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
                <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link></li>

                 <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
              <li>      <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
        </Link></li>
<li><Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link></li>
 <li><Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link></li>
              </div>
            )}
          </div>

          {/* Logout Action */}
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
            <button 
              type="button" 
              onClick={() => navigate('/header')} 
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="p-4 text-white" style={{ marginLeft: '280px', width: 'calc(100% - 280px)' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h3>Payment Automation Center</h3>
          <span className="badge bg-primary">Auto-Processing: 1 Minute Delay</span>
        </div>
        
        <div className="table-responsive">
          <table className="table table-dark table-hover border-secondary">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions (Automatic)</th>
              </tr>
            </thead>
            <tbody>
              {bankDetails.map((item) => (
                <tr key={item.id}>
                  {/* Comprehensive fallbacks to display ID regardless of backend property casing */}
                  <td className="fw-bold">
                    {item.userId || item.UserId || item.userid || item.customerId || item.CustomerID || item.id || "N/A"}
                  </td>
                  <td>{item.cardNumber ? "Credit/Debit Card" : "UPI"}</td>
                  <td className="text-info fw-bold">₹{item.amount}</td>
                  <td>
                    <span className={`badge ${item.status === 'Accepted' ? 'bg-success' : item.status === 'Failed' ? 'bg-danger' : 'bg-warning'}`}>
                      {item.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    {item.status ? (
                      <span className="text-success small">✅ Message Sent to Customer</span>
                    ) : (
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm text-light me-2" role="status"></div>
                        <span className="text-muted small">Auto-verifying in 1m...</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
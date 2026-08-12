import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminCustomerHelpIssueList() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);

  // 🔹 SHOP STATE (Fixed: Added missing states for sidebar functionality)
  const [isShopOpen, setIsShopOpen] = useState(false);

  // 🔹 SHOP TOGGLE HANDLER (Fixed: Added missing handler)
  const handleShopToggle = () => {
    setIsShopOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://ecommerencesite.onrender.com/api/CustomerHelpIssueAPI/GetAllCustomerHelpIssues");
      // Fixed: Handle data mapping securely if response wraps an array inside an object structure
      if (Array.isArray(response.data)) {
        setIssues(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setIssues(response.data.data);
      } else {
        setIssues([]);
      }
    } catch (error) {
      console.error("Error fetching help issues:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTickClick = async (issue) => {
    const issueId = issue.customerhelpissueid || issue.customerHelpIssueId;
    const customerEmail = issue.customerHelpEmail || issue.CustomerHelpEmail;

    // 1. UI Status Update
    setIssues(prev => prev.map(item => 
      (item.customerhelpissueid || item.customerHelpIssueId) === issueId 
      ? { ...item, customerHelpStatus: "Confirm Sending", CustomerHelpStatus: "Confirm Sending" } 
      : item
    ));

    // 2. Create Notification for Customer in LocalStorage
    const newNotification = {
      id: Date.now(),
      message: "Your request is confirmed. 24 to 48 hrs connected to call.",
      time: new Date().toLocaleTimeString(),
      forEmail: customerEmail,
      isRead: false
    };

    const existingNotifs = JSON.parse(localStorage.getItem("customer_notifications") || "[]");
    localStorage.setItem("customer_notifications", JSON.stringify([...existingNotifs, newNotification]));

    alert("Status Updated & Message sent to Customer!");

    // 3. API Update (Background)
    try {
      await axios.put(`https://ecommerencesite.onrender.com/api/CustomerHelpIssueAPI/UpdateCustomerHelpIssueStatus/${issueId}`, {
        customerHelpIssueId: issueId,
        customerHelpStatus: "Confirm Sending"
      });
    } catch (error) {
      console.warn("API Update failed, but notification sent locally.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      {/* ---------- SIDEBAR ---------- */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>
         {/* --- Master Config Dropdown Section --- */}
                        <div className="mb-3 border-bottom border-secondary pb-3">
                          <button 
                            onClick={() => setMasterDropdownOpen(!masterDropdownOpen)} 
                            className="btn btn-outline-success w-100 text-start d-flex justify-content-between align-items-center fw-bold mb-2" 
                            style={{ fontSize: '13px', borderStyle: 'dashed' }}
                          >
                            <span className="d-flex align-items-center gap-2">
                              <i className="fas fa-sliders-h"></i> Master Config
                            </span>
                            <i className={`fas ${masterDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"}`} style={{ fontSize: '11px' }}></i>
                          </button>
                          
                          {masterDropdownOpen && (
                            <div className="ps-1 mt-2">
                              <Link 
                                to="/adminissuetype" 
                                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                                style={{ fontSize: '12px' }}
                              >
                                <i className="fas fa-plus-circle"></i> Add Item Type
                              </Link>
                                <Link 
                to="/adminmasterassignedto" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i> AddAssignedTO 
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
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Language Master   
                </Link>
          


                            </div>
                          )}
                        </div>
        <ul className="nav flex-column mt-4">
          <li className="mb-3">
            <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between" onClick={handleShopToggle} style={{ cursor: 'pointer', userSelect: 'none' }}>
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
          <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">AdminbankselectMaster</Link></li>
          <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">AdminBankCreditAmountDetails</Link></li> 
          <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registration Form</Link></li>
          <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList</Link></li>
          <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminLivenessimageList</Link></li>
          {/* <li><Link to="/adminsupportticketlist" className="btn btn-outline-success w-100 mb-2 text-start">AdminSupportTicketList</Link></li> */}
          <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">Admincustomerticketraiselist</Link></li>
                            <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund</Link></li>
                    <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>


 <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
          <li>      <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
     </Link></li>
      <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

          <li className="mt-3 mb-5">
            <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </button>
          </li>
        </ul>
      </div>
      
      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: '260px', width: 'calc(100% - 260px)' }}>
        <h2 className="text-dark fw-bold">Help Issues (Admin)</h2>
        <div className="table-responsive shadow-sm mt-4 bg-white rounded">
          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
              ) : issues.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4">No Help Issues Found</td></tr>
              ) : issues.map((issue) => {
                const currentId = issue.customerhelpissueid || issue.customerHelpIssueId;
                const status = issue.customerHelpStatus || issue.CustomerHelpStatus || "Pending";
                
                return (
                  <tr key={currentId}>
                    <td>{currentId}</td>
                    <td>{issue.customerHelpName || issue.CustomerHelpName}</td>
                    <td>{issue.customerHelpEmail || issue.CustomerHelpEmail}</td>
                    <td>
                      <span className={`badge ${status === 'Pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-success btn-sm" 
                        onClick={() => handleTickClick(issue)}
                        disabled={status !== "Pending"}
                      >
                        <i className="fas fa-check me-1"></i> Tick
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
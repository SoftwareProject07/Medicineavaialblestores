

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminHealthHistory() {
  const navigate = useNavigate();

  // Sidebar States & Toggles
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const handleShopToggle = () => setIsShopOpen(!isShopOpen);
  
  const getNavLinkClass = (path) => {
    return window.location.pathname === path
      ? "btn btn-success w-100 mb-2 text-start d-flex align-items-center gap-2"
      : "btn btn-outline-secondary text-white-50 w-100 mb-2 text-start d-flex align-items-center gap-2 border-0";
  };

  const getSubLinkClass = (path) => {
    return window.location.pathname === path
      ? "text-success fw-bold py-1 text-decoration-none mb-1"
      : "text-white-50 py-1 text-decoration-none mb-1 hover-text-white";
  };

  // Data States
  const [healthHistories, setHealthHistories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Form & Selection States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    id: 0,
    userId: 1,
    candidateName: '', 
    conditionName: '',
    diagnosisDate: '',
    description: '',
    treatingDoctor: '',
    status: 'Active',
    fullName: '',
    customerEmail: '',
    customerMobile: ''
  });

  // API Base URL
  const API_BASE = "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI"; 
  // "http://localhost:5256/api/TestingDashBoardPanelAPI";

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const historyRes = await axios.get(`${API_BASE}/AllHealthHistories`).catch(() => ({ data: [] }));
      setHealthHistories(historyRes.data || []);

      let customerData = [];
      const possibleEndpoints = [
        `${API_BASE}/CustomerLists`,
        `${API_BASE}/AllCustomers`,
        `${API_BASE}/GetCustomers`,
        //"http://localhost:5256/api/Customer"
        "https://ecommerencesite.onrender.com/api/Customer"
      ];

      for (let endpoint of possibleEndpoints) {
        try {
          const res = await axios.get(endpoint);
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            customerData = res.data;
            break;
          }
        } catch (err) {}
      }
      setCustomers(customerData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper functions
  const getCustomerObj = (item) => {
    const custId = item.userId || item.customerId || item.CustomerId || item.UserId;
    return customers.find(c => {
      const cId = c.id || c.Id || c.userId || c.UserId;
      return custId && cId && cId.toString() === custId.toString();
    }) || {};
  };

  const getCustomerFullName = (item, custObj) => {
    return custObj.fullName || custObj.FullName || custObj.firstName || custObj.FirstName || item.fullName || item.name || 'Gautam Dev';
  };

  const getCustomerEmail = (item, custObj) => {
    return custObj.email || custObj.Email || item.email || 'N/A';
  };

  const getCustomerMobile = (item, custObj) => {
    return custObj.mobileNumber || custObj.MobileNumber || custObj.mobile || item.mobileNumber || item.phone || 'N/A';
  };

  const getCandidateName = (item) => {
    return item.candidateName || item.Name || item.conditionName || item.fullName || 'Gautam Dev';
  };

  // Handle Open Create Modal
  const handleOpenCreateForCustomer = (item, custObj) => {
    const custId = custObj.id || custObj.Id || custObj.userId || item.userId || 1;
    const candidateNameVal = getCustomerFullName(item, custObj);
    
    const loginEmail = getCustomerEmail(item, custObj);
    const loginMobile = getCustomerMobile(item, custObj);

    setSelectedCandidateName(candidateNameVal);
    setFormData({
      id: 0,
      userId: Number(custId) || 1,
      candidateName: candidateNameVal,
      conditionName: candidateNameVal, 
      diagnosisDate: new Date().toISOString().split('T')[0],
      description: 'N/A',
      treatingDoctor: '',
      status: 'Active',
      fullName: candidateNameVal,
      customerEmail: loginEmail,
      customerMobile: loginMobile
    });
    setShowCreateModal(true);
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        id: 0,
        userId: Number(formData.userId) || 1,
        conditionName: formData.candidateName,
        diagnosisDate: formData.diagnosisDate ? new Date(formData.diagnosisDate).toISOString() : new Date().toISOString()
      };

      await axios.post(`${API_BASE}/CreateHealthHistory`, payload);
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      console.error("Error creating record:", error.response?.data || error.message);
      alert("Failed to create record: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  // Handle Edit Setup & Submit
  const handleEditClick = (item) => {
    setSelectedRecord(item);
    const custObj = getCustomerObj(item);
    const resolvedName = item.candidateName || item.Name || item.fullName || custObj.fullName || 'Gautam Dev';

    setFormData({
      id: item.id || item.Id || 0,
      userId: Number(item.userId || item.UserId) || 1,
      candidateName: resolvedName,
      conditionName: item.conditionName || item.ConditionName || resolvedName,
      diagnosisDate: item.diagnosisDate ? item.diagnosisDate.split('T')[0] : '',
      description: item.description || item.Description || '',
      treatingDoctor: item.treatingDoctor || item.TreatingDoctor || '',
      status: item.status || item.Status || 'Active',
      fullName: resolvedName,
      customerEmail: item.customerEmail || custObj.email || '',
      customerMobile: item.customerMobile || custObj.mobileNumber || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        userId: Number(formData.userId) || 1,
        diagnosisDate: formData.diagnosisDate ? new Date(formData.diagnosisDate).toISOString() : new Date().toISOString()
      };
      await axios.put(`${API_BASE}/UpdateHealthHistory`, payload);
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating record:", error.response?.data || error.message);
      alert("Failed to update record: " + JSON.stringify(error.response?.data || error.message));
    }
  };

  const handleDetailsClick = async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/DetailsHealthHistory?id=${id}`);
      setSelectedRecord(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this health history record?")) {
      try {
        await axios.delete(`${API_BASE}/DeleteHealthHistory?id=${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  return (
    <div className="d-flex bg-dark min-vh-100 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* --- SIDE MENU --- */}
      <div style={{ 
        width: '280px', 
        backgroundColor: '#16161a', 
        padding: '24px 16px', 
        position: 'fixed',
        height: '100vh', 
        zIndex: 100, 
        overflowY: 'auto',
        borderRight: '1px solid #232329',
        left: 0,
        top: 0
      }}>
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

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

        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
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
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>Add Item Type</Link>
                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>AddAssignedTO</Link>
                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>AddAdminTypes</Link>
                <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>Language Master</Link>
                <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>StateName Master</Link>
                <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>CityName Master</Link> 
                <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>Accountant Master Types</Link> 
              </div>
            )}
          </div>

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
                
                <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Adminmediciationtrackers</Link> 
                <Link to="/admintestreportss" className="btn btn-outline-success w-100 mb-2 text-start">AdminTestReports</Link>
                <Link to="/adminhealthhistorys" className="btn btn-success w-100 mb-2 text-start">AdminHelathHistory</Link>
                <Link to="/adminmonthlyprogresses" className="btn btn-outline-success w-100 mb-2 text-start">AdminMonthlyProgress</Link>
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-outline-success w-100 mb-2 text-start">Feedback List</Link>
                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster</Link>
                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails</Link> 
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registration Form</Link>
                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList</Link>
                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist</Link>
                <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link>
                <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> 
                <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> 
                <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start">Doctor_PatientdetailsLists</Link> 
                <Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link>
                <Link to="/qrcodeupload" className="btn btn-outline-success w-100 mb-2 text-start">qrcodeupload</Link>
                <Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link>
              </div>
            )}
          </div>

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
      <div className="flex-grow-1 p-4" style={{ marginLeft: '280px', backgroundColor: '#0f0f13' }}>
        
        <div className="d-flex justify-content-between align-items-center bg-dark p-4 rounded-3 mb-4 border border-secondary">
          <div>
            <h2 className="text-white fw-bold m-0">Admin Health History Management</h2>
            <p className="text-muted m-0 small">Manage candidate health history and records.</p>
          </div>
        </div>

        <div className="card bg-dark border border-secondary shadow-sm rounded-3">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5 text-muted">Loading records...</div>
            ) : healthHistories.length === 0 && customers.length === 0 ? (
              <div className="text-center py-5 text-muted">No records found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary text-dark text-uppercase small fw-bold">
                    <tr>
                      <th className="py-3 ps-3">ID</th>
                      <th className="py-3">FULL NAME</th>
                      <th className="py-3">Customer Email</th>
                      <th className="py-3">Customer Mobile</th>
                      <th className="py-3">Candidate Name / Condition</th>
                      <th className="py-3 text-end pe-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(healthHistories.length > 0 ? healthHistories : customers).map((item, idx) => {
                      const custObj = getCustomerObj(item);
                      const fullName = getCustomerFullName(item, custObj);
                      const email = getCustomerEmail(item, custObj);
                      const mobile = getCustomerMobile(item, custObj);
                      const candidateNameVal = getCandidateName(item);

                      return (
                        <tr key={item.id || idx}>
                          <td className="ps-3 fw-bold text-success">#{item.id || idx + 1}</td>
                          <td className="fw-bold text-white">{fullName}</td>
                          <td className="text-info">{email}</td>
                          <td className="text-warning">{mobile}</td>
                          <td className="fw-semibold text-white">{candidateNameVal}</td>
                          <td className="text-end pe-3">
                            <button onClick={() => handleOpenCreateForCustomer(item, custObj)} className="btn btn-sm btn-success me-2" title="Create for this candidate">
                              <i className="fas fa-plus me-1"></i> Create
                            </button>
                            <button onClick={() => handleDetailsClick(item.id)} className="btn btn-sm btn-outline-info me-2" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-warning me-2" title="Edit Record">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger" title="Delete Record">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- CREATE MODAL --- */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-success">Create Health History</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Candidate Name (Automatic)</label>
                    <input 
                      type="text" 
                      disabled 
                      className="form-control bg-secondary text-warning fw-bold border-0" 
                      value={selectedCandidateName} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Diagnosis Date (Test Date)</label>
                    <input type="date" required className="form-control bg-secondary text-white border-0" value={formData.diagnosisDate} onChange={(e) => setFormData({...formData, diagnosisDate: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Treating Doctor</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" placeholder="Dr. Sharma" value={formData.treatingDoctor} onChange={(e) => setFormData({...formData, treatingDoctor: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Status</label>
                    <select className="form-select bg-secondary text-white border-0" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Active">Active</option>
                      <option value="Managed">Managed</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Description / Notes</label>
                    <textarea rows="3" className="form-control bg-secondary text-white border-0" placeholder="Condition details..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success btn-sm px-4">Save & Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-warning">Update Health History (#{formData.id})</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Candidate Name (Automatic)</label>
                    <input type="text" disabled className="form-control bg-secondary text-warning fw-bold border-0" value={formData.candidateName} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Diagnosis Date</label>
                    <input type="date" required className="form-control bg-secondary text-white border-0" value={formData.diagnosisDate} onChange={(e) => setFormData({...formData, diagnosisDate: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Treating Doctor</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" value={formData.treatingDoctor} onChange={(e) => setFormData({...formData, treatingDoctor: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Status</label>
                    <select className="form-select bg-secondary text-white border-0" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Active">Active</option>
                      <option value="Managed">Managed</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold">Description / Notes</label>
                    <textarea rows="3" className="form-control bg-secondary text-white border-0" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning btn-sm px-4">Update Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAILS MODAL --- */}
      {showDetailsModal && selectedRecord && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-info">Health History Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> #{selectedRecord.id}</p>
                <p><strong>Candidate Name:</strong> {selectedRecord.candidateName || selectedRecord.conditionName}</p>
                <p><strong>Diagnosis Date:</strong> {selectedRecord.diagnosisDate ? selectedRecord.diagnosisDate.split('T')[0] : 'N/A'}</p>
                <p><strong>Treating Doctor:</strong> {selectedRecord.treatingDoctor || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedRecord.status}</p>
                <p><strong>Description:</strong> {selectedRecord.description || 'N/A'}</p>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setShowDetailsModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminMonthlyProgresses() {
  const navigate = useNavigate();

  // Data & Pagination States
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sidebar & Interactive States
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    id: 0,
    monthYear: "",
    weight: "",
    avgGlucose: "",
    bloodPressureStatus: "Normal",
    notes: ""
  });

  const API_BASE_URL = "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI";
  // const API_BASE_URL = "http://localhost:5256/api/TestingDashBoardPanelAPI";

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getNavLinkClass = (path) => {
    return window.location.pathname === path
      ? "btn btn-success w-100 mb-2 text-start d-flex align-items-center gap-2"
      : "btn btn-outline-secondary text-white-50 w-100 mb-2 text-start d-flex align-items-center gap-2 border-0";
  };

  const getSubLinkClass = (path) => {
    return window.location.pathname === path
      ? "btn btn-success w-100 mb-2 text-start"
      : "btn btn-outline-success w-100 mb-2 text-start";
  };

  // 1. FETCH ALL
  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/AllMonthlyProgress`);
      if (!response.ok) throw new Error("Failed to fetch records.");
      const data = await response.json();
      setProgressList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const filteredList = progressList.filter(item =>
    (item.monthYear || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.bloodPressureStatus || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // 2. CREATE & UPDATE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isEditMode
      ? `${API_BASE_URL}/UpdateMonthlyProgress?id=${formData.id}`
      : `${API_BASE_URL}/CreateMonthlyProgress`;

    const method = isEditMode ? "PUT" : "POST";

    const payload = {
      id: isEditMode ? Number(formData.id) : 0,
      monthYear: String(formData.monthYear || "").trim(),
      weight: formData.weight !== "" ? parseFloat(formData.weight) : 0,
      avgGlucose: formData.avgGlucose !== "" ? parseInt(formData.avgGlucose, 10) : 0,
      bloodPressureStatus: String(formData.bloodPressureStatus || "Normal"),
      notes: String(formData.notes || "")
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchProgress();
        resetForm();
        alert("Record saved successfully!");
      } else {
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        alert(`Server failed (${response.status}): Check backend logs for DateTime/Database mapping issues.`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert(`Network Error: ${error.message}`);
    }
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/DeleteMonthlyProgress?id=${id}`, { 
        method: "DELETE"
      });
      if (response.ok) {
        fetchProgress();
        alert("Record deleted successfully!");
      } else {
        alert("Delete failed on the server.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // 4. VIEW DETAILS
  const handleViewClick = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DetailsMonthlyProgress?id=${item.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedItem(data || item);
      } else {
        setSelectedItem(item);
      }
    } catch (error) {
      setSelectedItem(item);
    }
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    setFormData(item);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ id: 0, monthYear: "", weight: "", avgGlucose: "", bloodPressureStatus: "Normal", notes: "" });
    setIsEditMode(false);
  };

  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .main-content { margin-left: 280px; width: calc(100% - 280px); padding: 32px; box-sizing: border-box; }
        .swal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
        .swal-popup { background: white; padding: 32px; border-radius: 20px; width: 100%; max-width: 600px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .form-control-custom { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 15px; font-size: 0.9rem; outline: none; box-sizing: border-box; color: #0f172a !important; background: #ffffff !important; }
        .btn-primary-custom { background-color: #0fa462; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-action { padding: 5px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: none; margin-right: 5px; }
        .rotate-90 { transform: rotate(90deg); transition: transform 0.2s ease; }
        .transition-transform { transition: transform 0.2s ease; }
      `}</style>

      {/* Sidebar */}
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
                <Link to="/adminhealthhistorys" className="btn btn-outline-success w-100 mb-2 text-start">AdminHelathHistory</Link>
                <Link to="/adminmonthlyprogresses" className="btn btn-success w-100 mb-2 text-start">AdminMonthlyProgress</Link>

                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-outline-success w-100 mb-2 text-start">Feedback List</Link>
                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link>
                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link> 
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registration Form </Link>
                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link>
                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link>
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

      {/* Main Content */}
      <div className="main-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2>Monthly Progress Tracker 📈</h2>
          <button className="btn-primary-custom" onClick={() => { resetForm(); setIsModalOpen(true); }}>+ Add New Progress</button>
        </div>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <input
            type="text"
            className="form-control-custom"
            placeholder="🔍 Search by Month or BP Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginTop: "15px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Month / Year</th>
                <th style={{ padding: "12px" }}>Weight</th>
                <th style={{ padding: "12px" }}>Avg Glucose</th>
                <th style={{ padding: "12px" }}>BP Status</th>
                <th style={{ padding: "12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>Loading...</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px" }}>#{item.id}</td>
                    <td style={{ padding: "12px", fontWeight: 600 }}>{item.monthYear}</td>
                    <td style={{ padding: "12px" }}>{item.weight} lbs</td>
                    <td style={{ padding: "12px" }}>{item.avgGlucose} mg/dL</td>
                    <td style={{ padding: "12px" }}>{item.bloodPressureStatus}</td>
                    <td style={{ padding: "12px" }}>
                      <button className="btn-action" style={{ background: "#f0fdf4", color: "#0fa462" }} onClick={() => handleViewClick(item)}>View</button>
                      <button className="btn-action" style={{ background: "#eff6ff", color: "#3b82f6" }} onClick={() => handleEditClick(item)}>Edit</button>
                      <button className="btn-action" style={{ background: "#fef2f2", color: "#ef4444" }} onClick={() => handleDelete(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="swal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditMode ? "Edit Record" : "Add Progress"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Month & Year</label>
              <input type="text" className="form-control-custom" value={formData.monthYear} onChange={(e) => setFormData({...formData, monthYear: e.target.value})} required />

              <label>Weight (lbs)</label>
              <input type="number" step="0.1" className="form-control-custom" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} required />

              <label>Avg Glucose (mg/dL)</label>
              <input type="number" className="form-control-custom" value={formData.avgGlucose} onChange={(e) => setFormData({...formData, avgGlucose: e.target.value})} required />

              <label>Blood Pressure Status</label>
              <select className="form-control-custom" value={formData.bloodPressureStatus} onChange={(e) => setFormData({...formData, bloodPressureStatus: e.target.value})}>
                <option value="Normal">Normal</option>
                <option value="Elevated">Elevated</option>
                <option value="High">High</option>
              </select>

              <label>Notes</label>
              <textarea className="form-control-custom" rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn-primary-custom" style={{ flex: 1 }}>{isEditMode ? "Update" : "Save"}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: "#e2e8f0", border: "none", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailModalOpen && selectedItem && (
        <div className="swal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Progress Details (#{selectedItem.id})</h3>
            <p><strong>Month & Year:</strong> {selectedItem.monthYear}</p>
            <p><strong>Weight:</strong> {selectedItem.weight} lbs</p>
            <p><strong>Avg Glucose:</strong> {selectedItem.avgGlucose} mg/dL</p>
            <p><strong>Blood Pressure:</strong> {selectedItem.bloodPressureStatus}</p>
            <p><strong>Notes:</strong> {selectedItem.notes || "None"}</p>
            <button className="btn-primary-custom" onClick={() => setIsDetailModalOpen(false)} style={{ width: "100%", marginTop: "15px" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const BASE_URL = "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI";

// export default function AdminHistoryManager() {
//   const navigate = useNavigate();
  
//   const [historyList, setHistoryList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Sidebar States
//   const [isShopOpen, setIsShopOpen] = useState(true);
//   const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
//   const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

//   // Modals & Form State
//   const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'details'
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [formData, setFormData] = useState({ actionType: "", description: "", ipAddress: "" });

//   const handleShopToggle = () => {
//     setIsShopOpen(!isShopOpen);
//   };

//   const getNavLinkClass = () => "d-flex align-items-center gap-3 px-3 py-2 text-white text-decoration-none rounded mb-1";
//   const getSubLinkClass = () => "text-white-50 text-decoration-none py-1.5 px-2 rounded mb-1";

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BASE_URL}/AllUserHistory`);
//       const data = await res.json();
//       setHistoryList(Array.isArray(data) ? data : (data.data || []));
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   // Handle Form Submit (Create & Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (modalMode === 'add') {
//         const res = await fetch(`${BASE_URL}/AddUserHistory`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });
//         if (res.ok) alert("History added successfully!");
//       } else if (modalMode === 'edit') {
//         const res = await fetch(`${BASE_URL}/UpdateHistory/${selectedRecord.id}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id: selectedRecord.id, ...formData })
//         });
//         if (res.ok) alert("History updated successfully!");
//       }
//       closeModal();
//       fetchHistory();
//     } catch (err) {
//       console.error("Error saving data:", err);
//     }
//   };

//   // Handle Delete
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this history record?")) return;
//     try {
//       const res = await fetch(`${BASE_URL}/DeleteHistory/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         alert("Deleted successfully!");
//         fetchHistory();
//       }
//     } catch (err) {
//       console.error("Error deleting:", err);
//     }
//   };

//   const openModal = (mode, record = null) => {
//     setModalMode(mode);
//     setSelectedRecord(record);
//     if (mode === 'edit' && record) {
//       setFormData({ actionType: record.actionType || "", description: record.description || "", ipAddress: record.ipAddress || "" });
//     } else if (mode === 'add') {
//       setFormData({ actionType: "", description: "", ipAddress: "" });
//     }
//   };

//   const closeModal = () => {
//     setModalMode(null);
//     setSelectedRecord(null);
//   };

//   const filteredHistory = historyList.filter(item => 
//     `${item.actionType} ${item.description} ${item.ipAddress}`.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f12' }}>
      
//       {/* SIDE MENU */}
//       <div style={{ 
//         width: '280px', 
//         backgroundColor: '#16161a', 
//         padding: '24px 16px', 
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         height: '100vh', 
//         zIndex: 100, 
//         overflowY: 'auto',
//         borderRight: '1px solid #232329'
//       }}>
//         <div className="brand mb-4 px-2 d-flex align-items-center">
//           <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
//           <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
//             AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
//           </h5>
//         </div>

//         <div className="px-2 mb-4">
//           <div 
//             onClick={handleShopToggle} 
//             className="p-2.5 rounded d-flex align-items-center justify-content-between transition-all" 
//             style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
//           >
//             <div className="d-flex flex-column">
//               <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
//               <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
//             </div>
//             <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
//           </div>
//         </div>

//         <div className="d-flex flex-column gap-1">
//           <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
//           <Link to="/deshboardpanel" className={getNavLinkClass()}>
//             <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
//             <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
//           </Link>

//           <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
//           <div className="mt-2">
//             <div 
//               onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-sliders-h"></i> Master Config
//               </span>
//               <i className={`fas fa-chevron-right ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {masterDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
//                 <Link to="/adminissuetype" className={getSubLinkClass()}>Add Item Type</Link>
//                 <Link to="/adminmasterassignedto" className={getSubLinkClass()}>AddAssignedTO</Link>
//                 <Link to="/addadmintypes" className={getSubLinkClass()}>AddAdminTypes</Link>
//                 <Link to="/languagematerpanels" className={getSubLinkClass()}>Language Master</Link>
//                 <Link to="/statenamemasters" className={getSubLinkClass()}>StateName Master</Link>
//                 <Link to="/citynamemasters" className={getSubLinkClass()}>CityName Master</Link> 
//                 <Link to="/addaccountmastertypes" className={getSubLinkClass()}>Accountant Master Types</Link> 
//               </div>
//             )}
//           </div>

//           <div>
//             <div 
//               onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-boxes"></i> Operations Registry
//               </span>
//               <i className={`fas fa-chevron-right ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {listsDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
//                 <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Adminmediciationtrackers</Link> 
//                 <Link to="/admintestreportss" className="btn btn-outline-success w-100 mb-2 text-start">AdminTestReports</Link>
//                 <Link to="/adminhealthhistorys" className="btn btn-outline-success w-100 mb-2 text-start">AdminHelathHistory</Link>
//                 <Link to="/adminmonthlyprogresses" className="btn btn-outline-success w-100 mb-2 text-start">AdminMonthlyProgress</Link>
//                 <Link to="/adminprescriptions" className="btn btn-outline-success w-100 mb-2 text-start">AdminPrescriptions</Link>
//                 <Link to="/adminhistorymanagers" className="btn btn-outline-success w-100 mb-2 text-start">AdminHistoryManager</Link>
//                 <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
//                 <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
//                 <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link>
//                 <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
//                 <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
//                 <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link>
//                 <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link> 
//                 <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registration Form </Link>
//                 <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link>
//                 <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link>
//                 <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link>
//                 <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> 
//                 <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> 
//                 <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start">Doctor_PatientdetailsLists</Link> 
//                 <Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link>
//                 <Link to="/qrcodeupload" className="btn btn-outline-success w-100 mb-2 text-start">qrcodeupload</Link>
//                 <Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link>
//               </div>
//             )}
//           </div>

//           <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
//             <button 
//               type="button" 
//               onClick={() => navigate('/header')} 
//               className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
//               style={{ fontSize: '13.5px' }}
//             >
//               <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div style={{ marginLeft: '280px', flex: 1, padding: "24px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
//         <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//             <div>
//               <h2 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "1.4rem" }}>History Management (CRUD)</h2>
//               <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Create, update, view details and delete logs.</p>
//             </div>
//             <button 
//               onClick={() => openModal('add')}
//               style={{ background: "#0fa462", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
//             >
//               + Add New History
//             </button>
//           </div>

//           {/* Search */}
//           <input 
//             type="text" 
//             placeholder="🔍 Search actions, descriptions, IP..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", marginBottom: "20px", outline: "none", boxSizing: "border-box" }}
//           />

//           {/* Table */}
//           <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
//               <thead>
//                 <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
//                   <th style={{ padding: '12px' }}>ID</th>
//                   <th style={{ padding: '12px' }}>Action Type</th>
//                   <th style={{ padding: '12px' }}>Description</th>
//                   <th style={{ padding: '12px' }}>IP Address</th>
//                   <th style={{ padding: '12px' }}>Date</th>
//                   <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
//                 ) : filteredHistory.length > 0 ? (
//                   filteredHistory.map((item) => (
//                     <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
//                       <td style={{ padding: '12px', fontWeight: 600 }}>{item.id}</td>
//                       <td style={{ padding: '12px' }}><span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{item.actionType}</span></td>
//                       <td style={{ padding: '12px' }}>{item.description}</td>
//                       <td style={{ padding: '12px', fontFamily: 'monospace', color: '#64748b' }}>{item.ipAddress || 'N/A'}</td>
//                       <td style={{ padding: '12px', color: '#64748b' }}>{new Date(item.createdAt).toLocaleString()}</td>
//                       <td style={{ padding: '12px', textAlign: 'center' }}>
//                         <button onClick={() => openModal('details', item)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Details</button>
//                         <button onClick={() => openModal('edit', item)} style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
//                         <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No records found.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Modal for Add / Edit / Details */}
//           {modalMode && (
//             <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//               <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                
//                 <h3 style={{ margin: '0 0 16px 0', textTransform: 'capitalize' }}>{modalMode} History Record</h3>

//                 {modalMode === 'details' ? (
//                   <div>
//                     <p><strong>ID:</strong> {selectedRecord.id}</p>
//                     <p><strong>Action Type:</strong> {selectedRecord.actionType}</p>
//                     <p><strong>Description:</strong> {selectedRecord.description}</p>
//                     <p><strong>IP Address:</strong> {selectedRecord.ipAddress}</p>
//                     <p><strong>Created At:</strong> {new Date(selectedRecord.createdAt).toLocaleString()}</p>
//                     <button onClick={closeModal} style={{ width: '100%', padding: '10px', background: '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>Close</button>
//                   </div>
//                 ) : (
//                   <form onSubmit={handleSubmit}>
//                     <div style={{ marginBottom: '12px' }}>
//                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Action Type</label>
//                       <input 
//                         type="text" 
//                         required 
//                         value={formData.actionType} 
//                         onChange={(e) => setFormData({...formData, actionType: e.target.value})}
//                         style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
//                       />
//                     </div>
//                     <div style={{ marginBottom: '12px' }}>
//                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Description</label>
//                       <textarea 
//                         value={formData.description} 
//                         onChange={(e) => setFormData({...formData, description: e.target.value})}
//                         style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', height: '80px' }}
//                       />
//                     </div>
//                     <div style={{ marginBottom: '16px' }}>
//                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>IP Address</label>
//                       <input 
//                         type="text" 
//                         value={formData.ipAddress} 
//                         onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
//                         style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
//                       />
//                     </div>
//                     <div style={{ display: 'flex', gap: '10px' }}>
//                       <button type="submit" style={{ flex: 1, background: '#0fa462', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
//                       <button type="button" onClick={closeModal} style={{ flex: 1, background: '#e2e8f0', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
//                     </div>
//                   </form>
//                 )}

//               </div>
//             </div>
//           )}

//         </div>
//       </div>

//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI";

export default function AdminHistoryManager() {
  const navigate = useNavigate();
  
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sidebar States
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  // Modals & Form State
  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'details'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({ actionType: "", description: "", ipAddress: "" });

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getNavLinkClass = () => "d-flex align-items-center gap-3 px-3 py-2 text-white text-decoration-none rounded mb-1";
  const getSubLinkClass = () => "text-white-50 text-decoration-none py-1.5 px-2 rounded mb-1";

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/AllHistory`);
      const data = await res.json();
      setHistoryList(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle Form Submit (Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        const res = await fetch(`${BASE_URL}/CreateHistory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) alert("History added successfully!");
      } else if (modalMode === 'edit') {
        const res = await fetch(`${BASE_URL}/UpdateHistory/${selectedRecord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedRecord.id, ...formData })
        });
        if (res.ok) alert("History updated successfully!");
      }
      closeModal();
      fetchHistory();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this history record?")) return;
    try {
      const res = await fetch(`${BASE_URL}/DeleteHistory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Deleted successfully!");
        fetchHistory();
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const openModal = (mode, record = null) => {
    setModalMode(mode);
    setSelectedRecord(record);
    if (mode === 'edit' && record) {
      setFormData({ actionType: record.actionType || "", description: record.description || "", ipAddress: record.ipAddress || "" });
    } else if (mode === 'add') {
      setFormData({ actionType: "", description: "", ipAddress: "" });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRecord(null);
  };

  const filteredHistory = historyList.filter(item => 
    `${item.actionType || ''} ${item.description || ''} ${item.ipAddress || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f0f12', overflowX: 'hidden' }}>
      
      {/* SIDE MENU */}
      <div style={{ 
        width: '280px', 
        backgroundColor: '#16161a', 
        padding: '24px 16px', 
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh', 
        zIndex: 100, 
        overflowY: 'auto',
        borderRight: '1px solid #232329'
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
          
          <Link to="/deshboardpanel" className={getNavLinkClass()}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          <div className="mt-2">
            <div 
              onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-sliders-h"></i> Master Config
              </span>
              <i className={`fas fa-chevron-right ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {masterDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                <Link to="/adminissuetype" className={getSubLinkClass()}>Add Item Type</Link>
                <Link to="/adminmasterassignedto" className={getSubLinkClass()}>AddAssignedTO</Link>
                <Link to="/addadmintypes" className={getSubLinkClass()}>AddAdminTypes</Link>
                <Link to="/languagematerpanels" className={getSubLinkClass()}>Language Master</Link>
                <Link to="/statenamemasters" className={getSubLinkClass()}>StateName Master</Link>
                <Link to="/citynamemasters" className={getSubLinkClass()}>CityName Master</Link> 
                <Link to="/addaccountmastertypes" className={getSubLinkClass()}>Accountant Master Types</Link> 
              </div>
            )}
          </div>

          <div>
            <div 
              onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-boxes"></i> Operations Registry
              </span>
              <i className={`fas fa-chevron-right ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {listsDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
                <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Adminmediciationtrackers</Link> 
                <Link to="/admintestreportss" className="btn btn-outline-success w-100 mb-2 text-start">AdminTestReports</Link>
                <Link to="/adminhealthhistorys" className="btn btn-outline-success w-100 mb-2 text-start">AdminHelathHistory</Link>
                <Link to="/adminmonthlyprogresses" className="btn btn-outline-success w-100 mb-2 text-start">AdminMonthlyProgress</Link>
                <Link to="/adminprescriptions" className="btn btn-outline-success w-100 mb-2 text-start">AdminPrescriptions</Link>
                <Link to="/adminhistorymanagers" className="btn btn-outline-success w-100 mb-2 text-start">AdminHistoryManager</Link>
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link>
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
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: '280px', flex: 1, padding: "24px", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ margin: "0 0 4px 0", color: "#0f172a", fontSize: "1.4rem" }}>History Management (CRUD)</h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Create, update, view details and delete logs.</p>
            </div>
            <button 
              onClick={() => openModal('add')}
              style={{ background: "#0fa462", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
            >
              + Add New History
            </button>
          </div>

          {/* Search */}
          <input 
            type="text" 
            placeholder="🔍 Search actions, descriptions, IP..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", marginBottom: "20px", outline: "none", boxSizing: "border-box" }}
          />

          {/* Table Container */}
          <div style={{ width: '100%', overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Action Type</th>
                  <th style={{ padding: '12px' }}>Description</th>
                  <th style={{ padding: '12px' }}>IP Address</th>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{item.id}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {item.actionType}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{item.description}</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', color: '#64748b' }}>{item.ipAddress || 'N/A'}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</td>
                      <td style={{ padding: '12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button onClick={() => openModal('details', item)} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Details</button>
                        <button onClick={() => openModal('edit', item)} style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal for Add / Edit / Details */}
          {modalMode && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ background: 'red', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
                
                <h3 style={{ margin: '0 0 16px 0', textTransform: 'capitalize' }}>{modalMode} History Record</h3>

                {modalMode === 'details' ? (
                  <div>
                    <p><strong>ID:</strong> {selectedRecord.id}</p>
                    <p><strong>Action Type:</strong> {selectedRecord.actionType}</p>
                    <p><strong>Description:</strong> {selectedRecord.description}</p>
                    <p><strong>IP Address:</strong> {selectedRecord.ipAddress}</p>
                    <p><strong>Created At:</strong> {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString() : 'N/A'}</p>
                    <button onClick={closeModal} style={{ width: '100%', padding: '10px', background: '#cbd5e1', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Action Type</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.actionType} 
                        onChange={(e) => setFormData({...formData, actionType: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Description</label>
                      <textarea 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', height: '80px' }}
                      />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>IP Address</label>
                      <input 
                        type="text" 
                        value={formData.ipAddress} 
                        onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" style={{ flex: 1, background: '#0fa462', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                      <button type="button" onClick={closeModal} style={{ flex: 1, background: '#e2e8f0', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
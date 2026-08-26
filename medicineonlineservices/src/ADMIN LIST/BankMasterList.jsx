

// import React from 'react'

// export default function BankMasterList() {
//   const [banks, setBanks] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({ bankselectedid: 0, bankName: '' });
//     const [isEditing, setIsEditing] = useState(false);
    
//     // Sidebar Navigation & Toggle States
//     const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
//     const [listsDropdownOpen, setListsDropdownOpen] = useState(true);
//     const [isShopOpen, setIsShopOpen] = useState(true);

//     const navigate = useNavigate();
//     const location = useLocation();

//     const handleShopToggle = () => {
//         setIsShopOpen(!isShopOpen);
//     };

//     // Active Sidebar class styling helpers
//     const getNavLinkClass = (path) => {
//         const isActive = location.pathname === path;
//         return `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none ${
//             isActive ? "bg-success text-white fw-bold" : "text-white-50 hover-sidebar-menu"
//         }`;
//     };

//     const getSubLinkClass = (path) => {
//         const isActive = location.pathname === path;
//         return `position-relative px-3 py-1.5 rounded text-decoration-none d-block text-truncate ${
//             isActive ? "text-success fw-bold" : "text-white-50 hover-sidebar-menu"
//         }`;
//     };

//     const fetchBanks = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`${API_URL}/GetAllBankSelect`);
//             console.log("API Data received:", res.data);
//             setBanks(res.data || []);
//         } catch (err) {
//             console.error("Fetch error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchBanks(); }, []);

//     const handleDelete = async (id) => {
//         if (id === undefined || id === null || id === 0) {
//             alert("Error: ID is missing or 0! Check console for data structure.");
//             return;
//         }

//         if (!window.confirm("Are you sure you want to delete this bank?")) return;

//         try {
//             const response = await axios.delete(`${API_URL}/DeleteBankSelectModel?id=${id}`);

//             if (response.status === 200 || response.status === 204) {
//                 setBanks((prev) => prev.filter(bank => 
//                     (bank.bankselectedid || bank.id || bank.bankselectid || bank._id) !== id
//                 ));
//                 alert("🗑️ Deleted Successfully!");
//             }
//         } catch (err) {
//             console.error("Delete Error:", err);
//             alert("❌ Delete failed!");
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (isEditing) {
//                 await axios.put(`${API_URL}/UpdateBankSelectModel`, formData);
//                 alert("✅ Updated!");
//             }
//             // } else {
//             //     await axios.post(`${API_URL}/AddBankSelect`, formData);
//             //     alert("✅ Saved!");
//             // }
//             resetForm();
//             fetchBanks();
//         } catch (err) {
//             console.error("Submit Error:", err);
//             alert("Action failed.");
//         }
//     };

//     const resetForm = () => {
//         setFormData({ bankselectedid: 0, bankName: '' });
//         setIsEditing(false);
//     };

//     const filteredBanks = banks.filter(bank =>
//         bank.bankName?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#212529', color: 'white', margin: 0, padding: 0 }}>
            
//             {/* --- PREMIUM TREE-STRUCTURE SIDEBAR --- */}
//             <div style={{ 
//                 width: '280px', 
//                 minWidth: '280px',
//                 backgroundColor: '#16161a', 
//                 padding: '24px 16px', 
//                 minHeight: '100vh', 
//                 zIndex: 100, 
//                 borderRight: '1px solid #232329'
//             }}>
//                 {/* Brand Logo */}
//                 <div className="brand mb-4 px-2 d-flex align-items-center">
//                     <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
//                     <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
//                         AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
//                     </h5>
//                 </div>

//                 {/* Global Shop Status Switch */}
//                 <div className="px-2 mb-4">
//                     <div 
//                         onClick={handleShopToggle} 
//                         className="p-2 rounded d-flex align-items-center justify-content-between transition-all" 
//                         style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
//                     >
//                         <div className="d-flex flex-column">
//                             <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
//                             <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
//                         </div>
//                         <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
//                     </div>
//                 </div>

//                 {/* Navigation Links */}
//                 <div className="d-flex flex-column gap-1">
//                     <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
                    
//                     <Link to="/adminmedicinelists" className={getNavLinkClass("/adminmedicinelists")}>
//                         <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
//                         <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
//                     </Link>

//                     <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
                    
//                     {/* 1. MASTER CONFIGURATION DROPDOWN */}
//                     <div className="mt-2">
//                         <div 
//                             onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
//                             className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
//                             style={{ cursor: 'pointer', fontSize: '13.5px' }}
//                         >
//                             <span className="d-flex align-items-center gap-3">
//                                 <i className="fas fa-sliders-h"></i> Master Config
//                             </span>
//                             <i className={`fas fa-chevron-right transition-transform ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//                         </div>

//                         {masterDropdownOpen && (
//                             <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                                
//                                 <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
//                                     <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                                     Add Item Type
//                                 </Link>

//                                 <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
//                                     <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                                     AddAssignedTO
//                                 </Link>

//                                 {/* <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
//                                     <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/doctorassignto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                                     AddDoctorAssignTo
//                                 </Link> */}
                                
//                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
//                   <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                   AddAdminTypes
//                 </Link>
//                  <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
//                   <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels ' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                   Language Master
//                 </Link>


//          <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>
//                                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/statenamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                                          StateName Master  
//                               </Link>
// <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>
//                                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/citynamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                                 CityName Master           
//                               </Link> 
//                       <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>
//                                 <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addaccountmastertypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
//                                 Accountant Master Types             
//                               </Link> 
//                             </div>
//                         )}
//                     </div>

//                     {/* 2. OPERATIONS REGISTRY DROPDOWN */}
//                     <div className="mt-2">
//                         <div 
//                             onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
//                             className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
//                             style={{ cursor: 'pointer', fontSize: '13.5px' }}
//                         >
//                             <span className="d-flex align-items-center gap-3">
//                                 <i className="fas fa-boxes"></i> Operations Registry
//                             </span>
//                             <i className={`fas fa-chevron-right transition-transform ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//                         </div>

//                         {listsDropdownOpen && (
//                             <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px', gap: '4px' }}>
//                                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                                
//                                 <Link to="/adminmedicinelists" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link>
//                                 <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
//                                 <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link>
//                                 <Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link>
//                                 <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link>
//                                 <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
//                                 <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
//                                 <Link to="/adminbanklists" className="btn btn-outline-success w-100 mb-2 text-start">BankselectList</Link>
//                                 <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails</Link> 
//                                 <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList</Link>
//                                 <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist</Link>
//                                 <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link>
//                                 <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link>
//                                 <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link>
//                                 <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists</Link>
// <li><Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link></li>
//  <li><Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link></li>
//                             </div>
//                         )}
//                     </div>

//                     {/* Logout Action */}
//                     <div className="mt-4 pt-3 pb-5" style={{ borderTop: '1px solid #232329' }}>
//                         <button 
//                             type="button" 
//                             onClick={() => navigate('/header')} 
//                             className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
//                             style={{ fontSize: '13.5px' }}
//                         >
//                             <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* ---------- MAIN CONTENT AREA ---------- */}
//             <div style={{ flex: 1, padding: '40px', boxSizing: 'border-box', minWidth: 0 }}>
//                 <div style={{ width: '100%', maxWidth: '100%' }}>
//                     <h2 className="mb-4 fw-bold text-success">Bank Management Master</h2>

//                     <input
//                         type="text"
//                         className="form-control mb-4 bg-dark text-white border-secondary"
//                         placeholder="🔍 Search bank name..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />

//                     {/* Entry Form */}
//                     <div className="card bg-dark border-secondary mb-5 shadow w-100">
//                         <div className="card-header border-secondary text-center fw-bold text-success">
//                             {isEditing ? "EDIT BANK RECORD" : "ADD NEW BANK"}
//                         </div>
//                         <div className="card-body p-4">
//                             <form onSubmit={handleSubmit} className="d-flex gap-3">
//                                 <input
//                                     type="text"
//                                     className="form-control bg-dark text-white border-secondary"
//                                     placeholder="Enter Bank Name"
//                                     value={formData.bankName}
//                                     onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
//                                     required
//                                 />
//                                 <button type="submit" className="btn btn-success px-5 fw-bold text-nowrap">
//                                     {isEditing ? "UPDATE" : "SAVE"}
//                                 </button>
//                                 {isEditing && (
//                                     <button type="button" className="btn btn-outline-light text-nowrap" onClick={resetForm}>Cancel</button>
//                                 )}
//                             </form>
//                         </div>
//                     </div>

//                     {/* Table Area */}
//                     <div className="table-responsive shadow w-100">
//                         <table className="table table-dark table-hover border-secondary w-100">
//                             <thead className="table-secondary">
//                                 <tr>
//                                     <th>BANK NAME</th>
//                                     <th className="text-end px-4">ACTIONS</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr><td colSpan="2" className="text-center py-4">Loading...</td></tr>
//                                 ) : filteredBanks.length === 0 ? (
//                                     <tr><td colSpan="2" className="text-center py-4">No Records Found</td></tr>
//                                 ) : filteredBanks.map((bank) => {
//                                     const currentId = bank.bankselectedid || bank.id || bank.bankselectid || bank._id;

//                                     return (
//                                         <tr key={currentId} className="border-secondary">
//                                             <td className="align-middle fw-bold">{bank.bankName}</td>
//                                             <td className="text-end px-4">
//                                                 <button 
//                                                     className="btn btn-sm btn-outline-primary me-2"
//                                                     onClick={() => { 
//                                                         setFormData({
//                                                             bankselectedid: currentId,
//                                                             bankName: bank.bankName || ""
//                                                         }); 
//                                                         setIsEditing(true); 
//                                                     }}
//                                                 >
//                                                     <i className="fas fa-edit"></i> 
//                                                 </button>
//                                                 <button 
//                                                     className="btn btn-sm btn-outline-danger"
//                                                     onClick={() => handleDelete(currentId)}
//                                                 >
//                                                     <i className="fas fa-trash-alt"></i>    
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
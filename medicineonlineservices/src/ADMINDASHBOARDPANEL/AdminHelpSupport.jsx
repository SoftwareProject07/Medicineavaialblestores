// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function AdminHelpSupport() {
//   const navigate = useNavigate();

//   // Sidebar & Layout States
//   const [isShopOpen, setIsShopOpen] = useState(true);
//   const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
//   const [listsDropdownOpen, setListsDropdownOpen] = useState(true); // Default open so operations registry items are visible

//   const [supportList, setSupportList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal States
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

//   // Form & Selected Item States
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [formData, setFormData] = useState({
//     ticketId: 0,
//     subject: "",
//     description: "",
//     status: "Pending",
//     priority: "Medium"
//   });

//   // API Base URL
//   const baseUrl = "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI";

//   // Helper classes for links
//   const getNavLinkClass = (path) => {
//     return window.location.pathname === path
//       ? "d-flex align-items-center gap-3 px-3 py-2 text-white bg-success rounded text-decoration-none fw-bold"
//       : "d-flex align-items-center gap-3 px-3 py-2 text-white-50 rounded text-decoration-none hover-sidebar-menu";
//   };

//   const getSubLinkClass = (path) => {
//     return window.location.pathname === path
//       ? "text-success fw-bold py-1 text-decoration-none d-block"
//       : "text-white-50 py-1 text-decoration-none d-block hover-sub-menu";
//   };

//   const handleShopToggle = () => {
//     setIsShopOpen(!isShopOpen);
//   };

//   // 1. FETCH ALL TICKETS
//   const fetchTickets = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${baseUrl}/AllticketHelpSupport`);
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || []);
//       setSupportList(rawList);
//     } catch (error) {
//       console.error("Error fetching support tickets:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   // 2. CREATE TICKET
//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         subject: formData.subject,
//         description: formData.description,
//         status: formData.status,
//         priority: formData.priority
//       };

//       const response = await fetch(`${baseUrl}/CreateticketHelpSupport`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       const result = await response.json();
//       if (result.success !== false) {
//         alert("Support Ticket created successfully!");
//         setIsCreateModalOpen(false);
//         setFormData({ ticketId: 0, subject: "", description: "", status: "Pending", priority: "Medium" });
//         fetchTickets();
//       } else {
//         alert("Failed to create ticket.");
//       }
//     } catch (error) {
//       console.error("Error creating ticket:", error);
//       alert("An error occurred while creating the ticket.");
//     }
//   };

//   // 3. DETAILS TICKET
//   const handleViewDetails = async (id) => {
//     try {
//       setIsDetailModalOpen(true);
//       setSelectedTicket(null);
//       const response = await fetch(`${baseUrl}/DetailsTicket?id=${id}`);
//       const data = await response.json();
//       setSelectedTicket(data);
//     } catch (error) {
//       console.error("Error fetching ticket details:", error);
//       setSelectedTicket(null);
//     }
//   };

//   // 4. OPEN UPDATE MODAL & SET DATA
//   const handleOpenUpdate = (ticket) => {
//     const ticketIdVal = ticket.ticketId !== undefined ? ticket.ticketId : (ticket.id !== undefined ? ticket.id : 0);
//     setSelectedTicket(ticket);
//     setFormData({
//       ticketId: ticketIdVal,
//       subject: ticket.subject || "",
//       description: ticket.description || "",
//       status: ticket.status || "Pending",
//       priority: ticket.priority || "Medium"
//     });
//     setIsUpdateModalOpen(true);
//   };

//   // UPDATE SUBMIT
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${baseUrl}/UpdateticketHelpSupport`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });
//       const result = await response.json();
//       if (result.success !== false) {
//         alert("Ticket updated successfully!");
//         setIsUpdateModalOpen(false);
//         fetchTickets();
//       } else {
//         alert("Failed to update ticket.");
//       }
//     } catch (error) {
//       console.error("Error updating ticket:", error);
//       alert("An error occurred while updating.");
//     }
//   };

//   // 5. DELETE TICKET
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this support ticket?")) {
//       try {
//         const response = await fetch(`${baseUrl}/DeleteticketHelpSupport?id=${id}`, {
//           method: "DELETE" 
//         });
//         const result = await response.json();
//         if (result.success !== false) {
//           alert("Ticket deleted successfully!");
//           fetchTickets();
//         } else {
//           alert("Failed to delete ticket.");
//         }
//       } catch (error) {
//         console.error("Error deleting ticket:", error);
//         alert("An error occurred while deleting.");
//       }
//     }
//   };

//   // Filter Search
//   const filteredList = supportList.filter((item) => {
//     const query = searchTerm.toLowerCase();
//     const subject = item.subject || "";
//     const desc = item.description || "";
//     const status = item.status || "";
//     return subject.toLowerCase().includes(query) || desc.toLowerCase().includes(query) || status.toLowerCase().includes(query);
//   });

//   return (
//     <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
//       <style>{`
//         .hover-sidebar-menu:hover { background-color: #1e1e24; color: #fff !important; }
//         .hover-sub-menu:hover { color: #fff !important; padding-left: 4px; transition: 0.2s; }
//         .hover-sidebar-logout:hover { background-color: rgba(239, 68, 68, 0.1); }
//         .admin-card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
//         .table-custom { width: 100%; border-collapse: collapse; text-align: left; }
//         .table-custom th { background: #f1f5f9; padding: 14px; font-size: 0.85rem; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
//         .table-custom td { padding: 14px; font-size: 0.9rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
//         .btn-primary-custom { background: #0fa462; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
//         .btn-primary-custom:hover { background: #0b824f; }
//         .btn-action { padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; cursor: pointer; border: none; margin-right: 6px; }
//         .btn-view { background: #e0f2fe; color: #0284c7; }
//         .btn-edit { background: #fef9c3; color: #ca8a04; }
//         .btn-delete { background: #fee2e2; color: #dc2626; }
//         .swal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
//         .swal-popup { background: white; width: 100%; max-width: 500px; padding: 30px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
//         .form-control { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; margin-top: 6px; margin-bottom: 16px; font-size: 0.9rem; box-sizing: border-box; }
//         .form-label { font-weight: 600; font-size: 0.85rem; color: #475569; }
//       `}</style>

//       {/* SIDEBAR NAVIGATION */}
//       <div style={{ 
//         width: '280px', 
//         backgroundColor: '#16161a', 
//         padding: '24px 16px', 
//         position: 'fixed',
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
          
//           <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
//             <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
//             <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
//           </Link>

//           <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
//           <div className="mt-2">
//             <div 
//               onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-sliders-h"></i> Master Config
//               </span>
//               <i className={`fas fa-chevron-right transition-transform ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {masterDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
//                 <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>Add Item Type</Link>
//                 <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>AddAssignedTO</Link>
//                 <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>AddAdminTypes</Link>
//                 <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>Language Master</Link>
//                 <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>StateName Master</Link>
//                 <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>CityName Master</Link> 
//                 <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>Accountant Master Types</Link> 
//               </div>
//             )}
//           </div>

//           <div>
//             <div 
//               onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-boxes"></i> Operations Registry
//               </span>
//               <i className={`fas fa-chevron-right transition-transform ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {listsDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                
//                 <Link to="/adminmediciationtrackers" className={getSubLinkClass("/adminmediciationtrackers")}>Adminmediciationtrackers</Link> 
//                 <Link to="/admintestreportss" className={getSubLinkClass("/admintestreportss")}>AdminTestReports</Link>
//                 <Link to="/adminhealthhistorys" className={getSubLinkClass("/adminhealthhistorys")}>AdminHelathHistory</Link>
//                 <Link to="/adminmonthlyprogresses" className={getSubLinkClass("/adminmonthlyprogresses")}>AdminMonthlyProgress</Link>
//                 <Link to="/adminprescriptions" className={getSubLinkClass("/adminprescriptions")}>AdminPrescriptions</Link>
//                 <Link to="/adminhistorymanagers" className={getSubLinkClass("/adminhistorymanagers")}>AdminHistoryManager</Link>
//                 <Link to="/adminhelpsupports" className={getSubLinkClass("/adminhelpsupports")}>AdminHelpSupport</Link>
//                 <Link to="/deshboardpanel" className={getSubLinkClass("/deshboardpanel")}>Dashboard</Link> 
//                 <Link to="/customerlists" className={getSubLinkClass("/customerlists")}>CustomerLIST</Link>
//                 <Link to="/adminFeedbackcustomerlists" className={getSubLinkClass("/adminFeedbackcustomerlists")}>Feedback List</Link>
//                 <Link to="/adminloginlists" className={getSubLinkClass("/adminloginlists")}>Admin Login List</Link>
//                 <Link to="/adminUnavailableMedicines" className={getSubLinkClass("/adminUnavailableMedicines")}>UnavailableMedicineList</Link>
//                 <Link to="/adminbankselectdetailss" className={getSubLinkClass("/adminbankselectdetailss")}>bankselectMaster</Link>
//                 <Link to="/admincreditdetails" className={getSubLinkClass("/admincreditdetails")}>BankCreditAmountDetails</Link> 
//                 <Link to="/adminregisterationform" className={getSubLinkClass("/adminregisterationform")}>Registration Form</Link>
//                 <Link to="/adminLivenessimageLists" className={getSubLinkClass("/adminLivenessimageLists")}>LivenessimageList</Link>
//                 <Link to="/admincustomerticketraiselist" className={getSubLinkClass("/admincustomerticketraiselist")}>customerticketraiselist</Link>
//                 <Link to="/customer-bankdetailsrefund" className={getSubLinkClass("/customer-bankdetailsrefund")}>Bank Details RefundList</Link>
//                 <Link to="/customerdeliveryaddresslist" className={getSubLinkClass("/customerdeliveryaddresslist")}>Customer_DeliveryAddressList</Link> 
//                 <Link to="/adminlivetracker" className={getSubLinkClass("/adminlivetracker")}>Livetracker</Link> 
//                 <Link to="/doctor_patientdetailslists" className={getSubLinkClass("/doctor_patientdetailslists")}>Doctor_PatientdetailsLists</Link> 
//                 <Link to="/hrdatalists" className={getSubLinkClass("/hrdatalists")}>HiringDATALIst</Link>
//                 <Link to="/qrcodeupload" className={getSubLinkClass("/qrcodeupload")}>qrcodeupload</Link>
//                 <Link to="/accountmanagerplanelists" className={getSubLinkClass("/accountmanagerplanelists")}>AccountantManagerPanelLists</Link>
//               </div>
//             )}
//           </div>

//           <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
//             <button 
//               type="button" 
//               onClick={() => navigate('/header')} 
//               className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded hover-sidebar-logout"
//               style={{ fontSize: '13.5px' }}
//             >
//               <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div style={{ marginLeft: "280px", width: "calc(100% - 280px)", padding: "30px", boxSizing: "border-box" }}>
        
//         {/* Header & Controls */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
//           <div>
//             <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.75rem", fontWeight: "700" }}>Help & Support Management</h2>
//             <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>Manage customer queries and help tickets efficiently.</p>
//           </div>
//           <button className="btn-primary-custom" onClick={() => {
//             setFormData({ ticketId: 0, subject: "", description: "", status: "Pending", priority: "Medium" });
//             setIsCreateModalOpen(true);
//           }}>
//             + Create New Ticket
//           </button>
//         </div>

//         {/* Main Content Card */}
//         <div className="admin-card">
//           {/* Search Bar */}
//           <input 
//             type="text" 
//             placeholder="🔍 Search tickets by subject, description or status..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", marginBottom: "20px", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" }}
//           />

//           {/* Table */}
//           <div style={{ overflowX: "auto" }}>
//             <table className="table-custom">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Subject</th>
//                   <th>Description</th>
//                   <th>Status</th>
//                   <th>Priority</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading tickets...</td></tr>
//                 ) : filteredList.length > 0 ? (
//                   filteredList.map((item, idx) => {
//                     const tId = item.ticketId !== undefined ? item.ticketId : (item.id !== undefined ? item.id : idx + 1);
//                     return (
//                       <tr key={idx}>
//                         <td style={{ fontWeight: 600 }}>{tId}</td>
//                         <td>{item.subject || "N/A"}</td>
//                         <td style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description || "N/A"}</td>
//                         <td>
//                           <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: item.status === "Resolved" ? "#dcfce7" : "#fef3c7", color: item.status === "Resolved" ? "#166534" : "#92400e" }}>
//                             {item.status || "Pending"}
//                           </span>
//                         </td>
//                         <td>{item.priority || "Medium"}</td>
//                         <td>
//                           <button className="btn-action btn-view" onClick={() => handleViewDetails(tId)}>View</button>
//                           <button className="btn-action btn-edit" onClick={() => handleOpenUpdate(item)}>Update</button>
//                           <button className="btn-action btn-delete" onClick={() => handleDelete(tId)}>Delete</button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No support tickets found.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* 1. CREATE MODAL */}
//         {isCreateModalOpen && (
//           <div className="swal-overlay">
//             <div className="swal-popup">
//               <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Create Support Ticket</h3>
//               <form onSubmit={handleCreateSubmit}>
//                 <label className="form-label">Subject</label>
//                 <input type="text" className="form-control" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Enter subject" />

//                 <label className="form-label">Description</label>
//                 <textarea className="form-control" rows="3" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the issue..."></textarea>

//                 <label className="form-label">Status</label>
//                 <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Resolved">Resolved</option>
//                 </select>

//                 <label className="form-label">Priority</label>
//                 <select className="form-control" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                 </select>

//                 <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                   <button type="submit" className="btn-primary-custom" style={{ flex: 1 }}>Submit</button>
//                   <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, background: "#64748b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* 2. DETAILS MODAL */}
//         {isDetailModalOpen && (
//           <div className="swal-overlay">
//             <div className="swal-popup">
//               <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Ticket Details</h3>
//               {selectedTicket ? (
//                 <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
//                   <p><strong>ID:</strong> {selectedTicket.ticketId || selectedTicket.id || "N/A"}</p>
//                   <p><strong>Subject:</strong> {selectedTicket.subject || "N/A"}</p>
//                   <p><strong>Description:</strong> {selectedTicket.description || "N/A"}</p>
//                   <p><strong>Status:</strong> {selectedTicket.status || "N/A"}</p>
//                   <p><strong>Priority:</strong> {selectedTicket.priority || "N/A"}</p>
//                 </div>
//               ) : (
//                 <p style={{ textAlign: "center", padding: "20px" }}>Loading details...</p>
//               )}
//               <button className="btn-primary-custom" style={{ width: "100%" }} onClick={() => setIsDetailModalOpen(false)}>Close</button>
//             </div>
//           </div>
//         )}

//         {/* 3. UPDATE MODAL */}
//         {isUpdateModalOpen && (
//           <div className="swal-overlay">
//             <div className="swal-popup">
//               <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Update Support Ticket</h3>
//               <form onSubmit={handleUpdateSubmit}>
//                 <label className="form-label">Subject</label>
//                 <input type="text" className="form-control" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />

//                 <label className="form-label">Description</label>
//                 <textarea className="form-control" rows="3" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>

//                 <label className="form-label">Status</label>
//                 <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Resolved">Resolved</option>
//                 </select>

//                 <label className="form-label">Priority</label>
//                 <select className="form-control" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                 </select>

//                 <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                   <button type="submit" className="btn-primary-custom" style={{ flex: 1, background: "#ca8a04" }}>Update</button>
//                   <button type="button" onClick={() => setIsUpdateModalOpen(false)} style={{ flex: 1, background: "#64748b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//       </div>

//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHelpSupport() {
  const navigate = useNavigate();

  // Sidebar & Layout States
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const [supportList, setSupportList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Form & Selected Item States
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({
    ticketId: 0,
    subject: "",
    description: "",
    status: "Pending",
    priority: "Medium"
  });

  // API Base URL
  const baseUrl = "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI";
 // "http://localhost:5256/api/TestingDashBoardPanelAPI"
  

  // Helper classes for links
  const getNavLinkClass = (path) => {
    return window.location.pathname === path
      ? "d-flex align-items-center gap-3 px-3 py-2 text-white bg-success rounded text-decoration-none fw-bold"
      : "d-flex align-items-center gap-3 px-3 py-2 text-white-50 rounded text-decoration-none hover-sidebar-menu";
  };

  const getSubLinkClass = (path) => {
    return window.location.pathname === path
      ? "text-success fw-bold py-1 text-decoration-none d-block"
      : "text-white-50 py-1 text-decoration-none d-block hover-sub-menu";
  };

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  // 1. FETCH ALL TICKETS
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/AllticketHelpSupport`);
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || []);
      setSupportList(rawList);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 2. CREATE TICKET
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        subject: formData.subject,
        description: formData.description,
        status: formData.status,
        priority: formData.priority
      };

      const response = await fetch(`${baseUrl}/CreateticketHelpSupport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const textResponse = await response.text();
      let result = {};
      try {
        if (textResponse) result = JSON.parse(textResponse);
      } catch (err) {}

      if (response.ok) {
        alert("Support Ticket created successfully!");
        setIsCreateModalOpen(false);
        setFormData({ ticketId: 0, subject: "", description: "", status: "Pending", priority: "Medium" });
        fetchTickets();
      } else {
        alert("Failed to create ticket. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("An error occurred while creating the ticket.");
    }
  };

  // 3. DETAILS TICKET
  const handleViewDetails = async (id) => {
    try {
      setIsDetailModalOpen(true);
      setSelectedTicket(null);
      const response = await fetch(`${baseUrl}/DetailsTicket?id=${id}`);
      const data = await response.json();
      setSelectedTicket(data);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      setSelectedTicket(null);
    }
  };

  // 4. OPEN UPDATE MODAL & SET DATA
  const handleOpenUpdate = (ticket) => {
    const ticketIdVal = ticket.ticketId !== undefined ? ticket.ticketId : (ticket.id !== undefined ? ticket.id : 0);
    setSelectedTicket(ticket);
    setFormData({
      ticketId: ticketIdVal,
      subject: ticket.subject || "",
      description: ticket.description || "",
      status: ticket.status || "Pending",
      priority: ticket.priority || "Medium"
    });
    setIsUpdateModalOpen(true);
  };

  // UPDATE SUBMIT (Fixed 405 Error by using PUT and proper payload structure)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ticketId: Number(formData.ticketId),
        id: Number(formData.ticketId),
        subject: formData.subject,
        description: formData.description,
        status: formData.status,
        priority: formData.priority
      };

      console.log("Sending Update Payload:", payload);

      const response = await fetch(`${baseUrl}/UpdateticketHelpSupport`, {
        method: "PUT", // PUT method fix for 405 error
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const textResponse = await response.text();
      console.log("Server Update Response:", textResponse);

      let result = {};
      try {
        if (textResponse) result = JSON.parse(textResponse);
      } catch (err) {}

      if (response.ok) {
        alert("Ticket updated successfully!");
        setIsUpdateModalOpen(false);
        fetchTickets();
      } else {
        alert("Failed to update ticket. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("An error occurred while updating.");
    }
  };

  // 5. DELETE TICKET
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this support ticket?")) {
      try {
        const response = await fetch(`${baseUrl}/DeleteticketHelpSupport?id=${id}`, {
          method: "DELETE" 
        });
        
        if (response.ok) {
          alert("Ticket deleted successfully!");
          fetchTickets();
        } else {
          alert("Failed to delete ticket.");
        }
      } catch (error) {
        console.error("Error deleting ticket:", error);
        alert("An error occurred while deleting.");
      }
    }
  };

  // Filter Search
  const filteredList = supportList.filter((item) => {
    const query = searchTerm.toLowerCase();
    const subject = item.subject || "";
    const desc = item.description || "";
    const status = item.status || "";
    return subject.toLowerCase().includes(query) || desc.toLowerCase().includes(query) || status.toLowerCase().includes(query);
  });

  return (
    <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      
      <style>{`
        .hover-sidebar-menu:hover { background-color: #1e1e24; color: #fff !important; }
        .hover-sub-menu:hover { color: #fff !important; padding-left: 4px; transition: 0.2s; }
        .hover-sidebar-logout:hover { background-color: rgba(239, 68, 68, 0.1); }
        .admin-card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .table-custom { width: 100%; border-collapse: collapse; text-align: left; }
        .table-custom th { background: #f1f5f9; padding: 14px; font-size: 0.85rem; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
        .table-custom td { padding: 14px; font-size: 0.9rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
        .btn-primary-custom { background: #0fa462; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary-custom:hover { background: #0b824f; }
        .btn-action { padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; cursor: pointer; border: none; margin-right: 6px; }
        .btn-view { background: #e0f2fe; color: #0284c7; }
        .btn-edit { background: #fef9c3; color: #ca8a04; }
        .btn-delete { background: #fee2e2; color: #dc2626; }
        .swal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .swal-popup { background: white; width: 100%; max-width: 500px; padding: 30px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .form-control { width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; margin-top: 6px; margin-bottom: 16px; font-size: 0.9rem; box-sizing: border-box; }
        .form-label { font-weight: 600; font-size: 0.85rem; color: #475569; }
      `}</style>

      {/* SIDEBAR NAVIGATION */}
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
                
                <Link to="/adminmediciationtrackers" className={getSubLinkClass("/adminmediciationtrackers")}>Adminmediciationtrackers</Link> 
                <Link to="/admintestreportss" className={getSubLinkClass("/admintestreportss")}>AdminTestReports</Link>
                <Link to="/adminhealthhistorys" className={getSubLinkClass("/adminhealthhistorys")}>AdminHelathHistory</Link>
                <Link to="/adminmonthlyprogresses" className={getSubLinkClass("/adminmonthlyprogresses")}>AdminMonthlyProgress</Link>
                <Link to="/adminprescriptions" className={getSubLinkClass("/adminprescriptions")}>AdminPrescriptions</Link>
                <Link to="/adminhistorymanagers" className={getSubLinkClass("/adminhistorymanagers")}>AdminHistoryManager</Link>
                <Link to="/adminhelpsupports" className={getSubLinkClass("/adminhelpsupports")}>AdminHelpSupport</Link>
                <Link to="/deshboardpanel" className={getSubLinkClass("/deshboardpanel")}>Dashboard</Link> 
                <Link to="/customerlists" className={getSubLinkClass("/customerlists")}>CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className={getSubLinkClass("/adminFeedbackcustomerlists")}>Feedback List</Link>
                <Link to="/adminloginlists" className={getSubLinkClass("/adminloginlists")}>Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className={getSubLinkClass("/adminUnavailableMedicines")}>UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className={getSubLinkClass("/adminbankselectdetailss")}>bankselectMaster</Link>
                <Link to="/admincreditdetails" className={getSubLinkClass("/admincreditdetails")}>BankCreditAmountDetails</Link> 
                <Link to="/adminregisterationform" className={getSubLinkClass("/adminregisterationform")}>Registration Form</Link>
                <Link to="/adminLivenessimageLists" className={getSubLinkClass("/adminLivenessimageLists")}>LivenessimageList</Link>
                <Link to="/admincustomerticketraiselist" className={getSubLinkClass("/admincustomerticketraiselist")}>customerticketraiselist</Link>
                <Link to="/customer-bankdetailsrefund" className={getSubLinkClass("/customer-bankdetailsrefund")}>Bank Details RefundList</Link>
                <Link to="/customerdeliveryaddresslist" className={getSubLinkClass("/customerdeliveryaddresslist")}>Customer_DeliveryAddressList</Link> 
                <Link to="/adminlivetracker" className={getSubLinkClass("/adminlivetracker")}>Livetracker</Link> 
                <Link to="/doctor_patientdetailslists" className={getSubLinkClass("/doctor_patientdetailslists")}>Doctor_PatientdetailsLists</Link> 
                <Link to="/hrdatalists" className={getSubLinkClass("/hrdatalists")}>HiringDATALIst</Link>
                <Link to="/qrcodeupload" className={getSubLinkClass("/qrcodeupload")}>qrcodeupload</Link>
                <Link to="/accountmanagerplanelists" className={getSubLinkClass("/accountmanagerplanelists")}>AccountantManagerPanelLists</Link>
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

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: "280px", width: "calc(100% - 280px)", padding: "30px", boxSizing: "border-box" }}>
        
        {/* Header & Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, color: "#0f172a", fontSize: "1.75rem", fontWeight: "700" }}>Help & Support Management</h2>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>Manage customer queries and help tickets efficiently.</p>
          </div>
          <button className="btn-primary-custom" onClick={() => {
            setFormData({ ticketId: 0, subject: "", description: "", status: "Pending", priority: "Medium" });
            setIsCreateModalOpen(true);
          }}>
            + Create New Ticket
          </button>
        </div>

        {/* Main Content Card */}
        <div className="admin-card">
          {/* Search Bar */}
          <input 
            type="text" 
            placeholder="🔍 Search tickets by subject, description or status..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", marginBottom: "20px", outline: "none", fontSize: "0.95rem", boxSizing: "border-box" }}
          />

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading tickets...</td></tr>
                ) : filteredList.length > 0 ? (
                  filteredList.map((item, idx) => {
                    const tId = item.ticketId !== undefined ? item.ticketId : (item.id !== undefined ? item.id : idx + 1);
                    return (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{tId}</td>
                        <td>{item.subject || "N/A"}</td>
                        <td style={{ maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.description || "N/A"}</td>
                        <td>
                          <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: item.status === "Resolved" ? "#dcfce7" : "#fef3c7", color: item.status === "Resolved" ? "#166534" : "#92400e" }}>
                            {item.status || "Pending"}
                          </span>
                        </td>
                        <td>{item.priority || "Medium"}</td>
                        <td>
                          <button className="btn-action btn-view" onClick={() => handleViewDetails(tId)}>View</button>
                          <button className="btn-action btn-edit" onClick={() => handleOpenUpdate(item)}>Update</button>
                          <button className="btn-action btn-delete" onClick={() => handleDelete(tId)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No support tickets found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1. CREATE MODAL */}
        {isCreateModalOpen && (
          <div className="swal-overlay">
            <div className="swal-popup">
              <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Create Support Ticket</h3>
              <form onSubmit={handleCreateSubmit}>
                <label className="form-label">Subject</label>
                <input type="text" className="form-control" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Enter subject" />

                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe the issue..."></textarea>

                <label className="form-label">Status</label>
                <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <label className="form-label">Priority</label>
                <select className="form-control" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button type="submit" className="btn-primary-custom" style={{ flex: 1 }}>Submit</button>
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ flex: 1, background: "#64748b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. DETAILS MODAL */}
        {isDetailModalOpen && (
          <div className="swal-overlay">
            <div className="swal-popup">
              <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Ticket Details</h3>
              {selectedTicket ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                  <p><strong>ID:</strong> {selectedTicket.ticketId || selectedTicket.id || "N/A"}</p>
                  <p><strong>Subject:</strong> {selectedTicket.subject || "N/A"}</p>
                  <p><strong>Description:</strong> {selectedTicket.description || "N/A"}</p>
                  <p><strong>Status:</strong> {selectedTicket.status || "N/A"}</p>
                  <p><strong>Priority:</strong> {selectedTicket.priority || "N/A"}</p>
                </div>
              ) : (
                <p style={{ textAlign: "center", padding: "20px" }}>Loading details...</p>
              )}
              <button className="btn-primary-custom" style={{ width: "100%" }} onClick={() => setIsDetailModalOpen(false)}>Close</button>
            </div>
          </div>
        )}

        {/* 3. UPDATE MODAL */}
        {isUpdateModalOpen && (
          <div className="swal-overlay">
            <div className="swal-popup">
              <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>Update Support Ticket</h3>
              <form onSubmit={handleUpdateSubmit}>
                <label className="form-label">Subject</label>
                <input type="text" className="form-control" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />

                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>

                <label className="form-label">Status</label>
                <select className="form-control" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <label className="form-label">Priority</label>
                <select className="form-control" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button type="submit" className="btn-primary-custom" style={{ flex: 1, background: "#ca8a04" }}>Update</button>
                  <button type="button" onClick={() => setIsUpdateModalOpen(false)} style={{ flex: 1, background: "#64748b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
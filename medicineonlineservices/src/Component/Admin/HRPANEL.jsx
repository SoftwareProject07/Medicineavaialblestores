// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function HRPANEL() {
//   // Always set to true by default so the sidebar menu displays immediately without forcing a login screen loop
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const [username, setUsername] = useState('Admin');
  
//   // Sidebar dropdown states
//   const [isShopOpen, setIsShopOpen] = useState(true);
//   const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
//   const [listsDropdownOpen, setListsDropdownOpen] = useState(false);

//   const handleShopToggle = () => {
//     setIsShopOpen(!isShopOpen);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   const getNavLinkClass = (path) => {
//     return window.location.pathname === path
//       ? "d-flex align-items-center gap-3 px-3 py-2 rounded text-white bg-success text-decoration-none fw-semibold"
//       : "d-flex align-items-center gap-3 px-3 py-2 rounded text-white-50 text-decoration-none hover-sidebar-menu";
//   };

//   const getSubLinkClass = (path) => {
//     return window.location.pathname === path
//       ? "d-flex align-items-center px-3 py-2 text-success bg-dark rounded fw-semibold text-decoration-none border border-success"
//       : "d-flex align-items-center px-3 py-2 text-white-50 rounded text-decoration-none hover-sidebar-sub border border-transparent";
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
      
//       {/* Sidebar matching your exact design */}
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
          
//           {/* <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
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
//               <i className={`fas fa-chevron-${masterDropdownOpen ? 'down' : 'right'}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {masterDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column gap-1" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
               
//                 <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>Add Item Type</Link>
//                 <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>AddAssignedTO</Link>
//                 <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>AddDoctorAssignTo</Link>
//                 <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>AddAdminTypes</Link>
//                 <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>Language Master</Link>
//                 <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>StateName Master</Link>
//                 <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>CityName Master</Link>
//               </div>
//             )}
//           </div> */}

//           <div className="mt-2">
//             <div 
//               onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-boxes"></i> Operations Registry
//               </span>
//               <i className={`fas fa-chevron-${listsDropdownOpen ? 'down' : 'right'}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {listsDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column gap-1" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
               
//                 {/* <Link to="/deshboardpanel" className={getSubLinkClass("/deshboardpanel")}>Dashboard</Link>
//                 <Link to="/customerlists" className={getSubLinkClass("/customerlists")}>CustomerLIST</Link>
//                 <Link to="/orderpaymentlist" className={getSubLinkClass("/orderpaymentlist")}>OrderPaymentList</Link>
//                 <Link to="/orderstatuslist" className={getSubLinkClass("/orderstatuslist")}>OrderStatusLIST</Link>
//                 <Link to="/adminFeedbackcustomerlists" className={getSubLinkClass("/adminFeedbackcustomerlists")}>Feedback List</Link>
//                 <Link to="/adminloginlists" className={getSubLinkClass("/adminloginlists")}>Admin Login List</Link>
//                 <Link to="/adminUnavailableMedicines" className={getSubLinkClass("/adminUnavailableMedicines")}>UnavailableMedicineList</Link>
//                 <Link to="/adminbankselectdetailss" className={getSubLinkClass("/adminbankselectdetailss")}>bankselectMaster</Link>
//                 <Link to="/admincreditdetails" className={getSubLinkClass("/admincreditdetails")}>BankCreditAmountDetails</Link>
//                 <Link to="/adminregisterationform" className={getSubLinkClass("/adminregisterationform")}>Registeartion Form</Link>
//                 <Link to="/adminLivenessimageLists" className={getSubLinkClass("/adminLivenessimageLists")}>LivenessimageList</Link>
//                 <Link to="/admincustomerticketraiselist" className={getSubLinkClass("/admincustomerticketraiselist")}>customerticketraiselist</Link>
//                 <Link to="/customer-bankdetailsrefund" className={getSubLinkClass("/customer-bankdetailsrefund")}>Bank Details RefundList</Link>
//                 <Link to="/customerdeliveryaddresslist" className={getSubLinkClass("/customerdeliveryaddresslist")}>Customer_DeliveryAddressList</Link>
//                 <Link to="/adminlivetracker" className={getSubLinkClass("/adminlivetracker")}>Livetracker</Link>
//                 <Link to="/doctor_patientdetailslists" className={getSubLinkClass("/doctor_patientdetailslists")}>Doctor_PatientdetailsLists</Link> */}
//                 <Link to="/hiringcandidteapplieds" className={getSubLinkClass("/hiringcandidteapplieds")}>HiringDATA</Link>
//               </div>
//             )}
//           </div>

//           {/* Logout Section */}
//           <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
//             <button
//               type="button"
//               onClick={handleLogout}
//               className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
//               style={{ fontSize: '13.5px' }}
//             >
//               <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)', color: '#fff' }}>
//         <h2 className="fw-bold mb-4">Dashboard & Management Panel</h2>
//         <div className="p-4 rounded" style={{ backgroundColor: '#16161a', border: '1px solid #232329' }}>
//           <p className="text-muted mb-0">Welcome, <strong>{username}</strong>. Select an option from the sidebar to manage your records.</p>
//         </div>
//       </div>
//     </div>
//   );
// }
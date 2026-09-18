// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";
// import { useCart } from "../User/CartContext";
// import "../styles/dashboardsprofiles.css";

// const COLORS = ["#0fa462", "#3b82f6", "#f59e0b"];

// export default function Dashboard() {
//   const { cartItems } = useCart();
//   const location = useLocation();

//   const [openDashboard, setOpenDashboard] = useState(true);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [user, setUser] = useState(null);

//   // ---------- GRAPH STATES ----------
//   const [currentMonth, setCurrentMonth] = useState("Select Period");
//   const [selectedGlucoseData, setSelectedGlucoseData] = useState([]);
//   const [selectedWeightData, setSelectedWeightData] = useState([]);
//   const [selectedBpData, setSelectedBpData] = useState([]);

//   // ---------- NOTIFICATION & SETTINGS STATES ----------
//   const [unreadCount, setUnreadCount] = useState(2); // Example count
//   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
//   const [loadingSettings, setLoadingSettings] = useState(false);
//   const [settingsData, setSettingsData] = useState({
//     emailNotifications: true,
//     smsNotifications: true,
//     twoFactorAuth: false,
//     themeMode: "Light",
//     language: "English"
//   });

//   // ---------- MODAL & API STATES ----------
//   const [isMedModalOpen, setIsMedModalOpen] = useState(false);
//   const [medications, setMedications] = useState([]);
//   const [loadingMed, setLoadingMed] = useState(false);

//   const [isTestReportModalOpen, setIsTestReportModalOpen] = useState(false);
//   const [testReports, setTestReports] = useState([]);
//   const [loadingTest, setLoadingTest] = useState(false);

//   const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
//   const [healthHistories, setHealthHistories] = useState([]);
//   const [loadingHealth, setLoadingHealth] = useState(false);

//   const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
//   const [monthlyProgressData, setMonthlyProgressData] = useState([]);
//   const [loadingMonthly, setLoadingMonthly] = useState(false);

//   // ---------- PRESCRIPTIONS LIST & DETAIL STATES ----------
//   const [isPrescriptionsListModalOpen, setIsPrescriptionsListModalOpen] = useState(false);
//   const [prescriptionsList, setPrescriptionsList] = useState([]);
//   const [loadingPrescriptionsList, setLoadingPrescriptionsList] = useState(false);
//   const [prescriptionSearchTerm, setPrescriptionSearchTerm] = useState('');

//   const [isPrescriptionDetailModalOpen, setIsPrescriptionDetailModalOpen] = useState(false);
//   const [prescriptionDetails, setPrescriptionDetails] = useState(null);
//   const [loadingPrescriptionDetail, setLoadingPrescriptionDetail] = useState(false);

//   // ---------- HISTORY LIST & DETAIL STATES ----------
//   const [isHistoryListModalOpen, setIsHistoryListModalOpen] = useState(false);
//   const [historyList, setHistoryList] = useState([]);
//   const [loadingHistoryList, setLoadingHistoryList] = useState(false);
//   const [historySearchTerm, setHistorySearchTerm] = useState('');

//   const [isHistoryDetailModalOpen, setIsHistoryDetailModalOpen] = useState(false);
//   const [historyDetails, setHistoryDetails] = useState(null);
//   const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);

//   // ---------- HANDLERS ----------
//   const handleNotifClick = () => {
//     alert("Notifications clicked!");
//     setUnreadCount(0);
//   };

//   // ---------- FETCH & OPEN SETTINGS MODAL ----------
//   const fetchSettings = async () => {
//     try {
//       setLoadingSettings(true);
//       setIsSettingsModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllSettings");
//       const data = await response.json();
//       if (data) {
//         // Agar array return hota hai toh pehla item le lenge, warna object
//         const actualSettings = Array.isArray(data) ? data[0] : (data.data || data);
//         if (actualSettings) {
//           setSettingsData({
//             emailNotifications: actualSettings.emailNotifications ?? true,
//             smsNotifications: actualSettings.smsNotifications ?? true,
//             twoFactorAuth: actualSettings.twoFactorAuth ?? false,
//             themeMode: actualSettings.themeMode || "Light",
//             language: actualSettings.language || "English"
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     } finally {
//       setLoadingSettings(false);
//     }
//   };

//   const handleSettingsClick = (e) => {
//     if (e) e.preventDefault();
//     fetchSettings();
//   };

//   // ---------- SAVE SETTINGS API ----------
//   const handleSaveSettings = async () => {
//     try {
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/UpdateSettings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(settingsData)
//       });
//       const result = await response.json();
//       if (result.success !== false) {
//         alert("Settings updated successfully!");
//         setIsSettingsModalOpen(false);
//       } else {
//         alert("Failed to update settings.");
//       }
//     } catch (error) {
//       console.error('Error updating settings:', error);
//       alert("An error occurred while updating settings.");
//     }
//   };

//   // ---------- FETCH: ALL HISTORY LIST ----------
//   const fetchHistoryList = async () => {
//     try {
//       setLoadingHistoryList(true);
//       setIsHistoryListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllHistory");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || []);
//       setHistoryList(rawList);
//     } catch (error) {
//       console.error('Error fetching history list:', error);
//       setHistoryList([]);
//     } finally {
//       setLoadingHistoryList(false);
//     }
//   };

//   const handleOpenHistoryList = (e) => {
//     if (e) e.preventDefault();
//     fetchHistoryList();
//   };

//   // ---------- FETCH: SINGLE HISTORY DETAILS BY ID ----------
//   const fetchHistoryDetails = async (id) => {
//     try {
//       setLoadingHistoryDetail(true);
//       setIsHistoryDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsHistory?id=${id}`);
//       const data = await response.json();
//       setHistoryDetails(data);
//     } catch (error) {
//       console.error('Error fetching history details:', error);
//       setHistoryDetails(null);
//     } finally {
//       setLoadingHistoryDetail(false);
//     }
//   };

//   // ---------- FETCH: ALL PRESCRIPTIONS LIST ----------
//   const fetchPrescriptionsList = async () => {
//     try {
//       setLoadingPrescriptionsList(true);
//       setIsPrescriptionsListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllPrescriptions");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || []);
//       setPrescriptionsList(rawList);
//     } catch (error) {
//       console.error('Error fetching prescriptions list:', error);
//       setPrescriptionsList([]);
//     } finally {
//       setLoadingPrescriptionsList(false);
//     }
//   };

//   const handleOpenPrescriptionsList = (e) => {
//     if (e) e.preventDefault();
//     fetchPrescriptionsList();
//   };

//   // ---------- FETCH: SINGLE PRESCRIPTION DETAILS BY ID ----------
//   const fetchPrescriptionDetails = async (id) => {
//     try {
//       setLoadingPrescriptionDetail(true);
//       setIsPrescriptionDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsPrescription?id=${id}`);
//       const data = await response.json();
//       setPrescriptionDetails(data);
//     } catch (error) {
//       console.error('Error fetching prescription details:', error);
//       setPrescriptionDetails(null);
//     } finally {
//       setLoadingPrescriptionDetail(false);
//     }
//   };

//   // ---------- FETCH: MONTHLY PROGRESS ----------
//   const fetchMonthlyProgress = async () => {
//     try {
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMonthlyProgress");
//       const data = await response.json();
//       const actualData = Array.isArray(data) ? data : (data.data || data.result || []);
      
//       if (actualData.length > 0) {
//         setMonthlyProgressData(actualData);
//         if (currentMonth === "Select Period") {
//           const firstItem = actualData[0];
//           const periodName = firstItem.month || firstItem.monthYear || "Period 1";
//           const bpVal = firstItem.bpStatus || firstItem.status || 'Normal';
          
//           setCurrentMonth(periodName);
//           setSelectedGlucoseData(firstItem.glucoseData || [{ day: 'Avg', value: parseInt(firstItem.avgGlucose) || 120 }]);
//           setSelectedWeightData(firstItem.weightData || [{ date: periodName, weight: parseFloat(firstItem.weight) || 150 }]);
//           setSelectedBpData(firstItem.bpData || [{ label: bpVal, value: 100 }]);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching monthly progress:', error);
//     }
//   };

//   const filteredPrescriptionsList = prescriptionsList.filter(item => {
//     const title = item.title || item.doctorName || item.patientName || item.name || '';
//     return title.toLowerCase().includes(prescriptionSearchTerm.toLowerCase());
//   });

//   const filteredHistoryList = historyList.filter(item => {
//     const queryStr = `${item.actionType || ''} ${item.description || ''} ${item.ipAddress || ''}`;
//     return queryStr.toLowerCase().includes(historySearchTerm.toLowerCase());
//   });

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     fetchMonthlyProgress();
//   }, []);

//   const getInitial = () => {
//     if (user && user.firstName) return user.firstName.charAt(0).toUpperCase();
//     return "G";
//   };

//   return (
//     <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: "'Inter', sans-serif" }}>
      
//       <style>{`
//         .modern-sidebar { width: 270px; height: 100vh; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 18px; position: fixed; left: 0; top: 0; z-index: 1000; box-sizing: border-box; overflow-y: auto; }
//         .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; margin-bottom: 18px; text-decoration: none; }
//         .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
//         .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
//         .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; color: #475569; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
//         .modern-nav-item:hover { background-color: #f0fdf4; color: #0fa462; }
//         .modern-nav-item.active { background-color: #0fa462; color: #ffffff; box-shadow: 0 4px 12px rgba(15, 164, 98, 0.2); }
//         .modern-link-content { display: flex; align-items: center; gap: 12px; }
//         .modern-link-content i { font-size: 1.1rem; width: 20px; text-align: center; }
//         .modern-dropdown-toggle { border: 1px solid #f1f5f9; background-color: #f8fafc; }
//         .modern-submenu { list-style: none; padding: 6px 0 6px 32px; display: flex; flex-direction: column; gap: 4px; }
//         .modern-submenu a, .modern-submenu button { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; background: none; border: none; text-align: left; width: 100%; cursor: pointer; transition: all 0.15s ease; }
//         .modern-submenu a:hover, .modern-submenu button:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
//         .modern-sidebar-footer { margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; flex-direction: column; gap: 10px; }
//         .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
//         .modern-avatar { width: 38px; height: 38px; background-color: #dcfce7; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
//         .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
//         .modern-user-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
//         .modern-user-role { font-size: 0.72rem; color: #64748b; font-weight: 500; }
//         .modern-logout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #ef4444; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 8px; transition: background 0.2s; }
//         .modern-logout-btn:hover { background-color: #fef2f2; }
//         .modern-main-layout { margin-left: 270px; width: calc(100% - 270px); padding: 32px; box-sizing: border-box; }
//         .stat-card { padding: 22px; border-radius: 14px; color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); transition: transform 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px; }
//         .stat-card:hover { transform: translateY(-3px); }
//         .swal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
//         .swal-popup { background: white; padding: 32px; border-radius: 20px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: left; }
//         .swal-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 20px; text-align: center; }
//         .swal-btn { background-color: #0fa462; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; }
//         .swal-btn:hover { background-color: #0b824f; }
//         .btn-view { background-color: #f0fdf4; color: #0fa462; border: 1px solid #bbf7d0; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; }
//         .btn-view:hover { background-color: #0fa462; color: white; }
//         .search-box { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; margin-bottom: 20px; outline: none; box-sizing: border-box; font-size: 0.95rem; }
//       `}</style>

//       {/* ---------- SIDEBAR ---------- */}
//       <div className="modern-sidebar">
//         <div>
//           <Link to="/dashboards" className="modern-brand">
//             <img src="/AKMedizostore.png" alt="logo" width="36" height="36" style={{ objectFit: 'contain' }} />
//             <span>AK Medistore</span>
//           </Link>

//           <ul className="modern-nav-menu">
//             <li>
//               <button
//                 className={`modern-nav-item ${openDashboard ? "active" : ""}`}
//                 onClick={() => setOpenDashboard(!openDashboard)}
//               >
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>

//               {openDashboard && (
//                 <ul className="modern-submenu">
//                   <li><button onClick={() => setIsMedModalOpen(true)}>Medication Tracker</button></li>
//                   <li><button onClick={() => setIsTestReportModalOpen(true)}>Test Reports</button></li>
//                   <li><button onClick={() => setIsHealthModalOpen(true)}>Health History</button></li>
//                   <li><button onClick={() => setIsMonthlyModalOpen(true)}>Monthly Progress</button></li>
//                   <li><button onClick={handleOpenPrescriptionsList}>Prescriptions</button></li>
//                   <li><button onClick={handleOpenHistoryList}>History</button></li>
//                   <li><Link to="/support">Help & Support</Link></li>
//                   <li><button onClick={handleSettingsClick} style={{ background: 'none', border: 'none', padding: '7px 12px', textAlign: 'left', width: '100%', cursor: 'pointer', color: '#64748b' }}>Settings</button></li>
//                   <li><Link to="/labtests">LAB TEST</Link></li>
//                 </ul>
//               )}
//             </li>

//             <li>
//               <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openMasterUpdate && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/deliveryaddress">Delivery Address</Link></li>
//                   <li><Link to="/addbankrefundableamounts">Refund Bank Details</Link></li>
//                   <li><Link to="/bankdetailsrefundlist">Bankdetailsrefundlist</Link></li>
//                 </ul>
//               )}
//             </li>

//             <li><Link to="/medicinedisplay" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
//             <li>
//               <Link to="/carts" className="modern-nav-item">
//                 <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
//                 {cartItems.length > 0 && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>{cartItems.length}</span>}
//               </Link>
//             </li>
//             <li><Link to="/order" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div></Link></li>
//             <li><Link to="/customerfeedback" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-comments"></i><span>Customer Feedback</span></div></Link></li>
//             <li><Link to="/unavailablemedicines" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-ban"></i><span>Unavailable Medicines</span></div></Link></li>
//             <li><Link to="/customerprofile" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div></Link></li>
//           </ul>
//         </div>

//         <div className="modern-sidebar-footer">
//           <div className="modern-user-card">
//             <div className="modern-avatar">{getInitial()}</div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
//               <span className="modern-user-role">Customer Account</span>
//             </div>
//           </div>
//           <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
//         </div>
//       </div>

//       {/* ---------- MAIN CONTENT AREA ---------- */}
//       <div className="modern-main-layout">
//         <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//           <div>
//             <h2 style={{ margin: 0, color: "#0f172a", fontWeight: "700", fontSize: "1.75rem", letterSpacing: "-0.5px" }}>
//               Welcome back, Gautam Dev 👋
//             </h2>
//             <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>
//               Active Period View: <strong style={{ color: "#0fa462" }}>{currentMonth}</strong>
//             </p>
//           </div>

//           {/* Notification Bell & Settings Icon */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//             <div 
//               style={{ position: 'relative', cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
//               onClick={handleNotifClick}
//             >
//               🔔
//               {unreadCount > 0 && (
//                 <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
//                   {unreadCount}
//                 </span>
//               )}
//             </div>

//             <div 
//               style={{ cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//               onClick={handleSettingsClick}
//             >
//               ⚙️
//             </div>
//           </div>
//         </header>

//         {/* Top Action Cards */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "18px", marginBottom: "30px" }}>
//           <div onClick={() => setIsMedModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>💊</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Medication Tracker</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>View prescriptions</div>
//             </div>
//           </div>
//           <div onClick={() => setIsTestReportModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🔬</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Test Reports</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Lab diagnostics</div>
//             </div>
//           </div>
//           <div onClick={() => setIsHealthModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🩺</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Health History</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Medical background</div>
//             </div>
//           </div>
//           <div onClick={() => setIsMonthlyModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>📈</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Monthly Progress</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Track improvements</div>
//             </div>
//           </div>
//           <div onClick={() => window.location.href = '/labtests'} className="stat-card" style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🧪</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Lab Test</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Book new tests</div>
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Charts Section */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Glucose ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={180}>
//               <BarChart data={selectedGlucoseData}>
//                 <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Weight Progress ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={selectedWeightData}>
//                 <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 2', 'dataMax + 2']} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 10px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Pressure Status ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={140}>
//               <PieChart>
//                 <Pie data={selectedBpData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={50}>
//                   {selectedBpData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* ================= MODALS SECTION ================= */}

//       {/* SETTINGS SWEETALERT2 POPUP MODAL */}
//       {isSettingsModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Account Settings</div>
            
//             {loadingSettings ? (
//               <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading settings...</p>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input 
//                     type="checkbox" 
//                     checked={settingsData.emailNotifications} 
//                     onChange={(e) => setSettingsData({...settingsData, emailNotifications: e.target.checked})} 
//                     style={{ width: '18px', height: '18px', accentColor: '#0fa462' }}
//                   />
//                   <span>Enable Email Notifications</span>
//                 </label>

//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input 
//                     type="checkbox" 
//                     checked={settingsData.smsNotifications} 
//                     onChange={(e) => setSettingsData({...settingsData, smsNotifications: e.target.checked})} 
//                     style={{ width: '18px', height: '18px', accentColor: '#0fa462' }}
//                   />
//                   <span>Enable SMS Notifications</span>
//                 </label>

//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input 
//                     type="checkbox" 
//                     checked={settingsData.twoFactorAuth} 
//                     onChange={(e) => setSettingsData({...settingsData, twoFactorAuth: e.target.checked})} 
//                     style={{ width: '18px', height: '18px', accentColor: '#0fa462' }}
//                   />
//                   <span>Two-Factor Authentication (2FA)</span>
//                 </label>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
//                   <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>Theme Mode:</label>
//                   <select 
//                     value={settingsData.themeMode} 
//                     onChange={(e) => setSettingsData({...settingsData, themeMode: e.target.value})}
//                     style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
//                   >
//                     <option value="Light">Light Mode</option>
//                     <option value="Dark">Dark Mode</option>
//                   </select>
//                 </div>

//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '5px' }}>
//                   <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>Language:</label>
//                   <select 
//                     value={settingsData.language} 
//                     onChange={(e) => setSettingsData({...settingsData, language: e.target.value})}
//                     style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
//                   >
//                     <option value="English">English</option>
//                     <option value="Hindi">Hindi</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button className="swal-btn" onClick={handleSaveSettings}>Save Changes</button>
//               <button 
//                 className="swal-btn" 
//                 style={{ backgroundColor: '#64748b' }} 
//                 onClick={() => setIsSettingsModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 1. HISTORY LIST MODAL */}
//       {isHistoryListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsHistoryListModalOpen(false)}>
//           <div className="swal-popup" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">User History List</div>
//             <input 
//               type="text" 
//               className="search-box" 
//               placeholder="🔍 Search history logs..." 
//               value={historySearchTerm} 
//               onChange={(e) => setHistorySearchTerm(e.target.value)} 
//             />
//             <div style={{ overflowX: 'auto', marginBottom: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//                 <thead>
//                   <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem' }}>
//                     <th style={{ padding: '12px' }}>ID</th>
//                     <th style={{ padding: '12px' }}>Action Type</th>
//                     <th style={{ padding: '12px' }}>Description</th>
//                     <th style={{ padding: '12px' }}>IP Address</th>
//                     <th style={{ padding: '12px' }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loadingHistoryList ? (
//                     <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>Loading history list...</td></tr>
//                   ) : filteredHistoryList.length > 0 ? (
//                     filteredHistoryList.map((item, idx) => {
//                       const historyId = item.id || item._id || idx + 1;
//                       const actionType = item.actionType || 'N/A';
//                       const description = item.description || 'N/A';
//                       const ipAddress = item.ipAddress || 'N/A';

//                       return (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
//                           <td style={{ padding: '12px', fontWeight: 600, color: '#1e293b' }}>{historyId}</td>
//                           <td style={{ padding: '12px', color: '#475569' }}>{actionType}</td>
//                           <td style={{ padding: '12px', color: '#475569' }}>{description}</td>
//                           <td style={{ padding: '12px', color: '#475569' }}>{ipAddress}</td>
//                           <td style={{ padding: '12px' }}>
//                             <button className="btn-view" onClick={() => fetchHistoryDetails(historyId)}>
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No history records found.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <button className="swal-btn" onClick={() => setIsHistoryListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* 2. INDIVIDUAL HISTORY DETAILS POPUP */}
//       {isHistoryDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsHistoryDetailModalOpen(false)}>
//           <div className="swal-popup" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">History Details View</div>
//             <div style={{ textAlign: 'left', marginTop: '10px', marginBottom: '24px' }}>
//               {loadingHistoryDetail ? (
//                 <p style={{ textAlign: 'center', padding: '20px' }}>Loading history details...</p>
//               ) : historyDetails ? (
//                 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <p><strong>ID:</strong> {historyDetails.id || historyDetails._id || 'N/A'}</p>
//                   <p><strong>Action Type:</strong> {historyDetails.actionType || 'N/A'}</p>
//                   <p><strong>Description:</strong> {historyDetails.description || 'N/A'}</p>
//                   <p><strong>IP Address:</strong> {historyDetails.ipAddress || 'N/A'}</p>
//                   <p><strong>Date:</strong> {
//                     (() => {
//                       const detailDate = historyDetails.createdAt || historyDetails.date || historyDetails.timestamp;
//                       if (!detailDate) return 'N/A';
//                       const pDate = new Date(detailDate);
//                       return !isNaN(pDate.getTime()) ? pDate.toLocaleString() : detailDate;
//                     })()
//                   }</p>
//                 </div>
//               ) : (
//                 <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load history data.</p>
//               )}
//             </div>
//             <button className="swal-btn" onClick={() => setIsHistoryDetailModalOpen(false)}>Back to List</button>
//           </div>
//         </div>
//       )}

//       {/* 3. PRESCRIPTIONS LIST MODAL */}
//       {isPrescriptionsListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsPrescriptionsListModalOpen(false)}>
//           <div className="swal-popup" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Prescriptions List</div>
//             <input 
//               type="text" 
//               className="search-box" 
//               placeholder="🔍 Search prescriptions..." 
//               value={prescriptionSearchTerm} 
//               onChange={(e) => setPrescriptionSearchTerm(e.target.value)} 
//             />
//             <div style={{ overflowX: 'auto', marginBottom: '24px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//                 <thead>
//                   <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.85rem' }}>
//                     <th style={{ padding: '12px' }}>ID</th>
//                     <th style={{ padding: '12px' }}>Doctor Name</th>
//                     <th style={{ padding: '12px' }}>Date</th>
//                     <th style={{ padding: '12px' }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loadingPrescriptionsList ? (
//                     <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>Loading prescriptions list...</td></tr>
//                   ) : filteredPrescriptionsList.length > 0 ? (
//                     filteredPrescriptionsList.map((item, idx) => {
//                       const prescriptionId = item.id || item._id || idx + 1;
//                       const doctorName = item.doctorName || item.title || item.name || 'N/A';
//                       const rawDate = item.date || item.createdAt || item.createdDate || item.prescriptionDate;
//                       let formattedDate = 'N/A';
//                       if (rawDate) {
//                         const parsedDate = new Date(rawDate);
//                         if (!isNaN(parsedDate.getTime())) {
//                           formattedDate = parsedDate.toLocaleDateString();
//                         } else {
//                           formattedDate = rawDate;
//                         }
//                       }

//                       return (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
//                           <td style={{ padding: '12px', fontWeight: 600, color: '#1e293b' }}>{prescriptionId}</td>
//                           <td style={{ padding: '12px', color: '#475569' }}>{doctorName}</td>
//                           <td style={{ padding: '12px', color: '#475569' }}>{formattedDate}</td>
//                           <td style={{ padding: '12px' }}>
//                             <button className="btn-view" onClick={() => fetchPrescriptionDetails(prescriptionId)}>
//                               View
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No prescriptions found.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <button className="swal-btn" onClick={() => setIsPrescriptionsListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* 4. INDIVIDUAL PRESCRIPTION DETAILS MODAL */}
//       {isPrescriptionDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsPrescriptionDetailModalOpen(false)}>
//           <div className="swal-popup" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Prescription Details</div>
//             <div style={{ textAlign: 'left', marginTop: '10px', marginBottom: '24px' }}>
//               {loadingPrescriptionDetail ? (
//                 <p style={{ textAlign: 'center', padding: '20px' }}>Loading prescription details...</p>
//               ) : prescriptionDetails ? (
//                 <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                   <p><strong>ID:</strong> {prescriptionDetails.id || prescriptionDetails._id || 'N/A'}</p>
//                   <p><strong>Doctor Name:</strong> {prescriptionDetails.doctorName || prescriptionDetails.title || prescriptionDetails.name || 'N/A'}</p>
//                   <p><strong>Description:</strong> {prescriptionDetails.description || prescriptionDetails.notes || 'N/A'}</p>
//                   <p><strong>Date:</strong> {
//                     (() => {
//                       const pDateVal = prescriptionDetails.date || prescriptionDetails.createdAt;
//                       if (!pDateVal) return 'N/A';
//                       const parsed = new Date(pDateVal);
//                       return !isNaN(parsed.getTime()) ? parsed.toLocaleDateString() : pDateVal;
//                     })()
//                   }</p>
//                 </div>
//               ) : (
//                 <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load prescription data.</p>
//               )}
//             </div>
//             <button className="swal-btn" onClick={() => setIsPrescriptionDetailModalOpen(false)}>Back to List</button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }



//2.


// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";
// import { useCart } from "../User/CartContext";
// import "../styles/dashboardsprofiles.css";

// const COLORS = ["#0fa462", "#3b82f6", "#f59e0b"];

// export default function Dashboard() {
//   const { cartItems } = useCart();
//   const location = useLocation();

//   const [openDashboard, setOpenDashboard] = useState(true);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [user, setUser] = useState(null);

//   // ---------- GRAPH STATES ----------
//   const [currentMonth, setCurrentMonth] = useState("Select Period");
//   const [selectedGlucoseData, setSelectedGlucoseData] = useState([]);
//   const [selectedWeightData, setSelectedWeightData] = useState([]);
//   const [selectedBpData, setSelectedBpData] = useState([]);

//   // ---------- NOTIFICATION & SETTINGS STATES ----------
//   const [unreadCount, setUnreadCount] = useState(2);
//   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
//   const [loadingSettings, setLoadingSettings] = useState(false);
//   const [settingsData, setSettingsData] = useState({
//     emailNotifications: true,
//     smsNotifications: true,
//     twoFactorAuth: false,
//     themeMode: "Light",
//     language: "English"
//   });

//   // ---------- MODAL & API STATES ----------
//   const [isMedModalOpen, setIsMedModalOpen] = useState(false);
//   const [isTestReportModalOpen, setIsTestReportModalOpen] = useState(false);
//   const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
//   const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
//   const [monthlyProgressData, setMonthlyProgressData] = useState([]);

//   // ---------- HELP & SUPPORT LIST & DETAIL STATES ----------
//   const [isSupportListModalOpen, setIsSupportListModalOpen] = useState(false);
//   const [supportList, setSupportList] = useState([]);
//   const [loadingSupportList, setLoadingSupportList] = useState(false);
//   const [supportSearchTerm, setSupportSearchTerm] = useState("");

//   const [isSupportDetailModalOpen, setIsSupportDetailModalOpen] = useState(false);
//   const [supportDetails, setSupportDetails] = useState(null);
//   const [loadingSupportDetail, setLoadingSupportDetail] = useState(false);

//   // ---------- PRESCRIPTIONS LIST & DETAIL STATES ----------
//   const [isPrescriptionsListModalOpen, setIsPrescriptionsListModalOpen] = useState(false);
//   const [prescriptionsList, setPrescriptionsList] = useState([]);
//   const [loadingPrescriptionsList, setLoadingPrescriptionsList] = useState(false);
//   const [prescriptionSearchTerm, setPrescriptionSearchTerm] = useState('');

//   const [isPrescriptionDetailModalOpen, setIsPrescriptionDetailModalOpen] = useState(false);
//   const [prescriptionDetails, setPrescriptionDetails] = useState(null);
//   const [loadingPrescriptionDetail, setLoadingPrescriptionDetail] = useState(false);

//   // ---------- HISTORY LIST & DETAIL STATES ----------
//   const [isHistoryListModalOpen, setIsHistoryListModalOpen] = useState(false);
//   const [historyList, setHistoryList] = useState([]);
//   const [loadingHistoryList, setLoadingHistoryList] = useState(false);
//   const [historySearchTerm, setHistorySearchTerm] = useState('');

//   const [isHistoryDetailModalOpen, setIsHistoryDetailModalOpen] = useState(false);
//   const [historyDetails, setHistoryDetails] = useState(null);
//   const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);

//   // ---------- HANDLERS ----------
//   const handleNotifClick = () => {
//     alert("Notifications clicked!");
//     setUnreadCount(0);
//   };

//   // ---------- FETCH & OPEN SETTINGS MODAL ----------
//   const fetchSettings = async () => {
//     try {
//       setLoadingSettings(true);
//       setIsSettingsModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllSettings");
//       const data = await response.json();
//       if (data) {
//         const actualSettings = Array.isArray(data) ? data[0] : (data.data || data);
//         if (actualSettings) {
//           setSettingsData({
//             emailNotifications: actualSettings.emailNotifications ?? true,
//             smsNotifications: actualSettings.smsNotifications ?? true,
//             twoFactorAuth: actualSettings.twoFactorAuth ?? false,
//             themeMode: actualSettings.themeMode || "Light",
//             language: actualSettings.language || "English"
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     } finally {
//       setLoadingSettings(false);
//     }
//   };

//   const handleSettingsClick = (e) => {
//     if (e) e.preventDefault();
//     fetchSettings();
//   };

//   // ---------- SAVE SETTINGS API ----------
//   const handleSaveSettings = async () => {
//     try {
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/UpdateSettings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(settingsData)
//       });
//       const result = await response.json();
//       if (result.success !== false) {
//         alert("Settings updated successfully!");
//         setIsSettingsModalOpen(false);
//       } else {
//         alert("Failed to update settings.");
//       }
//     } catch (error) {
//       console.error('Error updating settings:', error);
//       alert("An error occurred while updating settings.");
//     }
//   };

//   // ---------- FETCH: HELP & SUPPORT LIST ----------
//   const fetchSupportList = async () => {
//     try {
//       setLoadingSupportList(true);
//       setIsSupportListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllticketHelpSupport");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || []);
//       setSupportList(rawList);
//     } catch (error) {
//       console.error('Error fetching support list:', error);
//       setSupportList([]);
//     } finally {
//       setLoadingSupportList(false);
//     }
//   };

//   const handleOpenSupportList = (e) => {
//     if (e) e.preventDefault();
//     fetchSupportList();
//   };

//   // ---------- FETCH: HELP & SUPPORT DETAILS BY ID ----------
//   const fetchSupportDetails = async (id) => {
//     try {
//       setLoadingSupportDetail(true);
//       setIsSupportDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsTicket?id=${id}`);
//       const data = await response.json();
//       setSupportDetails(data);
//     } catch (error) {
//       console.error('Error fetching support details:', error);
//       setSupportDetails(null);
//     } finally {
//       setLoadingSupportDetail(false);
//     }
//   };

//   // ---------- FETCH: ALL HISTORY LIST ----------
//   const fetchHistoryList = async () => {
//     try {
//       setLoadingHistoryList(true);
//       setIsHistoryListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllHistory");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || []);
//       setHistoryList(rawList);
//     } catch (error) {
//       console.error('Error fetching history list:', error);
//       setHistoryList([]);
//     } finally {
//       setLoadingHistoryList(false);
//     }
//   };

//   const handleOpenHistoryList = (e) => {
//     if (e) e.preventDefault();
//     fetchHistoryList();
//   };

//   // ---------- FETCH: SINGLE HISTORY DETAILS BY ID ----------
//   const fetchHistoryDetails = async (id) => {
//     try {
//       setLoadingHistoryDetail(true);
//       setIsHistoryDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsHistory?id=${id}`);
//       const data = await response.json();
//       setHistoryDetails(data);
//     } catch (error) {
//       console.error('Error fetching history details:', error);
//       setHistoryDetails(null);
//     } finally {
//       setLoadingHistoryDetail(false);
//     }
//   };

//   // ---------- FETCH: ALL PRESCRIPTIONS LIST ----------
//   const fetchPrescriptionsList = async () => {
//     try {
//       setLoadingPrescriptionsList(true);
//       setIsPrescriptionsListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllPrescriptions");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || []);
//       setPrescriptionsList(rawList);
//     } catch (error) {
//       console.error('Error fetching prescriptions list:', error);
//       setPrescriptionsList([]);
//     } finally {
//       setLoadingPrescriptionsList(false);
//     }
//   };

//   const handleOpenPrescriptionsList = (e) => {
//     if (e) e.preventDefault();
//     fetchPrescriptionsList();
//   };

//   // ---------- FETCH: SINGLE PRESCRIPTION DETAILS BY ID ----------
//   const fetchPrescriptionDetails = async (id) => {
//     try {
//       setLoadingPrescriptionDetail(true);
//       setIsPrescriptionDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsPrescription?id=${id}`);
//       const data = await response.json();
//       setPrescriptionDetails(data);
//     } catch (error) {
//       console.error('Error fetching prescription details:', error);
//       setPrescriptionDetails(null);
//     } finally {
//       setLoadingPrescriptionDetail(false);
//     }
//   };

//   // ---------- FETCH: MONTHLY PROGRESS ----------
//   const fetchMonthlyProgress = async () => {
//     try {
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMonthlyProgress");
//       const data = await response.json();
//       const actualData = Array.isArray(data) ? data : (data.data || data.result || []);
      
//       if (actualData.length > 0) {
//         setMonthlyProgressData(actualData);
//         if (currentMonth === "Select Period") {
//           const firstItem = actualData[0];
//           const periodName = firstItem.month || firstItem.monthYear || "Period 1";
//           const bpVal = firstItem.bpStatus || firstItem.status || 'Normal';
          
//           setCurrentMonth(periodName);
//           setSelectedGlucoseData(firstItem.glucoseData || [{ day: 'Avg', value: parseInt(firstItem.avgGlucose) || 120 }]);
//           setSelectedWeightData(firstItem.weightData || [{ date: periodName, weight: parseFloat(firstItem.weight) || 150 }]);
//           setSelectedBpData(firstItem.bpData || [{ label: bpVal, value: 100 }]);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching monthly progress:', error);
//     }
//   };

//   const filteredSupportList = supportList.filter(item => {
//     const query = supportSearchTerm.toLowerCase();
//     const subject = item.subject || "";
//     const description = item.description || "";
//     const status = item.status || "";
//     return subject.toLowerCase().includes(query) || description.toLowerCase().includes(query) || status.toLowerCase().includes(query);
//   });

//   const filteredPrescriptionsList = prescriptionsList.filter(item => {
//     const title = item.title || item.doctorName || item.patientName || item.name || '';
//     return title.toLowerCase().includes(prescriptionSearchTerm.toLowerCase());
//   });

//   const filteredHistoryList = historyList.filter(item => {
//     const queryStr = `${item.actionType || ''} ${item.description || ''} ${item.ipAddress || ''}`;
//     return queryStr.toLowerCase().includes(historySearchTerm.toLowerCase());
//   });

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     fetchMonthlyProgress();
//   }, []);

//   const getInitial = () => {
//     if (user && user.firstName) return user.firstName.charAt(0).toUpperCase();
//     return "G";
//   };

//   return (
//     <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: "'Inter', sans-serif" }}>
      
//       <style>{`
//         .modern-sidebar { width: 270px; height: 100vh; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 18px; position: fixed; left: 0; top: 0; z-index: 1000; box-sizing: border-box; overflow-y: auto; }
//         .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; margin-bottom: 18px; text-decoration: none; }
//         .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
//         .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
//         .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; color: #475569; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
//         .modern-nav-item:hover { background-color: #f0fdf4; color: #0fa462; }
//         .modern-nav-item.active { background-color: #0fa462; color: #ffffff; box-shadow: 0 4px 12px rgba(15, 164, 98, 0.2); }
//         .modern-link-content { display: flex; align-items: center; gap: 12px; }
//         .modern-link-content i { font-size: 1.1rem; width: 20px; text-align: center; }
//         .modern-dropdown-toggle { border: 1px solid #f1f5f9; background-color: #f8fafc; }
//         .modern-submenu { list-style: none; padding: 6px 0 6px 32px; display: flex; flex-direction: column; gap: 4px; }
//         .modern-submenu a, .modern-submenu button { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; background: none; border: none; text-align: left; width: 100%; cursor: pointer; transition: all 0.15s ease; }
//         .modern-submenu a:hover, .modern-submenu button:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
//         .modern-sidebar-footer { margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; flex-direction: column; gap: 10px; }
//         .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
//         .modern-avatar { width: 38px; height: 38px; background-color: #dcfce7; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
//         .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
//         .modern-user-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
//         .modern-user-role { font-size: 0.72rem; color: #64748b; font-weight: 500; }
//         .modern-logout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #ef4444; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 8px; transition: background 0.2s; }
//         .modern-logout-btn:hover { background-color: #fef2f2; }
//         .modern-main-layout { margin-left: 270px; width: calc(100% - 270px); padding: 32px; box-sizing: border-box; }
//         .stat-card { padding: 22px; border-radius: 14px; color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); transition: transform 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px; }
//         .stat-card:hover { transform: translateY(-3px); }
//         .swal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
//         .swal-popup { background: white; padding: 32px; border-radius: 20px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: left; }
//         .swal-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 20px; text-align: center; }
//         .swal-btn { background-color: #0fa462; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; }
//         .swal-btn:hover { background-color: #0b824f; }
//         .btn-view { background-color: #f0fdf4; color: #0fa462; border: 1px solid #bbf7d0; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; }
//         .btn-view:hover { background-color: #0fa462; color: white; }
//         .search-box { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; margin-bottom: 20px; outline: none; box-sizing: border-box; font-size: 0.95rem; }
//       `}</style>

//       {/* ---------- SIDEBAR ---------- */}
//       <div className="modern-sidebar">
//         <div>
//           <Link to="/dashboards" className="modern-brand">
//             <img src="/AKMedizostore.png" alt="logo" width="36" height="36" style={{ objectFit: 'contain' }} />
//             <span>AK Medistore</span>
//           </Link>

//           <ul className="modern-nav-menu">
//             <li>
//               <button
//                 className={`modern-nav-item ${openDashboard ? "active" : ""}`}
//                 onClick={() => setOpenDashboard(!openDashboard)}
//               >
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>

//               {openDashboard && (
//                 <ul className="modern-submenu">
//                   <li><button onClick={() => setIsMedModalOpen(true)}>Medication Tracker</button></li>
//                   <li><button onClick={() => setIsTestReportModalOpen(true)}>Test Reports</button></li>
//                   <li><button onClick={() => setIsHealthModalOpen(true)}>Health History</button></li>
//                   <li><button onClick={() => setIsMonthlyModalOpen(true)}>Monthly Progress</button></li>
//                   <li><button onClick={handleOpenPrescriptionsList}>Prescriptions</button></li>
//                   <li><button onClick={handleOpenHistoryList}>History</button></li>
//                   <li><button onClick={handleOpenSupportList}>Help & Support</button></li>
//                   <li><button onClick={handleSettingsClick} style={{ background: 'none', border: 'none', padding: '7px 12px', textAlign: 'left', width: '100%', cursor: 'pointer', color: '#64748b' }}>Settings</button></li>
//                   <li><Link to="/labtests">LAB TEST</Link></li>
//                 </ul>
//               )}
//             </li>

//             <li>
//               <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openMasterUpdate && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/deliveryaddress">Delivery Address</Link></li>
//                   <li><Link to="/addbankrefundableamounts">Refund Bank Details</Link></li>
//                   <li><Link to="/bankdetailsrefundlist">Bankdetailsrefundlist</Link></li>
//                 </ul>
//               )}
//             </li>

//             <li><Link to="/medicinedisplay" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
//             <li>
//               <Link to="/carts" className="modern-nav-item">
//                 <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
//                 {cartItems.length > 0 && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>{cartItems.length}</span>}
//               </Link>
//             </li>
//             <li><Link to="/order" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div></Link></li>
//             <li><Link to="/customerfeedback" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-comments"></i><span>Customer Feedback</span></div></Link></li>
//             <li><Link to="/unavailablemedicines" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-ban"></i><span>Unavailable Medicines</span></div></Link></li>
//             <li><Link to="/customerprofile" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div></Link></li>
//           </ul>
//         </div>

//         <div className="modern-sidebar-footer">
//           <div className="modern-user-card">
//             <div className="modern-avatar">{getInitial()}</div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
//               <span className="modern-user-role">Customer Account</span>
//             </div>
//           </div>
//           <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
//         </div>
//       </div>

//       {/* ---------- MAIN CONTENT AREA ---------- */}
//       <div className="modern-main-layout">
//         <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//           <div>
//             <h2 style={{ margin: 0, color: "#0f172a", fontWeight: "700", fontSize: "1.75rem", letterSpacing: "-0.5px" }}>
//               Welcome back, Gautam Dev 👋
//             </h2>
//             <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>
//               Active Period View: <strong style={{ color: "#0fa462" }}>{currentMonth}</strong>
//             </p>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//             <div 
//               style={{ position: 'relative', cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
//               onClick={handleNotifClick}
//             >
//               🔔
//               {unreadCount > 0 && (
//                 <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
//                   {unreadCount}
//                 </span>
//               )}
//             </div>

//             <div 
//               style={{ cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//               onClick={handleSettingsClick}
//             >
//               ⚙️
//             </div>
//           </div>
//         </header>

//         {/* Top Action Cards */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "18px", marginBottom: "30px" }}>
//           <div onClick={() => setIsMedModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>💊</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Medication Tracker</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>View prescriptions</div>
//             </div>
//           </div>
//           <div onClick={() => setIsTestReportModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🔬</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Test Reports</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Lab diagnostics</div>
//             </div>
//           </div>
//           <div onClick={() => setIsHealthModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🩺</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Health History</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Medical background</div>
//             </div>
//           </div>
//           <div onClick={() => setIsMonthlyModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>📈</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Monthly Progress</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Track improvements</div>
//             </div>
//           </div>
//           <div onClick={() => window.location.href = '/labtests'} className="stat-card" style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🧪</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Lab Test</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Book new tests</div>
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Charts Section */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Glucose ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={180}>
//               <BarChart data={selectedGlucoseData}>
//                 <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Weight Progress ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={selectedWeightData}>
//                 <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 2', 'dataMax + 2']} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 10px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Pressure Status ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={140}>
//               <PieChart>
//                 <Pie data={selectedBpData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={50}>
//                   {selectedBpData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* ================= MODALS SECTION ================= */}

//       {/* SETTINGS MODAL */}
//       {isSettingsModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Account Settings</div>
//             {loadingSettings ? (
//               <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading settings...</p>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input type="checkbox" checked={settingsData.emailNotifications} onChange={(e) => setSettingsData({...settingsData, emailNotifications: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
//                   <span>Enable Email Notifications</span>
//                 </label>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input type="checkbox" checked={settingsData.smsNotifications} onChange={(e) => setSettingsData({...settingsData, smsNotifications: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
//                   <span>Enable SMS Notifications</span>
//                 </label>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input type="checkbox" checked={settingsData.twoFactorAuth} onChange={(e) => setSettingsData({...settingsData, twoFactorAuth: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
//                   <span>Two-Factor Authentication (2FA)</span>
//                 </label>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//                   <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>Theme Mode:</label>
//                   <select value={settingsData.themeMode} onChange={(e) => setSettingsData({...settingsData, themeMode: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
//                     <option value="Light">Light Mode</option>
//                     <option value="Dark">Dark Mode</option>
//                   </select>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//                   <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>Language:</label>
//                   <select value={settingsData.language} onChange={(e) => setSettingsData({...settingsData, language: e.target.value})} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
//                     <option value="English">English</option>
//                     <option value="Hindi">Hindi</option>
//                   </select>
//                 </div>
//               </div>
//             )}
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button className="swal-btn" onClick={handleSaveSettings}>Save Changes</button>
//               <button className="swal-btn" style={{ backgroundColor: '#64748b' }} onClick={() => setIsSettingsModalOpen(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* HELP & SUPPORT LIST MODAL */}
//       {isSupportListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsSupportListModalOpen(false)}>
//           <div className="swal-popup" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Help & Support Tickets</div>
//             <input 
//               type="text" 
//               className="search-box" 
//               placeholder="🔍 Search tickets by subject, description or status..." 
//               value={supportSearchTerm}
//               onChange={(e) => setSupportSearchTerm(e.target.value)}
//             />

//             {loadingSupportList ? (
//               <p style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading tickets...</p>
//             ) : (
//               <div style={{ overflowX: 'auto', maxHeight: '400px' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//                   <thead>
//                     <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
//                       <th style={{ padding: '12px', fontSize: '0.85rem', color: '#475569' }}>ID</th>
//                       <th style={{ padding: '12px', fontSize: '0.85rem', color: '#475569' }}>Subject</th>
//                       <th style={{ padding: '12px', fontSize: '0.85rem', color: '#475569' }}>Status</th>
//                       <th style={{ padding: '12px', fontSize: '0.85rem', color: '#475569', textAlign: 'right' }}>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredSupportList.length > 0 ? (
//                       filteredSupportList.map((item, idx) => {
//                         const tId = item.ticketId || item.id || idx + 1;
//                         return (
//                           <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                             <td style={{ padding: '12px', fontWeight: 600 }}>{tId}</td>
//                             <td style={{ padding: '12px', color: '#1e293b' }}>{item.subject || "N/A"}</td>
//                             <td style={{ padding: '12px' }}>
//                               <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: item.status === "Resolved" ? "#dcfce7" : "#fef3c7", color: item.status === "Resolved" ? "#166534" : "#92400e" }}>
//                                 {item.status || "Pending"}
//                               </span>
//                             </td>
//                             <td style={{ padding: '12px', textAlign: 'right' }}>
//                               <button className="btn-view" onClick={() => fetchSupportDetails(tId)}>View Details</button>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     ) : (
//                       <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No support tickets found.</td></tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//             <div style={{ marginTop: '20px' }}>
//               <button className="swal-btn" style={{ backgroundColor: '#64748b' }} onClick={() => setIsSupportListModalOpen(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* HELP & SUPPORT DETAILS MODAL */}
//       {isSupportDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsSupportDetailModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Ticket Details</div>
//             {loadingSupportDetail ? (
//               <p style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Loading details...</p>
//             ) : supportDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
//                 <p style={{ margin: 0 }}><strong>Ticket ID:</strong> {supportDetails.ticketId || supportDetails.id || "N/A"}</p>
//                 <p style={{ margin: 0 }}><strong>Subject:</strong> {supportDetails.subject || "N/A"}</p>
//                 <p style={{ margin: 0 }}><strong>Description:</strong> {supportDetails.description || "N/A"}</p>
//                 <p style={{ margin: 0 }}><strong>Status:</strong> {supportDetails.status || "N/A"}</p>
//                 <p style={{ margin: 0 }}><strong>Priority:</strong> {supportDetails.priority || "N/A"}</p>
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>Failed to load ticket details.</p>
//             )}
//             <button className="swal-btn" onClick={() => setIsSupportDetailModalOpen(false)}>Back to List</button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

//3/
// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";
// import { useCart } from "../User/CartContext";
// import "../styles/dashboardsprofiles.css";

// const COLORS = ["#0fa462", "#3b82f6", "#f59e0b"];

// export default function Dashboard() {
//   const { cartItems } = useCart();
//   const location = useLocation();

//   const [openDashboard, setOpenDashboard] = useState(true);
//   const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
//   const [user, setUser] = useState(null);

//   // ---------- GRAPH STATES ----------
//   const [currentMonth, setCurrentMonth] = useState("Select Period");
//   const [selectedGlucoseData, setSelectedGlucoseData] = useState([]);
//   const [selectedWeightData, setSelectedWeightData] = useState([]);
//   const [selectedBpData, setSelectedBpData] = useState([]);

//   // ---------- NOTIFICATION & SETTINGS STATES ----------
//   const [unreadCount, setUnreadCount] = useState(2);
//   const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
//   const [loadingSettings, setLoadingSettings] = useState(false);
//   const [settingsData, setSettingsData] = useState({
//     emailNotifications: true,
//     smsNotifications: true,
//     twoFactorAuth: false,
//     themeMode: "Light",
//     language: "English"
//   });

//   // ---------- MONTHLY PROGRESS MODAL ----------
//   const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
//   const [monthlyProgressData, setMonthlyProgressData] = useState([]);

//   // ---------- HELP & SUPPORT LIST & DETAIL STATES ----------
//   const [isSupportListModalOpen, setIsSupportListModalOpen] = useState(false);
//   const [supportList, setSupportList] = useState([]);
//   const [loadingSupportList, setLoadingSupportList] = useState(false);
//   const [supportSearchTerm, setSupportSearchTerm] = useState("");

//   const [isSupportDetailModalOpen, setIsSupportDetailModalOpen] = useState(false);
//   const [supportDetails, setSupportDetails] = useState(null);
//   const [loadingSupportDetail, setLoadingSupportDetail] = useState(false);

//   // ---------- PRESCRIPTIONS LIST & DETAIL STATES ----------
//   const [isPrescriptionsListModalOpen, setIsPrescriptionsListModalOpen] = useState(false);
//   const [prescriptionsList, setPrescriptionsList] = useState([]);
//   const [loadingPrescriptionsList, setLoadingPrescriptionsList] = useState(false);
//   const [prescriptionSearchTerm, setPrescriptionSearchTerm] = useState('');

//   const [isPrescriptionDetailModalOpen, setIsPrescriptionDetailModalOpen] = useState(false);
//   const [prescriptionDetails, setPrescriptionDetails] = useState(null);
//   const [loadingPrescriptionDetail, setLoadingPrescriptionDetail] = useState(false);

//   // ---------- HISTORY LIST & DETAIL STATES ----------
//   const [isHistoryListModalOpen, setIsHistoryListModalOpen] = useState(false);
//   const [historyList, setHistoryList] = useState([]);
//   const [loadingHistoryList, setLoadingHistoryList] = useState(false);
//   const [historySearchTerm, setHistorySearchTerm] = useState('');

//   const [isHistoryDetailModalOpen, setIsHistoryDetailModalOpen] = useState(false);
//   const [historyDetails, setHistoryDetails] = useState(null);
//   const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);

//   // ---------- MEDICATION TRACKER LIST & DETAIL STATES ----------
//   const [isMedListModalOpen, setIsMedListModalOpen] = useState(false);
//   const [medList, setMedList] = useState([]);
//   const [loadingMedList, setLoadingMedList] = useState(false);
//   const [medSearchTerm, setMedSearchTerm] = useState('');

//   const [isMedDetailModalOpen, setIsMedDetailModalOpen] = useState(false);
//   const [medDetails, setMedDetails] = useState(null);
//   const [loadingMedDetail, setLoadingMedDetail] = useState(false);

//   // ---------- TEST REPORTS LIST & DETAIL STATES ----------
//   const [isTestListModalOpen, setIsTestListModalOpen] = useState(false);
//   const [testList, setTestList] = useState([]);
//   const [loadingTestList, setLoadingTestList] = useState(false);
//   const [testSearchTerm, setTestSearchTerm] = useState('');

//   const [isTestDetailModalOpen, setIsTestDetailModalOpen] = useState(false);
//   const [testDetails, setTestDetails] = useState(null);
//   const [loadingTestDetail, setLoadingTestDetail] = useState(false);

//   // ---------- HEALTH HISTORY LIST & DETAIL STATES ----------
//   const [isHealthListModalOpen, setIsHealthListModalOpen] = useState(false);
//   const [healthList, setHealthList] = useState([]);
//   const [loadingHealthList, setLoadingHealthList] = useState(false);
//   const [healthSearchTerm, setHealthSearchTerm] = useState('');

//   const [isHealthDetailModalOpen, setIsHealthDetailModalOpen] = useState(false);
//   const [healthDetails, setHealthDetails] = useState(null);
//   const [loadingHealthDetail, setLoadingHealthDetail] = useState(false);

//   // ---------- HANDLERS ----------
//   const handleNotifClick = () => {
//     alert("Notifications clicked!");
//     setUnreadCount(0);
//   };

//   const fetchSettings = async () => {
//     try {
//       setLoadingSettings(true);
//       setIsSettingsModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllSettings");
//       const data = await response.json();
//       if (data) {
//         const actualSettings = Array.isArray(data) ? data[0] : (data.data || data.result || data);
//         if (actualSettings) {
//           setSettingsData({
//             emailNotifications: actualSettings.emailNotifications ?? true,
//             smsNotifications: actualSettings.smsNotifications ?? true,
//             twoFactorAuth: actualSettings.twoFactorAuth ?? false,
//             themeMode: actualSettings.themeMode || "Light",
//             language: actualSettings.language || "English"
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     } finally {
//       setLoadingSettings(false);
//     }
//   };

//   const handleSettingsClick = (e) => {
//     if (e) e.preventDefault();
//     fetchSettings();
//   };

//   const handleSaveSettings = async () => {
//     try {
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/UpdateSettings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(settingsData)
//       });
//       const result = await response.json();
//       if (result.success !== false) {
//         alert("Settings updated successfully!");
//         setIsSettingsModalOpen(false);
//       } else {
//         alert("Failed to update settings.");
//       }
//     } catch (error) {
//       console.error('Error updating settings:', error);
//       alert("An error occurred while updating settings.");
//     }
//   };

//   // Medication Fetchers
//   const fetchMedList = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       setLoadingMedList(true);
//       setIsMedListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMedicationtracker");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || data.medications || []);
//       setMedList(Array.isArray(rawList) ? rawList : []);
//     } catch (error) {
//       console.error('Error fetching medication list:', error);
//       setMedList([]);
//     } finally {
//       setLoadingMedList(false);
//     }
//   };

//   const fetchMedDetails = async (id) => {
//     try {
//       setLoadingMedDetail(true);
//       setIsMedDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsMedicationtracker?id=${id}`);
//       const data = await response.json();
//       const itemData = data.data || data.result || data;
//       setMedDetails(Array.isArray(itemData) ? itemData[0] : itemData);
//     } catch (error) {
//       console.error('Error fetching medication details:', error);
//       setMedDetails(null);
//     } finally {
//       setLoadingMedDetail(false);
//     }
//   };

//   // Test Reports Fetchers
//   const fetchTestList = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       setLoadingTestList(true);
//       setIsTestListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllTestReports");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || data.reports || []);
//       setTestList(Array.isArray(rawList) ? rawList : []);
//     } catch (error) {
//       console.error('Error fetching test reports list:', error);
//       setTestList([]);
//     } finally {
//       setLoadingTestList(false);
//     }
//   };

//   const fetchTestDetails = async (id) => {
//     try {
//       setLoadingTestDetail(true);
//       setIsTestDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsTestReport?id=${id}`);
//       const data = await response.json();
//       const itemData = data.data || data.result || data;
//       setTestDetails(Array.isArray(itemData) ? itemData[0] : itemData);
//     } catch (error) {
//       console.error('Error fetching test details:', error);
//       setTestDetails(null);
//     } finally {
//       setLoadingTestDetail(false);
//     }
//   };

//   // Health History Fetchers
//   const fetchHealthList = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       setLoadingHealthList(true);
//       setIsHealthListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllHealthHistory");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || data.history || []);
//       setHealthList(Array.isArray(rawList) ? rawList : []);
//     } catch (error) {
//       console.error('Error fetching health history list:', error);
//       setHealthList([]);
//     } finally {
//       setLoadingHealthList(false);
//     }
//   };

//   const fetchHealthDetails = async (id) => {
//     try {
//       setLoadingHealthDetail(true);
//       setIsHealthDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsHealthHistory?id=${id}`);
//       const data = await response.json();
//       const itemData = data.data || data.result || data;
//       setHealthDetails(Array.isArray(itemData) ? itemData[0] : itemData);
//     } catch (error) {
//       console.error('Error fetching health details:', error);
//       setHealthDetails(null);
//     } finally {
//       setLoadingHealthDetail(false);
//     }
//   };

//   // Support, History, Prescriptions fetchers
//   const fetchSupportList = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       setLoadingSupportList(true);
//       setIsSupportListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllticketHelpSupport");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || data.tickets || []);
//       setSupportList(Array.isArray(rawList) ? rawList : []);
//     } catch (error) {
//       setSupportList([]);
//     } finally {
//       setLoadingSupportList(false);
//     }
//   };

//   const fetchSupportDetails = async (id) => {
//     try {
//       setLoadingSupportDetail(true);
//       setIsSupportDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsTicket?id=${id}`);
//       const data = await response.json();
//       const itemData = data.data || data.result || data;
//       setSupportDetails(Array.isArray(itemData) ? itemData[0] : itemData);
//     } catch (error) {
//       setSupportDetails(null);
//     } finally {
//       setLoadingSupportDetail(false);
//     }
//   };

//   const fetchHistoryList = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       setLoadingHistoryList(true);
//       setIsHistoryListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllHistory");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || data.history || []);
//       setHistoryList(Array.isArray(rawList) ? rawList : []);
//     } catch (error) {
//       setHistoryList([]);
//     } finally {
//       setLoadingHistoryList(false);
//     }
//   };

//   const fetchHistoryDetails = async (id) => {
//     try {
//       setLoadingHistoryDetail(true);
//       setIsHistoryDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsHistory?id=${id}`);
//       const data = await response.json();
//       const itemData = data.data || data.result || data;
//       setHistoryDetails(Array.isArray(itemData) ? itemData[0] : itemData);
//     } catch (error) {
//       setHistoryDetails(null);
//     } finally {
//       setLoadingHistoryDetail(false);
//     }
//   };

//   const fetchPrescriptionsList = async (e) => {
//     if (e) e.preventDefault();
//     try {
//       setLoadingPrescriptionsList(true);
//       setIsPrescriptionsListModalOpen(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllPrescriptions");
//       const data = await response.json();
//       const rawList = Array.isArray(data) ? data : (data.data || data.result || data.prescriptions || []);
//       setPrescriptionsList(Array.isArray(rawList) ? rawList : []);
//     } catch (error) {
//       setPrescriptionsList([]);
//     } finally {
//       setLoadingPrescriptionsList(false);
//     }
//   };

//   const fetchPrescriptionDetails = async (id) => {
//     try {
//       setLoadingPrescriptionDetail(true);
//       setIsPrescriptionDetailModalOpen(true);
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsPrescription?id=${id}`);
//       const data = await response.json();
//       const itemData = data.data || data.result || data;
//       setPrescriptionDetails(Array.isArray(itemData) ? itemData[0] : itemData);
//     } catch (error) {
//       setPrescriptionDetails(null);
//     } finally {
//       setLoadingPrescriptionDetail(false);
//     }
//   };

//   const fetchMonthlyProgress = async () => {
//     try {
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMonthlyProgress");
//       const data = await response.json();
//       const actualData = Array.isArray(data) ? data : (data.data || data.result || []);
//       if (actualData.length > 0) {
//         setMonthlyProgressData(actualData);
//         if (currentMonth === "Select Period") {
//           const firstItem = actualData[0];
//           const periodName = firstItem.month || firstItem.monthYear || "sept2026";
//           setCurrentMonth(periodName);
//           setSelectedGlucoseData(firstItem.glucoseData || [{ day: 'Avg', value: parseInt(firstItem.avgGlucose) || 120 }]);
//           setSelectedWeightData(firstItem.weightData || [{ date: periodName, weight: parseFloat(firstItem.weight) || 165 }]);
//           setSelectedBpData(firstItem.bpData || [{ label: 'Normal', value: 100 }]);
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//     fetchMonthlyProgress();
//   }, []);

//   const getInitial = () => (user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

//   return (
//     <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: "'Inter', sans-serif" }}>
//       <style>{`
//         .modern-sidebar { width: 270px; height: 100vh; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 18px; position: fixed; left: 0; top: 0; z-index: 1000; box-sizing: border-box; overflow-y: auto; }
//         .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; margin-bottom: 18px; text-decoration: none; }
//         .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
//         .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
//         .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; color: #475569; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
//         .modern-nav-item:hover { background-color: #f0fdf4; color: #0fa462; }
//         .modern-nav-item.active { background-color: #0fa462; color: #ffffff; box-shadow: 0 4px 12px rgba(15, 164, 98, 0.2); }
//         .modern-link-content { display: flex; align-items: center; gap: 12px; }
//         .modern-submenu { list-style: none; padding: 6px 0 6px 32px; display: flex; flex-direction: column; gap: 4px; }
//         .modern-submenu a, .modern-submenu button { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; background: none; border: none; text-align: left; width: 100%; cursor: pointer; transition: all 0.15s ease; }
//         .modern-submenu a:hover, .modern-submenu button:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
//         .modern-sidebar-footer { margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; flex-direction: column; gap: 10px; }
//         .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
//         .modern-avatar { width: 38px; height: 38px; background-color: #dcfce7; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
//         .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
//         .modern-user-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
//         .modern-user-role { font-size: 0.72rem; color: #64748b; font-weight: 500; }
//         .modern-logout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #ef4444; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 8px; transition: background 0.2s; }
//         .modern-logout-btn:hover { background-color: #fef2f2; }
//         .modern-main-layout { margin-left: 270px; width: calc(100% - 270px); padding: 32px; box-sizing: border-box; }
//         .stat-card { padding: 22px; border-radius: 14px; color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); transition: transform 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px; }
//         .stat-card:hover { transform: translateY(-3px); }
//         .swal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
//         .swal-popup { background: white; padding: 32px; border-radius: 20px; width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: left; }
//         .swal-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 20px; text-align: center; }
//         .swal-btn { background-color: #0fa462; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; }
//         .swal-btn:hover { background-color: #0b824f; }
//         .btn-view { background-color: #f0fdf4; color: #0fa462; border: 1px solid #bbf7d0; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; }
//         .btn-view:hover { background-color: #0fa462; color: white; }
//         .search-box { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; margin-bottom: 20px; outline: none; box-sizing: border-box; font-size: 0.95rem; }
//       `}</style>

//       {/* SIDEBAR */}
//       <div className="modern-sidebar">
//         <div>
//           <Link to="/dashboards" className="modern-brand">
//             <img src="/AKMedizostore.png" alt="logo" width="36" height="36" style={{ objectFit: 'contain' }} />
//             <span>AK Medistore</span>
//           </Link>

//           <ul className="modern-nav-menu">
//             <li>
//               <button className={`modern-nav-item ${openDashboard ? "active" : ""}`} onClick={() => setOpenDashboard(!openDashboard)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-chart-pie"></i>
//                   <span>Dashboard</span>
//                 </div>
//                 <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>

//               {openDashboard && (
//                 <ul className="modern-submenu">
//                   <li><button onClick={fetchMedList}>Medication Tracker</button></li>
//                   <li><button onClick={fetchTestList}>Test Reports</button></li>
//                   <li><button onClick={fetchHealthList}>Health History</button></li>
//                   <li><button onClick={() => setIsMonthlyModalOpen(true)}>Monthly Progress</button></li>
//                   <li><button onClick={fetchPrescriptionsList}>Prescriptions</button></li>
//                   <li><button onClick={fetchHistoryList}>History</button></li>
//                   <li><button onClick={fetchSupportList}>Help & Support</button></li>
//                   <li><button onClick={handleSettingsClick}>Settings</button></li>
//                   <li><Link to="/labtests">LAB TEST</Link></li>
//                 </ul>
//               )}
//             </li>

//             <li>
//               <button className="modern-nav-item" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
//                 <div className="modern-link-content">
//                   <i className="fa-solid fa-pen-to-square"></i>
//                   <span>Master Update</span>
//                 </div>
//                 <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
//               </button>
//               {openMasterUpdate && (
//                 <ul className="modern-submenu">
//                   <li><Link to="/deliveryaddress">Delivery Address</Link></li>
//                   <li><Link to="/addbankrefundableamounts">Refund Bank Details</Link></li>
//                   <li><Link to="/bankdetailsrefundlist">Bankdetailsrefundlist</Link></li>
//                 </ul>
//               )}
//             </li>

//             <li><Link to="/medicinedisplay" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
//             <li>
//               <Link to="/carts" className="modern-nav-item">
//                 <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
//                 {cartItems.length > 0 && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>{cartItems.length}</span>}
//               </Link>
//             </li>
//             <li><Link to="/order" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div></Link></li>
//             <li><Link to="/customerfeedback" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-comments"></i><span>Customer Feedback</span></div></Link></li>
//             <li><Link to="/unavailablemedicines" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-ban"></i><span>Unavailable Medicines</span></div></Link></li>
//             <li><Link to="/customerprofile" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div></Link></li>
//           </ul>
//         </div>

//         <div className="modern-sidebar-footer">
//           <div className="modern-user-card">
//             <div className="modern-avatar">{getInitial()}</div>
//             <div className="modern-user-info">
//               <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
//               <span className="modern-user-role">Customer Account</span>
//             </div>
//           </div>
//           <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className="modern-main-layout">
//         <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//           <div>
//             <h2 style={{ margin: 0, color: "#0f172a", fontWeight: "700", fontSize: "1.75rem", letterSpacing: "-0.5px" }}>
//               Welcome back, Gautam Dev 👋
//             </h2>
//             <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>
//               Active Period View: <strong style={{ color: "#0fa462" }}>{currentMonth}</strong>
//             </p>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//             <div style={{ position: 'relative', cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }} onClick={handleNotifClick}>
//               🔔
//               {unreadCount > 0 && (
//                 <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
//                   {unreadCount}
//                 </span>
//               )}
//             </div>
//             <div style={{ cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }} onClick={handleSettingsClick}>
//               ⚙️
//             </div>
//           </div>
//         </header>

//         {/* Top Action Cards */}
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "18px", marginBottom: "30px" }}>
//           <div onClick={fetchMedList} className="stat-card" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>💊</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Medication Tracker</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>View prescriptions</div>
//             </div>
//           </div>
//           <div onClick={fetchTestList} className="stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🔬</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Test Reports</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Lab diagnostics</div>
//             </div>
//           </div>
//           <div onClick={fetchHealthList} className="stat-card" style={{ background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🩺</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Health History</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Medical background</div>
//             </div>
//           </div>
//           <div onClick={() => setIsMonthlyModalOpen(true)} className="stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>📈</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Monthly Progress</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Track improvements</div>
//             </div>
//           </div>
//           <div onClick={() => window.location.href = '/labtests'} className="stat-card" style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}>
//             <div style={{ fontSize: "1.3rem" }}>🧪</div>
//             <div>
//               <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Lab Test</div>
//               <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Book new tests</div>
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Charts Section */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Glucose ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={180}>
//               <BarChart data={selectedGlucoseData}>
//                 <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Weight Progress ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={selectedWeightData}>
//                 <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
//                 <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 2', 'dataMax + 2']} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
//             <h4 style={{ margin: "0 0 10px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Pressure Status ({currentMonth})</h4>
//             <ResponsiveContainer width="100%" height={140}>
//               <PieChart>
//                 <Pie data={selectedBpData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={50}>
//                   {selectedBpData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* ================= MODALS SECTION ================= */}

//       {/* SETTINGS MODAL */}
//       {isSettingsModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Account Settings</div>
//             {loadingSettings ? (
//               <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading settings...</p>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input type="checkbox" checked={settingsData.emailNotifications} onChange={(e) => setSettingsData({...settingsData, emailNotifications: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
//                   <span>Enable Email Notifications</span>
//                 </label>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input type="checkbox" checked={settingsData.smsNotifications} onChange={(e) => setSettingsData({...settingsData, smsNotifications: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
//                   <span>Enable SMS Notifications</span>
//                 </label>
//                 <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
//                   <input type="checkbox" checked={settingsData.twoFactorAuth} onChange={(e) => setSettingsData({...settingsData, twoFactorAuth: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
//                   <span>Two-Factor Authentication (2FA)</span>
//                 </label>
//               </div>
//             )}
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button className="swal-btn" onClick={handleSaveSettings}>Save Changes</button>
//               <button style={{ background: '#e2e8f0', color: '#1e293b', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', width: '100%' }} onClick={() => setIsSettingsModalOpen(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MEDICATION TRACKER LIST MODAL */}
//       {isMedListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsMedListModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Medication Tracker</div>
//             <input type="text" className="search-box" placeholder="Search medications..." value={medSearchTerm} onChange={(e) => setMedSearchTerm(e.target.value)} />
//             {loadingMedList ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading medications...</p>
//             ) : (
//               <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
//                 {medList.length > 0 ? (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
//                     <thead>
//                       <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
//                         <th style={{ padding: '10px' }}>ID</th>
//                         <th style={{ padding: '10px' }}>Name / Details</th>
//                         <th style={{ padding: '10px' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {medList.map((item, idx) => (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                           <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
//                           <td style={{ padding: '10px' }}>{item.medicineName || item.name || item.title || JSON.stringify(item).substring(0, 30)}</td>
//                           <td style={{ padding: '10px' }}>
//                             <button className="btn-view" onClick={() => fetchMedDetails(item.id || idx + 1)}>View</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No medications found.</p>
//                 )}
//               </div>
//             )}
//             <button className="swal-btn" onClick={() => setIsMedListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* MEDICATION DETAIL MODAL (Fully Dynamic) */}
//       {isMedDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsMedDetailModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Medication Details</div>
//             {loadingMedDetail ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
//             ) : medDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                 {Object.entries(medDetails).map(([key, value]) => (
//                   <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
//                     <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
//                     <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
//             )}
//             <button className="swal-btn" onClick={() => setIsMedDetailModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* TEST REPORTS LIST MODAL */}
//       {isTestListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsTestListModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Test Reports</div>
//             <input type="text" className="search-box" placeholder="Search test reports..." value={testSearchTerm} onChange={(e) => setTestSearchTerm(e.target.value)} />
//             {loadingTestList ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading reports...</p>
//             ) : (
//               <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
//                 {testList.length > 0 ? (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
//                     <thead>
//                       <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
//                         <th style={{ padding: '10px' }}>ID</th>
//                         <th style={{ padding: '10px' }}>Test Name / Details</th>
//                         <th style={{ padding: '10px' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {testList.map((item, idx) => (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                           <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
//                           <td style={{ padding: '10px' }}>{item.testName || item.title || item.name || JSON.stringify(item).substring(0, 30)}</td>
//                           <td style={{ padding: '10px' }}>
//                             <button className="btn-view" onClick={() => fetchTestDetails(item.id || idx + 1)}>View</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No test reports found.</p>
//                 )}
//               </div>
//             )}
//             <button className="swal-btn" onClick={() => setIsTestListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* TEST REPORT DETAIL MODAL (Fully Dynamic) */}
//       {isTestDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsTestDetailModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Test Report Details</div>
//             {loadingTestDetail ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
//             ) : testDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                 {Object.entries(testDetails).map(([key, value]) => (
//                   <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
//                     <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
//                     <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
//             )}
//             <button className="swal-btn" onClick={() => setIsTestDetailModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* HEALTH HISTORY LIST MODAL */}
//       {isHealthListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsHealthListModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Health History</div>
//             <input type="text" className="search-box" placeholder="Search health history..." value={healthSearchTerm} onChange={(e) => setHealthSearchTerm(e.target.value)} />
//             {loadingHealthList ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading health history...</p>
//             ) : (
//               <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
//                 {healthList.length > 0 ? (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
//                     <thead>
//                       <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
//                         <th style={{ padding: '10px' }}>ID</th>
//                         <th style={{ padding: '10px' }}>Condition / Record</th>
//                         <th style={{ padding: '10px' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {healthList.map((item, idx) => (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                           <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
//                           <td style={{ padding: '10px' }}>{item.condition || item.title || item.name || JSON.stringify(item).substring(0, 30)}</td>
//                           <td style={{ padding: '10px' }}>
//                             <button className="btn-view" onClick={() => fetchHealthDetails(item.id || idx + 1)}>View</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No records found.</p>
//                 )}
//               </div>
//             )}
//             <button className="swal-btn" onClick={() => setIsHealthListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* HEALTH HISTORY DETAIL MODAL (Fully Dynamic) */}
//       {isHealthDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsHealthDetailModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Health Record Details</div>
//             {loadingHealthDetail ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
//             ) : healthDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                 {Object.entries(healthDetails).map(([key, value]) => (
//                   <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
//                     <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
//                     <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
//             )}
//             <button className="swal-btn" onClick={() => setIsHealthDetailModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* HELP & SUPPORT LIST MODAL */}
//       {isSupportListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsSupportListModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Help & Support Tickets</div>
//             <input type="text" className="search-box" placeholder="Search tickets..." value={supportSearchTerm} onChange={(e) => setSupportSearchTerm(e.target.value)} />
//             {loadingSupportList ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading tickets...</p>
//             ) : (
//               <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
//                 {supportList.length > 0 ? (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
//                     <thead>
//                       <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
//                         <th style={{ padding: '10px' }}>ID</th>
//                         <th style={{ padding: '10px' }}>Subject</th>
//                         <th style={{ padding: '10px' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {supportList.map((item, idx) => (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                           <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
//                           <td style={{ padding: '10px' }}>{item.subject || 'Ticket'}</td>
//                           <td style={{ padding: '10px' }}>
//                             <button className="btn-view" onClick={() => fetchSupportDetails(item.id || idx + 1)}>View</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No tickets found.</p>
//                 )}
//               </div>
//             )}
//             <button className="swal-btn" onClick={() => setIsSupportListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* SUPPORT DETAIL MODAL (Fully Dynamic) */}
//       {isSupportDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsSupportDetailModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Ticket Details</div>
//             {loadingSupportDetail ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
//             ) : supportDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                 {Object.entries(supportDetails).map(([key, value]) => (
//                   <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
//                     <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
//                     <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
//             )}
//             <button className="swal-btn" onClick={() => setIsSupportDetailModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* PRESCRIPTIONS LIST MODAL */}
//       {isPrescriptionsListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsPrescriptionsListModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Prescriptions</div>
//             <input type="text" className="search-box" placeholder="Search prescriptions..." value={prescriptionSearchTerm} onChange={(e) => setPrescriptionSearchTerm(e.target.value)} />
//             {loadingPrescriptionsList ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading prescriptions...</p>
//             ) : (
//               <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
//                 {prescriptionsList.length > 0 ? (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
//                     <thead>
//                       <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
//                         <th style={{ padding: '10px' }}>ID</th>
//                         <th style={{ padding: '10px' }}>Title</th>
//                         <th style={{ padding: '10px' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {prescriptionsList.map((item, idx) => (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                           <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
//                           <td style={{ padding: '10px' }}>{item.title || item.doctorName || 'Prescription'}</td>
//                           <td style={{ padding: '10px' }}>
//                             <button className="btn-view" onClick={() => fetchPrescriptionDetails(item.id || idx + 1)}>View</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No prescriptions found.</p>
//                 )}
//               </div>
//             )}
//             <button className="swal-btn" onClick={() => setIsPrescriptionsListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* PRESCRIPTION DETAIL MODAL (Fully Dynamic) */}
//       {isPrescriptionDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsPrescriptionDetailModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Prescription Details</div>
//             {loadingPrescriptionDetail ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
//             ) : prescriptionDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                 {Object.entries(prescriptionDetails).map(([key, value]) => (
//                   <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
//                     <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
//                     <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
//             )}
//             <button className="swal-btn" onClick={() => setIsPrescriptionDetailModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* HISTORY LIST MODAL */}
//       {isHistoryListModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsHistoryListModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">History</div>
//             <input type="text" className="search-box" placeholder="Search history..." value={historySearchTerm} onChange={(e) => setHistorySearchTerm(e.target.value)} />
//             {loadingHistoryList ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading history...</p>
//             ) : (
//               <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
//                 {historyList.length > 0 ? (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
//                     <thead>
//                       <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
//                         <th style={{ padding: '10px' }}>Action Type</th>
//                         <th style={{ padding: '10px' }}>Description</th>
//                         <th style={{ padding: '10px' }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {historyList.map((item, idx) => (
//                         <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
//                           <td style={{ padding: '10px' }}>{item.actionType || 'Activity'}</td>
//                           <td style={{ padding: '10px' }}>{item.description || 'N/A'}</td>
//                           <td style={{ padding: '10px' }}>
//                             <button className="btn-view" onClick={() => fetchHistoryDetails(item.id || idx + 1)}>View</button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No history found.</p>
//                 )}
//               </div>
//             )}
//             <button className="swal-btn" onClick={() => setIsHistoryListModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* HISTORY DETAIL MODAL (Fully Dynamic) */}
//       {isHistoryDetailModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsHistoryDetailModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">History Details</div>
//             {loadingHistoryDetail ? (
//               <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
//             ) : historyDetails ? (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//                 {Object.entries(historyDetails).map(([key, value]) => (
//                   <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
//                     <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
//                     <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
//             )}
//             <button className="swal-btn" onClick={() => setIsHistoryDetailModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* MONTHLY PROGRESS MODAL */}
//       {isMonthlyModalOpen && (
//         <div className="swal-overlay" onClick={() => setIsMonthlyModalOpen(false)}>
//           <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
//             <div className="swal-title">Monthly Progress Overview</div>
//             <p style={{ color: '#475569', marginBottom: '20px' }}>Aapka mahine bhar ka health progress data.</p>
//             <button className="swal-btn" onClick={() => setIsMonthlyModalOpen(false)}>Close</button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }



//4.

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useCart } from "../User/CartContext";
import "../styles/dashboardsprofiles.css";

const COLORS = ["#0fa462", "#3b82f6", "#f59e0b"];

export default function Dashboard() {
  const { cartItems } = useCart();
  const location = useLocation();

  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [user, setUser] = useState(null);

  // ---------- GRAPH STATES ----------
  const [currentMonth, setCurrentMonth] = useState("Select Period");
  const [selectedGlucoseData, setSelectedGlucoseData] = useState([]);
  const [selectedWeightData, setSelectedWeightData] = useState([]);
  const [selectedBpData, setSelectedBpData] = useState([]);

  // ---------- NOTIFICATION & SETTINGS STATES ----------
  const [unreadCount, setUnreadCount] = useState(2);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [settingsData, setSettingsData] = useState({
    emailNotifications: true,
    smsNotifications: true,
    twoFactorAuth: false,
    themeMode: "Light",
    language: "English"
  });

  // ---------- MONTHLY PROGRESS LIST & DETAIL STATES ----------
  const [isMonthlyListModalOpen, setIsMonthlyListModalOpen] = useState(false);
  const [monthlyList, setMonthlyList] = useState([]);
  const [loadingMonthlyList, setLoadingMonthlyList] = useState(false);
  const [monthlySearchTerm, setMonthlySearchTerm] = useState('');

  const [isMonthlyDetailModalOpen, setIsMonthlyDetailModalOpen] = useState(false);
  const [monthlyDetails, setMonthlyDetails] = useState(null);
  const [loadingMonthlyDetail, setLoadingMonthlyDetail] = useState(false);

  // ---------- HELP & SUPPORT LIST & DETAIL STATES ----------
  const [isSupportListModalOpen, setIsSupportListModalOpen] = useState(false);
  const [supportList, setSupportList] = useState([]);
  const [loadingSupportList, setLoadingSupportList] = useState(false);
  const [supportSearchTerm, setSupportSearchTerm] = useState("");

  const [isSupportDetailModalOpen, setIsSupportDetailModalOpen] = useState(false);
  const [supportDetails, setSupportDetails] = useState(null);
  const [loadingSupportDetail, setLoadingSupportDetail] = useState(false);

  // ---------- PRESCRIPTIONS LIST & DETAIL STATES ----------
  const [isPrescriptionsListModalOpen, setIsPrescriptionsListModalOpen] = useState(false);
  const [prescriptionsList, setPrescriptionsList] = useState([]);
  const [loadingPrescriptionsList, setLoadingPrescriptionsList] = useState(false);
  const [prescriptionSearchTerm, setPrescriptionSearchTerm] = useState('');

  const [isPrescriptionDetailModalOpen, setIsPrescriptionDetailModalOpen] = useState(false);
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [loadingPrescriptionDetail, setLoadingPrescriptionDetail] = useState(false);

  // ---------- HISTORY LIST & DETAIL STATES ----------
  const [isHistoryListModalOpen, setIsHistoryListModalOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistoryList, setLoadingHistoryList] = useState(false);
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  const [isHistoryDetailModalOpen, setIsHistoryDetailModalOpen] = useState(false);
  const [historyDetails, setHistoryDetails] = useState(null);
  const [loadingHistoryDetail, setLoadingHistoryDetail] = useState(false);

  // ---------- MEDICATION TRACKER LIST & DETAIL STATES ----------
  const [isMedListModalOpen, setIsMedListModalOpen] = useState(false);
  const [medList, setMedList] = useState([]);
  const [loadingMedList, setLoadingMedList] = useState(false);
  const [medSearchTerm, setMedSearchTerm] = useState('');

  const [isMedDetailModalOpen, setIsMedDetailModalOpen] = useState(false);
  const [medDetails, setMedDetails] = useState(null);
  const [loadingMedDetail, setLoadingMedDetail] = useState(false);

  // ---------- TEST REPORTS LIST & DETAIL STATES ----------
  const [isTestListModalOpen, setIsTestListModalOpen] = useState(false);
  const [testList, setTestList] = useState([]);
  const [loadingTestList, setLoadingTestList] = useState(false);
  const [testSearchTerm, setTestSearchTerm] = useState('');

  const [isTestDetailModalOpen, setIsTestDetailModalOpen] = useState(false);
  const [testDetails, setTestDetails] = useState(null);
  const [loadingTestDetail, setLoadingTestDetail] = useState(false);

  // ---------- HEALTH HISTORY LIST & DETAIL STATES ----------
  const [isHealthListModalOpen, setIsHealthListModalOpen] = useState(false);
  const [healthList, setHealthList] = useState([]);
  const [loadingHealthList, setLoadingHealthList] = useState(false);
  const [healthSearchTerm, setHealthSearchTerm] = useState('');

  const [isHealthDetailModalOpen, setIsHealthDetailModalOpen] = useState(false);
  const [healthDetails, setHealthDetails] = useState(null);
  const [loadingHealthDetail, setLoadingHealthDetail] = useState(false);

  // ---------- HANDLERS ----------
  const handleNotifClick = () => {
    alert("Notifications clicked!");
    setUnreadCount(0);
  };

  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      setIsSettingsModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllSettings");
      const data = await response.json();
      if (data) {
        const actualSettings = Array.isArray(data) ? data[0] : (data.data || data.result || data);
        if (actualSettings) {
          setSettingsData({
            emailNotifications: actualSettings.emailNotifications ?? true,
            smsNotifications: actualSettings.smsNotifications ?? true,
            twoFactorAuth: actualSettings.twoFactorAuth ?? false,
            themeMode: actualSettings.themeMode || "Light",
            language: actualSettings.language || "English"
          });
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSettingsClick = (e) => {
    if (e) e.preventDefault();
    fetchSettings();
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/UpdateSettings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData)
      });
      const result = await response.json();
      if (result.success !== false) {
        alert("Settings updated successfully!");
        setIsSettingsModalOpen(false);
      } else {
        alert("Failed to update settings.");
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert("An error occurred while updating settings.");
    }
  };

  // Monthly Progress Fetchers
  const fetchMonthlyProgressList = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoadingMonthlyList(true);
      setIsMonthlyListModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMonthlyProgress");
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.monthlyProgress || []);
      setMonthlyList(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      setMonthlyList([]);
    } finally {
      setLoadingMonthlyList(false);
    }
  };

  const fetchMonthlyDetails = async (id) => {
    try {
      setLoadingMonthlyDetail(true);
      setIsMonthlyDetailModalOpen(true);
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsMonthlyProgress?id=${id}`);
      const data = await response.json();
      const itemData = data.data || data.result || data;
      setMonthlyDetails(Array.isArray(itemData) ? itemData[0] : itemData);
    } catch (error) {
      setMonthlyDetails(null);
    } finally {
      setLoadingMonthlyDetail(false);
    }
  };

  // Medication Fetchers
  const fetchMedList = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoadingMedList(true);
      setIsMedListModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMedicationtracker");
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.medications || []);
      setMedList(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      setMedList([]);
    } finally {
      setLoadingMedList(false);
    }
  };

  const fetchMedDetails = async (id) => {
    try {
      setLoadingMedDetail(true);
      setIsMedDetailModalOpen(true);
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsMedicationtracker?id=${id}`);
      const data = await response.json();
      const itemData = data.data || data.result || data;
      setMedDetails(Array.isArray(itemData) ? itemData[0] : itemData);
    } catch (error) {
      setMedDetails(null);
    } finally {
      setLoadingMedDetail(false);
    }
  };

  // Test Reports Fetchers
  const fetchTestList = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoadingTestList(true);
      setIsTestListModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllTestReports");
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.reports || []);
      setTestList(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      setTestList([]);
    } finally {
      setLoadingTestList(false);
    }
  };

  const fetchTestDetails = async (id) => {
    try {
      setLoadingTestDetail(true);
      setIsTestDetailModalOpen(true);
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsTestReport?id=${id}`);
      const data = await response.json();
      const itemData = data.data || data.result || data;
      setTestDetails(Array.isArray(itemData) ? itemData[0] : itemData);
    } catch (error) {
      setTestDetails(null);
    } finally {
      setLoadingTestDetail(false);
    }
  };

  // Health History Fetchers
  const fetchHealthList = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoadingHealthList(true);
      setIsHealthListModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllHealthHistory");
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.history || []);
      setHealthList(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      setHealthList([]);
    } finally {
      setLoadingHealthList(false);
    }
  };

  const fetchHealthDetails = async (id) => {
    try {
      setLoadingHealthDetail(true);
      setIsHealthDetailModalOpen(true);
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsHealthHistory?id=${id}`);
      const data = await response.json();
      const itemData = data.data || data.result || data;
      setHealthDetails(Array.isArray(itemData) ? itemData[0] : itemData);
    } catch (error) {
      setHealthDetails(null);
    } finally {
      setLoadingHealthDetail(false);
    }
  };

  // Support, History, Prescriptions fetchers
  const fetchSupportList = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoadingSupportList(true);
      setIsSupportListModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllticketHelpSupport");
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.tickets || []);
      setSupportList(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      setSupportList([]);
    } finally {
      setLoadingSupportList(false);
    }
  };

  const fetchSupportDetails = async (id) => {
    try {
      setLoadingSupportDetail(true);
      setIsSupportDetailModalOpen(true);
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsTicket?id=${id}`);
      const data = await response.json();
      const itemData = data.data || data.result || data;
      setSupportDetails(Array.isArray(itemData) ? itemData[0] : itemData);
    } catch (error) {
      setSupportDetails(null);
    } finally {
      setLoadingSupportDetail(false);
    }
  };

  const fetchHistoryList = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoadingHistoryList(true);
      setIsHistoryListModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllHistory");
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.history || []);
      setHistoryList(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      setHistoryList([]);
    } finally {
      setLoadingHistoryList(false);
    }
  };

  const fetchHistoryDetails = async (id) => {
    try {
      setLoadingHistoryDetail(true);
      setIsHistoryDetailModalOpen(true);
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsHistory?id=${id}`);
      const data = await response.json();
      const itemData = data.data || data.result || data;
      setHistoryDetails(Array.isArray(itemData) ? itemData[0] : itemData);
    } catch (error) {
      setHistoryDetails(null);
    } finally {
      setLoadingHistoryDetail(false);
    }
  };

  const fetchPrescriptionsList = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoadingPrescriptionsList(true);
      setIsPrescriptionsListModalOpen(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllPrescriptions");
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.prescriptions || []);
      setPrescriptionsList(Array.isArray(rawList) ? rawList : []);
    } catch (error) {
      setPrescriptionsList([]);
    } finally {
      setLoadingPrescriptionsList(false);
    }
  };

  const fetchPrescriptionDetails = async (id) => {
    try {
      setLoadingPrescriptionDetail(true);
      setIsPrescriptionDetailModalOpen(true);
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsPrescription?id=${id}`);
      const data = await response.json();
      const itemData = data.data || data.result || data;
      setPrescriptionDetails(Array.isArray(itemData) ? itemData[0] : itemData);
    } catch (error) {
      setPrescriptionDetails(null);
    } finally {
      setLoadingPrescriptionDetail(false);
    }
  };

  const fetchInitialMonthlyProgress = async () => {
    try {
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMonthlyProgress");
      const data = await response.json();
      const actualData = Array.isArray(data) ? data : (data.data || data.result || []);
      if (actualData.length > 0) {
        if (currentMonth === "Select Period") {
          const firstItem = actualData[0];
          const periodName = firstItem.month || firstItem.monthYear || "sept2026";
          setCurrentMonth(periodName);
          setSelectedGlucoseData(firstItem.glucoseData || [{ day: 'Avg', value: parseInt(firstItem.avgGlucose) || 120 }]);
          setSelectedWeightData(firstItem.weightData || [{ date: periodName, weight: parseFloat(firstItem.weight) || 165 }]);
          setSelectedBpData(firstItem.bpData || [{ label: 'Normal', value: 100 }]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchInitialMonthlyProgress();
  }, []);

  const getInitial = () => (user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh", background: "#f4f7f6", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .modern-sidebar { width: 270px; height: 100vh; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 18px; position: fixed; left: 0; top: 0; z-index: 1000; box-sizing: border-box; overflow-y: auto; }
        .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid #f1f5f9; margin-bottom: 18px; text-decoration: none; }
        .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
        .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; color: #475569; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.9rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
        .modern-nav-item:hover { background-color: #f0fdf4; color: #0fa462; }
        .modern-nav-item.active { background-color: #0fa462; color: #ffffff; box-shadow: 0 4px 12px rgba(15, 164, 98, 0.2); }
        .modern-link-content { display: flex; align-items: center; gap: 12px; }
        .modern-submenu { list-style: none; padding: 6px 0 6px 32px; display: flex; flex-direction: column; gap: 4px; }
        .modern-submenu a, .modern-submenu button { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; background: none; border: none; text-align: left; width: 100%; cursor: pointer; transition: all 0.15s ease; }
        .modern-submenu a:hover, .modern-submenu button:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
        .modern-sidebar-footer { margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; flex-direction: column; gap: 10px; }
        .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
        .modern-avatar { width: 38px; height: 38px; background-color: #dcfce7; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
        .modern-user-name { font-weight: 600; font-size: 0.85rem; color: #1e293b; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .modern-user-role { font-size: 0.72rem; color: #64748b; font-weight: 500; }
        .modern-logout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #ef4444; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 8px; transition: background 0.2s; }
        .modern-logout-btn:hover { background-color: #fef2f2; }
        .modern-main-layout { margin-left: 270px; width: calc(100% - 270px); padding: 32px; box-sizing: border-box; }
        .stat-card { padding: 22px; border-radius: 14px; color: #fff; font-weight: 600; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); transition: transform 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; min-height: 110px; }
        .stat-card:hover { transform: translateY(-3px); }
        .swal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
        .swal-popup { background: white; padding: 32px; border-radius: 20px; width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: left; }
        .swal-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 20px; text-align: center; }
        .swal-btn { background-color: #0fa462; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s; }
        .swal-btn:hover { background-color: #0b824f; }
        .btn-view { background-color: #f0fdf4; color: #0fa462; border: 1px solid #bbf7d0; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; }
        .btn-view:hover { background-color: #0fa462; color: white; }
        .search-box { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; margin-bottom: 20px; outline: none; box-sizing: border-box; font-size: 0.95rem; }
      `}</style>

      {/* SIDEBAR */}
      <div className="modern-sidebar">
        <div>
          <Link to="/dashboards" className="modern-brand">
            <img src="/AKMedizostore.png" alt="logo" width="36" height="36" style={{ objectFit: 'contain' }} />
            <span>AK Medistore</span>
          </Link>

          <ul className="modern-nav-menu">
            <li>
              <button className={`modern-nav-item ${openDashboard ? "active" : ""}`} onClick={() => setOpenDashboard(!openDashboard)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-chart-pie"></i>
                  <span>Dashboard</span>
                </div>
                <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>

              {openDashboard && (
                <ul className="modern-submenu">
                  <li><button onClick={fetchMedList}>Medication Tracker</button></li>
                  <li><button onClick={fetchTestList}>Test Reports</button></li>
                  <li><button onClick={fetchHealthList}>Health History</button></li>
                  <li><button onClick={fetchMonthlyProgressList}>Monthly Progress</button></li>
                  <li><button onClick={fetchPrescriptionsList}>Prescriptions</button></li>
                  <li><button onClick={fetchHistoryList}>History</button></li>
                  <li><button onClick={fetchSupportList}>Help & Support</button></li>
                  <li><button onClick={handleSettingsClick}>Settings</button></li>
                  <li><Link to="/labtests">LAB TEST</Link></li>
                </ul>
              )}
            </li>

            <li>
              <button className="modern-nav-item" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>
              {openMasterUpdate && (
                <ul className="modern-submenu">
                  <li><Link to="/deliveryaddress">Delivery Address</Link></li>
                  <li><Link to="/addbankrefundableamounts">Refund Bank Details</Link></li>
                  <li><Link to="/bankdetailsrefundlist">Bankdetailsrefundlist</Link></li>
                </ul>
              )}
            </li>

            <li><Link to="/medicinedisplay" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
            <li>
              <Link to="/carts" className="modern-nav-item">
                <div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div>
                {cartItems.length > 0 && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>{cartItems.length}</span>}
              </Link>
            </li>
            <li><Link to="/order" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>Orders</span></div></Link></li>
            <li><Link to="/customerfeedback" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-comments"></i><span>Customer Feedback</span></div></Link></li>
            <li><Link to="/unavailablemedicines" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-ban"></i><span>Unavailable Medicines</span></div></Link></li>
            <li><Link to="/customerprofile" className="modern-nav-item"><div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div></Link></li>
          </ul>
        </div>

        <div className="modern-sidebar-footer">
          <div className="modern-user-card">
            <div className="modern-avatar">{getInitial()}</div>
            <div className="modern-user-info">
              <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
              <span className="modern-user-role">Customer Account</span>
            </div>
          </div>
          <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="modern-main-layout">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0, color: "#0f172a", fontWeight: "700", fontSize: "1.75rem", letterSpacing: "-0.5px" }}>
              Welcome back, Gautam Dev 👋
            </h2>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>
              Active Period View: <strong style={{ color: "#0fa462" }}>{currentMonth}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }} onClick={handleNotifClick}>
              🔔
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div style={{ cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }} onClick={handleSettingsClick}>
              ⚙️
            </div>
          </div>
        </header>

        {/* Top Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "18px", marginBottom: "30px" }}>
          <div onClick={fetchMedList} className="stat-card" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>💊</div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Medication Tracker</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>View prescriptions</div>
            </div>
          </div>
          <div onClick={fetchTestList} className="stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>🔬</div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Test Reports</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Lab diagnostics</div>
            </div>
          </div>
          <div onClick={fetchHealthList} className="stat-card" style={{ background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>🩺</div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Health History</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Medical background</div>
            </div>
          </div>
          <div onClick={fetchMonthlyProgressList} className="stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>📈</div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Monthly Progress</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Track improvements</div>
            </div>
          </div>
          <div onClick={() => window.location.href = '/labtests'} className="stat-card" style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>🧪</div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Lab Test</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Book new tests</div>
            </div>
          </div>
        </div>

        {/* Dynamic Charts Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Glucose ({currentMonth})</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={selectedGlucoseData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Weight Progress ({currentMonth})</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={selectedWeightData}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Pressure Status ({currentMonth})</h4>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={selectedBpData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={50}>
                  {selectedBpData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* MONTHLY PROGRESS LIST MODAL */}
      {isMonthlyListModalOpen && (
        <div className="swal-overlay" onClick={() => setIsMonthlyListModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Monthly Progress Overview</div>
            <input type="text" className="search-box" placeholder="Search progress..." value={monthlySearchTerm} onChange={(e) => setMonthlySearchTerm(e.target.value)} />
            {loadingMonthlyList ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading progress data...</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                {monthlyList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Month / Period</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyList.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
                          <td style={{ padding: '10px' }}>{item.month || item.monthYear || item.title || `Month ${idx + 1}`}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-view" onClick={() => fetchMonthlyDetails(item.id || idx + 1)}>View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No monthly progress records found.</p>
                )}
              </div>
            )}
            <button className="swal-btn" onClick={() => setIsMonthlyListModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* MONTHLY PROGRESS DETAIL MODAL */}
      {isMonthlyDetailModalOpen && (
        <div className="swal-overlay" onClick={() => setIsMonthlyDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Monthly Progress Details</div>
            {loadingMonthlyDetail ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
            ) : monthlyDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {Object.entries(monthlyDetails).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>
                      {typeof value === 'object' && value !== null 
                        ? JSON.stringify(value) 
                        : (value !== null && value !== undefined ? String(value) : 'N/A')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
            )}
            <button className="swal-btn" onClick={() => setIsMonthlyDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL (Updated with Theme Mode and Language Dropdowns) */}
      {isSettingsModalOpen && (
        <div className="swal-overlay" onClick={() => setIsSettingsModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Account Settings</div>
            {loadingSettings ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading settings...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
                  <input type="checkbox" checked={settingsData.emailNotifications} onChange={(e) => setSettingsData({...settingsData, emailNotifications: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
                  <span>Enable Email Notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
                  <input type="checkbox" checked={settingsData.smsNotifications} onChange={(e) => setSettingsData({...settingsData, smsNotifications: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
                  <span>Enable SMS Notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>
                  <input type="checkbox" checked={settingsData.twoFactorAuth} onChange={(e) => setSettingsData({...settingsData, twoFactorAuth: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: '#0fa462' }} />
                  <span>Two-Factor Authentication (2FA)</span>
                </label>

                {/* Theme Mode Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>Theme Mode:</label>
                  <select 
                    value={settingsData.themeMode} 
                    onChange={(e) => setSettingsData({...settingsData, themeMode: e.target.value})}
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', background: '#fff' }}
                  >
                    <option value="Light">Light Mode</option>
                    <option value="Dark">Dark Mode</option>
                    <option value="System">System Default</option>
                  </select>
                </div>

                {/* Language Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>Language:</label>
                  <select 
                    value={settingsData.language} 
                    onChange={(e) => setSettingsData({...settingsData, language: e.target.value})}
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', background: '#fff' }}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="swal-btn" onClick={handleSaveSettings}>Save Changes</button>
              <button style={{ background: '#cbd5e1', color: '#1e293b', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', width: '100%' }} onClick={() => setIsSettingsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MEDICATION TRACKER LIST MODAL */}
      {isMedListModalOpen && (
        <div className="swal-overlay" onClick={() => setIsMedListModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Medication Tracker</div>
            <input type="text" className="search-box" placeholder="Search medications..." value={medSearchTerm} onChange={(e) => setMedSearchTerm(e.target.value)} />
            {loadingMedList ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading medications...</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                {medList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Name / Details</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medList.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
                          <td style={{ padding: '10px' }}>{item.medicineName || item.name || item.title || JSON.stringify(item).substring(0, 30)}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-view" onClick={() => fetchMedDetails(item.id || idx + 1)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No medications found.</p>
                )}
              </div>
            )}
            <button className="swal-btn" onClick={() => setIsMedListModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* MEDICATION DETAIL MODAL */}
      {isMedDetailModalOpen && (
        <div className="swal-overlay" onClick={() => setIsMedDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Medication Details</div>
            {loadingMedDetail ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
            ) : medDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {Object.entries(medDetails).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
            )}
            <button className="swal-btn" onClick={() => setIsMedDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* TEST REPORTS LIST MODAL */}
      {isTestListModalOpen && (
        <div className="swal-overlay" onClick={() => setIsTestListModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Test Reports</div>
            <input type="text" className="search-box" placeholder="Search test reports..." value={testSearchTerm} onChange={(e) => setTestSearchTerm(e.target.value)} />
            {loadingTestList ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading reports...</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                {testList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Test Name / Details</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testList.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
                          <td style={{ padding: '10px' }}>{item.testName || item.title || item.name || JSON.stringify(item).substring(0, 30)}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-view" onClick={() => fetchTestDetails(item.id || idx + 1)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No test reports found.</p>
                )}
              </div>
            )}
            <button className="swal-btn" onClick={() => setIsTestListModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* TEST REPORT DETAIL MODAL */}
      {isTestDetailModalOpen && (
        <div className="swal-overlay" onClick={() => setIsTestDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Test Report Details</div>
            {loadingTestDetail ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
            ) : testDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {Object.entries(testDetails).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
            )}
            <button className="swal-btn" onClick={() => setIsTestDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* HEALTH HISTORY LIST MODAL */}
      {isHealthListModalOpen && (
        <div className="swal-overlay" onClick={() => setIsHealthListModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Health History</div>
            <input type="text" className="search-box" placeholder="Search health history..." value={healthSearchTerm} onChange={(e) => setHealthSearchTerm(e.target.value)} />
            {loadingHealthList ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading health history...</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                {healthList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Condition / Record</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {healthList.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
                          <td style={{ padding: '10px' }}>{item.condition || item.title || item.name || JSON.stringify(item).substring(0, 30)}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-view" onClick={() => fetchHealthDetails(item.id || idx + 1)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No records found.</p>
                )}
              </div>
            )}
            <button className="swal-btn" onClick={() => setIsHealthListModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* HEALTH HISTORY DETAIL MODAL */}
      {isHealthDetailModalOpen && (
        <div className="swal-overlay" onClick={() => setIsHealthDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Health Record Details</div>
            {loadingHealthDetail ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
            ) : healthDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {Object.entries(healthDetails).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
            )}
            <button className="swal-btn" onClick={() => setIsHealthDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* HELP & SUPPORT LIST MODAL */}
      {isSupportListModalOpen && (
        <div className="swal-overlay" onClick={() => setIsSupportListModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Help & Support Tickets</div>
            <input type="text" className="search-box" placeholder="Search tickets..." value={supportSearchTerm} onChange={(e) => setSupportSearchTerm(e.target.value)} />
            {loadingSupportList ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading tickets...</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                {supportList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Subject</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportList.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
                          <td style={{ padding: '10px' }}>{item.subject || 'Ticket'}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-view" onClick={() => fetchSupportDetails(item.id || idx + 1)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No tickets found.</p>
                )}
              </div>
            )}
            <button className="swal-btn" onClick={() => setIsSupportListModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* SUPPORT DETAIL MODAL */}
      {isSupportDetailModalOpen && (
        <div className="swal-overlay" onClick={() => setIsSupportDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Ticket Details</div>
            {loadingSupportDetail ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
            ) : supportDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {Object.entries(supportDetails).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
            )}
            <button className="swal-btn" onClick={() => setIsSupportDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* PRESCRIPTIONS LIST MODAL */}
      {isPrescriptionsListModalOpen && (
        <div className="swal-overlay" onClick={() => setIsPrescriptionsListModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Prescriptions</div>
            <input type="text" className="search-box" placeholder="Search prescriptions..." value={prescriptionSearchTerm} onChange={(e) => setPrescriptionSearchTerm(e.target.value)} />
            {loadingPrescriptionsList ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading prescriptions...</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                {prescriptionsList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Title</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptionsList.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px' }}>{item.id || idx + 1}</td>
                          <td style={{ padding: '10px' }}>{item.title || item.doctorName || 'Prescription'}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-view" onClick={() => fetchPrescriptionDetails(item.id || idx + 1)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No prescriptions found.</p>
                )}
              </div>
            )}
            <button className="swal-btn" onClick={() => setIsPrescriptionsListModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* PRESCRIPTION DETAIL MODAL */}
      {isPrescriptionDetailModalOpen && (
        <div className="swal-overlay" onClick={() => setIsPrescriptionDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">Prescription Details</div>
            {loadingPrescriptionDetail ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
            ) : prescriptionDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {Object.entries(prescriptionDetails).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
            )}
            <button className="swal-btn" onClick={() => setIsPrescriptionDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* HISTORY LIST MODAL */}
      {isHistoryListModalOpen && (
        <div className="swal-overlay" onClick={() => setIsHistoryListModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">History</div>
            <input type="text" className="search-box" placeholder="Search history..." value={historySearchTerm} onChange={(e) => setHistorySearchTerm(e.target.value)} />
            {loadingHistoryList ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading history...</p>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                {historyList.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Action Type</th>
                        <th style={{ padding: '10px' }}>Description</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyList.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px' }}>{item.actionType || 'Activity'}</td>
                          <td style={{ padding: '10px' }}>{item.description || 'N/A'}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-view" onClick={() => fetchHistoryDetails(item.id || idx + 1)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No history found.</p>
                )}
              </div>
            )}
            <button className="swal-btn" onClick={() => setIsHistoryListModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* HISTORY DETAIL MODAL */}
      {isHistoryDetailModalOpen && (
        <div className="swal-overlay" onClick={() => setIsHistoryDetailModalOpen(false)}>
          <div className="swal-popup" onClick={(e) => e.stopPropagation()}>
            <div className="swal-title">History Details</div>
            {loadingHistoryDetail ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading details...</p>
            ) : historyDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.95rem', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {Object.entries(historyDetails).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                    <strong style={{ textTransform: 'capitalize', color: '#475569' }}>{key}:</strong>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{value !== null && value !== undefined ? String(value) : 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Failed to load details.</p>
            )}
            <button className="swal-btn" onClick={() => setIsHistoryDetailModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
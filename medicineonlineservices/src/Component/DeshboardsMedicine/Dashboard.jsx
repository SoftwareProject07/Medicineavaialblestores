//6.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [user, setUser] = useState(null);

  // ---------- GRAPH STATES ----------
  const [currentMonth] = useState("Oct2026");
  const [selectedGlucoseData] = useState([{ day: 'Avg', value: 120 }]);
  const [selectedWeightData] = useState([{ date: 'Oct2026', weight: 165 }]);
  const [selectedBpData] = useState([{ label: 'Normal', value: 100 }]);

  // ---------- MODAL & LAB BOOKING STATES ----------
  const [unreadCount, setUnreadCount] = useState(2);
  const [activeModal, setActiveModal] = useState(null); 
  const [modalData, setModalData] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [labActiveTab, setLabActiveTab] = useState("packages"); // packages, blood, radiology

  // Detailed Action View State for Table Items
  const [selectedTableItem, setSelectedTableItem] = useState(null);

  // Booking Flow States inside Modal
  const [selectedTestForBooking, setSelectedTestForBooking] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: List, 2: Details Form, 3: Tracking View
  const [patientForm, setPatientForm] = useState({
    fullName: "",
    age: "",
    gender: "Male",
    mobile: "",
    collectionType: "Home Collection",
    address: "",
    pincode: "",
    date: "",
    timeSlot: "07:00 AM - 09:00 AM"
  });
  const [distanceInfo, setDistanceInfo] = useState(null);

  // Settings specific states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAutoTheme, setIsAutoTheme] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Generic Data Fetcher
  const fetchModalData = async (modalType, endpoint) => {
    setActiveModal(modalType);
    setLoadingModal(true);
    setBookingStep(1);
    setSelectedTestForBooking(null);
    setSelectedTableItem(null);
    try {
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/${endpoint}`);
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.data || data.result || data.items || []);
      
      if (Array.isArray(rawList) && rawList.length > 0) {
        setModalData(rawList);
      } else {
        setModalData(getFallbackData(modalType));
      }
    } catch (error) {
      console.error(`Error fetching ${modalType}:`, error);
      setModalData(getFallbackData(modalType));
    } finally {
      setLoadingModal(false);
    }
  };

  const getFallbackData = (type) => {
    switch(type) {
      case "med":
        return [
          { id: "MED-01", name: "Paracetamol 650mg", dosage: "1 Tablet after meal", status: "Active", instructions: "Take with warm water after lunch." },
          { id: "MED-02", name: "Vitamin D3 Supplement", dosage: "Once a week", status: "Pending", instructions: "Consume post breakfast." }
        ];
      case "test":
        return [
          { id: "REP-101", testName: "Complete Blood Count (CBC)", status: "Completed", details: "All parameters normal.", hemoglobin: "14.5 g/dL", WBC: "7200 /μL" }
        ];
      case "health":
        return [
          { id: "HLT-01", condition: "Seasonal Allergy", details: "Mild pollen allergy reported in spring.", status: "Stable", doctor: "Dr. R. K. Sharma" }
        ];
      case "monthly":
        return [
          { id: "MON-01", month: "October 2026", details: "Weight controlled, blood sugar stable at 120 mg/dL.", status: "Good" }
        ];
      case "prescriptions":
        return [
          { id: "PRC-01", name: "Dr. Sharma Prescription", details: "General consultation and routine checkup.", status: "Valid" }
        ];
      case "history":
        return [
          { id: "HST-01", details: "Consulted general physician on 10th Sept 2026.", status: "Closed" }
        ];
      case "support":
        return [
          { id: "TKT-99", ticketTitle: "Delayed Lab Report Delivery", details: "Report dispatched via email successfully.", status: "Resolved" }
        ];
      case "lab":
        return [
          { id: "LAB-1", testName: "Blood Test Complete Panel", description: "Includes CBC, Lipid Profile, Liver & Kidney Function", offerPrice: 1499, category: "packages", type: "Home Collection" },
          { id: "LAB-2", testName: "Diabetes & Thyroid Package", description: "HbA1c, Fasting Glucose, T3, T4, TSH", offerPrice: 999, category: "packages", type: "Home Collection" },
          { id: "LAB-3", testName: "Advanced Lipid Profile", description: "Cholesterol, Triglycerides, HDL, LDL", offerPrice: 599, category: "blood", type: "Home Collection" },
          { id: "LAB-4", testName: "Full Body Ultrasound / X-Ray", description: "Abdomen and pelvis diagnostic scan (Lab Visit Required)", offerPrice: 1299, category: "radiology", type: "Lab Visit" }
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const getInitial = () => (user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

  const filteredLabTests = modalData.filter(test => {
    const name = test.testName || test.name || "";
    const matchesSearch = name.toLowerCase().includes(labSearchTerm.toLowerCase());
    const matchesTab = labActiveTab === "all" || test.category === labActiveTab || (labActiveTab === "packages" && !test.category);
    return matchesSearch && matchesTab;
  });

  const handlePincodeCheck = (pincode) => {
    setPatientForm({ ...patientForm, pincode });
    if (pincode.length === 6) {
      const mockDistance = parseInt(pincode) % 120;
      if (mockDistance <= 100) {
        setDistanceInfo({
          text: `Distance from lab: ${mockDistance} km - Home Collection Available`,
          extraCharge: 0,
          outOfRange: false
        });
      } else {
        setDistanceInfo({
          text: `Distance is ${mockDistance} km (> 100 km limit). Extra travelling charge applied.`,
          extraCharge: 120,
          outOfRange: false
        });
      }
    } else {
      setDistanceInfo(null);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!patientForm.fullName || !patientForm.mobile || !patientForm.address) {
      alert("Please fill in all mandatory patient details.");
      return;
    }
    setBookingStep(3);
  };

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
        .modern-submenu button { color: #64748b; text-decoration: none; font-size: 0.85rem; padding: 7px 12px; border-radius: 8px; display: block; font-weight: 500; background: none; border: none; text-align: left; width: 100%; cursor: pointer; transition: all 0.15s ease; }
        .modern-submenu button:hover { background-color: #f0fdf4; color: #0fa462; padding-left: 16px; }
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
        .custom-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 9999; padding: 20px; }
        .custom-modal-box { background: white; padding: 24px; border-radius: 16px; width: 100%; max-width: 850px; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: left; }
        .settings-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .settings-label { font-weight: 600; color: #1e293b; font-size: 0.95rem; }
        .settings-desc { font-size: 0.8rem; color: #64748b; margin-top: 2px; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; text-align: left; }
        .data-table th { background: #f8fafc; color: #475569; padding: 10px 12px; font-size: 0.85rem; border-bottom: 2px solid #e2e8f0; }
        .data-table td { padding: 10px 12px; font-size: 0.85rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; }
        .data-table tr:hover { background: #f1f5f9; }
        
        .lab-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
        .lab-item-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s; }
        .lab-item-card:hover { border-color: #0fa462; box-shadow: 0 6px 12px rgba(15, 164, 98, 0.08); }
        .lab-tab-btn { padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; color: #475569; transition: all 0.2s; }
        .lab-tab-btn.active { background: #0fa462; color: #fff; border-color: #0fa462; }
        
        .form-group { margin-bottom: 14px; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px; }
        .form-control { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem; box-sizing: border-box; outline: none; }
        .form-control:focus { border-color: #0fa462; box-shadow: 0 0 0 3px rgba(15, 164, 98, 0.1); }
        
        .tracker-step { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 8px; border-left: 4px solid #cbd5e1; }
        .tracker-step.completed { background: #f0fdf4; border-left-color: #0fa462; }
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
                  <li><button onClick={() => fetchModalData("med", "AllMedicationtracker")}>Medication Tracker</button></li>
                  <li><button onClick={() => fetchModalData("test", "AllTestReports")}>Test Reports</button></li>
                  <li><button onClick={() => fetchModalData("health", "AllHealthHistory")}>Health History</button></li>
                  <li><button onClick={() => fetchModalData("monthly", "AllMonthlyProgress")}>Monthly Progress</button></li>
                  <li><button onClick={() => fetchModalData("prescriptions", "AllPrescriptions")}>Prescriptions</button></li>
                  <li><button onClick={() => fetchModalData("history", "AllHistory")}>History</button></li>
                  <li><button onClick={() => fetchModalData("support", "AllticketHelpSupport")}>Help & Support</button></li>
                  <li><button onClick={() => setActiveModal("settings")}>Settings</button></li>
                  <li><button onClick={() => fetchModalData("lab", "AllOffersAsync")} style={{ color: "#0fa462", fontWeight: "700" }}>🧪 LAB TEST PANEL</button></li>
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
                  <li><button onClick={() => window.location.href="/deliveryaddress"}>Delivery Address</button></li>
                  <li><button onClick={() => window.location.href="/addbankrefundableamounts"}>Refund Bank Details</button></li>
                 <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                  
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
              <li>
                          <Link to="/customeraddmedicines"className="modern-nav-item"><div className="modern-link-content">
                            {/* <div className="modern-link-content"> */}
                              <i className="fa-solid fa-circle-exclamation"></i>
                              <span>Unavailable Medicines</span>
                            </div>
                          </Link>
                        </li>
  <li>
              <Link to="/profile" className="modern-nav-item"><div className="modern-link-content">
                {/* <div className="modern-link-content"> */}
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </li>
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
            <h2 style={{ margin: 0, color: "#0f172a", fontWeight: "700", fontSize: "1.75rem" }}>Welcome back, Gautam Dev 👋</h2>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.95rem" }}>Active Period View: <strong style={{ color: "#0fa462" }}>{currentMonth}</strong></p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }} onClick={() => setUnreadCount(0)}>
              🔔
              {unreadCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold' }}>{unreadCount}</span>}
            </div>
            <div style={{ cursor: 'pointer', fontSize: '20px', background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }} onClick={() => setActiveModal("settings")}>⚙️</div>
          </div>
        </header>

        {/* Top Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "18px", marginBottom: "30px" }}>
          <div onClick={() => fetchModalData("med", "AllMedicationtracker")} className="stat-card" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>💊</div>
            <div><div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Medication Tracker</div><div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>View prescriptions</div></div>
          </div>
          <div onClick={() => fetchModalData("test", "AllTestReports")} className="stat-card" style={{ background: "linear-gradient(135deg, #10b981 0%, #047857 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>🔬</div>
            <div><div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Test Reports</div><div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Lab diagnostics</div></div>
          </div>
          <div onClick={() => fetchModalData("health", "AllHealthHistory")} className="stat-card" style={{ background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>🩺</div>
            <div><div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Health History</div><div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Medical background</div></div>
          </div>
          <div onClick={() => fetchModalData("monthly", "AllMonthlyProgress")} className="stat-card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>📈</div>
            <div><div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Monthly Progress</div><div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Track improvements</div></div>
          </div>
          <div onClick={() => fetchModalData("lab", "AllOffersAsync")} className="stat-card" style={{ background: "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)" }}>
            <div style={{ fontSize: "1.3rem" }}>🧪</div>
            <div><div style={{ fontSize: "0.95rem", fontWeight: "700" }}>Lab Test</div><div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px" }}>Book new tests</div></div>
          </div>
        </div>

        {/* Dynamic Charts Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Glucose</h4>
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
            <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Weight Progress</h4>
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
            <h4 style={{ margin: "0 0 15px 0", fontSize: "1.05rem", color: "#0f172a", fontWeight: "700" }}>Blood Pressure Status</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={selectedBpData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={60} label>
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

      {/* ================= UNIVERSAL MODAL ================= */}
      {activeModal && (
        <div className="custom-overlay">
          <div className="custom-modal-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a", textTransform: "capitalize" }}>
                {activeModal === "lab" ? (
                  bookingStep === 1 ? "🧪 Lab Test Hub: Categories & Health Packages" :
                  bookingStep === 2 ? `📝 Patient Details & Booking: ${selectedTestForBooking?.testName || "Test"}` :
                  "🚀 Live Booking Tracking & Phlebotomist Details"
                ) : activeModal === "settings" ? "⚙️ Account Settings & Customer Preferences" : `${activeModal.toUpperCase()} Details & Action List`}
              </h3>
              <button onClick={() => { setActiveModal(null); setSelectedTableItem(null); }} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            {/* ================= ENHANCED MODERN SETTINGS DESIGN ================= */}
            {activeModal === "settings" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#0f172a", fontSize: "0.95rem", fontWeight: "700" }}>🎨 Appearance & Theme Settings</h4>
                  <div className="settings-row">
                    <div>
                      <div className="settings-label">Dark / Light Mode</div>
                      <div className="settings-desc">Switch dashboard theme appearance</div>
                    </div>
                    <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                  <div className="settings-row" style={{ borderBottom: "none" }}>
                    <div>
                      <div className="settings-label">Automatic System Theme Sync</div>
                      <div className="settings-desc">Match theme automatically with your device settings</div>
                    </div>
                    <input type="checkbox" checked={isAutoTheme} onChange={() => setIsAutoTheme(!isAutoTheme)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#0f172a", fontSize: "0.95rem", fontWeight: "700" }}>🔔 Notification & Communication Preferences</h4>
                  <div className="settings-row" style={{ borderBottom: "none" }}>
                    <div>
                      <div className="settings-label">Push & SMS Notifications</div>
                      <div className="settings-desc">Get real-time updates for lab reports, phlebotomist tracking & reminders</div>
                    </div>
                    <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                  </div>
                </div>

                <div style={{ marginTop: "10px", textAlign: "right" }}>
                  <button onClick={() => { alert("Customer preferences saved successfully!"); setActiveModal(null); }} style={{ background: "#0fa462", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Save Changes</button>
                </div>
              </div>
            ) : activeModal === "lab" ? (
              /* ================= LAB TEST COMPLETE BOOKING WORKFLOW ================= */
              <div>
                {bookingStep === 1 && (
                  <div>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                      <button className={`lab-tab-btn ${labActiveTab === "packages" ? "active" : ""}`} onClick={() => setLabActiveTab("packages")}>🔥 Health Packages / Offers</button>
                      <button className={`lab-tab-btn ${labActiveTab === "blood" ? "active" : ""}`} onClick={() => setLabActiveTab("blood")}>🩸 Blood Tests (Home Collection)</button>
                      <button className={`lab-tab-btn ${labActiveTab === "radiology" ? "active" : ""}`} onClick={() => setLabActiveTab("radiology")}>🩺 Radiology / Lab Visit</button>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <input 
                        type="text" 
                        placeholder="Search specific test, disease or health package..." 
                        value={labSearchTerm}
                        onChange={(e) => setLabSearchTerm(e.target.value)}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>

                    {loadingModal ? (
                      <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading lab packages...</div>
                    ) : filteredLabTests.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No lab tests found matching your search.</div>
                    ) : (
                      <div className="lab-card-grid">
                        {filteredLabTests.map((item, index) => {
                          const title = item.testName || item.name || "Health Package";
                          const desc = item.description || "Includes comprehensive parameters.";
                          const price = item.offerPrice || 599;
                          const collectionMode = item.type || "Home Collection";

                          return (
                            <div key={index} className="lab-item-card">
                              <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                  <h4 style={{ margin: 0, fontSize: "1rem", color: "#1e293b", fontWeight: "700" }}>{title}</h4>
                                  <span style={{ fontSize: "0.7rem", background: collectionMode === "Home Collection" ? "#e0f2fe" : "#fef3c7", color: collectionMode === "Home Collection" ? "#0369a1" : "#d97706", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>{collectionMode}</span>
                                </div>
                                <p style={{ margin: "0 0 12px 0", fontSize: "0.82rem", color: "#64748b", lineHeight: "1.4" }}>{desc}</p>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px", marginTop: "8px" }}>
                                <span style={{ fontWeight: "700", color: "#0fa462", fontSize: "1.05rem" }}>₹{price}</span>
                                <button 
                                  onClick={() => {
                                    setSelectedTestForBooking(item);
                                    setBookingStep(2);
                                  }} 
                                  style={{ background: "#0fa462", color: "#fff", border: "none", padding: "7px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "0.8rem", cursor: "pointer" }}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {bookingStep === 2 && (
                  <form onSubmit={handleBookingSubmit}>
                    <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Selected Test / Package</div>
                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{selectedTestForBooking?.testName}</div>
                      </div>
                      <div style={{ fontWeight: "700", color: "#0fa462", fontSize: "1.1rem" }}>₹{selectedTestForBooking?.offerPrice || 599}</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label>Patient Full Name *</label>
                        <input type="text" className="form-control" required placeholder="Enter full name" value={patientForm.fullName} onChange={(e) => setPatientForm({...patientForm, fullName: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Mobile Number (For Updates) *</label>
                        <input type="tel" className="form-control" required placeholder="10-digit mobile number" value={patientForm.mobile} onChange={(e) => setPatientForm({...patientForm, mobile: e.target.value})} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label>Age & Gender</label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input type="number" className="form-control" placeholder="Age" style={{ width: "80px" }} value={patientForm.age} onChange={(e) => setPatientForm({...patientForm, age: e.target.value})} />
                          <select className="form-control" value={patientForm.gender} onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Sample Collection Mode</label>
                        <select className="form-control" value={patientForm.collectionType} onChange={(e) => setPatientForm({...patientForm, collectionType: e.target.value})}>
                          <option value="Home Collection">Home Collection</option>
                          <option value="Lab Visit">Lab Visit / Walk-in</option>
                        </select>
                      </div>
                    </div>

                    {patientForm.collectionType === "Home Collection" && (
                      <>
                        <div className="form-group">
                          <label>Full Address (House No, Street, Area) *</label>
                          <input type="text" className="form-control" required placeholder="Enter complete address" value={patientForm.address} onChange={(e) => setPatientForm({...patientForm, address: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>Pincode (For 100km Radius Distance Check) *</label>
                          <input type="text" className="form-control" required maxLength="6" placeholder="Enter 6-digit pincode" value={patientForm.pincode} onChange={(e) => handlePincodeCheck(e.target.value)} />
                        </div>
                        {distanceInfo && (
                          <div style={{ padding: "10px 12px", background: distanceInfo.extraCharge > 0 ? "#fef3c7" : "#ecfdf5", color: distanceInfo.extraCharge > 0 ? "#b45309" : "#047857", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "14px", fontWeight: "600" }}>
                            {distanceInfo.text} {distanceInfo.extraCharge > 0 && " (+₹120 Travelling Charge added)"}
                          </div>
                        )}
                      </>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div className="form-group">
                        <label>Appointment Date *</label>
                        <input type="date" className="form-control" required value={patientForm.date} onChange={(e) => setPatientForm({...patientForm, date: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Select Time Slot *</label>
                        <select className="form-control" value={patientForm.timeSlot} onChange={(e) => setPatientForm({...patientForm, timeSlot: e.target.value})}>
                          <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM</option>
                          <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                          <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
                      <button type="button" onClick={() => setBookingStep(1)} style={{ background: "#e2e8f0", color: "#334155", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Back to Tests</button>
                      <button type="submit" style={{ background: "#0fa462", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Confirm Booking & Pay</button>
                    </div>
                  </form>
                )}

                {bookingStep === 3 && (
                  <div>
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px", borderRadius: "12px", marginBottom: "20px", textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🎉</div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#065f46", fontSize: "1.1rem" }}>Booking Confirmed Successfully!</h4>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#047857" }}>Your appointment has been registered. Reference ID: #LAB-{Math.floor(100000 + Math.random() * 900000)}</p>
                    </div>

                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>ASSIGNED PHLEBOTOMIST / EXECUTIVE</div>
                        <div style={{ fontSize: "1rem", fontWeight: "700", color: "#1e293b", marginTop: "2px" }}>Ramesh Kumar 🟢</div>
                        <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>Rating: 4.8★ (Exp: 4 Years)</div>
                      </div>
                      <a href={`tel:${patientForm.mobile}`} style={{ background: "#0fa462", color: "#fff", textDecoration: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        📞 Call Executive
                      </a>
                    </div>

                    <h4 style={{ fontSize: "0.95rem", color: "#1e293b", marginBottom: "12px", fontWeight: "700" }}>Live Step-by-Step Status Tracker</h4>
                    <div>
                      <div className="tracker-step completed">
                        <span style={{ fontSize: "1.1rem" }}>✅</span>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "#065f46" }}>Booking Confirmed</div>
                          <div style={{ fontSize: "0.75rem", color: "#047857" }}>Slot locked for {patientForm.date || "Today"} ({patientForm.timeSlot})</div>
                        </div>
                      </div>

                      <div className="tracker-step completed">
                        <span style={{ fontSize: "1.1rem" }}>🛵</span>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "#065f46" }}>Executive Assigned</div>
                          <div style={{ fontSize: "0.75rem", color: "#047857" }}>Ramesh Kumar is assigned to collect your sample.</div>
                        </div>
                      </div>

                      <div className="tracker-step">
                        <span style={{ fontSize: "1.1rem" }}>📍</span>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "#334155" }}>Executive on the Way</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Live GPS tracking active on your dashboard.</div>
                        </div>
                      </div>

                      <div className="tracker-step">
                        <span style={{ fontSize: "1.1rem" }}>🧪</span>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "#334155" }}>Sample Collected & OTP Verified</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Secure barcode scanning at your doorstep.</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", marginTop: "20px" }}>
                      <button onClick={() => setActiveModal(null)} style={{ background: "#0fa462", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Done / Close</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ================= DEFAULT TABLES WITH RICH DETAILS ACTION DATA ================= */
              <>
                {loadingModal ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading records...</div>
                ) : modalData.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No details found.</div>
                ) : selectedTableItem ? (
                  <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <h4 style={{ margin: "0 0 10px 0", color: "#0f172a", fontSize: "1.1rem" }}>📋 Record Summary & Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.9rem", marginBottom: "16px" }}>
                      <div><strong>ID / Ref:</strong> {selectedTableItem.id || "N/A"}</div>
                      <div><strong>Status:</strong> <span style={{ color: "#0fa462", fontWeight: "700" }}>{selectedTableItem.status || "Active"}</span></div>
                      <div style={{ gridColumn: "span 2" }}><strong>Name / Title:</strong> {selectedTableItem.testName || selectedTableItem.name || selectedTableItem.condition || selectedTableItem.ticketTitle || "Record Details"}</div>
                      <div style={{ gridColumn: "span 2" }}><strong>Full Notes / Description:</strong> {selectedTableItem.description || selectedTableItem.dosage || selectedTableItem.details || selectedTableItem.instructions || "No remarks available."}</div>
                    </div>
                    <button onClick={() => setSelectedTableItem(null)} style={{ background: "#0fa462", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>← Back to List</button>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>S.No.</th>
                          <th>ID / Ref</th>
                          <th>Name / Title</th>
                          <th>Details & Description</th>
                          <th>Status</th>
                          <th style={{ textAlign: "center" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modalData.map((item, index) => {
                          const seriesId = item.id || `ID-${index + 1}`;
                          const title = item.testName || item.name || item.reportName || item.condition || item.month || item.ticketTitle || `Record #${index + 1}`;
                          const desc = item.description || item.dosage || item.details || "No additional notes available.";
                          const status = item.status || "Active";

                          return (
                            <tr key={index}>
                              <td style={{ fontWeight: "700", color: "#0fa462" }}>#{index + 1}</td>
                              <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b" }}>{seriesId}</td>
                              <td style={{ fontWeight: "600" }}>{title}</td>
                              <td style={{ color: "#475569" }}>{desc}</td>
                              <td><span style={{ background: "#dcfce7", color: "#0fa462", padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700" }}>{status}</span></td>
                              <td style={{ textAlign: "center" }}>
                                <button 
                                  onClick={() => setSelectedTableItem(item)} 
                                  style={{ background: "#0fa462", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "600", fontSize: "0.78rem", cursor: "pointer" }}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
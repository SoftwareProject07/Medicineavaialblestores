import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminRegisteration() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Sidebar & Layout States ---
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");

  // --- Form Input States ---
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [adminType, setAdminType] = useState(""); // <--- नया Admin Type स्टेट जोड़ा गया
  const [adminTypesList, setAdminTypesList] = useState([]); // <--- API से टाइप्स लोड करने के लिए लिस्ट
  const [showPassword, setShowPassword] = useState(false);

  // --- API से Admin Types फेच करना ---
  useEffect(() => {
    const fetchAdminTypes = async () => {
      try {
        const response = await axios.get("https://ecommerencesite.onrender.com/api/AdminApi/AllTypeList");
        setAdminTypesList(response.data);
      } catch (error) {
        console.error("Error fetching admin types:", error);
      }
    };
    fetchAdminTypes();
  }, []);

  // --- Sidebar Dynamic Class Helpers ---
  const getNavLinkClass = (path) => {
    const baseClass = "d-flex align-items-center gap-3 px-3 py-2 text-decoration-none rounded text-white-50 ";
    return baseClass + (location.pathname === path ? "bg-success text-white" : "hover-sidebar-menu");
  };

  const getSubLinkClass = (path) => {
    const baseClass = "d-flex align-items-center px-3 py-2 text-decoration-none text-white-50 rounded mb-1 position-relative ";
    return baseClass + (location.pathname === path ? "text-success fw-bold" : "hover-sidebar-menu");
  };

  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  // --- Action Handlers ---
  const handleSave = async () => {
    if (!firstname || !lastname || !password || !email || !mobile || !adminType) {
      Swal.fire("Warning", "Please fill all required fields including Admin Type", "warning");
      return;
    }

    const payload = {
      firstName: firstname,
      middleName: middlename || "",
      lastName: lastname,
      password: password,
      email: email,
      mobileNumber: mobile,
      fund: 0,
      type: adminType, // <--- यहाँ से सेलेक्ट किया गया Admin Type पास होगा
      createdOn: new Date().toISOString()
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/AdminApi/CREATERegisterAdmin",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201 || response.data?.isSuccess) {
        Swal.fire("Success", "Admin Registration Successful", "success")
          .then(() => navigate("/adminlogin"));
      } else {
        Swal.fire("Error", response.data?.message || "Registration Failed", "error");
      }
    } catch (error) {
      console.error("API Error Details:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.title || 
        error.message || 
        "Server Error, please try again later";

      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleReset = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setPassword("");
    setEmail("");
    setMobile("");
    setAdminType(""); // <--- सही स्टेट रीसेट फंक्शन
  };

  return (
     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>

      {/* प्रीमियम ट्री-स्ट्रक्चर साइडबार */}
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
        {/* ब्रांड लोगो */}
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        {/* ग्लोबल शॉप स्टेटस स्विच */}
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

        {/* नेविगेशन लिंक्स */}
        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          {/* 1. OPERATIONS CENTER DROPDOWN */}
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
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Add Item Type
                </Link>

                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAssignedTO
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
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels ' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Language Master           
                              </Link>
          
          
              </div>
            )}
          </div>
        

          {/* 2. MASTER CONFIGURATION DROPDOWN */}
       
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
                
                 <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link></li>
          <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
          <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
          <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
          <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
          <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link></li>
          <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link></li>
          <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link></li> 
          <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">RegisteartionForm </Link></li>
          {/* <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AustomerHelpIssueList </Link></li> */}
          <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link></li>
          {/* <li><Link to="/adminsupportticketlist" className="btn btn-outline-success w-100 mb-2 text-start">AdminSupportTicketList </Link></li> */}
          <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link></li>
         <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
          <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
          <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>

                 <li><Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start">Doctor_PatientdetailsLists    </Link> </li>
 <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

          </div>
            )}
          </div>
          {/* टर्मिनेट / लॉगआउट एक्शन */}
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

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <section className="flex-grow-1 bg-dark overflow-auto" style={{ marginLeft: '280px' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12">
              <div className="card card-registration my-4 shadow-lg border-0">
                <div className="row g-0">
                  <div className="col-xl-5 d-none d-xl-block">
                    <img 
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                      alt="Registration" 
                      className="img-fluid h-100"
                      style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem", objectFit: 'cover', minHeight: '100%' }} 
                    />
                  </div>

                  <div className="col-xl-7 bg-white" style={{ borderTopRightRadius: ".25rem", borderBottomRightRadius: ".25rem" }}>
                    <div className="card-body p-md-5 text-black">
                      <h3 className="mb-4 text-uppercase fw-bold text-dark">Admin Registration Form</h3>
                      <hr />

                      <div className="row mt-4">
                        <div className="col-md-4 mb-4">
                          <label className="form-label fw-semibold text-secondary">First Name</label>
                          <input type="text" className="form-control" placeholder="First Name"
                            value={firstname} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="col-md-4 mb-4">
                          <label className="form-label fw-semibold text-secondary">Middle Name</label>
                          <input type="text" className="form-control" placeholder="Middle Name"
                            value={middlename} onChange={(e) => setMiddleName(e.target.value)} />
                        </div>
                        <div className="col-md-4 mb-4">
                          <label className="form-label fw-semibold text-secondary">Last Name</label>
                          <input type="text" className="form-control" placeholder="Last Name"
                            value={lastname} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                      </div>

                      {/* --- ADMIN TYPE DROPDOWN (यहाँ जोड़ा गया है) --- */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary">Admin Type</label>
                        <select 
                          className="form-control" 
                          value={adminType} 
                          onChange={(e) => setAdminType(e.target.value)} 
                          required
                        >
                          <option value="">-- Select Admin Type --</option>
                          {adminTypesList.map((item, index) => {
                            const typeVal = typeof item === 'string' ? item : item.type || item.Type || item.name || '';
                            return (
                              <option key={index} value={typeVal}>
                                {typeVal}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary">Password</label>
                        <div className="input-group">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            className="form-control" 
                            placeholder="Password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} required
                          />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary">Email</label>
                        <input type="email" className="form-control" placeholder="Email ID"
                          value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary">Mobile Number</label>
                        <input type="text" className="form-control" placeholder="Mobile Number"
                          value={mobile} maxLength={10} onChange={(e) => setMobile(e.target.value)} required/>
                      </div>

                      <div className="d-flex justify-content-end pt-3">
         <Link to="/adminlogin" className="btn btn-light btn-lg me-3 px-4 text-decoration-none">Back</Link>
                        <button type="button" className="btn btn-light btn-lg me-3 px-4" onClick={handleReset}>Reset</button>

                        <button type="button" className="btn btn-warning btn-lg px-5 text-white fw-bold shadow-sm" onClick={handleSave}>Register Admin</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
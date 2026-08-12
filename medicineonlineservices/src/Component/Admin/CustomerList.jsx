import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function CustomerList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false); // Fixed missing state
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");

  // 🔹 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 HELPER FUNCTIONS FOR SIDEBAR ACTIVE CLASSES (Fixed missing functions)
  const getNavLinkClass = (path) => {
    const baseClass = "d-flex align-items-center gap-3 px-3 py-2 text-decoration-none rounded text-white-50 ";
    return baseClass + (location.pathname === path ? "bg-success text-white" : "hover-sidebar-menu");
  };

  const getSubLinkClass = (path) => {
    const baseClass = "d-flex align-items-center px-3 py-2 text-decoration-none text-white-50 rounded mb-1 position-relative ";
    return baseClass + (location.pathname === path ? "text-success fw-bold" : "hover-sidebar-menu");
  };

  // 🔹 NORMALIZE API DATA
  const normalizeUsers = (list) =>
    list.map((u) => ({
      id: u.id ?? u.Id,
      firstName: u.firstName ?? u.FirstName,
      middleName: u.middleName ?? u.MiddleName ?? "", // Added normalization for Middle Name
      lastName: u.lastName ?? u.LastName,
      password: u.password ?? u.Password, 
      email: u.email ?? u.Email,
      mobileNumber: u.mobileNumber ?? u.MobileNumber,
      fund: u.fund ?? u.Fund,
      type: u.type ?? u.Type,
      createdOn: u.createdOn ?? u.CreatedOn,
    }));

  // --- Shop Toggle Logic ---
  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  // 🔹 GET USERS
  useEffect(() => {
    axios
      .get("https://ecommerencesite.onrender.com/api/USERMEDICINE/AllUserList")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data;
        setUsers(Array.isArray(list) ? normalizeUsers(list) : []);
      })
      .catch((err) => {
        console.error("API ERROR 👉", err);
        setUsers([]);
      });
  }, []);

  // 🔹 SEARCH FILTER
  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container">
      {/* ---------- SIDEBAR ---------- */}
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
                <Link to="/doctor_patientdetailslists" className={getSubLinkClass("/doctor_patientdetailslists")}>
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
                <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
                <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
                <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link></li>
                <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link></li>
                <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link></li> 
                <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li>
                <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link></li>
                <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link></li>
                                  <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund</Link></li>
                  <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
 <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
                  <li>    <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
          </Link></li> 

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

      {/* CONTENT */}
      <div className="content" style={{ marginLeft: '300px', padding: '24px' }}>
        <h2>Customer User List</h2>

        <input
          className="form-control my-3"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); 
          }}
        />

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>First Name</th>
              <th>Middlename</th>
              <th>Last Name</th>
              <th>PassWord</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Fund</th>
              <th>Type</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No customers found</td>
              </tr>
            ) : (
              currentItems.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName}</td>
                  <td>{u.middleName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.password}</td>
                  <td>{u.email}</td>
                  <td>{u.mobileNumber}</td>
                  <td>{u.fund}</td>
                  <td>{u.type}</td>
                  <td>{u.createdOn ? new Date(u.createdOn).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 🔹 PAGINATION CONTROLS */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>Showing {filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries</span>
          
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
              </li>
              
              <li className="page-item active">
                <span className="page-link">{currentPage}</span>
              </li>

              <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
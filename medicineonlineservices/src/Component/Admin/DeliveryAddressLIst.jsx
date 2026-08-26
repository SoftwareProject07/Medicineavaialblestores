import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function DeliveryAddressLIst() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for viewing all column details in a modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sidebar toggle states
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getNavLinkClass = (path) => {
    return `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none ${
      location.pathname === path ? 'bg-success text-white' : 'text-white-50 hover-sidebar-menu'
    }`;
  };

  const getSubLinkClass = (path) => {
    return `d-flex align-items-center text-decoration-none py-1.5 px-2 rounded ${
      location.pathname === path ? 'text-success fw-bold' : 'text-white-50'
    }`;
  };

  // Fetch Delivery Address Data from API on Mount
  useEffect(() => {
    fetch('https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/GetAllPatients_Customers')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch delivery addresses');
        }
        return response.json();
      })
      .then((data) => {
        setPatients(data);
        setFilteredPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Search filter handler
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = patients.filter((item) => {
      return Object.values(item).some((val) =>
        val !== null && val !== undefined && val.toString().toLowerCase().includes(keyword)
      );
    });
    setFilteredPatients(filtered);
  };

  // Open modal and show all columns/fields for the selected item
  const handleViewAllColumns = (item) => {
    setSelectedPatient(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212', position: 'relative' }}>

      {/* Sidebar */}
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
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Add Item Type
                </Link>

                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAssignedTO
                </Link>

                {/* <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                  AddDoctorAssignTo
                                </Link>
             */}
               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>

                 <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels ' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Language Master           
                              </Link>

                                       <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/statenamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                         StateName Master  
                              </Link>
<Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/citynamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                CityName Master           
                              </Link> 

                                   <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addaccountmastertypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Accountant Master Types             
                              </Link> 
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
                
                <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
                <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link></li>
                <li><Link to="/deliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Delivery Address List</Link></li>
                <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
                <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
                <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link></li>
                <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster</Link></li>
                <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails</Link></li> 
                {/* <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form</Link></li> */}
                <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList</Link></li>
                <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist</Link></li>
                <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
                <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
                                       <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
                
                           <li>   <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
                  </Link></li> 

<li><Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link></li>
 <li><Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link></li>
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

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)', backgroundColor: '#121212', color: '#fff' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 className="m-0 text-white" style={{ fontSize: '24px', fontWeight: 'bold' }}>Delivery Address List</h2>
          
          <div style={{ position: 'relative', width: '320px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a8a98' }}>
              <i className="fas fa-search"></i>
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search across all fields..." 
              style={{
                width: '100%',
                padding: '10px 10px 10px 38px',
                backgroundColor: '#1e1e24',
                border: '1px solid #2d2d37',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '13.5px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>Loading delivery addresses...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>Error: {error}</div>}

        {!loading && !error && (
          <div style={{ overflowX: 'auto', backgroundColor: '#16161a', padding: '20px', borderRadius: '8px', border: '1px solid #232329' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', tableLayout: 'auto' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e1e24', textAlign: 'left', borderBottom: '2px solid #2d2d37' }}>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>ID</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#2ecc71', fontSize: '13px', minWidth: '180px' }}>User Credential / Login Info</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '150px' }}>Full Name</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '130px' }}>Phone Number</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '220px' }}>Address Details</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '120px' }}>City</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '120px' }}>State</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '100px' }}>Zip Code</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '160px', whiteSpace: 'nowrap' }}>Created On</th>
                  <th style={{ padding: '14px 12px', border: '1px solid #ddd', color: '#fff', fontSize: '13px', minWidth: '110px', textAlign: 'center', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((item, index) => (
                    <tr key={item.patient_CustomerId || index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9', borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#111', fontSize: '13px', wordBreak: 'break-word' }}>
                        {item.patient_CustomerId || item.id || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#0d6efd', fontWeight: '500', fontSize: '13px', wordBreak: 'break-all' }}>
                        {item.email || item.username || item.loginId || item.customerEmail || item.userEmail || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#111', fontWeight: 'bold', fontSize: '13px', wordBreak: 'break-word' }}>
                        {item.fullName || item.name || item.customerName || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#111', fontSize: '13px', wordBreak: 'break-word' }}>
                        {item.phoneNumber || item.phone || item.mobileNumber || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#111', fontSize: '13px', wordBreak: 'break-word' }}>
                        {item.address || item.streetAddress || item.deliveryAddress || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#111', fontSize: '13px', wordBreak: 'break-word' }}>
                        {item.customerCity || item.city || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#111', fontSize: '13px', wordBreak: 'break-word' }}>
                        {item.customerState || item.state || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#111', fontSize: '13px', wordBreak: 'break-word' }}>
                        {item.customerZipCode || item.zipCode || item.postalCode || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', color: '#555', fontSize: '12.5px', wordBreak: 'break-word' }}>
                        {item.createdOn || item.createdAt || item.date ? new Date(item.createdOn || item.createdAt || item.date).toLocaleString() : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => handleViewAllColumns(item)}
                          className="btn btn-sm btn-success"
                          style={{ fontSize: '12px', padding: '4px 10px', fontWeight: '500' }}
                        >
                          <i className="fas fa-list me-1"></i> All Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: '#666', fontSize: '14px', backgroundColor: '#fff' }}>
                      No matching delivery addresses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Popup to Show All Columns/Fields */}
      {isModalOpen && selectedPatient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#16161a',
            border: '1px solid #2d2d37',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-3 px-4" style={{ borderBottom: '1px solid #2d2d37' }}>
              <h5 className="m-0 text-white fw-bold" style={{ fontSize: '18px' }}>
                <i className="fas fa-info-circle text-success me-2"></i> All Column Details
              </h5>
              <button 
                onClick={closeModal} 
                className="btn btn-sm text-white-50 hover-white"
                style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body - Displaying all keys and values dynamically */}
            <div className="p-4" style={{ overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1e1e24', borderRadius: '6px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ backgroundColor: '#252530', borderBottom: '1px solid #2d2d37' }}>
                    <th style={{ padding: '10px 14px', color: '#2ecc71', fontSize: '13px', width: '35%', textAlign: 'left' }}>Column / Field Name</th>
                    <th style={{ padding: '10px 14px', color: '#fff', fontSize: '13px', width: '65%', textAlign: 'left' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedPatient).map(([key, value], idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #2d2d37' }}>
                      <td style={{ padding: '10px 14px', color: '#a0a0b0', fontSize: '13px', fontWeight: '600', wordBreak: 'break-word' }}>
                        {key}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#ffffff', fontSize: '13px', wordBreak: 'break-all' }}>
                        {value === null || value === undefined ? (
                          <span className="text-muted fst-italic" style={{ fontSize: '12px' }}>null / empty</span>
                        ) : typeof value === 'boolean' ? (
                          value ? 'True' : 'False'
                        ) : (
                          value.toString()
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="d-flex justify-content-end p-3 px-4" style={{ borderTop: '1px solid #2d2d37', backgroundColor: '#16161a' }}>
              <button 
                onClick={closeModal} 
                className="btn btn-secondary btn-sm px-4"
                style={{ fontSize: '13px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
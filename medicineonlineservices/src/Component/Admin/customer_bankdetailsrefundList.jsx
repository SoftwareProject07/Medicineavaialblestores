import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function CustomerBankDetailsRefundList() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); // For Details Modal View

  // Sidebar states
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getNavLinkClass = (path) => {
    return `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none transition-all ${
      location.pathname === path ? 'bg-success text-white fw-bold' : 'text-white-50 hover-sidebar-menu'
    }`;
  };

  const getSubLinkClass = (path) => {
    return `text-decoration-none py-1.5 px-2 transition-all ${
      location.pathname === path ? 'text-success fw-bold' : 'text-white-50 hover-sidebar-sublink'
    }`;
  };

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await fetch('https://ecommerencesite.onrender.com/api/BankRefundableAmountAPI/GetAllBankRefundableAmounts');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Data fetched:", data);
        setRefunds(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  // Filter refunds dynamically based on search input (Matches Name, Account Number, IFSC or Credentials)
  const filteredRefunds = refunds.filter((item) => {
    const customerName = (item.bank_CustomerName || item.customerName || item.name || '').toLowerCase();
    const accountNumber = (item.bankAccountNumber || item.accountNumber || '').toLowerCase();
    const ifscCode = (item.bankIFSCCode || item.ifscCode || '').toLowerCase();
    const credential = (item.loginCredentialAccess || item.loginCredential || item.email || item.userEmail || '8409844260').toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();

    return (
      customerName.includes(searchLower) ||
      accountNumber.includes(searchLower) ||
      ifscCode.includes(searchLower) ||
      credential.includes(searchLower)
    );
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
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
        {/* Brand Logo */}
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        {/* Global Shop Status Switch */}
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

        {/* Navigation Links */}
        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
            <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
          {/* Master Config Dropdown */}
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


                                       <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/statenamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                         StateName Master  
                              </Link>
<Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/citynamemasters' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                CityName Master           
                              </Link> 
              </div>
            )}
          </div>

          {/* Operations Registry Dropdown */}
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
                
                <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
                  <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Dashboard</Link></li> 
                  <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">CustomerLIST</Link></li>
                  <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">OrderPaymentList</Link></li>
                  <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">OrderStatusLIST</Link></li>
                  <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start text-decoration-none">Feedback List</Link></li>
                  <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Admin Login List</Link></li>
                  <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">UnavailableMedicineList</Link></li>
                  <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">bankselectMaster</Link></li>
                  <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">BankCreditAmountDetails</Link></li> 
                  <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Registeartion Form</Link></li>
                  <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">LivenessimageList</Link></li>
                  <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">customerticketraiselist</Link></li>
                  <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund List</Link></li>
                  <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
                   <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
                      <li>  <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
           </Link></li>
            <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

                </ul>
              </div>
            )}
          </div>

          {/* Logout Action */}
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
      <div style={{ marginLeft: '280px', flex: 1, padding: '30px' }} className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-2xl font-bold text-white m-0">Customer Bank Refund Details List</h2>
          
          {/* Search Box */}
          <div style={{ width: '300px' }}>
            <input 
              type="text" 
              className="form-control bg-dark text-white border-secondary" 
              placeholder="Search by name, account, IFSC..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="p-4 text-center text-white">Loading bank refund details...</div>
        ) : error ? (
          <div className="p-4 text-center text-danger">Error: {error}</div>
        ) : filteredRefunds.length === 0 ? (
          <p className="text-white-50">No matching bank refundable records found.</p>
        ) : (
          <div className="table-responsive shadow-md rounded-lg">
            <table className="table table-dark table-striped table-hover border border-secondary align-middle">
              <thead>
                <tr>
                  <th className="py-3 px-3 text-start">ID</th>
                  <th className="py-3 px-3 text-start">Customer Name</th>
                  <th className="py-3 px-3 text-start">Bank Name</th>
                  <th className="py-3 px-3 text-start">Account Number</th>
                  <th className="py-3 px-3 text-start">IFSC Code</th>
                  <th className="py-3 px-3 text-start">Login Credential</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.map((item, index) => {
                  let resolvedCredential = 
                    item.loginCredentialAccess || 
                    item.loginCredential || 
                    item.email || 
                    item.userEmail || 
                    item.customerEmail || 
                    item.username || 
                    item.userId;

                  if (!resolvedCredential) {
                    resolvedCredential = "8409844260";
                  }

                  return (
                    <tr key={item.id || item.bankRefundableAmountId || index}>
                      <td className="py-3 px-3">{item.id || item.bankRefundableAmountId || index + 1}</td>
                      <td className="py-3 px-3">{item.bank_CustomerName || item.customerName || item.name || 'N/A'}</td>
                      <td className="py-3 px-3">{item.bankName || 'N/A'}</td>
                      <td className="py-3 px-3">{item.bankAccountNumber || item.accountNumber || 'N/A'}</td>
                      <td className="py-3 px-3">{item.bankIFSCCode || item.ifscCode || 'N/A'}</td>
                      <td className="py-3 px-3 text-info fw-bold">{resolvedCredential}</td>
                      <td className="py-3 px-3 text-center">
                        <button 
                          className="btn btn-sm btn-outline-success px-3"
                          onClick={() => setSelectedCustomer({ ...item, resolvedCredential })}
                        >
                          <i className="fas fa-eye me-1"></i> 
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Modal Popup View */}
        {selectedCustomer && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
          }}>
            <div className="bg-dark text-white p-4 rounded border border-secondary" style={{ width: '500px', maxWidth: '90%' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                <h4 className="m-0 text-success">Customer Refund Detail</h4>
                <button 
                  className="btn btn-sm btn-danger" 
                  onClick={() => setSelectedCustomer(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="d-flex flex-column gap-2" style={{ fontSize: '14px' }}>
                <div><strong>Record ID:</strong> {selectedCustomer.id || selectedCustomer.bankRefundableAmountId || 'N/A'}</div>
                <div><strong>Customer Name:</strong> {selectedCustomer.bank_CustomerName || selectedCustomer.customerName || selectedCustomer.name || 'N/A'}</div>
                <div><strong>Login Credential (User ID):</strong> <span className="text-info">{selectedCustomer.resolvedCredential}</span></div>
                <div><strong>Bank Name:</strong> {selectedCustomer.bankName || 'N/A'}</div>
                <div><strong>Account Number:</strong> {selectedCustomer.bankAccountNumber || selectedCustomer.accountNumber || 'N/A'}</div>
                <div><strong>Confirm Account Number:</strong> {selectedCustomer.confirmBankAccountNumber || selectedCustomer.confirmAccountNumber || selectedCustomer.reEnterAccountNumber || selectedCustomer.bankAccountNumber || 'N/A'}</div>
                <div><strong>IFSC Code:</strong> {selectedCustomer.bankIFSCCode || selectedCustomer.ifscCode || 'N/A'}</div>
                {/* <div><strong>Refundable Amount:</strong> {selectedCustomer.bankRefundableAmount !== undefined ? `₹${selectedCustomer.bankRefundableAmount}` : 'N/A'}</div> */}
              </div>

              <div className="mt-4 text-end">
                <button className="btn btn-secondary btn-sm px-4" onClick={() => setSelectedCustomer(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
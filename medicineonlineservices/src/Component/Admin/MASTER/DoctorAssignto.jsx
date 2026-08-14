import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const API_BASE = "https://ecommerencesite.onrender.com/api/PatientDetailsAPI";

export default function DoctorAssignto() {
  const [assignments, setAssignments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [doctorType, setDoctorType] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sidebar specific states
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(true);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none transition-all ${
      isActive ? 'bg-success text-white' : 'text-white-50 hover-sidebar-menu'
    }`;
  };

  const getSubLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `d-flex align-items-center text-decoration-none py-1.5 transition-all ${
      isActive ? 'text-success fw-bold' : 'text-white-50 hover-sidebar-menu'
    }`;
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/AllDoctorAssigntoPatient`); 
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAssignments(data);
      } else if (data && typeof data === 'object') {
        if (data.$values && Array.isArray(data.$values)) {
          setAssignments(data.$values);
        } else {
          setAssignments([data]);
        }
      } else {
        setAssignments([]);
      }
    } catch (err) {
      setError('Failed to fetch doctor assignments.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const payload = {
      doctorName,
      doctorType,
    };

    try {
      let url = `${API_BASE}/AddDoctorAssigntoPatient`;
      let method = 'POST';

      if (editId) {
        url = `${API_BASE}/UpdateDoctorAssigntoPatient`;
        method = 'PUT'; 
        payload.doctorAssigntoPatientod = editId;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Operation failed');

      setSuccessMsg(editId ? 'Assignment updated successfully!' : 'Doctor assigned successfully!');
      setDoctorName('');
      setDoctorType('');
      setEditId(null);
      fetchAssignments();
    } catch (err) {
      setError('An error occurred while saving data.');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.doctorAssigntoPatientod || item.DoctorAssigntoPatientod);
    setDoctorName(item.doctorName || item.DoctorName);
    setDoctorType(item.doctorType || item.DoctorType);
  };

 const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      // FIX: Changed from path parameter to query parameter ?id=
      const response = await fetch(`${API_BASE}/DeleteDoctorAssigntoPatient?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setSuccessMsg('Assignment deleted successfully!');
      fetchAssignments();
    } catch (err) {
      setError('Failed to delete the assignment.');
    }
  };

  // Pagination Logic (5 items per page)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = assignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(assignments.length / itemsPerPage) || 1;

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
          
          {/* 1. MASTER CONFIG DROPDOWN */}
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
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/doctorassignto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddDoctorAssignTo
                </Link>

               <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>

               <Link to="/languagematerpanels" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                             <i className="fas fa-language"></i> Language Master
                                         </Link>
  <Link to="/statenamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                             <i className="fas fa-language"></i> StateName Master  
                                         </Link>
  <Link to="/citynamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                             <i className="fas fa-language"></i>  CityName Master
                                         </Link>


                                          
         
          
              </div>
            )}
          </div>

          {/* 2. OPERATIONS REGISTRY DROPDOWN */}
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
                <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster</Link></li>
                <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails</Link></li> 
                <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form</Link></li>
                <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList</Link></li>
                <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist</Link></li>
                <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
                <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link></li>
                <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link></li>
                 <li>   <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
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

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px', flex: 1, backgroundColor: '#121212', color: '#fff', padding: '30px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Header Section */}
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ fontWeight: '700', color: '#f8f9fa' }}>Doctor Assignment Management</h2>
            <p style={{ color: '#adb5bd', fontSize: '14px' }}>Configure doctor specializations and manage patient assignments.</p>
          </div>

          {/* Feedback Alerts */}
          {error && <div style={{ padding: '12px', backgroundColor: '#dc3545', color: '#fff', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}
          {successMsg && <div style={{ padding: '12px', backgroundColor: '#198754', color: '#fff', borderRadius: '6px', marginBottom: '20px' }}>{successMsg}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '25px' }}>
            
            {/* Form Card */}
            <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', border: '1px solid #2d2d37', height: 'fit-content' }}>
              <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#e9ecef' }}>
                {editId ? 'Update Assignment' : 'Add Doctor Assign'}
              </h4>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#adb5bd', marginBottom: '5px', textTransform: 'uppercase' }}>Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                    placeholder="e.g. Dr. Smith"
                    style={{ width: '100%', padding: '10px', backgroundColor: '#121212', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#adb5bd', marginBottom: '5px', textTransform: 'uppercase' }}>Doctor Type</label>
                  <input
                    type="text"
                    value={doctorType}
                    onChange={(e) => setDoctorType(e.target.value)}
                    required
                    placeholder="e.g. Cardiologist"
                    style={{ width: '100%', padding: '10px', backgroundColor: '#121212', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{ flex: 1, backgroundColor: '#198754', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    {editId ? 'Update Record' : 'Save Record'}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      onClick={() => { setEditId(null); setDoctorName(''); setDoctorType(''); }}
                      style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Registry Table List with 1 to 5 Pagination */}
            <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', border: '1px solid #2d2d37', overflowX: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#e9ecef' }}>Assigned Doctors Directory</h4>
                
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#adb5bd', padding: '20px' }}>Loading registry data...</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #2d2d37', color: '#adb5bd' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Doctor Name</th>
                        <th style={{ padding: '10px' }}>Type</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAssignments.length > 0 ? (
                        currentAssignments.map((item, index) => {
                          const id = item.doctorAssigntoPatientod || item.DoctorAssigntoPatientod || index;
                          const name = item.doctorName || item.DoctorName || "N/A";
                          const type = item.doctorType || item.DoctorType || "N/A";

                          return (
                            <tr key={id} style={{ borderBottom: '1px solid #2d2d37' }}>
                              <td style={{ padding: '10px', color: '#8a8a98' }}>#{id}</td>
                              <td style={{ padding: '10px', fontWeight: '600',backgroundColor: 'rgba(25, 135, 84, 0.2)', color: '#2ecc71' }}>{name}</td>
                              <td style={{ padding: '10px' }}>
                                <span style={{ backgroundColor: 'rgba(25, 135, 84, 0.2)', color: '#2ecc71', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                  {type}
                                </span>
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <button
                                  onClick={() => handleEdit(item)}
                                  style={{ backgroundColor: 'transparent', border: '1px solid #0d6efd', color: '#0d6efd', padding: '4px 8px', borderRadius: '4px', marginRight: '6px', cursor: 'pointer' }}
                                >
                                                                <i className="fas fa-edit"></i> 

                                </button>
                                <button
                                  onClick={() => handleDelete(id)}
                                  style={{ backgroundColor: 'transparent', border: '1px solid #dc3545', color: '#dc3545', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', color: '#adb5bd', padding: '30px' }}>
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination Controls (1 to 5) */}
              {assignments.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #2d2d37' }}>
                  <span style={{ fontSize: '13px', color: '#adb5bd' }}>
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, assignments.length)} of {assignments.length} entries
                  </span>
                  
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      style={{ backgroundColor: '#121212', border: '1px solid #3f3f46', color: currentPage === 1 ? '#555' : '#fff', padding: '5px 10px', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        style={{
                          backgroundColor: currentPage === number ? '#198754' : '#121212',
                          border: '1px solid #3f3f46',
                          color: '#fff',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: currentPage === number ? 'bold' : 'normal'
                        }}
                      >
                        {number}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      style={{ backgroundColor: '#121212', border: '1px solid #3f3f46', color: currentPage === totalPages ? '#555' : '#fff', padding: '5px 10px', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
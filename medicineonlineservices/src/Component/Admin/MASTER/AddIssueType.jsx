import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddIssueType() {
  const navigate = useNavigate();

  // --- Form & Data States ---
  const [issueCategory, setIssueCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // --- Layout Sidebar States ---
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(true); 
  const [isShopOpen, setIsShopOpen] = useState(() => localStorage.getItem("shopStatus") !== "OFF");

  // --- Helper to extract fields safely ---
  const getCategoryId = (cat, fallbackIdx) => {
    return cat.issueCategoryMasterId || cat.issuecategorymasterid || cat.id || cat.Id || cat.ID || cat.issueCategoryId || cat.issuecategoryid || fallbackIdx;
  };

  const getCategoryName = (cat) => {
    return cat.issueCategory || cat.IssueCategory || cat.issuecategory || cat.issueCategoryName || cat.issuecategoryName || cat.categoryName || cat.name || '';
  };

  // --- Fetch All Categories on Mount ---
  const fetchCategories = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(
        `https://ecommerencesite.onrender.com/api/TicketAPI/MasterGetAllIssuecategory?t=${Date.now()}`,
        {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        const extractedData = Array.isArray(data) ? data : (data.data || []);
        setCategories(extractedData);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Shop Toggle Handler ---
  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  // --- Create or Update Form Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issueCategory.trim()) {
      setMessage('Please enter an issue category.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (editingId) {
        // ===================================================
        // 🛠️ SAFE WORKAROUND UPDATE: DELETE OLD + ADD NEW 🛠️
        // ===================================================
        
        // 1. पहले पुराने अनुपयोगी रिकॉर्ड को हटाएं
        const deleteResponse = await fetch(`https://ecommerencesite.onrender.com/api/TicketAPI/MasterDeleteissuecategory/${editingId}`, {
          method: 'DELETE', 
        });

        if (deleteResponse.ok) {
          // 2. तुरंत नई वैल्यू के साथ डेटा इन्सर्ट करें
          const addResponse = await fetch('https://ecommerencesite.onrender.com/api/TicketAPI/MasterAddIssuecategory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              IssueCategory: issueCategory.trim(),
              issueCategory: issueCategory.trim()
            }),
          });

          if (addResponse.ok) {
            setMessage('Issue Category updated successfully!');
            setIssueCategory('');
            setEditingId(null);
            await fetchCategories();
          } else {
            setMessage('Failed to save the updated value. Try again.');
          }
        } else {
          setMessage('Update operation failed at initialization step.');
        }

      } else {
        // --- ADD / CREATE OPERATION ---
        const response = await fetch('https://ecommerencesite.onrender.com/api/TicketAPI/MasterAddIssuecategory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            IssueCategory: issueCategory.trim(),
            issueCategory: issueCategory.trim()
          }),
        });

        if (response.ok) {
          setMessage('Issue Category added successfully!');
          setIssueCategory(''); 
          await fetchCategories(); 
        } else {
          setMessage('Failed to add issue category. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error executing operation:', error);
      setMessage('An error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // --- Set Form values for Editing state ---
  const handleEditClick = (category, index) => {
    setMessage('');
    setEditingId(getCategoryId(category, index));
    setIssueCategory(getCategoryName(category));
  };

  // --- Cancel active edit action ---
  const handleCancelEdit = () => {
    setEditingId(null);
    setIssueCategory('');
    setMessage('');
  };

  // --- Delete Handler ---
  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue category?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TicketAPI/MasterDeleteissuecategory/${id}`, {
        method: 'DELETE', 
      });

      if (response.ok) {
        setMessage('Category removed successfully.');
        if (editingId === id) handleCancelEdit();
        fetchCategories();
      } else {
        setMessage('Failed to delete category.');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      setMessage('Error deleting item from API endpoints.');
    } finally {
      setLoading(false);
    }
  };

  // --- Pagination Logic Calculation ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>

        <div className="mb-3 border-bottom border-secondary pb-3">
          <button 
            type="button"
            onClick={() => setMasterDropdownOpen(!masterDropdownOpen)} 
            className="btn btn-outline-success w-100 text-start d-flex justify-content-between align-items-center fw-bold mb-2" 
            style={{ fontSize: '13px', borderStyle: 'dashed' }}
          >
            <span className="d-flex align-items-center gap-2">
              <i className="fas fa-sliders-h"></i> Master Config
            </span>
            <i className={`fas ${masterDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"}`} style={{ fontSize: '11px' }}></i>
          </button>
          
          {masterDropdownOpen && (
            <div className="ps-1 mt-2">
              <Link 
                to="/adminissuetype" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i> Add Item Type
              </Link>
               <Link 
                to="/adminmasterassignedto" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i> AddAssignedTO 
              </Link>
               {/* <Link 
                to="/doctorassignto" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i>  AddDoctorAssignTo 
              </Link> */}
                 <Link 
                to="/addadmintypes" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i>  AddAdminTypes 
              </Link>
                <Link to="/languagematerpanels " className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                              <i className="fas fa-language"></i> Language Master
                                          </Link>

  <Link to="/statenamemasters " className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                              <i className="fas fa-language"></i> StateName Master
                                          </Link>
  <Link to="/citynamemasters " className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                              <i className="fas fa-language"></i>  CityName Master 
                                          </Link>
 <Link to="/addaccountmastertypes " className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                              <i className="fas fa-language"></i>                                 
                                               Accountant Master Types             

                                          </Link>

     
                                 
       
            </div>
          )}
        </div>

        <ul className="nav flex-column">
          <li className="mb-3">
            <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between" onClick={handleShopToggle} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '11px' }}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
              <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
            </div>
          </li>
          <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
          {/* FIXED: Removed the invalid 'Harm' prop from here */}
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
          <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
          <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
          <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
          <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>
          <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">AdminbankselectMaster </Link></li>
          <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">AdminBankCreditAmountDetails </Link></li> 
          {/* <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li> */}
          <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
          <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminLivenessimageList </Link></li>
          {/* <li><Link to="/adminsupportticketlist" className="btn btn-outline-success w-100 mb-2 text-start">AdminSupportTicketList </Link></li> */}
          <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">Admincustomerticketraiselist </Link></li>
                            <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund</Link></li>
                    <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
    <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
 <li>   <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start" >Doctor_PatientdetailsLists       </Link></li>
<li><Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link></li>
 <li><Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link></li>
          <li className="mt-3">
            <button type="button" onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </button>
          </li>
        </ul>
      </div>

      {/* TWO COLUMN WORKSPACE PANEL */}
      <div style={{ flex: 1, marginLeft: '260px', padding: '40px', display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN: FORM */}
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1a1a1a', padding: '30px', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '25px', color: editingId ? '#ffc107' : '#28a745', textAlign: 'center' }}>
            {editingId ? 'Edit Issue Category' : 'Add Issue Category'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="issueCategory" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ccc', fontSize: '14px' }}>
                Issue Category Name:
              </label>
              <input
                type="text"
                id="issueCategory"
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                placeholder="e.g., Hardware, Software, Network"
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#2a2a2a', border: '1px solid #444', borderRadius: '4px', color: '#fff', outline: 'none' }}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', backgroundColor: editingId ? '#ffc107' : '#28a745', color: editingId ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'background-color 0.2s' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : editingId ? 'Update Category' : 'Add Category'}
            </button>

            {editingId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </form>

          {message && (
            <p style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', textAlign: 'center', fontWeight: '500', fontSize: '14px', backgroundColor: message.toLowerCase().includes('success') ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)', color: message.toLowerCase().includes('success') ? '#28a745' : '#dc3545', border: `1px solid ${message.toLowerCase().includes('success') ? '#28a745' : '#dc3545'}` }}>
              {message}
            </p>
          )}
        </div>

        {/* RIGHT COLUMN: MANAGEMENT TABLE WITH PAGINATION */}
        <div style={{ flex: 1, minWidth: '400px', backgroundColor: '#1a1a1a', padding: '30px', border: '1px solid #333', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#28a745' }}>Category Management Table</h3>
          
          {fetchLoading ? (
            <p style={{ color: '#aaa', textAlign: 'center' }}>Loading items from API server...</p>
          ) : categories.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>No record objects found.</p>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', backgroundColor: '#1a1a1a', color: '#fff' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #333', color: '#888', backgroundColor: '#1a1a1a' }}>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Item Category Name</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((cat, idx) => {
                      const absoluteIndex = indexOfFirstItem + idx;
                      const currentId = getCategoryId(cat, absoluteIndex);
                      const name = getCategoryName(cat);
                      
                      const rowBg = editingId === currentId ? 'rgba(255,193,7,0.15)' : '#1a1a1a';
                      
                      return (
                        <tr key={currentId} style={{ borderBottom: '1px solid #333', backgroundColor: rowBg }}>
                          <td style={{ padding: '12px 10px', color: '#aaa' }}>{currentId}</td>
                          <td style={{ padding: '12px 10px', fontWeight: '500', color: '#fff' }}>
                            {name || <span style={{color: '#666', fontStyle: 'italic'}}>N/A</span>}
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                            <button 
                              onClick={() => handleEditClick(cat, absoluteIndex)}
                              className="btn btn-sm btn-outline-warning me-2"
                              style={{ fontSize: '12px', padding: '3px 10px' }}
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(currentId)}
                              className="btn btn-sm btn-outline-danger"
                              style={{ fontSize: '12px', padding: '3px 10px' }}
                            >
                              <i className="fas fa-trash-alt"></i> Del
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '5px' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ padding: '5px 12px', backgroundColor: '#2a2a2a', color: currentPage === 1 ? '#555' : '#fff', border: '1px solid #444', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{ padding: '5px 12px', backgroundColor: currentPage === pageNum ? '#28a745' : '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', fontWeight: currentPage === pageNum ? 'bold' : 'normal' }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ padding: '5px 12px', backgroundColor: '#2a2a2a', color: currentPage === totalPages ? '#555' : '#fff', border: '1px solid #444', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
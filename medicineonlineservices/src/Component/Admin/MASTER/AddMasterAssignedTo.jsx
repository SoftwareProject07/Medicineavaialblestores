import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddMasterAssignedTo() {
  // --- Navigation Hook ---
  const navigate = useNavigate();

  // --- States ---
  const [assignments, setAssignments] = useState([]);
  const [assignedToName, setAssignedToName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal / Action states for Update & Details
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [viewingItem, setViewingItem] = useState(null);

  // Side Menu Specific States
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(true);

  // Base URL config
  const API_BASE = "https://ecommerencesite.onrender.com/api/TicketAPI";

  // --- Side Menu Actions ---
  const handleShopToggle = () => {
    setIsShopOpen(prev => !prev);
  };

  // --- DYNAMIC NAME DETECTOR ---
  const getNameProperty = (item) => {
    if (!item || typeof item !== 'object') return 'No Name';
    
    const standardName = item.assignedTo || item.AssignedTo ||
                         item.masterAssignedToName || item.MasterAssignedToName || 
                         item.assignedToName || item.AssignedToName || 
                         item.name || item.Name;
    if (standardName) return standardName;

    const keys = Object.keys(item);
    for (let key of keys) {
      if (!key.startsWith('$') && typeof item[key] === 'string' && item[key].trim() !== '') {
        return item[key];
      }
    }
    return 'No Name';
  };

  // --- DYNAMIC ID DETECTOR ---
  const getIdProperty = (item) => {
    if (!item || typeof item !== 'object') return '';
    if (item.ticketId !== undefined) return item.ticketId;
    if (item.TicketId !== undefined) return item.TicketId;
    if (item.masterAssignedToId !== undefined) return item.masterAssignedToId;
    if (item.id !== undefined) return item.id;

    const keys = Object.keys(item);
    const numericKey = keys.find(k => typeof item[k] === 'number' && !k.startsWith('$'));
    return numericKey ? item[numericKey] : '';
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // --- 1. GET ALL (FETCH RECORDS) ---
  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/MasterAllAssignticket`);
      if (!response.ok) throw new Error('Failed to fetch data from server');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAssignments(data);
      } else if (data && Array.isArray(data.$values)) { 
        setAssignments(data.$values);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // --- 2. POST (ADD RECORD) ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const cleanName = assignedToName.trim();
    if (!cleanName) return;

    const currentISODate = new Date().toISOString();

    const completeTicketPayload = {
      ticketId: 0,
      ticketNumber: "string",
      customerName: "string",
      mobileNo: "string",
      email: "string",
      customerId: "string",
      orderId: "string",
      medicineName: "string",
      issueCategory: "string",
      subject: "string",
      description: "string",
      priority: "string",
      status: "string",
      attachment: "string",
      assignedTo: cleanName,
      resolutionRemark: "string",
      createdDate: currentISODate,
      updatedDate: currentISODate,
      closedDate: currentISODate,
      departmentOption: "string"
    };

    try {
      const response = await fetch(`${API_BASE}/MasterAddAssignticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(completeTicketPayload)
      });

      if (response.ok) {
        setAssignedToName('');
        alert('Record added successfully!');
        fetchAssignments(); 
      } else {
        alert(`Server Error ${response.status}: Failed to add record.`);
      }
    } catch (err) {
      alert(`Network Error: ${err.message}`);
    }
  };

  // --- 3. PUT (UPDATE RECORD) ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const cleanName = editName.trim();
    if (!cleanName || !editingItem) return;

    const currentId = getIdProperty(editingItem) || 0;
    const currentISODate = new Date().toISOString();

    const updatePayload = {
      ticketId: currentId,
      ticketNumber: editingItem.ticketNumber || "string",
      customerName: editingItem.customerName || "string",
      mobileNo: editingItem.mobileNo || "string",
      email: editingItem.email || "string",
      customerId: editingItem.customerId || "string",
      orderId: editingItem.orderId || "string",
      medicineName: editingItem.medicineName || "string",
      issueCategory: editingItem.issueCategory || "string",
      subject: editingItem.subject || "string",
      description: editingItem.description || "string",
      priority: editingItem.priority || "string",
      status: editingItem.status || "string",
      attachment: editingItem.attachment || "string",
      assignedTo: cleanName,
      resolutionRemark: editingItem.resolutionRemark || "string",
      createdDate: editingItem.createdDate || currentISODate,
      updatedDate: currentISODate,
      closedDate: editingItem.closedDate || currentISODate,
      departmentOption: editingItem.departmentOption || "string"
    };

    try {
      const response = await fetch(`${API_BASE}/MasterUpdateAssignticket?id=${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
      if (response.ok) {
        setEditingItem(null);
        fetchAssignments();
        alert('Record updated successfully!');
      } else {
        alert('Update Failed');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // --- 4. DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment record?')) return;

    try {
      const response = await fetch(`${API_BASE}/MasterDeleteAssignticket?deleteassignid=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Record deleted successfully!');
        fetchAssignments(); 
      } else {
        alert(`Delete Failed with status: ${response.status}`);
      }
    } catch (err) {
      alert(`Network Error: ${err.message}`);
    }
  };

  // --- SEARCH & PAGINATION ---
  const filteredAssignments = assignments.filter((item) => {
    return getNameProperty(item).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalItems = filteredAssignments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);

  // --- Theme Layout Design Styles ---
  const styles = {
    container: { backgroundColor: '#121212', minHeight: '100vh', color: '#ffffff', fontFamily: 'sans-serif', position: 'relative' },
    sideMenu: { width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, overflowY: 'auto' },
    mainContent: { marginLeft: '260px', padding: '40px 20px', display: 'flex', gap: '24px', minHeight: '100vh' },
    card: { backgroundColor: '#1e1e1e', border: '1px solid #333333', borderRadius: '6px', padding: '24px' },
    inputFormSide: { width: '320px', height: 'fit-content', flexShrink: 0 },
    tableSide: { flex: 1 },
    heading: { color: '#28a745', fontSize: '20px', fontWeight: '600', marginTop: 0, marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#e0e0e0', marginBottom: '8px' },
    input: { width: '100%', padding: '10px 12px', backgroundColor: '#2d2d2d', border: '1px solid #555555', borderRadius: '4px', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', marginBottom: '20px' },
    btnPrimary: { width: '100%', backgroundColor: '#28a745', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
    searchInput: { padding: '8px 12px', backgroundColor: '#2d2d2d', border: '1px solid #555555', borderRadius: '4px', color: '#ffffff', marginBottom: '15px', width: '280px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: '#1e1e1e' },
    tr: { borderBottom: '1px solid #3a3a3a' },
    th: { borderBottom: '2px solid #555555', textAlign: 'left', padding: '14px 12px', color: '#cccccc', fontSize: '13px', textTransform: 'uppercase', fontWeight: '700' },
    td: { padding: '14px 12px', fontSize: '14px', color: '#ffffff', backgroundColor: '#1e1e1e' },
    btnAction: { padding: '5px 12px', marginRight: '6px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
    paginationContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #333333' },
    paginationBtn: { padding: '6px 12px', backgroundColor: '#2d2d2d', border: '1px solid #555555', color: '#ffffff', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#1e1e1e', border: '1px solid #555555', borderRadius: '6px', padding: '24px', width: '400px', color: '#ffffff' }
  };

  return (
    <div style={styles.container}>
      
      {/* INTEGRATED SIDE MENU */}
      <div style={styles.sideMenu}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>

        {/* --- Master Config Dropdown Section --- */}
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

               <Link 
                to="/doctorassignto" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i> AddDoctorAssignTo 
              </Link>
                <Link 
                to="/addadmintypes" 
                className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" 
                style={{ fontSize: '12px' }}
              >
                <i className="fas fa-plus-circle"></i> AddAdminTypes 
              </Link>
  <Link to="/languagematerpanels" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                <i className="fas fa-language"></i> Language Master
                            </Link>

  <Link to="/statenamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                <i className="fas fa-language"></i>   StateName Master
                            </Link>

  <Link to="/citynamemasters" className="btn btn-warning w-100 text-start d-flex align-items-center gap-2 fw-bold mb-1" style={{ fontSize: '12px' }}>
                                <i className="fas fa-language"></i>CityName Master
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
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
          <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
          <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
          <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
          <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>
          <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">AdminbankselectMaster </Link></li>
          <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">AdminBankCreditAmountDetails </Link></li> 
          <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start"> Registeartion Form </Link></li>
          <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
          <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminLivenessimageList </Link></li>
          {/* <li><Link to="/adminsupportticketlist" className="btn btn-outline-success w-100 mb-2 text-start">AdminSupportTicketList </Link></li> */}
          <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">Admincustomerticketraiselist </Link></li>
                            <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details Refund List</Link></li>
                    <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
 <li>   <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
         </Link></li>
          <li><Link to="/hiringcandidteapplieds" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATA</Link></li>

          <li className="mt-3">
            <button type="button" onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </button>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT AREA CONTAINER */}
      <div style={styles.mainContent}>
        
        {/* INPUT FORM PANEL */}
        <div style={{ ...styles.card, ...styles.inputFormSide }}>
          <h3 style={styles.heading}>Add Master Assigned To</h3>
          <form onSubmit={handleAddSubmit}>
            <label style={styles.label}>Assigned To Name:</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g., sa"
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
              required
            />
            <button type="submit" style={styles.btnPrimary}>Add Assignment</button>
          </form>
        </div>

        {/* RENDER TABLE PANEL */}
        <div style={{ ...styles.card, ...styles.tableSide }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
            <h3 style={{ ...styles.heading, flex: 1 }}>Assigned Management Table</h3>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading && <p style={{ color: '#aaaaaa' }}>Loading entries...</p>}
          {error && <p style={{ color: '#dc3545' }}>Error status: {error}</p>}

          {!loading && !error && filteredAssignments.length === 0 && (
            <p style={{ color: '#aaaaaa' }}>No entries found inside database.</p>
          )}

          {!loading && filteredAssignments.length > 0 && (
            <>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: '15%' }}>Ticket ID</th>
                    <th style={styles.th}>Assigned Name</th>
                    <th style={{ ...styles.th, width: '35%', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => {
                    const itemId = getIdProperty(item) || index;
                    const itemName = getNameProperty(item);
                    return (
                      <tr key={itemId} style={styles.tr}>
                        <td style={styles.td}><strong>{itemId}</strong></td>
                        <td style={styles.td}>{itemName}</td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <button style={{ ...styles.btnAction, backgroundColor: '#17a2b8', color: '#ffffff' }} onClick={() => setViewingItem(item)}>
                            <i className="fas fa-info-circle"></i> 
                            </button>
                          <button style={{ ...styles.btnAction, backgroundColor: '#ffc107', color: '#000000' }} onClick={() => { setEditingItem(item); setEditName(itemName); }}>
                            <i className="fas fa-edit"></i> 
                            </button>
                          <button style={{ ...styles.btnAction, backgroundColor: '#dc3545', color: '#ffffff' }} onClick={() => handleDelete(itemId)}>
                            <i className="fas fa-trash-alt"></i> 
                            </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PAGINATION PANEL */}
              <div style={styles.paginationContainer}>
                <span style={{ color: '#aaaaaa', fontSize: '13px' }}>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={styles.paginationBtn} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                  <span style={{ alignSelf: 'center', fontSize: '13px', color: '#ffffff', padding: '0 5px' }}>Page {currentPage} of {totalPages || 1}</span>
                  <button style={styles.paginationBtn} disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* DETAILS MODAL */}
      {viewingItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.heading}>Assignment Details</h3>
            <p><strong>Ticket ID:</strong> {getIdProperty(viewingItem)}</p>
            <p><strong>Assigned Name:</strong> {getNameProperty(viewingItem)}</p>
            <button style={{ ...styles.btnPrimary, backgroundColor: '#6c757d', marginTop: '15px' }} onClick={() => setViewingItem(null)}>Close</button>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {editingItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.heading}>Update Assignment Entry</h3>
            <form onSubmit={handleUpdateSubmit}>
              <label style={styles.label}>Modify Name Field:</label>
              <input style={styles.input} type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={styles.btnPrimary}>Save Changes</button>
                <button type="button" style={{ ...styles.btnPrimary, backgroundColor: '#6c757d' }} onClick={() => setEditingItem(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useState, useEffect } from 'react';

// export default function AdminMedicationTracker() {
//   const [medications, setMedications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const [modalMode, setModalMode] = useState(null); // 'create', 'edit', 'details', null
//   const [selectedMed, setSelectedMed] = useState(null);
//   const [formData, setFormData] = useState({ 
//     id: null,
//     medicationName: '', 
//     dosage: '', 
//     frequency: '', 
//     startDate: '', 
//     endDate: '', 
//     status: 'Active' 
//   });

//   useEffect(() => {
//     fetchMedications();
//   }, []);

//   // 1. FETCH ALL MEDICATIONS
//   const fetchMedications = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:5256/api/TestingDashBoardPanelAPI/AllMedicationtracker');
      
//       if (!response.ok) {
//         const errorBody = await response.text();
//         console.error(`Backend GET Error (${response.status}):`, errorBody);
//         setMedications([]);
//         return;
//       }

//       const data = await response.json();
//       setMedications(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Network or Parsing Error (GET):', error);
//       setMedications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const openCreateModal = () => {
//     setFormData({ id: null, medicationName: '', dosage: '', frequency: '', startDate: '', endDate: '', status: 'Active' });
//     setModalMode('create');
//   };

//   const openEditModal = (med) => {
//     setSelectedMed(med);
//     setFormData({
//       id: med.id,
//       medicationName: med.medicationName || '',
//       dosage: med.dosage || '',
//       frequency: med.frequency || '',
//       startDate: med.startDate ? med.startDate.split('T')[0] : '',
//       endDate: med.endDate ? med.endDate.split('T')[0] : '',
//       status: med.status || 'Active'
//     });
//     setModalMode('edit');
//   };

//   // 2. GET SINGLE MEDICATION DETAILS
//   const openDetailsModal = async (med) => {
//     try {
//       const response = await fetch(`http://localhost:5256/api/TestingDashBoardPanelAPI/DetailsMedicationtracker?id=${med.id}`);
//       if (response.ok) {
//         const data = await response.json();
//         setSelectedMed(data || med);
//       } else {
//         setSelectedMed(med);
//       }
//     } catch (error) {
//       console.error('Error fetching medication details:', error);
//       setSelectedMed(med);
//     }
//     setModalMode('details');
//   };

//   const closeModal = () => {
//     setModalMode(null);
//     setSelectedMed(null);
//   };

//   // 3. CREATE & UPDATE SUBMISSION
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         medicationName: formData.medicationName,
//         dosage: formData.dosage,
//         frequency: formData.frequency,
//         startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
//         endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
//         status: formData.status || 'Active'
//       };

//       if (modalMode === 'edit' && formData.id !== null) {
//         payload.id = formData.id;
//       }

//       const endpoint = modalMode === 'create' 
//         ? 'http://localhost:5256/api/TestingDashBoardPanelAPI/CreateMedicationtracker' 
//         : 'http://localhost:5256/api/TestingDashBoardPanelAPI/UpdateMedicationtracker';
      
//       const method = modalMode === 'create' ? 'POST' : 'PUT';

//       const response = await fetch(endpoint, {
//         method: method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       if (response.ok) {
//         fetchMedications();
//         closeModal();
//       } else {
//         const errorText = await response.text();
//         console.error(`Backend ${method} Error (${response.status}):`, errorText);
//         alert(`Server Error (${response.status}): Check browser console for details.`);
//       }
//     } catch (error) {
//       console.error('Network or Parsing Error (Submit):', error);
//     }
//   };

//   // 4. DELETE MEDICATION
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this medication?')) {
//       try {
//         const response = await fetch(`http://localhost:5256/api/TestingDashBoardPanelAPI/DeleteMedicationtracker?id=${id}`, {
//           method: 'DELETE'
//         });
//         if (response.ok) {
//           fetchMedications();
//         } else {
//           const errorText = await response.text();
//           console.error('Delete Error:', errorText);
//           alert('Failed to delete medication.');
//         }
//       } catch (error) {
//         console.error('Error deleting medication:', error);
//       }
//     }
//   };

//   const filteredMedications = medications.filter(item => 
//     (item.medicationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (item.dosage || '').toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="admin-tracker">
//       <style>{`
//         .admin-tracker {
//           padding: 28px;
//           background-color: #f8fafc;
//           min-height: 100vh;
//           font-family: system-ui, -apple-system, sans-serif;
//         }
//         .header-flex {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }
//         .btn-primary {
//           background-color: #2563eb;
//           color: white;
//           padding: 10px 18px;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//         }
//         .btn-primary:hover { background-color: #1d4ed8; }
//         .search-box {
//           width: 100%;
//           max-width: 380px;
//           padding: 10px 14px;
//           border: 1px solid #cbd5e1;
//           border-radius: 8px;
//           margin-bottom: 20px;
//           font-size: 0.95rem;
//           outline: none;
//           background: #fff;
//         }
//         .table-card {
//           background: white;
//           border-radius: 12px;
//           border: 1px solid #e2e8f0;
//           overflow: hidden;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
//         }
//         table { width: 100%; border-collapse: collapse; text-align: left; }
//         th, td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }
//         th { background-color: #f8fafc; font-weight: 600; font-size: 0.85rem; color: #475569; text-transform: uppercase; }
//         .action-btns button {
//           margin-right: 6px;
//           padding: 6px 12px;
//           border-radius: 6px;
//           border: 1px solid #cbd5e1;
//           background: white;
//           cursor: pointer;
//           font-size: 0.85rem;
//           font-weight: 600;
//         }
//         .btn-view { color: #2563eb; border-color: #bfdbfe; }
//         .btn-edit { color: #d97706; border-color: #fde68a; }
//         .btn-delete { color: #dc2626; border-color: #fecaca; }
        
//         .modal-overlay {
//           position: fixed;
//           top: 0; left: 0; right: 0; bottom: 0;
//           background-color: rgba(15, 23, 42, 0.6);
//           backdrop-filter: blur(4px);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }
//         .modal-box {
//           background: white;
//           padding: 28px;
//           border-radius: 16px;
//           width: 100%;
//           max-width: 450px;
//           box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
//         }
//         .form-group { margin-bottom: 14px; }
//         .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.85rem; color: #475569; }
//         .form-group input, .form-group select {
//           width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;
//         }
//         .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
//         .btn-secondary { background: #e2e8f0; color: #475569; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
//       `}</style>

//       <div className="header-flex">
//         <div>
//           <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1e293b' }}>Admin Medication Management</h1>
//           <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Full CRUD control panel for patient prescriptions</p>
//         </div>
//         <button className="btn-primary" onClick={openCreateModal}>+ Add Medication</button>
//       </div>

//       <input
//         type="text"
//         className="search-box"
//         placeholder="🔍 Search medications..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <div className="table-card">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Medication Name</th>
//               <th>Dosage</th>
//               <th>Frequency</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>Loading...</td></tr>
//             ) : filteredMedications.length > 0 ? (
//               filteredMedications.map((med, index) => (
//                 <tr key={med.id || index}>
//                   <td>#{med.id || index + 1}</td>
//                   <td style={{ fontWeight: 600 }}>{med.medicationName || 'N/A'}</td>
//                   <td>{med.dosage || 'N/A'}</td>
//                   <td>{med.frequency || 'N/A'}</td>
//                   <td>
//                     <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#dcfce7', color: '#166534' }}>
//                       {med.status || 'Active'}
//                     </span>
//                   </td>
//                   <td className="action-btns">
//                     <button className="btn-view" onClick={() => openDetailsModal(med)}>View</button>
//                     <button className="btn-edit" onClick={() => openEditModal(med)}>Edit</button>
//                     <button className="btn-delete" onClick={() => handleDelete(med.id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No records found.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Create / Edit Modal */}
//       {(modalMode === 'create' || modalMode === 'edit') && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3 style={{ marginTop: 0, color: '#1e293b' }}>{modalMode === 'create' ? 'Add New Medication' : 'Edit Medication'}</h3>
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label>Medication Name</label>
//                 <input type="text" name="medicationName" value={formData.medicationName} onChange={handleChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Dosage</label>
//                 <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Frequency</label>
//                 <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Start Date</label>
//                 <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
//               </div>
//               <div className="form-group">
//                 <label>End Date</label>
//                 <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Status</label>
//                 <select name="status" value={formData.status} onChange={handleChange}>
//                   <option value="Active">Active</option>
//                   <option value="Completed">Completed</option>
//                   <option value="Discontinued">Discontinued</option>
//                 </select>
//               </div>
//               <div className="modal-actions">
//                 <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
//                 <button type="submit" className="btn-primary">Save Changes</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Details View Modal */}
//       {modalMode === 'details' && selectedMed && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3 style={{ marginTop: 0, color: '#1e293b' }}>Medication Details</h3>
//             <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', lineHeight: '1.6', color: '#475569' }}>
//               <div><strong>ID:</strong> #{selectedMed.id}</div>
//               <div><strong>Name:</strong> {selectedMed.medicationName || 'N/A'}</div>
//               <div><strong>Dosage:</strong> {selectedMed.dosage || 'N/A'}</div>
//               <div><strong>Frequency:</strong> {selectedMed.frequency || 'N/A'}</div>
//               <div><strong>Start Date:</strong> {selectedMed.startDate ? selectedMed.startDate.split('T')[0] : 'N/A'}</div>
//               <div><strong>End Date:</strong> {selectedMed.endDate ? selectedMed.endDate.split('T')[0] : 'N/A'}</div>
//               <div><strong>Status:</strong> {selectedMed.status || 'Active'}</div>
//             </div>
//             <div className="modal-actions">
//               <button type="button" className="btn-primary" onClick={closeModal} style={{ width: '100%' }}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminMedicationTracker() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sidebar States
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const [modalMode, setModalMode] = useState(null); // 'create', 'edit', 'details', null
  const [selectedMed, setSelectedMed] = useState(null);
  const [formData, setFormData] = useState({ 
    id: null,
    medicationName: '', 
    dosage: '', 
    frequency: '', 
    startDate: '', 
    endDate: '', 
    status: 'Active' 
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  // 1. FETCH ALL MEDICATIONS
  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllMedicationtracker');
      
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Backend GET Error (${response.status}):`, errorBody);
        setMedications([]);
        return;
      }

      const data = await response.json();
      setMedications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Network or Parsing Error (GET):', error);
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShopToggle = () => {
    setIsShopOpen(prev => !prev);
  };

  const getNavLinkClass = (path) => {
    return window.location.pathname === path 
      ? "d-flex align-items-center gap-3 px-3 py-2 text-white bg-dark rounded text-decoration-none" 
      : "d-flex align-items-center gap-3 px-3 py-2 text-white-50 rounded text-decoration-none hover-sidebar-menu";
  };

  const getSubLinkClass = (path) => {
    return window.location.pathname === path 
      ? "text-success mb-2 text-start text-decoration-none fw-bold" 
      : "text-white-50 mb-2 text-start text-decoration-none";
  };

  const openCreateModal = () => {
    setFormData({ id: null, medicationName: '', dosage: '', frequency: '', startDate: '', endDate: '', status: 'Active' });
    setModalMode('create');
  };

  const openEditModal = (med) => {
    setSelectedMed(med);
    setFormData({
      id: med.id,
      medicationName: med.medicationName || '',
      dosage: med.dosage || '',
      frequency: med.frequency || '',
      startDate: med.startDate ? med.startDate.split('T')[0] : '',
      endDate: med.endDate ? med.endDate.split('T')[0] : '',
      status: med.status || 'Active'
    });
    setModalMode('edit');
  };

  // 2. GET SINGLE MEDICATION DETAILS
  const openDetailsModal = async (med) => {
    try {
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsMedicationtracker?id=${med.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedMed(data || med);
      } else {
        setSelectedMed(med);
      }
    } catch (error) {
      console.error('Error fetching medication details:', error);
      setSelectedMed(med);
    }
    setModalMode('details');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedMed(null);
  };

  // 3. CREATE & UPDATE SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        frequency: formData.frequency,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        status: formData.status || 'Active'
      };

      if (modalMode === 'edit' && formData.id !== null) {
        payload.id = formData.id;
      }

      const endpoint = modalMode === 'create' 
        ? 'https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/CreateMedicationtracker' 
        : 'https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/UpdateMedicationtracker';
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchMedications();
        closeModal();
      } else {
        const errorText = await response.text();
        console.error(`Backend ${method} Error (${response.status}):`, errorText);
        alert(`Server Error (${response.status}): Check browser console for details.`);
      }
    } catch (error) {
      console.error('Network or Parsing Error (Submit):', error);
    }
  };

  // 4. DELETE MEDICATION
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DeleteMedicationtracker?id=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchMedications();
        } else {
          const errorText = await response.text();
          console.error('Delete Error:', errorText);
          alert('Failed to delete medication.');
        }
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  const filteredMedications = medications.filter(item => 
    (item.medicationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.dosage || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedications = filteredMedications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);

  return (
    <div className="admin-layout" style={{ display: 'flex', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Side Menu */}
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
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>Add Item Type</Link>
                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>AddAssignedTO</Link>
                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>AddAdminTypes</Link>
                <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>Language Master</Link>
                <Link to="/statenamemasters" className={getSubLinkClass("/statenamemasters")}>StateName Master</Link>
                <Link to="/citynamemasters" className={getSubLinkClass("/citynamemasters")}>CityName Master</Link> 
                <Link to="/addaccountmastertypes" className={getSubLinkClass("/addaccountmastertypes")}>Accountant Master Types</Link> 
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
                
                <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Adminmediciationtrackers</Link> 
                <Link to="/admintestreportss" className="btn btn-outline-success w-100 mb-2 text-start">AdminTestReports</Link>
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link>
                <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
                <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
                <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link>
                <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link> 
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registration Form </Link>
                <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link>
                <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link>
                <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link>
                <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> 
                <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> 
                <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start">Doctor_PatientdetailsLists</Link> 
                <Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link>
                <Link to="/qrcodeupload" className="btn btn-outline-success w-100 mb-2 text-start">qrcodeupload</Link>
                <Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link>
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
      <div className="admin-tracker" style={{ marginLeft: '280px', flex: 1, padding: '28px', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <style>{`
          .header-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .btn-primary {
            background-color: #2563eb;
            color: white;
            padding: 10px 18px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
          }
          .btn-primary:hover { background-color: #1d4ed8; }
          .search-box {
            width: 100%;
            max-width: 380px;
            padding: 10px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.95rem;
            outline: none;
            background: #fff;
          }
          .table-card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th, td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }
          th { background-color: #f8fafc; font-weight: 600; font-size: 0.85rem; color: #475569; text-transform: uppercase; }
          .action-btns button {
            margin-right: 6px;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            background: white;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
          }
          .btn-view { color: #2563eb; border-color: #bfdbfe; }
          .btn-edit { color: #d97706; border-color: #fde68a; }
          .btn-delete { color: #dc2626; border-color: #fecaca; }
          
          .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-box {
            background: white;
            padding: 28px;
            border-radius: 16px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          }
          .form-group { margin-bottom: 14px; }
          .form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.85rem; color: #475569; }
          .form-group input, .form-group select {
            width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;
          }
          .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
          .btn-secondary { background: #e2e8f0; color: #475569; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
          
          .pagination-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: white;
            border-top: 1px solid #e2e8f0;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
          }
          .pagination-btns { display: flex; gap: 6px; }
          .page-btn {
            padding: 6px 12px;
            border: 1px solid #cbd5e1;
            background: white;
            color: #334155;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            font-size: 0.85rem;
          }
          .page-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
          .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        `}</style>

        <div className="header-flex">
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1e293b' }}>Admin Medication Management</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Full CRUD control panel for patient prescriptions</p>
          </div>
          <button className="btn-primary" onClick={openCreateModal}>+ Add Medication Tracker </button>
        </div>

        <input
          type="text"
          className="search-box"
          placeholder="🔍 Search medications..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Medication Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>Loading...</td></tr>
              ) : currentMedications.length > 0 ? (
                currentMedications.map((med, index) => {
                  const actualIndex = indexOfFirstItem + index;
                  return (
                    <tr key={med.id || actualIndex}>
                      <td>#{med.id || actualIndex + 1}</td>
                      <td style={{ fontWeight: 600 }}>{med.medicationName || 'N/A'}</td>
                      <td>{med.dosage || 'N/A'}</td>
                      <td>{med.frequency || 'N/A'}</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#dcfce7', color: '#166534' }}>
                          {med.status || 'Active'}
                        </span>
                      </td>
                      <td className="action-btns">
                        <button className="btn-view" onClick={() => openDetailsModal(med)}>View</button>
                        <button className="btn-edit" onClick={() => openEditModal(med)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(med.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>No records found.</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {!loading && filteredMedications.length > 0 && (
            <div className="pagination-container">
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMedications.length)} of {filteredMedications.length} entries
              </span>
              <div className="pagination-btns">
                <button 
                  className="page-btn" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button 
                    key={number} 
                    className={`page-btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </button>
                ))}
                <button 
                  className="page-btn" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create / Edit Modal */}
        {(modalMode === 'create' || modalMode === 'edit') && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ marginTop: 0, color: '#1e293b' }}>{modalMode === 'create' ? 'Add New Medication' : 'Edit Medication'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Medication Name</label>
                  <input type="text" name="medicationName" value={formData.medicationName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Dosage</label>
                  <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <input type="text" name="frequency" value={formData.frequency} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details View Modal */}
        {modalMode === 'details' && selectedMed && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3 style={{ marginTop: 0, color: '#1e293b' }}>Medication Details</h3>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', lineHeight: '1.6', color: '#475569' }}>
                <div><strong>ID:</strong> #{selectedMed.id}</div>
                <div><strong>Name:</strong> {selectedMed.medicationName || 'N/A'}</div>
                <div><strong>Dosage:</strong> {selectedMed.dosage || 'N/A'}</div>
                <div><strong>Frequency:</strong> {selectedMed.frequency || 'N/A'}</div>
                <div><strong>Start Date:</strong> {selectedMed.startDate ? selectedMed.startDate.split('T')[0] : 'N/A'}</div>
                <div><strong>End Date:</strong> {selectedMed.endDate ? selectedMed.endDate.split('T')[0] : 'N/A'}</div>
                <div><strong>Status:</strong> {selectedMed.status || 'Active'}</div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-primary" onClick={closeModal} style={{ width: '100%' }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function DeliveryPersonAssignto() {
  const navigate = useNavigate();
  const location = useLocation();

  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryPersonName, setDeliveryPersonName] = useState('');
  // Default fixed value set for Delivery Type
  const [deliveryPerdsontype, setDeliveryPerdsontype] = useState('DeliveryOrderPerson Login');
  const [editId, setEditId] = useState(null);
  const [detailsData, setDetailsData] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sidebar toggles & states
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(true);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(true);

  const API_BASE = 'https://ecommerencesite.onrender.com/api/PatientDetailsAPI';

  // Toggle Shop Status
  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  // Helper classes for active links
  const getNavLinkClass = (path) => {
    return `d-flex align-items-center gap-3 px-3 py-2 rounded text-decoration-none transition-all ${
      location.pathname === path ? 'bg-success text-white fw-bold' : 'text-white-50 hover-sidebar-menu'
    }`;
  };

  const getSubLinkClass = (path) => {
    return `position-relative text-decoration-none py-1.5 px-2 d-block transition-all ${
      location.pathname === path ? 'text-success fw-bold' : 'text-white-50'
    }`;
  };

  // Universal property extractor covering all spelling variations
  const getVal = (item, keys) => {
    if (!item) return '';
    for (let key of keys) {
      const foundKey = Object.keys(item).find(k => k.toLowerCase() === key.toLowerCase());
      if (foundKey && item[foundKey] !== undefined && item[foundKey] !== null && item[foundKey] !== '') {
        return item[foundKey];
      }
    }
    return '';
  };

  // Fetch all assignments using AllDeliveryAssignto endpoint
  const fetchAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/AllDeliveryAssignto`);
      console.log("API Response Data:", response.data);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setAssignments(data.filter(Boolean));
    } catch (error) {
      console.error('Error fetching assignments:', error);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: 'Failed to load delivery assignments.',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Handle Form Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryPersonName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Delivery Name cannot be empty!',
        background: '#2a2a2a',
        color: '#fff'
      });
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_BASE}/UpdateDeliveryAssignto`, {
          deliveryAssgintoId: editId,
          deliveryPersonName: deliveryPersonName,
          deliveryPerdsonType: deliveryPerdsontype
        });
        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully',
          text: 'Delivery person updated successfully!',
          background: '#2a2a2a',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
        setEditId(null);
      } else {
        await axios.post(`${API_BASE}/AddDeliveryAssignto`, {
          deliveryAssgintoId: 0,
          deliveryPersonName: deliveryPersonName,
          deliveryPerdsonType: deliveryPerdsontype
        });
        Swal.fire({
          icon: 'success',
          title: 'Added Successfully',
          text: 'New delivery person added successfully!',
          background: '#2a2a2a',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
      }
      setDeliveryPersonName('');
      setDeliveryPerdsontype('DeliveryOrderPerson Login');
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: 'Could not save the record. Please try again.',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  // Handle Edit
  const handleEdit = (item) => {
    const targetId = getVal(item, ['deliveryAssgintoId', 'deliveryAssigntoId', 'id', 'deliveryPersonId', 'ticketId']);
    const targetName = getVal(item, ['deliveryPersonName', 'name', 'personName', 'deliveryname']);
    const targetType = getVal(item, ['deliveryPerdsonType', 'deliveryPerdsontype', 'deliveryPersontype', 'type', 'deliverytype', 'perdsontype']) || 'DeliveryOrderPerson Login';

    setEditId(targetId);
    setDeliveryPersonName(targetName);
    setDeliveryPerdsontype(targetType);
  };

  // Handle Delete
  const handleDelete = async (item) => {
    const targetId = getVal(item, ['deliveryAssgintoId', 'deliveryAssigntoId', 'id', 'deliveryPersonId', 'ticketId']);

    if (targetId === undefined || targetId === null || targetId === '') {
      Swal.fire({
        icon: 'error',
        title: 'Delete Error',
        text: 'Invalid Record ID found.',
        background: '#2a2a2a',
        color: '#fff'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#2a2a2a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE}/DeleteDeliveryAssignto?id=${targetId}`);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Record has been deleted.',
            background: '#2a2a2a',
            color: '#fff',
            timer: 1500,
            showConfirmButton: false
          });
          fetchAssignments();
        } catch (error) {
          console.error('Error deleting assignment:', error);
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: 'Could not delete the record.',
            background: '#2a2a2a',
            color: '#fff'
          });
        }
      }
    });
  };

  // Handle Details View
  const handleDetails = (item) => {
    setDetailsData(item);
  };

  // Filtered list based on search query
  const filteredAssignments = assignments.filter((item) => {
    const name = String(getVal(item, ['deliveryPersonName', 'name', 'personName', 'deliveryname']));
    const type = String(getVal(item, ['deliveryPerdsonType', 'deliveryPerdsontype', 'deliveryPersontype', 'type', 'deliverytype', 'perdsontype']));
    const id = String(getVal(item, ['deliveryAssgintoId', 'deliveryAssigntoId', 'id', 'deliveryPersonId', 'ticketId']));
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.includes(searchQuery)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignments = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff', fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      
      {/* Sidebar Section */}
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
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" onError={(e)=>{e.target.style.display='none'}} />
          <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
            AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
          </h5>
        </div>

        {/* Global Shop Status Switch */}
        <div className="px-2 mb-4">
          <div 
            onClick={handleShopToggle} 
            className="p-2 rounded d-flex align-items-center justify-content-between transition-all" 
            style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
          >
            <div className="d-flex flex-column">
              <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
              <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
            </div>
            <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '20px' }}></i>
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
          
          {/* 1. MASTER CONFIG DROPDOWN */}
          <div className="mt-2">
            <div 
              onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-sliders-h"></i> Master Config
              </span>
              <i className={`fas fa-chevron-right ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {masterDropdownOpen && (
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <Link to="/doctorassignto" className={getSubLinkClass("/doctorassignto")}>
                  AddDoctorAssignTo
                </Link>
                <Link to="/deliverypersonassigntos" className={getSubLinkClass("/deliverypersonassigntos")}>
                  AddDeliveryPersonAssignTo
                </Link>
              </div>
            )}
          </div>

          {/* 2. OPERATIONS REGISTRY DROPDOWN */}
          <div className="mt-2">
            <div 
              onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
              className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
              style={{ cursor: 'pointer', fontSize: '13.5px' }}
            >
              <span className="d-flex align-items-center gap-3">
                <i className="fas fa-boxes"></i> Operations Registry
              </span>
              <i className={`fas fa-chevron-right ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
            </div>

            {listsDropdownOpen && (
              <div className="position-relative ms-3 mt-2 d-flex flex-column gap-2" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <Link to="/adminregisterationform" className="btn btn-outline-success w-100 text-start btn-sm">Registration Form</Link>
                <Link to="/hradminlists" className="btn btn-outline-success w-100 text-start btn-sm">HrAdminReg.List</Link>
                <Link to="/hiringcandidteapplieds" className="btn btn-success w-100 text-start btn-sm fw-bold">HiringDATA</Link>
              </div>
            )}
          </div>

          {/* Logout Action */}
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
            <button 
              type="button" 
              onClick={() => navigate('/header')} 
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout Container */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Left Form Section */}
        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', width: '300px', height: 'fit-content', border: '1px solid #333' }}>
          <h3 style={{ color: '#4ade80', marginBottom: '15px', fontSize: '18px' }}>
            {editId ? 'Update Delivery Person' : 'Add Delivery Person'}
          </h3>
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: '#ccc' }}>Delivery Name:</label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={deliveryPersonName}
              onChange={(e) => setDeliveryPersonName(e.target.value)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px', marginBottom: '15px' }}
            />

            <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px', color: '#ccc' }}>Delivery Type:</label>
            <input
              type="text"
              value={deliveryPerdsontype}
              disabled
              style={{ width: '100%', padding: '10px', backgroundColor: '#18181b', border: '1px solid #333', color: '#9ca3af', borderRadius: '4px', marginBottom: '15px', cursor: 'not-allowed' }}
            />

            <button
              type="submit"
              style={{ width: '100%', padding: '10px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {editId ? 'Update Delivery Person' : 'Save Record'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setDeliveryPersonName(''); setDeliveryPerdsontype('DeliveryOrderPerson Login'); }}
                style={{ width: '100%', padding: '8px', backgroundColor: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px', marginTop: '10px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Right Table Section */}
        <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#4ade80', margin: 0, fontSize: '18px' }}>Delivery Management Table</h3>
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ padding: '8px 12px', backgroundColor: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px', width: '250px' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333', color: '#bbb', fontSize: '14px', backgroundColor: '#25252b' }}>
                    <th style={{ padding: '12px' }}>DeliveryID</th>
                    <th style={{ padding: '12px' }}>DELIVERY NAME</th>
                    <th style={{ padding: '12px' }}>TYPE</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssignments.length > 0 ? (
                    currentAssignments.map((item, index) => {
                      const recordId = getVal(item, ['deliveryAssgintoId', 'deliveryAssigntoId', 'id', 'deliveryPersonId', 'ticketId']);
                      const recordName = getVal(item, ['deliveryPersonName', 'name', 'personName', 'deliveryname']) || 'N/A';
                      const recordType = getVal(item, ['deliveryPerdsonType', 'deliveryPerdsontype', 'deliveryPersontype', 'type', 'deliverytype', 'perdsontype']) || 'DeliveryOrderPerson Login';

                      return (
                        <tr key={(recordId || index) + '-' + index} style={{ borderBottom: '1px solid #2a2a2a', fontSize: '14px', color: '#ffffff' }}>
                          <td style={{ padding: '12px', fontWeight: 'bold', color: '#38bdf8' }}>#{recordId || (indexOfFirstItem + index + 1)}</td>
                          <td style={{ padding: '12px', color: 'blue' }}>{recordName}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                              {recordType}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <button onClick={() => handleDetails(item)} title="Details" style={{ backgroundColor: '#06b6d4', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }}>👁️</button>
                            <button onClick={() => handleEdit(item)} title="Edit" style={{ backgroundColor: '#eab308', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }}>✏️</button>
                            <button onClick={() => handleDelete(item)} title="Delete" style={{ backgroundColor: '#ef4444', border: 'none', color: '#fff', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #333', paddingTop: '12px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              Showing {filteredAssignments.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredAssignments.length)} of {filteredAssignments.length} entries
            </span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', backgroundColor: currentPage === 1 ? '#222' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Prev
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: currentPage === i + 1 ? '#22c55e' : '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: currentPage === i + 1 ? 'bold' : 'normal'
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{ padding: '6px 12px', backgroundColor: (currentPage === totalPages || totalPages === 0) ? '#222' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>

          {/* Details Modal Popup */}
          {detailsData && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px', width: '350px', border: '1px solid #444', color: '#fff' }}>
                <h3 style={{ color: '#4ade80', marginBottom: '15px' }}>Delivery Details</h3>
                <p><strong>ID:</strong> #{getVal(detailsData, ['deliveryAssgintoId', 'deliveryAssigntoId', 'id', 'deliveryPersonId', 'ticketId']) || 'N/A'}</p>
                <p><strong>Delivery Name:</strong> {getVal(detailsData, ['deliveryPersonName', 'name', 'personName', 'deliveryname']) || 'N/A'}</p>
                <p><strong>Type:</strong> {getVal(detailsData, ['deliveryPerdsonType', 'deliveryPerdsontype', 'deliveryPersontype', 'type', 'deliverytype', 'perdsontype']) || 'DeliveryOrderPerson Login'}</p>
                <button
                  onClick={() => setDetailsData(null)}
                  style={{ marginTop: '15px', width: '100%', padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
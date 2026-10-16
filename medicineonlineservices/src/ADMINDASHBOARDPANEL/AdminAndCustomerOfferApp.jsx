


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export default function AdminAndCustomerOfferApp() {
//   const navigate = useNavigate();
//   const [offers, setOffers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Details & Update Modal States
//   const [selectedDetails, setSelectedDetails] = useState(null);
//   const [editingOffer, setEditingOffer] = useState(null);

//   // Sidebar toggles
//   const [isShopOpen, setIsShopOpen] = useState(true);
//   const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
//   const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

//   // Admin Create Form State
//   const [newOffer, setNewOffer] = useState({
//     testName: '',
//     description: '',
//     originalPrice: '',
//     offerPrice: '',
//     discountPercentage: '',
//     imageUrl: '',
//     startDate: '',
//     endDate: '',
//     isActive: true
//   });

//   const API_BASE = 'https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI';

//   useEffect(() => {
//     fetchOffers();
//   }, []);

//   // 1. LIST API
//   const fetchOffers = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/AllOffersAsync`);
//       setOffers(res.data);
//     } catch (err) {
//       console.error("Error fetching offers", err);
//     }
//   };

//   // 2. CREATE API
//   const handleCreateOffer = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_BASE}/CreateOfferAsync`, newOffer);
//       alert("Offer Test Created Successfully!");
//       fetchOffers();
//       setNewOffer({
//         testName: '',
//         description: '',
//         originalPrice: '',
//         offerPrice: '',
//         discountPercentage: '',
//         imageUrl: '',
//         startDate: '',
//         endDate: '',
//         isActive: true
//       });
//     } catch (err) {
//       alert("Creation failed.");
//     }
//   };

//   // 3. DETAILS API
//   const handleGetDetails = async (id) => {
//     try {
//       const res = await axios.get(`${API_BASE}/DetailsOffer?id=${id}`);
//       setSelectedDetails(res.data);
//     } catch (err) {
//       alert("Failed to fetch details.");
//     }
//   };

//   // 4. UPDATE API
//   const handleUpdateOffer = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${API_BASE}/UpdateOfferAsync`, editingOffer);
//       alert("Offer Updated Successfully!");
//       setEditingOffer(null);
//       fetchOffers();
//     } catch (err) {
//       alert("Update failed.");
//     }
//   };

//   // 5. DELETE API
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this offer?")) {
//       try {
//         await axios.delete(`${API_BASE}/DeleteOfferAsync?id=${id}`);
//         fetchOffers();
//       } catch (err) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   // 6. SEARCH FUNCTIONALITY (Filtered locally for instant response)
//   const filteredOffers = offers.filter(offer => 
//     offer.testName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     offer.description?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleShopToggle = () => setIsShopOpen(!isShopOpen);
//   const getNavLinkClass = () => "btn btn-outline-success w-100 mb-2 text-start text-decoration-none";
//   const getSubLinkClass = () => "text-white-50 text-decoration-none py-1 mb-1 hover-sub-link";

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
//       {/* SIDE MENU BAR */}
//       <div style={{ 
//         width: '280px', 
//         backgroundColor: '#16161a', 
//         padding: '24px 16px', 
//         position: 'fixed',
//         height: '100vh', 
//         zIndex: 100, 
//         overflowY: 'auto',
//         borderRight: '1px solid #232329',
//         left: 0,
//         top: 0
//       }}>
//         <div className="brand mb-4 px-2 d-flex align-items-center">
//           <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" onError={(e)=>{e.target.style.display='none'}} />
//           <h5 className="m-0 text-white fw-bold tracking-wide" style={{ letterSpacing: '0.5px' }}>
//             AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span>
//           </h5>
//         </div>

//         <div className="px-2 mb-4">
//           <div 
//             onClick={handleShopToggle} 
//             className="p-2.5 rounded d-flex align-items-center justify-content-between transition-all" 
//             style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}
//           >
//             <div className="d-flex flex-column">
//               <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600', textTransform: 'uppercase' }}>Store Status</span>
//               <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed / Offline"}</span>
//             </div>
//             <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
//           </div>
//         </div>

//         <div className="d-flex flex-column gap-1">
//           <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
//           <Link to="/deshboardpanel" className={getNavLinkClass()}>
//             <i className="fas fa-chart-pie me-2" style={{ fontSize: '13.5px' }}></i>
//             <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
//           </Link>

//           <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
//           {/* Master Config */}
//           <div className="mt-2">
//             <div 
//               onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-sliders-h"></i> Master Config
//               </span>
//               <i className={`fas fa-chevron-right ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {masterDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
//                 <Link to="/adminissuetype" className={getSubLinkClass()}>Add Item Type</Link>
//                 <Link to="/adminmasterassignedto" className={getSubLinkClass()}>AddAssignedTO</Link>
//                 <Link to="/addadmintypes" className={getSubLinkClass()}>AddAdminTypes</Link>
//               </div>
//             )}
//           </div>

//           {/* Operations Registry */}
//           <div>
//             <div 
//               onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-boxes"></i> Operations Registry
//               </span>
//               <i className={`fas fa-chevron-right ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {listsDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
//                 <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Adminmediciationtrackers</Link> 
//                 <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
//               </div>
//             )}
//           </div>

//           <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
//             <button 
//               type="button" 
//               onClick={() => navigate('/header')} 
//               className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
//               style={{ fontSize: '13.5px' }}
//             >
//               <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div style={{ marginLeft: '280px', flex: 1, padding: '30px' }}>
//         <div style={{ maxWidth: '950px', margin: 'auto', background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
//           <h2 className="mb-4 text-dark fw-bold">🛠️ Admin Panel: Offer Tests Management</h2>

//           {/* 1. CREATE FORM SECTION */}
//           <div style={{ background: 'red', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid blue' }}>
//             <h4 className="mb-3 text-success">➕ Create New Offer Test</h4>
//             <form onSubmit={handleCreateOffer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//               <input type="text" placeholder="Test Name" value={newOffer.testName} onChange={e => setNewOffer({...newOffer, testName: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               <input type="text" placeholder="Description" value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               <input type="number" placeholder="Original Price" value={newOffer.originalPrice} onChange={e => setNewOffer({...newOffer, originalPrice: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               <input type="number" placeholder="Offer Price" value={newOffer.offerPrice} onChange={e => setNewOffer({...newOffer, offerPrice: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               <input type="number" placeholder="Discount Percentage (%)" value={newOffer.discountPercentage} onChange={e => setNewOffer({...newOffer, discountPercentage: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               <input type="file" placeholder="Image URL" value={newOffer.imageUrl} onChange={e => setNewOffer({...newOffer, imageUrl: e.target.value})} required style={{padding: '10px', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               <div>
//                 <label className="form-label small text-muted mb-1">Start Date</label>
//                 <input type="date" value={newOffer.startDate} onChange={e => setNewOffer({...newOffer, startDate: e.target.value})} required style={{padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               </div>
//               <div>
//                 <label className="form-label small text-muted mb-1">End Date</label>
//                 <input type="date" value={newOffer.endDate} onChange={e => setNewOffer({...newOffer, endDate: e.target.value})} required style={{padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ced4da'}} />
//               </div>
//               <div style={{ gridColumn: 'span 2' }}>
//                 <button type="submit" style={{background: '#28a745', color: 'white', border: 'none', padding: '12px', width: '100%', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px'}}>Create Offer Test</button>
//               </div>
//             </form>
//           </div>

//           {/* 2. SEARCH BAR SECTION */}
//           <div style={{ marginBottom: '25px' }}>
//             <input 
//               type="text" 
//               placeholder="🔍 Search tests by name or description..." 
//               value={searchQuery} 
//               onChange={e => setSearchQuery(e.target.value)} 
//               style={{width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ced4da', fontSize: '14px'}} 
//             />
//           </div>

//           {/* 3. DETAILS MODAL / CARD VIEW */}
//           {selectedDetails && (
//             <div style={{ background: 'red',color:'red', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid white' }}>
//               <h4 className="text-success">📄 Offer Test Details (ID: {selectedDetails.id})</h4>
//               <p><strong>Name:</strong> {selectedDetails.testName}</p>
//               <p><strong>Description:</strong> {selectedDetails.description}</p>
//               <p><strong>Price:</strong> ₹{selectedDetails.offerPrice} <span className="text-muted text-decoration-line-through">₹{selectedDetails.originalPrice}</span></p>
//               <button onClick={() => setSelectedDetails(null)} className="btn btn-sm btn-secondary">Close Details</button>
//             </div>
//           )}

//           {/* 4. UPDATE FORM MODAL / VIEW */}
//           {editingOffer && (
//             <div style={{ background: 'red', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #ffeeba' }}>
//               <h4 className="text-warning">✏️ Update Offer Test</h4>
//               <form onSubmit={handleUpdateOffer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
//                 <input type="text" value={editingOffer.testName} onChange={e => setEditingOffer({...editingOffer, testName: e.target.value})} required style={{padding: '8px'}} />
//                 <input type="text" value={editingOffer.description} onChange={e => setEditingOffer({...editingOffer, description: e.target.value})} required style={{padding: '8px'}} />
//                 <input type="number" value={editingOffer.originalPrice} onChange={e => setEditingOffer({...editingOffer, originalPrice: e.target.value})} required style={{padding: '8px'}} />
//                 <input type="number" value={editingOffer.offerPrice} onChange={e => setEditingOffer({...editingOffer, offerPrice: e.target.value})} required style={{padding: '8px'}} />
//                 <input type="text" value={editingOffer.imageUrl} onChange={e => setEditingOffer({...editingOffer, imageUrl: e.target.value})} required style={{padding: '8px'}} />
//                 <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
//                   <button type="submit" className="btn btn-success btn-sm">Save Changes</button>
//                   <button type="button" onClick={() => setEditingOffer(null)} className="btn btn-secondary btn-sm">Cancel</button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* 5. LIST DATA VIEW */}
//           <h4 className="mb-3 text-secondary">📦 Available Offer Tests List ({filteredOffers.length})</h4>
//           <div style={{ display: 'grid', gap: '15px' }}>
//             {filteredOffers.length > 0 ? (
//               filteredOffers.map(offer => (
//                 <div key={offer.id} style={{ display: 'flex', alignItems: 'center', background: 'red', border: '1px solid #e9ecef', padding: '15px', borderRadius: '8px', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  
//                   <img src={offer.imageUrl || 'https://via.placeholder.com/100'} alt={offer.testName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }} />
                  
//                   <div style={{ flex: 1 }}>
//                     <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>{offer.testName}</h5>
//                     <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#666' }}>{offer.description}</p>
//                     <p style={{ margin: 0, fontSize: '14px' }}>
//                       <span style={{ textDecoration: 'line-through', color: '#999' }}>₹{offer.originalPrice}</span> 
//                       <strong style={{ color: '#28a745', marginLeft: '8px', fontSize: '16px' }}>₹{offer.offerPrice}</strong>
//                       {offer.discountPercentage > 0 && <span className="badge bg-danger ms-2">{offer.discountPercentage}% OFF</span>}
//                     </p>
//                   </div>

//                   <div style={{ display: 'flex', gap: '8px' }}>
//                     <button onClick={() => handleGetDetails(offer.id)} style={{ background: '#17a2b8', color: 'white', border: 'none', padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}>
//                       Details
//                     </button>
//                     <button onClick={() => setEditingOffer(offer)} style={{ background: '#ffc107', color: 'black', border: 'none', padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
//                       Update
//                     </button>
//                     <button onClick={() => handleDelete(offer.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}>
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-muted text-center py-4">No offer tests found.</p>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminAndCustomerOfferApp() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Details & Update Modal States
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);

  // Sidebar toggles
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  // Admin Create Form State
  const [newOffer, setNewOffer] = useState({
    testName: '',
    description: '',
    originalPrice: '',
    offerPrice: '',
    discountPercentage: '',
    category: 'Health Packages',
    sampleType: 'Blood Collection',
    isFastRequired: 'No',
    imageFile: null,
    imagePreview: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const API_BASE = 'https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI';

  useEffect(() => {
    fetchOffers();
  }, []);

  // 1. LIST API
  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/AllOffersAsync`);
      setOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers", err);
    }
  };

  // Handle File Change & Preview for Create Form
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewOffer(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: previewUrl
      }));
    }
  };

  // Handle File Change & Preview for Edit Form
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditingOffer(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: previewUrl
      }));
    }
  };

  // 2. CREATE API (Removed manual Content-Type header so Axios handles boundary automatically)
  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('testName', newOffer.testName);
      formData.append('description', newOffer.description);
      formData.append('originalPrice', newOffer.originalPrice);
      formData.append('offerPrice', newOffer.offerPrice);
      formData.append('discountPercentage', newOffer.discountPercentage || 0);
      formData.append('category', newOffer.category);
      formData.append('sampleType', newOffer.sampleType);
      formData.append('isFastRequired', newOffer.isFastRequired);
      formData.append('startDate', newOffer.startDate);
      formData.append('endDate', newOffer.endDate);
      formData.append('isActive', newOffer.isActive);
      
      if (newOffer.imageFile) {
        formData.append('imageFile', newOffer.imageFile);
      }

      // DO NOT set Content-Type manually for FormData in axios!
      await axios.post(`${API_BASE}/CreateOfferAsync`, formData);

      alert("Offer Test Created Successfully!");
      fetchOffers();
      setNewOffer({
        testName: '',
        description: '',
        originalPrice: '',
        offerPrice: '',
        discountPercentage: '',
        category: 'Health Packages',
        sampleType: 'Blood Collection',
        isFastRequired: 'No',
        imageFile: null,
        imagePreview: '',
        startDate: '',
        endDate: '',
        isActive: true
      });
    } catch (err) {
      console.error("Create error response:", err.response?.data);
      alert("Creation failed: " + (err.response?.data?.title || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 3. DETAILS API
  const handleGetDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/DetailsOffer?id=${id}`);
      setSelectedDetails(res.data);
    } catch (err) {
      alert("Failed to fetch details.");
    }
  };

  // 4. UPDATE API
  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', editingOffer.id);
      formData.append('testName', editingOffer.testName);
      formData.append('description', editingOffer.description);
      formData.append('originalPrice', editingOffer.originalPrice);
      formData.append('offerPrice', editingOffer.offerPrice);
      formData.append('discountPercentage', editingOffer.discountPercentage || 0);
      formData.append('category', editingOffer.category || 'Health Packages');
      formData.append('sampleType', editingOffer.sampleType || 'Blood Collection');
      formData.append('isFastRequired', editingOffer.isFastRequired || 'No');
      
      if (editingOffer.imageFile) {
        formData.append('imageFile', editingOffer.imageFile);
      }

      await axios.put(`${API_BASE}/UpdateOfferAsync`, formData);

      alert("Offer Updated Successfully!");
      setEditingOffer(null);
      fetchOffers();
    } catch (err) {
      console.error("Update error response:", err.response?.data);
      alert("Update failed: " + (err.response?.data?.title || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 5. DELETE API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axios.delete(`${API_BASE}/DeleteOfferAsync?id=${id}`);
        fetchOffers();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // 6. SEARCH FUNCTIONALITY
  const filteredOffers = offers.filter(offer => 
    offer.testName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offer.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopToggle = () => setIsShopOpen(!isShopOpen);
  const getNavLinkClass = () => "btn btn-outline-success w-100 mb-2 text-start text-decoration-none";
  const getSubLinkClass = () => "text-white-50 text-decoration-none py-1 mb-1 hover-sub-link";

  const inputStyle = {
    padding: '11px 14px',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    fontWeight: '500',
    outline: 'none'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SIDE MENU BAR */}
      <div style={{ 
        width: '280px', 
        backgroundColor: '#16161a', 
        padding: '24px 16px', 
        position: 'fixed',
        height: '100vh', 
        zIndex: 100, 
        overflowY: 'auto',
        borderRight: '1px solid #232329',
        left: 0,
        top: 0
      }}>
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" onError={(e)=>{e.target.style.display='none'}} />
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
            <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
          </div>
        </div>

        <div className="d-flex flex-column gap-1">
          <span className="px-3 text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
          <Link to="/deshboardpanel" className={getNavLinkClass()}>
            <i className="fas fa-chart-pie me-2" style={{ fontSize: '13.5px' }}></i>
            <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
          </Link>

          <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
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
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                <Link to="/adminissuetype" className={getSubLinkClass()}>Add Item Type</Link>
                <Link to="/adminmasterassignedto" className={getSubLinkClass()}>Add Assigned TO</Link>
                <Link to="/addadmintypes" className={getSubLinkClass()}>Add Admin Types</Link>
              </div>
            )}
          </div>

          <div>
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
              <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
                <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
                {/* <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Medication Trackers</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer Lists</Link> */}



                       
           <Link to="/adminmediciationtrackers" className="btn btn-outline-success w-100 mb-2 text-start">Adminmediciationtrackers</Link> 
            <Link to="/admintestreportss" className="btn btn-outline-success w-100 mb-2 text-start">AdminTestReports</Link>
              <Link to="/adminhealthhistorys" className="btn btn-outline-success w-100 mb-2 text-start">AdminHelathHistory</Link>
                <Link to="/adminmonthlyprogresses" className="btn btn-outline-success w-100 mb-2 text-start">AdminMonthlyProgress</Link>
                <Link to="/adminprescriptions" className="btn btn-outline-success w-100 mb-2 text-start">AdminPrescriptions</Link>
                  <Link to="/adminhistorymanagers" className="btn btn-outline-success w-100 mb-2 text-start">AdminHistoryManager</Link>
                <Link to="/adminhelpsupports" className="btn btn-outline-success w-100 mb-2 text-start">AdminHelpSupport</Link>
                <Link to="/adminandcustomerofferapps" className="btn btn-outline-success w-100 mb-2 text-start">AdminLabTest</Link>

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
              className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded"
              style={{ fontSize: '13.5px' }}
            >
              <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '35px' }}>
        <div style={{ maxWidth: '1050px', margin: 'auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          
          <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
            <h2 className="text-dark fw-bold m-0" style={{ fontSize: '1.5rem' }}>🛠️ Admin Panel: Offer Tests Management</h2>
            <span className="badge bg-success px-3 py-2" style={{ fontSize: '12px' }}>Live Mode Active</span>
          </div>

          {/* 1. CREATE FORM SECTION */}
          <div style={{ background: '#fafbfc', padding: '24px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
            <h4 className="mb-4 text-success fw-bold" style={{ fontSize: '1.2rem' }}>➕ Create New Offer Test</h4>
            <form onSubmit={handleCreateOffer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Test Name *</label>
                <input type="text" placeholder="e.g., Full Body Health Checkup" value={newOffer.testName} onChange={e => setNewOffer({...newOffer, testName: e.target.value})} required style={inputStyle} />
              </div>
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Description *</label>
                <input type="text" placeholder="Includes 60+ vital parameters" value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} required style={inputStyle} />
              </div>
              
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Original Price (₹) *</label>
                <input type="number" placeholder="2999" value={newOffer.originalPrice} onChange={e => setNewOffer({...newOffer, originalPrice: e.target.value})} required style={inputStyle} />
              </div>
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Offer Price (₹) *</label>
                <input type="number" placeholder="999" value={newOffer.offerPrice} onChange={e => setNewOffer({...newOffer, offerPrice: e.target.value})} required style={inputStyle} />
              </div>
              
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Discount Percentage (%) *</label>
                <input type="number" placeholder="65" value={newOffer.discountPercentage} onChange={e => setNewOffer({...newOffer, discountPercentage: e.target.value})} required style={inputStyle} />
              </div>
              
              <div>
                <label className="form-label small fw-bold text-muted mb-1">Category *</label>
                <select value={newOffer.category} onChange={e => setNewOffer({...newOffer, category: e.target.value})} style={inputStyle}>
                  <option value="Health Packages">Health Packages</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="Radiology">Radiology / Scan</option>
                </select>
              </div>

              <div>
                <label className="form-label small fw-bold text-muted mb-1">Sample Type *</label>
                <select value={newOffer.sampleType} onChange={e => setNewOffer({...newOffer, sampleType: e.target.value})} style={inputStyle}>
                  <option value="Blood Collection">Blood Collection</option>
                  <option value="Urine Sample">Urine Sample</option>
                  <option value="Lab Visit">Lab Visit Required</option>
                </select>
              </div>

              <div>
                <label className="form-label small fw-bold text-muted mb-1">Fasting Required *</label>
                <select value={newOffer.isFastRequired} onChange={e => setNewOffer({...newOffer, isFastRequired: e.target.value})} style={inputStyle}>
                  <option value="No">No</option>
                  <option value="Yes (8-10 hrs)">Yes (8-10 hrs)</option>
                </select>
              </div>

              <div>
                <label className="form-label small fw-bold text-muted mb-1">Upload Test Image File *</label>
                <input type="file" accept="image/*" onChange={handleFileChange} required style={{...inputStyle, padding: '9px'}} />
              </div>

              {newOffer.imagePreview ? (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <img src={newOffer.imagePreview} alt="Preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  <span className="small text-success fw-bold">Image selected successfully</span>
                </div>
              ) : <div />}

              <div>
                <label className="form-label small fw-bold text-muted mb-1">Start Date *</label>
                <input type="date" value={newOffer.startDate} onChange={e => setNewOffer({...newOffer, startDate: e.target.value})} required style={inputStyle} />
              </div>
              <div>
                <label className="form-label small fw-bold text-muted mb-1">End Date *</label>
                <input type="date" value={newOffer.endDate} onChange={e => setNewOffer({...newOffer, endDate: e.target.value})} required style={inputStyle} />
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                <button type="submit" disabled={loading} style={{background: '#198754', color: 'white', border: 'none', padding: '13px', width: '100%', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px', fontSize: '15px', transition: 'background 0.2s'}}>
                  {loading ? "Creating Offer Test..." : "🚀 Create Offer Test"}
                </button>
              </div>
            </form>
          </div>

          {/* 2. SEARCH BAR SECTION */}
          <div style={{ marginBottom: '25px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search tests by name or description..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{...inputStyle, padding: '13px 18px', backgroundColor: '#f8fafc'}} 
            />
          </div>

          {/* 3. DETAILS MODAL SECTION */}
          {selectedDetails && (
            <div style={{ background: '#f0f9ff', color: '#0369a1', padding: '20px', borderRadius: '10px', marginBottom: '25px', border: '1px solid #bae6fd', position: 'relative' }}>
              <h4 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>📄 Offer Test Details (ID: {selectedDetails.id})</h4>
              <div className="row g-2 mb-3" style={{ fontSize: '14px' }}>
                <div className="col-md-6"><strong>Name:</strong> {selectedDetails.testName}</div>
                <div className="col-md-6"><strong>Category:</strong> {selectedDetails.category || 'Packages'}</div>
                <div className="col-md-6"><strong>Sample Type:</strong> {selectedDetails.sampleType || 'Blood'}</div>
                <div className="col-md-6"><strong>Price:</strong> ₹{selectedDetails.offerPrice} <span className="text-muted text-decoration-line-through">₹{selectedDetails.originalPrice}</span></div>
                <div className="col-12"><strong>Description:</strong> {selectedDetails.description}</div>
              </div>
              <button onClick={() => setSelectedDetails(null)} className="btn btn-sm btn-outline-primary fw-bold">Close Details</button>
            </div>
          )}

          {/* 4. UPDATE FORM SECTION */}
          {editingOffer && (
            <div style={{ background: '#fffbeb', padding: '24px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #fde68a' }}>
              <h4 className="text-dark fw-bold mb-3" style={{ fontSize: '1.2rem' }}>✏️ Update Offer Test (ID: {editingOffer.id})</h4>
              <form onSubmit={handleUpdateOffer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label className="form-label small fw-bold text-muted mb-1">Test Name</label>
                  <input type="text" value={editingOffer.testName} onChange={e => setEditingOffer({...editingOffer, testName: e.target.value})} required style={inputStyle} />
                </div>
                <div>
                  <label className="form-label small fw-bold text-muted mb-1">Description</label>
                  <input type="text" value={editingOffer.description} onChange={e => setEditingOffer({...editingOffer, description: e.target.value})} required style={inputStyle} />
                </div>
                <div>
                  <label className="form-label small fw-bold text-muted mb-1">Original Price</label>
                  <input type="number" value={editingOffer.originalPrice} onChange={e => setEditingOffer({...editingOffer, originalPrice: e.target.value})} required style={inputStyle} />
                </div>
                <div>
                  <label className="form-label small fw-bold text-muted mb-1">Offer Price</label>
                  <input type="number" value={editingOffer.offerPrice} onChange={e => setEditingOffer({...editingOffer, offerPrice: e.target.value})} required style={inputStyle} />
                </div>
                
                <div>
                  <label className="form-label small fw-bold text-muted mb-1">New Image File (Optional)</label>
                  <input type="file" accept="image/*" onChange={handleEditFileChange} style={{...inputStyle, padding: '8px'}} />
                </div>

                {editingOffer.imagePreview && (
                  <div className="d-flex align-items-center gap-2">
                    <img src={editingOffer.imagePreview} alt="Preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                    <span className="small text-success">New image ready</span>
                  </div>
                )}

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" disabled={loading} className="btn btn-success btn-sm px-4 fw-bold">{loading ? "Saving..." : "Save Changes"}</button>
                  <button type="button" onClick={() => setEditingOffer(null)} className="btn btn-secondary btn-sm px-4">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* 5. LIST DATA VIEW */}
          <h4 className="mb-3 text-secondary" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>📦 Available Offer Tests List ({filteredOffers.length})</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredOffers.length > 0 ? (
              filteredOffers.map(offer => (
                <div key={offer.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '10px', gap: '18px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                  
                  <img src={offer.imageUrl || offer.imagePath || 'https://via.placeholder.com/100'} alt={offer.testName} style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge bg-success" style={{ fontSize: '10px', padding: '5px 8px' }}>{offer.category || 'Package'}</span>
                      <span className="badge bg-info text-dark" style={{ fontSize: '10px', padding: '5px 8px' }}>{offer.sampleType || 'Blood'}</span>
                    </div>
                    <h5 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '1.05rem', fontWeight: 'bold' }}>{offer.testName}</h5>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b' }}>{offer.description}</p>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                      <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>₹{offer.originalPrice}</span> 
                      <strong style={{ color: '#16a34a', marginLeft: '8px', fontSize: '16px' }}>₹{offer.offerPrice}</strong>
                      {offer.discountPercentage > 0 && <span className="badge bg-danger ms-2" style={{ fontSize: '10px' }}>{offer.discountPercentage}% OFF</span>}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleGetDetails(offer.id)} style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                      Details
                    </button>
                    <button onClick={() => setEditingOffer(offer)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                      Update
                    </button>
                    <button onClick={() => handleDelete(offer.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-muted bg-white rounded border">No offer tests found matching your criteria.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
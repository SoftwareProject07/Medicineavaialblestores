// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// export default function QRCODEUPLOAD_LIST() {
//   const navigate = useNavigate();
//   const [listData, setListData] = useState([]);
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // Sidebar states
//   const [isShopOpen, setIsShopOpen] = useState(true);
//   const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
//   const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

//   const handleShopToggle = () => {
//     setIsShopOpen(!isShopOpen);
//   };

//   const fetchList = async () => {
//     try {
//       const response = await fetch('https://ecommerencesite.onrender.com/api/QRCASHAPI/listqucasehmodel');
//       const data = await response.json();
//       setListData(Array.isArray(data) ? data : data.result || []);
//     } catch (error) {
//       console.error('Error fetching list:', error);
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file && !editId) {
//       alert('Please select a file (.jpg, .png, .pdf) first.');
//       return;
//     }

//     const formData = new FormData();
//     if (file) {
//       // Appending multiple common keys to prevent backend rejection based on parameter name
//       formData.append('file', file);
//       formData.append('files', file);
//       formData.append('Image', file);
//       formData.append('QRCodeImage', file);
//       formData.append('uploadedFile', file);
//     }

//     try {
//       setLoading(true);
//       if (editId) {
//         formData.append('id', editId);
//         const response = await fetch('https://ecommerencesite.onrender.com/api/QRCASHAPI/UpdateQRCashCodeModels', {
//           method: 'PUT',
//           body: formData,
//         });
        
//         if (response.ok) {
//           alert('Updated successfully!');
//           setEditId(null);
//         } else {
//           const errText = await response.text();
//           console.error('Update Error Response:', errText);
//           alert('Update failed: ' + (errText || response.statusText));
//         }
//       } else {
//         const response = await fetch('https://ecommerencesite.onrender.com/api/QRCASHAPI/upload', {
//           method: 'POST',
//           body: formData,
//         });

//         if (response.ok) {
//           alert('Uploaded successfully!');
//         } else {
//           const errText = await response.text();
//           console.error('Upload Error Response:', errText);
//           alert('Upload failed: ' + (errText || response.statusText));
//         }
//       }
//       setFile(null);
//       e.target.reset();
//       fetchList();
//     } catch (error) {
//       console.error('Error during upload/update:', error);
//       alert('Network or server error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this item?')) return;
//     try {
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/QRCASHAPI/DeleteQRCashCodeModels?id=${id}`, {
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         alert('Deleted successfully!');
//         fetchList();
//       } else {
//         alert('Delete failed.');
//       }
//     } catch (error) {
//       console.error('Error deleting item:', error);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       setEditId(id);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (error) {
//       console.error('Error fetching details for edit:', error);
//     }
//   };

//   // Helper function to format image path/URL correctly
//   const getImageUrl = (imgpath) => {
//     if (!imgpath) return '';
//     if (imgpath.startsWith('http')) return imgpath;
//     const cleanedPath = imgpath.replace('~', '');
//     return `https://ecommerencesite.onrender.com${cleanedPath}`;
//   };

//   const getNavLinkClass = () => {
//     return "text-white-50 text-decoration-none px-3 py-2 rounded d-flex align-items-center gap-2 hover-sidebar-menu";
//   };

//   const getSubLinkClass = () => {
//     return "text-white-50 text-decoration-none py-1.5 px-2 rounded hover-sub-link";
//   };

//   return (
//     <div style={{ display: 'flex', backgroundColor: '#0f0f13', minHeight: '100vh', color: '#fff' }}>
      
//       {/* SIDEBAR */}
//       <div style={{ 
//         width: '280px', 
//         backgroundColor: '#16161a', 
//         padding: '24px 16px', 
//         position: 'fixed',
//         height: '100vh', 
//         zIndex: 100, 
//         overflowY: 'auto',
//         borderRight: '1px solid #232329',
//         top: 0,
//         left: 0
//       }}>
//         <div className="brand mb-4 px-2 d-flex align-items-center">
//           <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
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
//             <i className={`fas fa-2xl ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '24px' }}></i>
//           </div>
//         </div>

//         <div className="d-flex flex-column gap-1">
//           <span className="px-3 text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Core Navigation</span>
          
//           <Link to="/deshboardpanel" className={getNavLinkClass()}>
//             <i className="fas fa-chart-pie" style={{ fontSize: '13.5px' }}></i>
//             <span style={{ fontSize: '13.5px' }}>Dashboard Matrix</span>
//           </Link>

//           <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />
          
//           <div className="mt-2">
//             <div 
//               onClick={() => setMasterDropdownOpen(!masterDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-sliders-h"></i> Master Config
//               </span>
//               <i className={`fas fa-chevron-right transition-transform ${masterDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {masterDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
//                 <Link to="/adminissuetype" className={getSubLinkClass()}>Add Item Type</Link>
//                 <Link to="/adminmasterassignedto" className={getSubLinkClass()}>AddAssignedTO</Link>
//                 <Link to="/addadmintypes" className={getSubLinkClass()}>AddAdminTypes</Link>
//                 <Link to="/languagematerpanels" className={getSubLinkClass()}>Language Master</Link>
//                 <Link to="/statenamemasters" className={getSubLinkClass()}>StateName Master</Link>
//                 <Link to="/citynamemasters" className={getSubLinkClass()}>CityName Master</Link> 
//                 <Link to="/addaccountmastertypes" className={getSubLinkClass()}>Accountant Master Types</Link> 
//               </div>
//             )}
//           </div>

//           <div>
//             <div 
//               onClick={() => setListsDropdownOpen(!listsDropdownOpen)}
//               className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50 rounded user-select-none hover-sidebar-menu"
//               style={{ cursor: 'pointer', fontSize: '13.5px' }}
//             >
//               <span className="d-flex align-items-center gap-3">
//                 <i className="fas fa-boxes"></i> Operations Registry
//               </span>
//               <i className={`fas fa-chevron-right transition-transform ${listsDropdownOpen ? 'rotate-90' : ''}`} style={{ fontSize: '10px' }}></i>
//             </div>

//             {listsDropdownOpen && (
//               <div className="position-relative ms-3 mt-1 d-flex flex-column" style={{ paddingLeft: '8px', fontSize: '13px' }}>
//                 <div className="position-absolute" style={{ left: '6px', top: '0', bottom: '14px', width: '1.5px', backgroundColor: '#2d2d37' }}></div>
//                 <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
//                 <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
//                 <Link to="/adminFeedbackcustomerlists" className="btn btn-outline-success w-100 mb-2 text-start">Feedback List</Link>
//                 <Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link>
//                 <Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link>
//                 <Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link>
//                 <Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link> 
//                 <Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registration Form </Link>
//                 <Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link>
//                 <Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link>
//                 <Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link>
//                 <Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> 
//                 <Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> 
//                 <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-2 text-start">Doctor_PatientdetailsLists</Link> 
//                 <Link to="/hrdatalists" className="btn btn-outline-success w-100 mb-2 text-start">HiringDATALIst</Link>
//                 <Link to="/qrcodeupload" className="btn btn-success w-100 mb-2 text-start">qrcodeupload</Link>
//                 <Link to="/accountmanagerplanelists" className="btn btn-outline-success w-100 mb-2 text-start">AccountantManagerPanelLists</Link>
//               </div>
//             )}
//           </div>

//           <div className="mt-4 pt-3" style={{ borderTop: '1px solid #232329' }}>
//             <button 
//               type="button" 
//               onClick={() => navigate('/header')} 
//               className="btn btn-link text-start text-danger text-decoration-none w-100 d-flex align-items-center gap-3 px-3 py-2 rounded hover-sidebar-logout"
//               style={{ fontSize: '13.5px' }}
//             >
//               <i className="fas fa-sign-out-alt"></i> <span>LogOut</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)', minHeight: '100vh', backgroundColor: '#0f0f13' }}>
//         <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
//           <h2 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#fff', fontSize: '24px' }}>
//             QR Code & File Management Panel
//           </h2>

//           {/* Upload / Edit Section */}
//           <div style={{ backgroundColor: '#16161a', padding: '24px', borderRadius: '8px', border: '1px solid #232329', marginBottom: '30px' }}>
//             <h4 style={{ marginBottom: '15px', fontSize: '16px', color: '#2ecc71' }}>
//               {editId ? `Edit Entry (ID: ${editId})` : 'Upload New File (.jpg, .png, .pdf)'}
//             </h4>
//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#8a8a98' }}>Select Document / Image</label>
//                 <input 
//                   type="file" 
//                   accept=".jpg, .jpeg, .png, .pdf" 
//                   onChange={handleFileChange} 
//                   style={{ 
//                     padding: '10px', 
//                     border: '1px solid #2d2d37', 
//                     borderRadius: '6px', 
//                     width: '100%', 
//                     backgroundColor: '#1e1e24', 
//                     color: '#fff',
//                     cursor: 'pointer' 
//                   }}
//                 />
//               </div>
//               <div style={{ display: 'flex', gap: '10px' }}>
//                 <button 
//                   type="submit" 
//                   disabled={loading}
//                   style={{ 
//                     backgroundColor: '#2ecc71', 
//                     color: '#fff', 
//                     padding: '10px 20px', 
//                     border: 'none', 
//                     borderRadius: '6px', 
//                     fontWeight: '600',
//                     cursor: 'pointer',
//                     opacity: loading ? 0.7 : 1 
//                   }}
//                 >
//                   {loading ? 'Processing...' : editId ? 'Update Record' : 'Upload File'}
//                 </button>
//                 {editId && (
//                   <button 
//                     type="button" 
//                     onClick={() => { setEditId(null); setFile(null); }}
//                     style={{ backgroundColor: '#7f8c8d', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>

//           {/* List Data Section */}
//           <div style={{ backgroundColor: '#16161a', padding: '24px', borderRadius: '8px', border: '1px solid #232329' }}>
//             <h4 style={{ marginBottom: '15px', fontSize: '16px', color: '#2ecc71' }}>Uploaded Registry Data</h4>
//             {listData.length === 0 ? (
//               <p style={{ color: '#8a8a98', fontStyle: 'italic' }}>No data available found.</p>
//             ) : (
//               <div style={{ overflowX: 'auto' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
//                   <thead>
//                     <tr style={{ borderBottom: '2px solid #232329', color: '#8a8a98' }}>
//                       <th style={{ padding: '12px' }}>ID</th>
//                       <th style={{ padding: '12px' }}>File Details / Path</th>
//                       <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {listData.map((item, index) => {
//                       const imagePath = item.qrCodeImageUrl || item.filePath || item.url;
//                       const fullImageUrl = getImageUrl(imagePath);
//                       const isPdf = imagePath && imagePath.toLowerCase().endsWith('.pdf');

//                       return (
//                         <tr key={item.qrcashcodeid || item.id || index} style={{ borderBottom: '1px solid #232329' }}>
//                           <td style={{ padding: '12px', color: '#fff' }}>{item.qrcashcodeid || item.id || index + 1}</td>
//                           <td style={{ padding: '12px', color: '#ccc' }}>
//                             {isPdf ? (
//                               <a href={fullImageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>
//                                 View PDF Document
//                               </a>
//                             ) : imagePath ? (
//                               <a href={fullImageUrl} target="_blank" rel="noopener noreferrer">
//                                 <img 
//                                   src={fullImageUrl} 
//                                   alt="Uploaded QR" 
//                                   style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} 
//                                   onError={(e) => { 
//                                     e.target.style.display = 'none'; 
//                                     if(e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
//                                   }}
//                                 />
//                                 <span style={{ display: 'none', fontSize: '12px', color: '#e74c3c' }}>Failed to load image</span>
//                               </a>
//                             ) : (
//                               <span>No File</span>
//                             )}
//                           </td>
//                           <td style={{ padding: '12px', textAlign: 'center' }}>
//                             <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
//                               <button 
//                                 onClick={() => handleEdit(item.qrcashcodeid || item.id)}
//                                 style={{ backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
//                               >
//                                 Edit
//                               </button>
//                               <button 
//                                 onClick={() => handleDelete(item.qrcashcodeid || item.id)}
//                                 style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function QRCODEUPLOAD_LIST() {
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Sidebar states
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const fetchList = async () => {
    try {
      const response = await fetch('https://ecommerencesite.onrender.com/api/QRCASHAPI/listqucasehmodel');
      const data = await response.json();
      setListData(Array.isArray(data) ? data : data.result || []);
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editId) {
      alert('Please select a file (.jpg, .png, .pdf) first.');
      return;
    }

    const formData = new FormData();
    if (file) {
      // Backend ke liye standard key 'file' ya 'qrCodeImage' use karein
      formData.append('file', file);
    }

    try {
      setLoading(true);
      if (editId) {
        formData.append('id', editId);
        const response = await fetch('https://ecommerencesite.onrender.com/api/QRCASHAPI/UpdateQRCashCodeModels', {
          method: 'PUT',
          body: formData,
        });
        
        if (response.ok) {
          alert('Updated successfully!');
          setEditId(null);
        } else {
          const errText = await response.text();
          console.error('Update Error Response:', errText);
          alert('Update failed: ' + (errText || response.statusText));
        }
      } else {
        const response = await fetch('https://ecommerencesite.onrender.com/api/QRCASHAPI/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('Uploaded successfully!');
        } else {
          const errText = await response.text();
          console.error('Upload Error Response:', errText);
          alert('Upload failed: ' + (errText || response.statusText));
        }
      }
      setFile(null);
      e.target.reset();
      fetchList();
    } catch (error) {
      console.error('Error during upload/update:', error);
      alert('Network or server error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`https://ecommerencesite.onrender.com/api/QRCASHAPI/DeleteQRCashCodeModels?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Deleted successfully!');
        fetchList();
      } else {
        alert('Delete failed.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      setEditId(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching details for edit:', error);
    }
  };

  const getImageUrl = (imgpath) => {
    if (!imgpath) return '';
    if (imgpath.startsWith('http')) return imgpath;
    const cleanedPath = imgpath.replace('~', '');
    return `https://ecommerencesite.onrender.com${cleanedPath}`;
  };

  const getNavLinkClass = () => {
    return "text-white-50 text-decoration-none px-3 py-2 rounded d-flex align-items-center gap-2 hover-sidebar-menu";
  };

  const getSubLinkClass = () => {
    return "text-white-50 text-decoration-none py-1.5 px-2 rounded hover-sub-link";
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#0f0f13', minHeight: '100vh', color: '#fff' }}>
      
      {/* SIDEBAR */}
      <div style={{ 
        width: '280px', 
        backgroundColor: '#16161a', 
        padding: '24px 16px', 
        position: 'fixed',
        height: '100vh', 
        zIndex: 100, 
        overflowY: 'auto',
        borderRight: '1px solid #232329',
        top: 0,
        left: 0
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
          
          <Link to="/deshboardpanel" className={getNavLinkClass()}>
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
                <Link to="/adminissuetype" className={getSubLinkClass()}>Add Item Type</Link>
                <Link to="/adminmasterassignedto" className={getSubLinkClass()}>AddAssignedTO</Link>
                <Link to="/addadmintypes" className={getSubLinkClass()}>AddAdminTypes</Link>
                <Link to="/languagematerpanels" className={getSubLinkClass()}>Language Master</Link>
                <Link to="/statenamemasters" className={getSubLinkClass()}>StateName Master</Link>
                <Link to="/citynamemasters" className={getSubLinkClass()}>CityName Master</Link> 
                <Link to="/addaccountmastertypes" className={getSubLinkClass()}>Accountant Master Types</Link> 
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
                <Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link> 
                <Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">CustomerLIST</Link>
                <Link to="/adminFeedbackcustomerlists" className="btn btn-outline-success w-100 mb-2 text-start">Feedback List</Link>
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
                <Link to="/qrcodeupload" className="btn btn-success w-100 mb-2 text-start">qrcodeupload</Link>
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

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)', minHeight: '100vh', backgroundColor: '#0f0f13' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <h2 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#fff', fontSize: '24px' }}>
            QR Code & File Management Panel
          </h2>

          {/* Upload / Edit Section */}
          <div style={{ backgroundColor: '#16161a', padding: '24px', borderRadius: '8px', border: '1px solid #232329', marginBottom: '30px' }}>
            <h4 style={{ marginBottom: '15px', fontSize: '16px', color: '#2ecc71' }}>
              {editId ? `Edit Entry (ID: ${editId})` : 'Upload New File (.jpg, .png, .pdf)'}
            </h4>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#8a8a98' }}>Select Document / Image</label>
                <input 
                  type="file" 
                  accept=".jpg, .jpeg, .png, .pdf" 
                  onChange={handleFileChange} 
                  style={{ 
                    padding: '10px', 
                    border: '1px solid #2d2d37', 
                    borderRadius: '6px', 
                    width: '100%', 
                    backgroundColor: '#1e1e24', 
                    color: '#fff',
                    cursor: 'pointer' 
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    backgroundColor: '#2ecc71', 
                    color: '#fff', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: loading ? 0.7 : 1 
                  }}
                >
                  {loading ? 'Processing...' : editId ? 'Update Record' : 'Upload File'}
                </button>
                {editId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditId(null); setFile(null); }}
                    style={{ backgroundColor: '#7f8c8d', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Data Section */}
          <div style={{ backgroundColor: '#16161a', padding: '24px', borderRadius: '8px', border: '1px solid #232329' }}>
            <h4 style={{ marginBottom: '15px', fontSize: '16px', color: '#2ecc71' }}>Uploaded Registry Data</h4>
            {listData.length === 0 ? (
              <p style={{ color: '#8a8a98', fontStyle: 'italic' }}>No data available found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #232329', color: '#8a8a98' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px' }}>File Details / Path</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.map((item, index) => {
                      const imagePath = item.qrCodeImageUrl || item.filePath || item.url;
                      const fullImageUrl = getImageUrl(imagePath);
                      const isPdf = imagePath && imagePath.toLowerCase().endsWith('.pdf');

                      return (
                        <tr key={item.qrcashcodeid || item.id || index} style={{ borderBottom: '1px solid #232329' }}>
                          <td style={{ padding: '12px', color: '#fff' }}>{item.qrcashcodeid || item.id || index + 1}</td>
                          <td style={{ padding: '12px', color: '#ccc' }}>
                            {isPdf ? (
                              <a href={fullImageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>
                                View PDF Document
                              </a>
                            ) : imagePath ? (
                              <a href={fullImageUrl} target="_blank" rel="noopener noreferrer">
                                <img 
                                  src={fullImageUrl} 
                                  alt="Uploaded QR" 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} 
                                  onError={(e) => { 
                                    e.target.style.display = 'none'; 
                                    if(e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
                                  }}
                                />
                                <span style={{ display: 'none', fontSize: '12px', color: '#e74c3c' }}>Failed to load image</span>
                              </a>
                            ) : (
                              <span>No File</span>
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button 
                                onClick={() => handleEdit(item.qrcashcodeid || item.id)}
                                style={{ backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(item.qrcashcodeid || item.id)}
                                style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
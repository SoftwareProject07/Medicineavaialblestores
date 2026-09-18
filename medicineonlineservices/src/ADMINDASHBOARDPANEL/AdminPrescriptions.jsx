// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// export default function AdminPrescriptions() {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isViewOnly, setIsViewOnly] = useState(false); // सिर्फ देखने के लिए (View mode)

//   const [formData, setFormData] = useState({
//     id: 0,
//     patientName: "",
//     doctorName: "",
//     diagnosis: "",
//     status: "Active",
//     medicines: [
//       {
//         id: 0,
//         prescriptionModelId: 0,
//         medicineName: "",
//         dosage: "",
//         frequency: ""
//       }
//     ]
//   });

//   // 1. ALL PRESCRIPTIONS API (GET)
//   const fetchPrescriptions = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllPrescriptions");
//       const data = await response.json();
//       const actualData = Array.isArray(data) ? data : (data.data || data.result || []);
//       setPrescriptions(actualData);
//     } catch (error) {
//       console.error("Error fetching prescriptions:", error);
//       setPrescriptions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPrescriptions();
//   }, []);

//   // 2. DETAILS PRESCRIPTION API (GET by ID for EDIT)
//   const fetchPrescriptionDetails = async (id, viewMode = false) => {
//     try {
//       const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsPrescription?id=${id}`);
//       const data = await response.json();
//       if (data) {
//         setFormData(data);
//         setIsEditing(!viewMode);
//         setIsViewOnly(viewMode);
//         setShowModal(true);
//       }
//     } catch (error) {
//       console.error("Error fetching details:", error);
//       alert("Failed to fetch prescription details.");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleMedicineChange = (index, field, value) => {
//     const updatedMeds = [...formData.medicines];
//     updatedMeds[index][field] = value;
//     setFormData({ ...formData, medicines: updatedMeds });
//   };

//   const addMedicineField = () => {
//     setFormData({
//       ...formData,
//       medicines: [...formData.medicines, { id: 0, prescriptionModelId: formData.id || 0, medicineName: "", dosage: "", frequency: "" }]
//     });
//   };

//   const removeMedicineField = (index) => {
//     const updatedMeds = formData.medicines.filter((_, i) => i !== index);
//     setFormData({ ...formData, medicines: updatedMeds });
//   };

//   // 3. CREATE & 4. UPDATE SUBMIT HANDLER
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isViewOnly) return; // अगर व्यू मोड है तो सबमिट न हो

//     const url = isEditing
//       ? "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/UpdatePrescription"
//       : "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/CreatePrescription";
    
//     const method = isEditing ? "PUT" : "POST";

//     try {
//       const response = await fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         alert(isEditing ? "Prescription updated successfully!" : "Prescription created successfully!");
//         setShowModal(false);
//         fetchPrescriptions();
//         resetForm();
//       } else {
//         alert("Operation failed. Status: " + response.status);
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//       alert("Failed to connect to backend server.");
//     }
//   };

//   // 5. DELETE PRESCRIPTION API
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this prescription?")) {
//       try {
//         const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DeletePrescription?id=${id}`, {
//           method: "DELETE"
//         });

//         if (response.ok) {
//           alert("Prescription deleted successfully!");
//           fetchPrescriptions();
//         } else {
//           alert("Failed to delete prescription.");
//         }
//       } catch (error) {
//         console.error("Delete Error:", error);
//         alert("Network error during deletion.");
//       }
//     }
//   };

//   const resetForm = () => {
//     setIsEditing(false);
//     setIsViewOnly(false);
//     setFormData({
//       id: 0,
//       patientName: "",
//       doctorName: "",
//       diagnosis: "",
//       status: "Active",
//       medicines: [{ id: 0, prescriptionModelId: 0, medicineName: "", dosage: "", frequency: "" }]
//     });
//   };

//   const filteredPrescriptions = prescriptions.filter(item => {
//     const term = searchTerm.toLowerCase();
//     return (
//       item.patientName?.toLowerCase().includes(term) ||
//       item.doctorName?.toLowerCase().includes(term) ||
//       item.diagnosis?.toLowerCase().includes(term) ||
//       item.medicines?.some(m => m.medicineName?.toLowerCase().includes(term))
//     );
//   });

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", background: "#121214", color: "#e1e1e6", fontFamily: "'Inter', sans-serif" }}>
      
//       {/* SIDEBAR */}
//       <div style={{ width: '280px', backgroundColor: '#16161a', padding: '24px 16px', position: 'fixed', height: '100vh', zIndex: 100, borderRight: '1px solid #232329' }}>
//         <h5 className="text-white fw-bold mb-4">AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span></h5>
//         <Link to="/adminprescriptions" className="btn btn-success w-100 text-start">AdminPrescriptions</Link>
//       </div>

//       {/* MAIN CONTENT */}
//       <div style={{ marginLeft: "280px", width: "calc(100% - 280px)", padding: "32px", boxSizing: "border-box" }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
//           <div>
//             <h2 style={{ margin: 0, color: "#fff", fontWeight: "700" }}>Admin Prescription Management</h2>
//             <p style={{ color: "#8a8a98", margin: "4px 0 0 0" }}>Manage patient prescriptions and medicines database records.</p>
//           </div>
//           <button 
//             onClick={() => { resetForm(); setShowModal(true); }}
//             style={{ background: "#0fa462", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer" }}
//           >
//             + Add Prescription
//           </button>
//         </div>

//         <div style={{ background: "#1a1a1e", padding: "24px", borderRadius: "16px", border: "1px solid #2d2d37" }}>
//           <input
//             type="text"
//             placeholder="🔍 Search patient, doctor, diagnosis or medicine..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", marginBottom: "20px", outline: "none", boxSizing: "border-box" }}
//           />

//           <div style={{ overflowX: "auto" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
//               <thead>
//                 <tr style={{ background: "#222228", borderBottom: "2px solid #2d2d37", color: "#a1a1aa", fontSize: "0.85rem" }}>
//                   <th style={{ padding: "12px" }}>Patient Name</th>
//                   <th style={{ padding: "12px" }}>Doctor Name</th>
//                   <th style={{ padding: "12px" }}>Diagnosis</th>
//                   <th style={{ padding: "12px" }}>Medicines Details</th>
//                   <th style={{ padding: "12px" }}>Date</th>
//                   <th style={{ padding: "12px" }}>Status</th>
//                   <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr><td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#8a8a98" }}>Loading records...</td></tr>
//                 ) : filteredPrescriptions.length > 0 ? (
//                   filteredPrescriptions.map((item, idx) => (
//                     <tr key={item.id || idx} style={{ borderBottom: "1px solid #232329", fontSize: "0.9rem" }}>
//                       <td style={{ padding: "12px", fontWeight: "600", color: "RED "}}>{item.patientName}</td>
//                       <td style={{ padding: "12px", color: "RED" }}>Dr. {item.doctorName}</td>
//                       <td style={{ padding: "12px", color: "RED" }}>{item.diagnosis}</td>
//                       <td style={{ padding: "12px", color: "RED" }}>
//                         {item.medicines?.map((med, mIdx) => (
//                           <div key={mIdx} style={{ fontSize: "0.82rem", marginBottom: "4px" }}>
//                             💊 <strong>{med.medicineName}</strong> ({med.dosage} - {med.frequency})
//                           </div>
//                         ))}
//                       </td>
//                       <td style={{ padding: "12px", color: "#a1a1aa" }}>
//                         {item.prescriptionDate ? new Date(item.prescriptionDate).toLocaleDateString() : "N/A"}
//                       </td>
//                       <td style={{ padding: "12px" }}>
//                         <span style={{ background: "#064e3b", color: "#34d399", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" }}>
//                           {item.status}
//                         </span>
//                       </td>
//                       <td style={{ padding: "12px", textAlign: "center" }}>
//                         {/* EDIT BUTTON */}
//                         <button 
//                           onClick={() => fetchPrescriptionDetails(item.id, false)} 
//                           style={{ background: "#0284c7", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", marginRight: "6px", cursor: "pointer", fontSize: "0.8rem" }}
//                         >
//                           Edit
//                         </button>

//                         {/* VIEW BUTTON */}
//                         <button 
//                           onClick={() => fetchPrescriptionDetails(item.id, true)} 
//                           style={{ background: "#059669", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", marginRight: "6px", cursor: "pointer", fontSize: "0.8rem" }}
//                         >
//                           VIEW
//                         </button>

//                         {/* DELETE BUTTON */}
//                         <button 
//                           onClick={() => handleDelete(item.id)} 
//                           style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#8a8a98" }}>No prescription records found.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* MODAL FOR VIEW, EDIT & CREATE */}
//       {showModal && (
//         <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
//           <div style={{ background: "#1a1a1e", padding: "30px", borderRadius: "16px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", border: "1px solid #2d2d37", color: "#fff" }}>
//             <h3>{isViewOnly ? "View Prescription Details" : isEditing ? "Update Prescription" : "Create New Prescription"}</h3>
            
//             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
//               <div>
//                 <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Patient Name</label>
//                 <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} disabled={isViewOnly} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }} />
//               </div>
//               <div>
//                 <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Doctor Name</label>
//                 <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} disabled={isViewOnly} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }} />
//               </div>
//               <div>
//                 <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Diagnosis</label>
//                 <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} disabled={isViewOnly} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }} />
//               </div>
//               <div>
//                 <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Status</label>
//                 <select name="status" value={formData.status} onChange={handleChange} disabled={isViewOnly} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }}>
//                   <option value="Active">Active</option>
//                   <option value="Completed">Completed</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>

//               <hr style={{ borderColor: "#2d2d37" }} />
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <h5 style={{ margin: 0 }}>Medicines List</h5>
//                 {!isViewOnly && (
//                   <button type="button" onClick={addMedicineField} style={{ background: "#0284c7", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>+ Add Medicine</button>
//                 )}
//               </div>

//               {formData.medicines.map((med, index) => (
//                 <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#121214", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37" }}>
//                   <input type="text" placeholder="Medicine Name" value={med.medicineName} onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)} disabled={isViewOnly} required style={{ flex: 2, padding: "8px", borderRadius: "6px", border: "1px solid #2d2d37", background: "#1a1a1e", color: "#fff", outline: "none" }} />
//                   <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} disabled={isViewOnly} required style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #2d2d37", background: "#1a1a1e", color: "#fff", outline: "none" }} />
//                   <input type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} disabled={isViewOnly} required style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #2d2d37", background: "#1a1a1e", color: "#fff", outline: "none" }} />
//                   {!isViewOnly && formData.medicines.length > 1 && (
//                     <button type="button" onClick={() => removeMedicineField(index)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer" }}>✕</button>
//                   )}
//                 </div>
//               ))}

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
//                 <button type="button" onClick={() => setShowModal(false)} style={{ background: "#3f3f46", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Close</button>
//                 {!isViewOnly && (
//                   <button type="submit" style={{ background: "#0fa462", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>{isEditing ? "Update Changes" : "Save Prescription"}</button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminPrescriptions() {
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false); // सिर्फ देखने के लिए (View mode)

  // Sidebar States
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(true);

  const [formData, setFormData] = useState({
    id: 0,
    patientName: "",
    doctorName: "",
    diagnosis: "",
    status: "Active",
    medicines: [
      {
        id: 0,
        prescriptionModelId: 0,
        medicineName: "",
        dosage: "",
        frequency: ""
      }
    ]
  });

  const handleShopToggle = () => {
    setIsShopOpen(!isShopOpen);
  };

  const getNavLinkClass = (path) => "d-flex align-items-center gap-3 px-3 py-2 text-white text-decoration-none rounded mb-1";
  const getSubLinkClass = (path) => "text-white-50 text-decoration-none py-1.5 px-2 rounded mb-1";

  // 1. ALL PRESCRIPTIONS API (GET)
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/AllPrescriptions");
      const data = await response.json();
      const actualData = Array.isArray(data) ? data : (data.data || data.result || []);
      setPrescriptions(actualData);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // 2. DETAILS PRESCRIPTION API (GET by ID for EDIT)
  const fetchPrescriptionDetails = async (id, viewMode = false) => {
    try {
      const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DetailsPrescription?id=${id}`);
      const data = await response.json();
      if (data) {
        setFormData(data);
        setIsEditing(!viewMode);
        setIsViewOnly(viewMode);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to fetch prescription details.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMeds = [...formData.medicines];
    updatedMeds[index][field] = value;
    setFormData({ ...formData, medicines: updatedMeds });
  };

  const addMedicineField = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { id: 0, prescriptionModelId: formData.id || 0, medicineName: "", dosage: "", frequency: "" }]
    });
  };

  const removeMedicineField = (index) => {
    const updatedMeds = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updatedMeds });
  };

  // 3. CREATE & 4. UPDATE SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewOnly) return;

    const url = isEditing
      ? "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/UpdatePrescription"
      : "https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/CreatePrescription";
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(isEditing ? "Prescription updated successfully!" : "Prescription created successfully!");
        setShowModal(false);
        fetchPrescriptions();
        resetForm();
      } else {
        alert("Operation failed. Status: " + response.status);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Failed to connect to backend server.");
    }
  };

  // 5. DELETE PRESCRIPTION API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        const response = await fetch(`https://ecommerencesite.onrender.com/api/TestingDashBoardPanelAPI/DeletePrescription?id=${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          alert("Prescription deleted successfully!");
          fetchPrescriptions();
        } else {
          alert("Failed to delete prescription.");
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Network error during deletion.");
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setIsViewOnly(false);
    setFormData({
      id: 0,
      patientName: "",
      doctorName: "",
      diagnosis: "",
      status: "Active",
      medicines: [{ id: 0, prescriptionModelId: 0, medicineName: "", dosage: "", frequency: "" }]
    });
  };

  const filteredPrescriptions = prescriptions.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.patientName?.toLowerCase().includes(term) ||
      item.doctorName?.toLowerCase().includes(term) ||
      item.diagnosis?.toLowerCase().includes(term) ||
      item.medicines?.some(m => m.medicineName?.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#121214", color: "#e1e1e6", fontFamily: "'Inter', sans-serif" }}>
      
      {/* SIDEBAR */}
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
                <Link to="/adminhealthhistorys" className="btn btn-outline-success w-100 mb-2 text-start">AdminHelathHistory</Link>
                <Link to="/adminmonthlyprogresses" className="btn btn-outline-success w-100 mb-2 text-start">AdminMonthlyProgress</Link>
                <Link to="/adminprescriptions" className="btn btn-success w-100 mb-2 text-start">AdminPrescriptions</Link>
                <Link to="/adminhistorymanagers" className="btn btn-outline-success w-100 mb-2 text-start">AdminHistoryManager</Link>
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

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: "280px", width: "calc(100% - 280px)", padding: "32px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, color: "#fff", fontWeight: "700" }}>Admin Prescription Management</h2>
            <p style={{ color: "#8a8a98", margin: "4px 0 0 0" }}>Manage patient prescriptions and medicines database records.</p>
          </div>
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            style={{ background: "#0fa462", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer" }}
          >
            + Add Prescription
          </button>
        </div>

        <div style={{ background: "#1a1a1e", padding: "24px", borderRadius: "16px", border: "1px solid #2d2d37" }}>
          <input
            type="text"
            placeholder="🔍 Search patient, doctor, diagnosis or medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", marginBottom: "20px", outline: "none", boxSizing: "border-box" }}
          />

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#222228", borderBottom: "2px solid #2d2d37", color: "#a1a1aa", fontSize: "0.85rem" }}>
                  <th style={{ padding: "12px" }}>Patient Name</th>
                  <th style={{ padding: "12px" }}>Doctor Name</th>
                  <th style={{ padding: "12px" }}>Diagnosis</th>
                  <th style={{ padding: "12px" }}>Medicines Details</th>
                  <th style={{ padding: "12px" }}>Date</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#8a8a98" }}>Loading records...</td></tr>
                ) : filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map((item, idx) => (
                    <tr key={item.id || idx} style={{ borderBottom: "1px solid #232329", fontSize: "0.9rem" }}>
                      <td style={{ padding: "12px", fontWeight: "600", color: "red" }}>{item.patientName}</td>
                      <td style={{ padding: "12px", color: "red" }}>Dr. {item.doctorName}</td>
                      <td style={{ padding: "12px", color: "red" }}>{item.diagnosis}</td>
                      <td style={{ padding: "12px", color: "red" }}>
                        {item.medicines?.map((med, mIdx) => (
                          <div key={mIdx} style={{ fontSize: "0.82rem", marginBottom: "4px" }}>
                            💊 <strong>{med.medicineName}</strong> ({med.dosage} - {med.frequency})
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: "12px", color: "#a1a1aa" }}>
                        {item.prescriptionDate ? new Date(item.prescriptionDate).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ background: "#064e3b", color: "#34d399", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700" }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button 
                          onClick={() => fetchPrescriptionDetails(item.id, false)} 
                          style={{ background: "#0284c7", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", marginRight: "6px", cursor: "pointer", fontSize: "0.8rem" }}
                        >
                          Edit
                        </button>

                        <button 
                          onClick={() => fetchPrescriptionDetails(item.id, true)} 
                          style={{ background: "#059669", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", marginRight: "6px", cursor: "pointer", fontSize: "0.8rem" }}
                        >
                          VIEW
                        </button>

                        <button 
                          onClick={() => handleDelete(item.id)} 
                          style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#8a8a98" }}>No prescription records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL FOR VIEW, EDIT & CREATE */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div style={{ background: "#1a1a1e", padding: "30px", borderRadius: "16px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", border: "1px solid #2d2d37", color: "#fff" }}>
            <h3>{isViewOnly ? "View Prescription Details" : isEditing ? "Update Prescription" : "Create New Prescription"}</h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Patient Name</label>
                <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} disabled={isViewOnly} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Doctor Name</label>
                <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} disabled={isViewOnly} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Diagnosis</label>
                <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} disabled={isViewOnly} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} disabled={isViewOnly} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37", background: "#121214", color: "#fff", outline: "none", boxSizing: "border-box" }}>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <hr style={{ borderColor: "#2d2d37" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5 style={{ margin: 0 }}>Medicines List</h5>
                {!isViewOnly && (
                  <button type="button" onClick={addMedicineField} style={{ background: "#0284c7", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>+ Add Medicine</button>
                )}
              </div>

              {formData.medicines.map((med, index) => (
                <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#121214", padding: "10px", borderRadius: "8px", border: "1px solid #2d2d37" }}>
                  <input type="text" placeholder="Medicine Name" value={med.medicineName} onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)} disabled={isViewOnly} required style={{ flex: 2, padding: "8px", borderRadius: "6px", border: "1px solid #2d2d37", background: "#1a1a1e", color: "#fff", outline: "none" }} />
                  <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} disabled={isViewOnly} required style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #2d2d37", background: "#1a1a1e", color: "#fff", outline: "none" }} />
                  <input type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)} disabled={isViewOnly} required style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #2d2d37", background: "#1a1a1e", color: "#fff", outline: "none" }} />
                  {!isViewOnly && formData.medicines.length > 1 && (
                    <button type="button" onClick={() => removeMedicineField(index)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer" }}>✕</button>
                  )}
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: "#3f3f46", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Close</button>
                {!isViewOnly && (
                  <button type="submit" style={{ background: "#0fa462", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>{isEditing ? "Update Changes" : "Save Prescription"}</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import "../styles/deshboards.css";
import "../styles/noscroll.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // For dynamic excel export (Download configuration)

export default function DeshboardPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Core States ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
  const [uploading, setUploading] = useState(false); // UI Loader control

  // --- UI Dropdown States ---
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

  // --- Pagination States (7 elements per page) ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; 

  // --- Edit Modal States ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMed, setCurrentMed] = useState({
    id: "",
    name: "",
    manufacturer: "",
    unitPrice: "",
    discount: "",
    quantity: "",
    expiryDate: "",
    image: "", 
    itemMedicine: "",
    type: "",
    medicinesType: "" 
  });

  // --- Active Helper Classes for Sidebar ---
  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `d-flex align-items-center gap-3 px-3 py-2.5 rounded text-decoration-none transition-all ${
      isActive ? "bg-success text-white fw-bold shadow-sm" : "text-white-50 hover-sidebar-menu"
    }`;
  };

  const getSubLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `position-relative d-block py-2 ps-4 text-decoration-none transition-all ${
      isActive ? "text-success fw-bold" : "text-white-50 hover-text-white"
    }`;
  };

  // --- Shop Toggle Logic ---
  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  // Helper Utility to parse raw API dates strictly to "DD/MM/YYYY"
  const normalizeToDDMMYYYY = (rawDate) => {
    if (!rawDate) return "";
    const cleanDate = String(rawDate).trim();
    
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDate)) {
      return cleanDate;
    }

    if (cleanDate.includes("-")) {
      const splitT = cleanDate.split("T")[0];
      const parts = splitT.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${day}/${month}/${year}`;
      }
    }
    return cleanDate;
  };

  // --- Fetch Data from API & Normalize ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct"
     // "http://localhost:5256/api/MEDICINE/AllListMedicineProduct"
      );

      console.log("API Full Response:", res.data);

      const rawData = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.lsTmedicines || res.data?.listMedicine || res.data?.data || res.data?.result || []);

      const normalized = rawData.map(m => ({
        id: m.id || m.Id || m._id || 0,
        name: m.name || m.Name || "",
        manufacturer: m.manufacturer || m.Manufacturer || "",
        unitPrice: m.unitPrice || m.UnitPrice || 0,
        discount: m.discount || m.Discount || 0,
        quantity: m.quantity || m.Quantity || 0,
        expiryDate: normalizeToDDMMYYYY(m.expiryDate || m.ExpiryDate),
        image: m.image || m.Image || "", 
        itemMedicine: m.itemMedicine || m.ItemMedicine || "",
        type: m.type || m.Type || "",
        medicinesType: m.medicinesType || m.MedicinesType || ""
      }));

      setMedicines(normalized);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Excel Download Logic ---
  const handleDownloadExcel = () => {
    if (medicines.length === 0) {
      alert("No data available to download.");
      return;
    }

    const dataToExport = medicines.map((m) => ({
      "Medicine Name": m.name,
      "Manufacturer": m.manufacturer,
      "Unit Price (₹)": m.unitPrice,
      "Discount (%)": m.discount,
      "Quantity": m.quantity,
      "Expiry Date": m.expiryDate,
      "Health Condition (Type)": m.type,
      "Category (ItemMedicine)": m.itemMedicine,
      "MedicinesType (Form)": m.medicinesType
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Medicines");
    XLSX.writeFile(wb, "AKMedizo_All_Medicines.xlsx");
  };

  // --- Excel Upload ---
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file); 

    try {
      const response = await axios.post(
      //  "http://localhost:5256/api/MEDICINE/UploadExcel",
      'https://ecommerencesite.onrender.com/api/MEDICINE/UploadExcel',
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200 || response.data?.success) {
        alert("Congratulations! The Excel file has been successfully uploaded.");
        fetchData(); 
      } else {
        alert("The Excel file has failed to upload: " + (response.data?.message || "Unknown server response"));
      }

    } catch (err) {
      console.error("Excel Upload Controller Error:", err);
      const serverError = err.response?.data?.error || err.response?.data?.message || err.message;
      alert("ERROR SERVER: " + serverError);
    } finally {
      setUploading(false);
      e.target.value = ""; 
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMed({ ...currentMed, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Kya aap "${name}" ko delete karna chahte hain?`)) {
      try {
        await axios.delete(`https://ecommerencesite.onrender.com/api/MEDICINE/DeleteMedicine/${id}`);
        setMedicines(prev => prev.filter(m => m.id !== id));
        alert("Deleted!");
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const openEditModal = (med) => {
    setCurrentMed({
      ...med,
      expiryDate: normalizeToDDMMYYYY(med.expiryDate)
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    let finalExpiryDate = String(currentMed.expiryDate || "").trim();
    const ddMmYyyyRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!ddMmYyyyRegex.test(finalExpiryDate)) {
      if (finalExpiryDate.includes("-")) {
        const datePath = finalExpiryDate.split("T")[0];
        const parts = datePath.split("-");
        if (parts.length === 3) {
          const year = parts[0];
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          finalExpiryDate = `${day}/${month}/${year}`;
        }
      } else {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear() + 2; 
        finalExpiryDate = `${dd}/${mm}/${yyyy}`;
      }
    }

    const updatePayload = {
      Id: parseInt(currentMed.id || 0),
      Name: String(currentMed.name || "").trim(),
      Manufacturer: String(currentMed.manufacturer || "N/A").trim(),
      UnitPrice: parseFloat(currentMed.unitPrice) || 0,
      Quantity: parseInt(currentMed.quantity) || 0,
      ExpiryDate: finalExpiryDate, 
      // Fix: Agar currentMed.image khali ya undefined hai, toh purani image ya placeholder bhejein
      Image: currentMed.image ? String(currentMed.image) : "", 
      ItemMedicine: String(currentMed.itemMedicine || "N/A").trim(),
      Type: String(currentMed.type || "N/A").trim(),
      MedicinesType: String(currentMed.medicinesType || "N/A").trim(), 
      Discount: parseFloat(currentMed.discount) || 0,
      Status: 1 
    };

    try {
      const apiUrl = "https://ecommerencesite.onrender.com/api/MEDICINE/UpdateMedicine";
      const response = await axios.put(apiUrl, updatePayload, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.status === 200 || response.status === 204 || response.data) {
        await fetchData(); 
        setShowEditModal(false);
        alert("Updated Successfully!");
      }
    } catch (err) {
      console.error("Update error detail:", err);
      if (err.response && err.response.data) {
        const detailedErr = JSON.stringify(err.response.data.errors || err.response.data);
        alert(`Update Failed: ${detailedErr}`);
      } else {
        alert("Update failed. Please review inputs.");
      }
    }
  };

  // --- Search Filtering ---
  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMedicines.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>

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
                
                <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminissuetype' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  Add Item Type
                </Link>

                <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/adminmasterassignedto' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAssignedTO
                </Link>
                <Link to="/addadmintypes" className={getSubLinkClass("/addadmintypes")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/addadmintypes' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                  AddAdminTypes
                </Link>
                <Link to="/languagematerpanels" className={getSubLinkClass("/languagematerpanels")}>
                  <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
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
      <div style={{ flex: 1, marginLeft: '280px', padding: '30px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 text-white">
          <h2>Medicines Management</h2>
          <div className="d-flex align-items-center gap-2">
            
            <label className={`btn btn-success btn-sm px-2 mb-0 d-flex align-items-center gap-2 ${uploading ? 'disabled' : ''}`} style={{ cursor: 'pointer' }}>
              {uploading ? "Uploading..." : "Upload All Medicine"} 
              {uploading ? <span className="spinner-border spinner-border-sm"></span> : <i className="fa-solid fa-upload"></i>}
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                style={{ display: "none" }} 
                onChange={handleExcelUpload} 
                disabled={uploading}
              />
            </label>

            <button 
              type="button" 
              onClick={handleDownloadExcel} 
              className="btn btn-info btn-sm px-2 text-white"
              style={{ fontWeight: "bold" }}
            >
              Download All Medicine <i className="fa-solid fa-download"></i>
            </button>

            <Link to="/deshboardpanel/medicines" className="btn btn-success btn-sm px-4">Add Medicine</Link>
          </div>
        </div>

        <input
          className="form-control mb-4 bg-dark text-white border-secondary"
          placeholder="Search All Medicines..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />

        <div className="table-responsive bg-dark rounded border border-secondary">
          <table className="table table-dark table-hover mb-0" style={{ fontSize: '13px' }}>
            <thead className="table-secondary text-dark">
              <tr>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Qty</th>
                <th>Expiry</th>
                <th>Category</th>
                <th>Type</th>
                <th>MedType</th>
                <th>Image</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" className="text-center p-5">Loading...</td></tr>
              ) : paginatedMedicines.length === 0 ? (
                <tr><td colSpan="11" className="text-center p-5 text-white-50">No Medicines Found. Upload excel or add some!</td></tr>
              ) : paginatedMedicines.map((med) => (
                <tr key={med.id}>
                  <td className="text-info fw-bold">{med.name}</td>
                  <td>{med.manufacturer}</td>
                  <td>₹{med.unitPrice}</td>
                  <td className="text-warning">{med.discount}%</td>
                  <td><span className={`badge ${med.quantity > 0 ? 'bg-primary' : 'bg-danger'}`}>{med.quantity}</span></td>
                  <td>{med.expiryDate}</td>
                  <td>{med.type}</td>
                  <td>{med.itemMedicine}</td>
                  <td className="text-success">{med.medicinesType}</td>
                  <td>
                    {(() => {
                      const imgValue = med?.Image || med?.image;

                      if (!imgValue || imgValue.includes('placeholder.com')) {
                        return <span style={{ fontSize: '11px', color: '#888' }}>No Image</span>;
                      }

                      let imageUrl = imgValue;
                      if (imgValue.startsWith('data:image') || imgValue.startsWith('http') || imgValue.startsWith('blob:')) {
                        imageUrl = imgValue;
                      } else {
                        const cleanName = imgValue.replace(/^uploads[\\/]/, '').replace(/^\/+/, '');
                        // FIXED: Corrected string interpolation using proper backticks (``) instead of quotes ("")
                        imageUrl = 
                        'https://ecommerencesite.onrender.com/uploads/${encodeURIComponent(cleanName)}';
                       // `http://localhost:5256/uploads/${encodeURIComponent(cleanName)}`;
                      }

                      return (
                        <img 
                          src={imageUrl} 
                          alt="medicine" 
                          style={{ 
                            width: '45px', 
                            height: '45px', 
                            objectFit: 'cover', 
                            borderRadius: '4px',
                            border: '1px solid #555'
                          }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/822/822148.png"; 
                          }}
                        />
                      );
                    })()}
                  </td>
                  <td className="text-center">
                    <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditModal(med)}>Edit</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(med.id, med.name)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-between align-items-center mt-3 text-white-50">
          <small>Showing {paginatedMedicines.length} of {filteredMedicines.length} results</small>
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-outline-success" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            <button type="button" className="btn btn-sm btn-success" disabled>{currentPage} / {totalPages || 1}</button>
            <button type="button" className="btn btn-sm btn-outline-success" disabled={currentPage >= totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="bg-dark p-4 rounded border border-secondary" style={{ width: '600px', maxHeight: '90vh', overflowY: 'auto', color: 'white' }}>
            <h4 className="text-primary mb-4 text-center">Update Medicine Details</h4>
            <form onSubmit={handleUpdateSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="small text-white-50">Medicine Name</label>
                  <input type="text" className="form-control bg-dark text-white border-secondary" value={currentMed.name} onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small text-white-50">Manufacturer</label>
                  <input type="text" className="form-control bg-dark text-white border-secondary" value={currentMed.manufacturer} onChange={(e) => setCurrentMed({ ...currentMed, manufacturer: e.target.value })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="small text-white-50">Unit Price</label>
                  <input type="number" step="any" className="form-control bg-dark text-white border-secondary" value={currentMed.unitPrice} onChange={(e) => setCurrentMed({ ...currentMed, unitPrice: e.target.value })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="small text-white-50">Discount (%)</label>
                  <input type="number" step="any" className="form-control bg-dark text-white border-secondary" value={currentMed.discount} onChange={(e) => setCurrentMed({ ...currentMed, discount: e.target.value })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="small text-white-50">Quantity</label>
                  <input type="number" className="form-control bg-dark text-white border-secondary" value={currentMed.quantity} onChange={(e) => setCurrentMed({ ...currentMed, quantity: e.target.value })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small text-white-50">Expiry (DD/MM/YYYY)</label>
                  <input type="text" placeholder="DD/MM/YYYY" className="form-control bg-dark text-white border-secondary" value={currentMed.expiryDate} onChange={(e) => setCurrentMed({ ...currentMed, expiryDate: e.target.value })} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small text-white-50">Medicine Type</label>
                  <input type="text" className="form-control bg-dark text-white border-secondary" value={currentMed.medicinesType} onChange={(e) => setCurrentMed({ ...currentMed, medicinesType: e.target.value })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small text-white-50">Category (ItemMedicine)</label>
                  <input type="text" className="form-control bg-dark text-white border-secondary" value={currentMed.itemMedicine} onChange={(e) => setCurrentMed({ ...currentMed, itemMedicine: e.target.value })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small text-white-50">Type</label>
                  <input type="text" className="form-control bg-dark text-white border-secondary" value={currentMed.type} onChange={(e) => setCurrentMed({ ...currentMed, type: e.target.value })} />
                </div>
              </div>

              <div className="mb-3">
                <label className="small text-white-50">Image</label>
                <input type="file" className="form-control bg-dark text-white border-secondary mb-2" onChange={handleEditImageChange} accept="image/*" />
                {currentMed.image && <img src={currentMed.image} width="60" className="rounded border border-secondary" alt="preview" />}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success px-4">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
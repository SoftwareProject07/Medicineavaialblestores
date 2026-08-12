import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/admincreateMedicine.css";


export default function Medicine() {
  const navigate = useNavigate();
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);

  // --- Form States (Aligned with C# Model) ---
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // YYYY-MM-DD from input
  const [imageFile, setImageFile] = useState(null);
  const [type, setType] = useState(""); // Generic Type
  const [medicinesType, setMedicinesType] = useState(""); // e.g. Tablet/Syrup
  const [itemtype, setItemType] = useState(""); // Category/ItemMedicine
  const [userId, setUserId] = useState("1"); 
  const [preview, setPreview] = useState(null);

  // Clean up preview URL to avoid memory leaks
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  // Convert HTML Date (YYYY-MM-DD) to Backend Format (DD/MM/YYYY)
  const toDdMmYyyy = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const [yyyy, mm, dd] = yyyyMmDd.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name || !manufacturer || !unitPrice || !quantity || !expiryDate || !imageFile || !itemtype || !type || !medicinesType) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    // Keys exactly matching the C# Model and Dashboard Logic
    formData.append("UserId", userId); 
    formData.append("Name", name.trim());
    formData.append("Manufacturer", manufacturer);
    formData.append("UnitPrice", unitPrice);
    formData.append("Discount", discount || 0);
    formData.append("Quantity", quantity);
    formData.append("ExpiryDate", toDdMmYyyy(expiryDate));
    formData.append("STATUS", "1");
    formData.append("Image", imageFile); // Capital 'I' for Backend compatibility
    formData.append("Type", type);
    formData.append("MedicinesType", medicinesType); // Added 's' to match Model
    formData.append("ItemMedicine", itemtype);

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/MEDICINE/CreateMedicine",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Checking success based on multiple possible response keys
      const isSuccess = response.data.status ?? response.data.Status;
      
      if (isSuccess) {
        alert("Medicine Added Successfully!");
        navigate("/deshboardpanel");
      } else {
        alert("Error: " + (response.data.responseMessage || "Failed to add"));
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error: Server Connection Failed");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* SIDEBAR */}
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
               
               {/* 1. OPERATIONS CENTER DROPDOWN */}
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
                                <div className="position-absolute tracking-dot" style={{ left: '-5px', top: '50%', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: location.pathname === '/languagematerpanels' ? '#198754' : '#3e3e4a', transform: 'translateY(-50%)' }}></div>
                                Language Master           
                              </Link>
                   </div>
                 )}
               </div>
             
     
               {/* 2. MASTER CONFIGURATION DROPDOWN */}
            
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
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
          <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
          <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
          <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
          <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">UnavailableMedicineList</Link></li>
          <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">bankselectMaster </Link></li>
          <li><Link to="/admincreditdetails" className="btn btn-outline-success w-100 mb-2 text-start">BankCreditAmountDetails </Link></li> 
          <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Registeartion Form </Link></li>
          {/* <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AustomerHelpIssueList </Link></li> */}
          <li><Link to="/adminLivenessimageLists" className="btn btn-outline-success w-100 mb-2 text-start">LivenessimageList </Link></li>
          {/* <li><Link to="/adminsupportticketlist" className="btn btn-outline-success w-100 mb-2 text-start">AdminSupportTicketList </Link></li> */}
          <li><Link to="/admincustomerticketraiselist" className="btn btn-outline-success w-100 mb-2 text-start">customerticketraiselist </Link></li>
                            <li><Link to="/customer-bankdetailsrefund" className="btn btn-outline-success w-100 mb-2 text-start text-decoration-none">Bank Details RefundList</Link></li>
                                      <li><Link to="/customerdeliveryaddresslist" className="btn btn-outline-success w-100 mb-2 text-start">Customer_DeliveryAddressList</Link> </li>
                                                <li><Link to="/adminlivetracker" className="btn btn-outline-success w-100 mb-2 text-start">Livetracker</Link> </li>
<li>
               <Link to="/doctor_patientdetailslists" className="btn btn-outline-success w-100 mb-1 text-start btn-sm" style={{ fontSize: '12px' }}>Doctor_PatientdetailsLists         
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

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: '260px', padding: '40px', width: 'calc(100% - 260px)' }}>
        <fieldset style={{ backgroundColor: 'white', padding: '35px', borderRadius: '15px', border: '1px solid #ddd', maxWidth: '900px', margin: 'auto', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <legend className="text-center fw-bold h3 text-success mb-4 px-3">Add New Medicine to Inventory</legend>

          {/* Image Preview Area */}
          <div className="text-center mb-4">
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '3px solid #28a745' }} />
            ) : (
              <div style={{ width: '140px', height: '140px', backgroundColor: '#e9ecef', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', border: '2px dashed #ced4da' }}>
                No Preview
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Medicine Name*</label>
              <input placeholder="e.g. Paracetamol" className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Manufacturer*</label>
              <input placeholder="e.g. Cipla / GSK" className="form-control" value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Unit Price (₹)*</label>
              <input placeholder="0.00" type="number" className="form-control" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Discount (%)</label>
              <input type="number" className="form-control" value={discount} onChange={e => setDiscount(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Stock Quantity*</label>
              <input placeholder="Numbers only" type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
          </div>
          
        <div className="row">
            {/* <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">AllMedicineType*</label>
              <input placeholder="e.g. General" className="form-control" value={type} onChange={e => setType(e.target.value)} />
            </div>  */}

 <div className="col-md-4 mb-3">
  <label className="form-label fw-bold">AllMedicineType*</label>
  <select 
    className="form-select" 
    value={type} 
    onChange={e => setType(e.target.value)}
  >
    <option value="">Select Type</option>
    <option value="Medicines">Medicines</option>
    <option value="Personal Care">Personal Care</option>
    <option value="Health Conditions">Health Conditions</option>
    <option value="Vitamins & Supplements">Vitamins & Supplements</option>
    <option value="Diabetes Care">Diabetes Care</option>
    <option value="Healthcare Devices">Healthcare Devices</option>
    <option value="Homeopathic Medicine">Homeopathic Medicine</option>
    <option value="Health Guide">Health Guide</option>
  </select>
</div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Medicine Form*</label>
              <input placeholder="Tablet / Syrup / Capsule" className="form-control" value={medicinesType} onChange={e => setMedicinesType(e.target.value)} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Category (Item)*</label>
              <input placeholder="e.g. Fever / Pain" className="form-control" value={itemtype} onChange={e => setItemType(e.target.value)} />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Expiry Date*</label>
              <input type="date" className="form-control" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Product Image*</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <button className="btn btn-success w-100 fw-bold py-3 shadow-sm mb-2" onClick={handleSave}>
            🚀 ADD TO INVENTORY
          </button>
          
          <Link to="/deshboardpanel" className="btn btn-light w-100 text-secondary border">Cancel & Go Back</Link>
        </fieldset>
      </div>
    </div>
  );
}
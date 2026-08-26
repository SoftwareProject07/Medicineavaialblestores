import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/admincreateMedicine.css";

export default function Medicine() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- States ---
  const [masterDropdownOpen, setMasterDropdownOpen] = useState(false);
  const [listsDropdownOpen, setListsDropdownOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(true);

  // Form States
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState(""); 
  const [medicinesType, setMedicinesType] = useState("");
  const [itemtype, setItemType] = useState("");
  const [userId] = useState("1");

  const handleShopToggle = () => setIsShopOpen(!isShopOpen);
  
  const getNavLinkClass = (path) => 
    `px-3 py-2 text-white-50 text-decoration-none d-flex align-items-center gap-3 ${location.pathname === path ? 'bg-success text-white rounded' : ''}`;
  
  const getSubLinkClass = (path) => 
    `px-3 py-2 text-white-50 text-decoration-none d-flex align-items-center position-relative ${location.pathname === path ? 'text-success' : ''}`;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const toDdMmYyyy = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const parts = yyyyMmDd.split("-");
    if (parts.length === 3) {
      const [yyyy, mm, dd] = parts;
      return `${dd}/${mm}/${yyyy}`;
    }
    return yyyyMmDd;
  };

  const handleSave = async () => {
    if (!name || !manufacturer || !unitPrice || !quantity || !expiryDate || !imageFile || !type) {
      alert("Please fill all required fields including Image File!");
      return;
    }

    const formData = new FormData();
    formData.append("UserId", userId);
    formData.append("Name", name.trim());
    formData.append("Manufacturer", manufacturer.trim());
    formData.append("UnitPrice", unitPrice);
    formData.append("Discount", discount || 0);
    formData.append("Quantity", quantity);
    formData.append("ExpiryDate", toDdMmYyyy(expiryDate));
    formData.append("Status", "1");
    formData.append("Type", type);
    formData.append("MedicinesType", medicinesType.trim());
    formData.append("ItemMedicine", itemtype.trim());
    
    // File append (Backend parameter 'image' ke sath match hona chahiye)
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/MEDICINE/CreateMedicine", 
       //"http://localhost:5256/api/MEDICINE/CreateMedicine",
        formData
        // ⚠️ Headers manually pass nahi karne hain, axios khud boundary set karega (415 error fix)
      );

      if (response.status === 200 || response.status === 201) {
        alert("Medicine Added Successfully!");
        navigate("/deshboardpanel");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* SIDEBAR */}
      <div style={{ width: '280px', backgroundColor: '#16161a', padding: '24px 16px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>
        <div className="brand mb-4 px-2 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="36px" className="me-2" />
          <h5 className="m-0 text-white fw-bold">AKMedizo <span className="text-success" style={{ fontSize: '11px' }}>Admin</span></h5>
        </div>

        <div className="px-2 mb-4">
          <div onClick={handleShopToggle} className="p-2.5 rounded d-flex align-items-center justify-content-between" style={{ cursor: 'pointer', backgroundColor: '#1e1e24', border: '1px solid #2d2d37', borderRadius: '6px' }}>
            <div className="d-flex flex-column">
              <span style={{ fontSize: '10px', color: '#8a8a98', fontWeight: '600' }}>Store Status</span>
              <span className="text-white fw-bold" style={{ fontSize: '13px' }}>{isShopOpen ? "Open for Orders" : "Closed"}</span>
            </div>
            <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`} style={{ fontSize: '20px' }}></i>
          </div>
        </div>

        <Link to="/deshboardpanel" className={getNavLinkClass("/deshboardpanel")}>
          <i className="fas fa-chart-pie"></i> Dashboard Matrix
        </Link>
        <hr style={{ borderTop: '1px solid #232329', margin: '12px 0' }} />

        {/* Master Config */}
        <div>
          <div onClick={() => setMasterDropdownOpen(!masterDropdownOpen)} className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50" style={{ cursor: 'pointer' }}>
            <span><i className="fas fa-sliders-h"></i> Master Config</span>
            <i className={`fas fa-chevron-right ${masterDropdownOpen ? 'rotate-90' : ''}`}></i>
          </div>
          {masterDropdownOpen && (
            <div className="ms-3 d-flex flex-column">
              <Link to="/adminissuetype" className={getSubLinkClass("/adminissuetype")}>Add Item Type</Link>
              <Link to="/adminmasterassignedto" className={getSubLinkClass("/adminmasterassignedto")}>AddAssignedTO</Link>
            </div>
          )}
        </div>

        {/* Operations Registry */}
        <div className="mt-2">
          <div onClick={() => setListsDropdownOpen(!listsDropdownOpen)} className="d-flex align-items-center justify-content-between px-3 py-2 text-white-50" style={{ cursor: 'pointer' }}>
            <span><i className="fas fa-boxes"></i> Operations Registry</span>
            <i className={`fas fa-chevron-right ${listsDropdownOpen ? 'rotate-90' : ''}`}></i>
          </div>
          {listsDropdownOpen && (
            <div className="ms-3 d-flex flex-column gap-1">
              <Link to="/deshboardpanel" className="btn btn-outline-success w-100 text-start btn-sm">Dashboard</Link>
              <Link to="/customerlists" className="btn btn-outline-success w-100 text-start btn-sm">CustomerLIST</Link>
              <Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 text-start btn-sm">Feedback List</Link>
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

      {/* FORM CONTENT */}
      <div style={{ marginLeft: '280px', padding: '40px', width: 'calc(100% - 280px)' }}>
        <fieldset style={{ backgroundColor: 'white', padding: '35px', borderRadius: '15px', border: '1px solid #ddd', maxWidth: '900px', margin: 'auto' }}>
          <legend className="text-center fw-bold h3 text-success mb-4">Add New Medicine</legend>
          
          <div className="text-center mb-4">
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #ccc' }} />
            ) : (
              <div style={{ width: '140px', height: '140px', backgroundColor: '#e9ecef', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No Image Selected</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3"><label className="fw-bold">Medicine Name*</label><input className="form-control" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="col-md-6 mb-3"><label className="fw-bold">Manufacturer*</label><input className="form-control" value={manufacturer} onChange={e => setManufacturer(e.target.value)} /></div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3"><label className="fw-bold">UnitPrice*</label><input type="number" className="form-control" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} /></div>
            <div className="col-md-4 mb-3"><label className="fw-bold">Discount (%)</label><input type="number" className="form-control" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
            <div className="col-md-4 mb-3"><label className="fw-bold">Quantity*</label><input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} /></div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="fw-bold">Type*</label>
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="">Select</option>
                <option value="Medicines">Medicines</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Health Conditions">Health Conditions</option>
                <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                <option value="Diabetes Care">Diabetes Care</option>
                <option value="HealthCare Devices">HealthCare Devices</option>
                <option value="Homeopathic Medicine">Homeopathic Medicine</option>
                <option value="Health Guide">Health Guide</option>
              </select>
            </div>
            <div className="col-md-4 mb-3"><label className="fw-bold">Medicine Type*</label><input className="form-control" value={medicinesType} onChange={e => setMedicinesType(e.target.value)} /></div>
            <div className="col-md-4 mb-3"><label className="fw-bold">Category*</label><input className="form-control" value={itemtype} onChange={e => setItemType(e.target.value)} /></div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6 mb-3"><label className="fw-bold">Expiry Date*</label><input type="date" className="form-control" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} /></div>
            <div className="col-md-6 mb-3">
              <label className="fw-bold">Upload Image File*</label>
              <input 
                type="file" 
                className="form-control" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>
          </div>

          <button className="btn btn-success w-100 py-3 fw-bold" onClick={handleSave}>🚀 ADD TO INVENTORY</button>
        </fieldset>
      </div>
    </div>
  );
}
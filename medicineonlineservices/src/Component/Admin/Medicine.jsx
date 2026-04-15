import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/admincreateMedicine.css";

export default function Medicine() {
  const navigate = useNavigate();

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
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', color: 'white', zIndex: 100 }}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>
        <ul className="nav flex-column mt-4">
           <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
                               <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
                             <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
         
                        <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
         
                               <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                               <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                              <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>
         
                                <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Admin Registeartion Form  </Link></li>
         
                                                       <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
         
                               <li className="mt-3">
                                   <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
                                       <i className="fas fa-sign-out-alt"></i> LogOut
                                   </button>
                               </li>
       
        </ul>
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
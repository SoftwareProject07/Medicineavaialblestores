import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admincreateMedicine.css";

export default function Medicine() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); 
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null); // Preview ke liye state

  const toDdMmYyyy = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const [yyyy, mm, dd] = yyyyMmDd.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  // Image change handle aur preview generate karna
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file)); // File se temporary URL banana
    }
  };

  const handleSave = async () => {
    if (!name || !manufacturer || !unitPrice || !quantity || !expiryDate || !imageFile) {
      alert("Please fill all required fields and select an image");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Manufacturer", manufacturer);
    formData.append("UnitPrice", unitPrice);
    formData.append("Discount", discount || 0);
    formData.append("Quantity", quantity);
    formData.append("ExpiryDate", toDdMmYyyy(expiryDate)); 
    formData.append("STATUS", "1");
    formData.append("image", imageFile); 

    try {
      await axios.post(
        "https://ecommerencesite.onrender.com/api/MEDICINE/CreateMedicine",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Add Medicine Successful");
      navigate("/deshboardpanel");
    } catch (error) {
      console.error("API Error Detailed:", error.response?.data);
      alert("Add Medicine Failed. Check console.");
    }
  };

  return (
    <Fragment>
      <div className="medicine-page">
        <fieldset className="createmedicinecss">
          <legend style={{ textAlign: "center" }}>Create Medicine</legend>

          {/* --- Image Preview Section (Optional but Good) --- */}
          {preview && (
            <div className="preview-container">
               <div className="preview-card" style={{ backgroundImage: `url(${preview})` }}>
                  <span className="preview-overlay">{name || "Medicine Name"}</span>
               </div>
            </div>
          )}

          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Manufacturer" value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
          <input type="number" placeholder="Unit Price" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
          <input type="number" placeholder="Discount" value={discount} onChange={e => setDiscount(e.target.value)} />
          <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
          <label style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>Expiry Date:</label>
          <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
          
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange} 
          />

          <button className="btn btn-success w-100" onClick={handleSave}>
            Add Medicines
          </button>
        </fieldset>
      </div>
    </Fragment>
  );
}
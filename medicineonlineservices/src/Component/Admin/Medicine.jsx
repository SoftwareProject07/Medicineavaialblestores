import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/admincreateMedicine.css";

export default function Medicine() {
  const navigate = useNavigate();

  // Initial state ko empty string "" rakhein taaki "uncontrolled to controlled" error na aaye
  const [name, setName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); 
  const [imageFile, setImageFile] = useState(null);

  const toDdMmYyyy = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const [yyyy, mm, dd] = yyyyMmDd.split("-");
    return `${dd}/${mm}/${yyyy}`;
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
    
    // ✅ Yahan function call karna zaroori hai
    formData.append("ExpiryDate", toDdMmYyyy(expiryDate)); 
    
    formData.append("STATUS", "1");
    // ✅ Image file object bhej rahe hain
    formData.append("image", imageFile); 

    try {
      await axios.post(
       // "http://localhost:5256/api/MEDICINE/CreateMedicine",
       "https://ecommerencesite.onrender.com/api/MEDICINE/CreateMedicine",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      alert("Add Medicine Successful");
      navigate("/deshboardpanel");
    } catch (error) {
      // 400 error aane par yahan console mein check karein ki backend kya maang raha hai
      console.error("API Error Detailed:", error.response?.data);
      alert("Add Medicine Failed. Check console for details.");
    }
  };

  return (
    <Fragment>
      <div className="medicine-page">
        <fieldset className="createmedicinecss">
          <legend style={{ textAlign: "center" }}>Create Medicine</legend>

          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Manufacturer" value={manufacturer} onChange={e => setManufacturer(e.target.value)} />
          <input type="number" placeholder="Unit Price" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
          <input type="number" placeholder="Discount" value={discount} onChange={e => setDiscount(e.target.value)} />
          <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
          <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
          
          {/* ✅ FIXED: value property hata di gayi hai aur files[0] use kiya hai */}
          <input 
            type="file" 
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])} 
          />

          <button className="btn btn-success w-100" onClick={handleSave}>
            Add Medicines
          </button>
        </fieldset>
      </div>
    </Fragment>
  );
}
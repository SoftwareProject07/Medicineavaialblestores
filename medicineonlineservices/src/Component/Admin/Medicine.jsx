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
  const [expiryDate, setExpiryDate] = useState(""); // YYYY-MM-DD from input
  const [imageFile, setImageFile] = useState(null);

  const toDdMmYyyy = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const [yyyy, mm, dd] = yyyyMmDd.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleSave = async () => {
    if (!name || !manufacturer || !unitPrice || !quantity || !expiryDate || !imageFile) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Manufacturer", manufacturer);
    formData.append("UnitPrice", unitPrice);   // let server parse decimals
    formData.append("Discount", discount || 0);
    formData.append("Quantity", quantity);
    formData.append("ExpiryDate", toDdMmYyyy(expiryDate)); // match backend regex
    formData.append("STATUS", "1"); // optional; backend sets this anyway
    formData.append("image", imageFile); // must match controller parameter name

    try {
      await axios.post(
        "https://ecommerencesite-api.onrender.com/api/MEDICINE/CreateMedicine",
        formData,
        {
          // DO NOT set Content-Type manually; let the browser set multipart boundary
          // headers: { "Content-Type": "multipart/form-data" }
        }
      );
      alert("Add Medicine Successful");
      navigate("/deshboardpanel");
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      alert("Add Medicine Failed");
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
          {/* <input type="file" value={imageFile} onChange={e => setImageFile(e.target.value)} /> */}

          <input
            type="file"
            accept="image/*"
            value={imageFile}
            onChange={e => setImageFile(e.target.files?.[0] || null)}
          />
        

          <button className="btn btn-success w-100" onClick={handleSave}>
            Add Medicines
          </button>
        </fieldset>
      </div>
    </Fragment>
  );
}

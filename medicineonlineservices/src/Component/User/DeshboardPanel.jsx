import "../styles/deshboards.css";
import "../styles/noscroll.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DeshboardPanel() {
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDashboard, setOpenDashboard] = useState(false);
  
  // 🟢 SHOP STATUS STATE
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");

  const [currentPage, setCurrentPage] = useState(1);
  const firstPageSize = 5;
  const pageSize = 10;

  const [formData, setFormData] = useState({
    name: "", manufacturer: "", unitPrice: "", discount: "", quantity: "", expiryDate: "", image: null, imageurl: ""
  });

  // 🟢 TOGGLE FUNCTION
  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage")); // Trigger Header update
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  const normalize = (list) => list.map((m) => ({
    id: m.id ?? m.Id,
    name: m.name ?? m.Name,
    manufacturer: m.manufacturer ?? m.Manufacturer,
    unitPrice: m.unitPrice ?? m.UnitPrice,
    discount: m.discount ?? m.Discount,
    quantity: m.quantity ?? m.Quantity,
    expiryDate: m.expiryDate ?? m.ExpiryDate,
    imageurl: m.image ?? m.Image ?? m.imageurl ?? m.ImageUrl
  }));

  useEffect(() => {
    axios.get("https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data;
        setMedicines(Array.isArray(list) ? normalize(list) : []);
      })
      .catch(() => setMedicines([]));
  }, []);

  const filteredMedicines = medicines.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = currentPage === 1 ? 0 : firstPageSize + (currentPage - 2) * pageSize;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + (currentPage === 1 ? firstPageSize : pageSize));
  const totalPages = Math.ceil((filteredMedicines.length - firstPageSize) / pageSize) + 1;

  const handleEditClick = (med) => {
    setEditingMedicine(med.id);
    setFormData({ ...med, expiryDate: med.expiryDate?.split("T")[0] || "", image: null });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleUpdate = async (id) => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => { if(formData[key]) data.append(key, formData[key]); });
      const res = await axios.put("https://ecommerencesite.onrender.com/api/MEDICINE/UpdateMedicine", data);
      if (res.data?.status) {
        alert("Updated successfully");
        setEditingMedicine(null);
        window.location.reload(); 
      }
    } catch (err) { alert("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://ecommerencesite.onrender.com/api/MEDICINE/DeleteMedicine/${id}`);
      setMedicines(prev => prev.filter(m => m.id !== id));
    } catch { alert("Delete failed"); }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="brand">
          <img src="/AKMedizostore.png" alt="logo" width="45px" />
          <span>AKMedizostore</span>
        </div>
        <ul>
           {/* 🟢 TOGGLE BUTTON IN SIDEBAR */}
           <li className="p-2 border rounded bg-light text-dark mb-3 mx-2" onClick={handleShopToggle} style={{cursor:'pointer'}}>
              <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"} fa-lg`}></i>
              <span className="ms-2 fw-bold" style={{fontSize:'12px'}}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
           </li>

           <Link to="/deshboardpanel" className="btn btn-success mb-2 w-100">Admin Dashboard</Link>
           <li><Link to="/customerlists" className="btn btn-success mb-2 w-100">Customer LIST</Link></li>
           <li><Link to="/adminlogin"><i className="fas fa-sign-out-alt"></i> LogOut</Link></li>
        </ul>
      </div>

      <div className="content">
        <div className="topbar d-flex justify-content-between align-items-center mb-4">
          <h2>Medicines Management</h2>
          <Link to="/deshboardpanel/medicines" className="btn btn-success">Add Medicine</Link>
        </div>

        <input className="form-control mb-3" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <table className="table table-hover border shadow-sm">
          <thead className="table-success">
            <tr>
              <th>Name</th><th>Manufacturer</th><th>Price</th><th>Qty</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.map((med) => (
              <tr key={med.id}>
                <td>{editingMedicine === med.id ? <input name="name" className="form-control" value={formData.name} onChange={handleChange} /> : med.name}</td>
                <td>{med.manufacturer}</td>
                <td>₹{med.unitPrice}</td>
                <td>{med.quantity}</td>
                <td>
                  {editingMedicine === med.id ? (
                    <button className="btn btn-sm btn-success" onClick={() => handleUpdate(med.id)}>Save</button>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(med)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(med.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import "../styles/deshboards.css";
import "../styles/noscroll.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DeshboardPanel() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // --- Edit Modal States ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMed, setCurrentMed] = useState({
    id: "",
    name: "",
    manufacturer: "",
    unitPrice: "",
    discount: "",
    quantity: "",
    expDate: "",
    imageUrl: ""
  });

  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  // API Fetch Logic - Mapping fixed for Expiry Date & Image
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct");
      const rawData = res.data?.lsTmedicines || res.data?.listMedicine || [];
      
      const normalized = rawData.map(m => ({
        id: m.id || m.Id || m._id,
        name: m.name || m.Name || "",
        manufacturer: m.manufacturer || m.Manufacturer || "",
        unitPrice: m.unitPrice || m.UnitPrice || 0,
        discount: m.discount || m.Discount || 0,
        quantity: m.quantity || m.Quantity || 0,
        // Yahan 'expiryDate' ya 'expDate' dono check ho rahe hain
        expDate: (m.expDate || m.expiryDate || m.ExpiryDate) ? (m.expDate || m.expiryDate || m.ExpiryDate).split('T')[0] : "", 
        // Yahan 'imageUrl' ya 'image' dono check ho rahe hain
        imageUrl: m.imageUrl || m.image || m.Image || ""
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

  // --- Image to Base64 Conversion ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentMed({ ...currentMed, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id, name) => {
    if (window.confirm(`Kya aap "${name}" ko delete karna chahte hain?`)) {
      try {
        await axios.delete(`https://ecommerencesite.onrender.com/api/MEDICINE/DeleteMedicine/${id}`);
        setMedicines(prev => prev.filter(m => m.id !== id));
        alert("Deleted Successfully!");
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const openEditModal = (med) => {
    setCurrentMed(med);
    setShowEditModal(true);
  };

  // --- UPDATE SUBMIT ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: Use the correct API endpoint (Render or Localhost)
      await axios.post("https://ecommerencesite.onrender.com/api/MEDICINE/UpdateMedicine", currentMed);
      
      setMedicines(prev => prev.map(m => m.id === currentMed.id ? currentMed : m));
      setShowEditModal(false);
      alert("Medicine Updated Successfully!");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Update failed.");
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#1a1a1a', padding: '20px', position: 'fixed', height: '100vh', zIndex: 100 }}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>
        <ul className="nav flex-column mt-4">
          <li className="mb-3">
             <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between" onClick={handleShopToggle} style={{cursor:'pointer'}}>
                <span style={{fontSize: '11px'}}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
                <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
             </div>
          </li>
          <li><Link to="/deshboardpanel" className="btn btn-success w-100 mb-2 text-start">Dashboard</Link></li> 
          <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
                    <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderPayment LIST</Link></li>
                    <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatus LIST</Link></li>
                    <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">AdminRegisteration</Link></li>
                    


          <li className="mt-3"><button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0"><i className="fas fa-sign-out-alt"></i> LogOut</button></li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 text-white">
          <h2>Medicines Management</h2>
          <Link to="/deshboardpanel/medicines" className="btn btn-success btn-sm px-4">Add Medicine</Link>
        </div>

        <input className="form-control mb-4 bg-dark text-white border-secondary" placeholder="Search medicines..." onChange={(e) => setSearchTerm(e.target.value)} />

        <div className="table-responsive bg-dark rounded border border-secondary">
          <table className="table table-dark table-hover mb-0">
            <thead className="table-secondary">
              <tr>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Image</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMedicines.map((med) => (
                <tr key={med.id}>
                  <td className="text-info fw-bold">{med.name}</td>
                  <td className="text-white-50">{med.manufacturer}</td>
                  <td>₹{med.unitPrice}</td>
                  <td><span className={`badge ${med.quantity > 0 ? 'bg-primary' : 'bg-danger'}`}>{med.quantity}</span></td>
                  <td>{med.expDate || "No Date"}</td>
                  <td>
                    {med.imageUrl ? (
                      <img src={med.imageUrl} alt={med.name} width="40" height="40" style={{objectFit: 'cover', borderRadius: '4px'}} />
                    ) : (
                      <span className="text-muted" style={{fontSize: '10px'}}>No Image</span>
                    )}
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(med)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(med.id, med.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="bg-dark p-4 rounded border border-secondary shadow-lg" style={{ width: '450px', color: 'white' }}>
            <h4 className="text-center text-primary mb-4">Edit Medicine</h4>
            <form onSubmit={handleUpdateSubmit}>
              <input type="text" className="form-control mb-3 bg-dark text-white border-secondary" placeholder="Name" value={currentMed.name} onChange={(e) => setCurrentMed({...currentMed, name: e.target.value})} required />
              <input type="text" className="form-control mb-3 bg-dark text-white border-secondary" placeholder="Manufacturer" value={currentMed.manufacturer} onChange={(e) => setCurrentMed({...currentMed, manufacturer: e.target.value})} />
              <div className="row">
                <div className="col"><input type="number" className="form-control mb-3 bg-dark text-white border-secondary" placeholder="Price" value={currentMed.unitPrice} onChange={(e) => setCurrentMed({...currentMed, unitPrice: e.target.value})} /></div>
                <div className="col"><input type="number" className="form-control mb-3 bg-dark text-white border-secondary" placeholder="Qty" value={currentMed.quantity} onChange={(e) => setCurrentMed({...currentMed, quantity: e.target.value})} /></div>
              </div>
              
              <label className="small text-white-50 mb-1">Expiry Date:</label>
              <input type="date" className="form-control mb-3 bg-dark text-white border-secondary" value={currentMed.expDate} onChange={(e) => setCurrentMed({...currentMed, expDate: e.target.value})} />
              
              <div className="mb-4">
                <label className="small text-white-50 mb-1">Update Image:</label>
                <input type="file" className="form-control bg-dark text-white border-secondary" onChange={handleImageChange} accept="image/*" />
                {currentMed.imageUrl && <img src={currentMed.imageUrl} alt="preview" className="mt-2" width="60" />}
              </div>

              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-secondary w-45" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success w-45">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
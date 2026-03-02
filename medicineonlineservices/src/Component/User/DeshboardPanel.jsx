import "../styles/deshboards.css";
import "../styles/noscroll.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DeshboardPanel() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Shop Toggle Logic
  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  // ✅ Normalize function (Jo API ki different keys ko handle karega)
  const normalize = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map((m) => ({
      id: m.id || m.Id || m._id,
      name: m.name || m.Name || "Unknown",
      manufacturer: m.manufacturer || m.Manufacturer || "N/A",
      unitPrice: m.unitPrice || m.UnitPrice || 0,
      quantity: m.quantity || m.Quantity || 0
    }));
  };

  // ✅ Data Fetching: lsTmedicines key use ki gayi hai
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct");
        
        // Aapke screenshot ke mutabiq sahi key 'lsTmedicines' hai
        const rawData = res.data?.lsTmedicines || res.data?.listMedicine || [];
        
        setMedicines(normalize(rawData));
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMedicines = medicines.filter(m => 
    (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.manufacturer || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
      
      {/* --- SIDE MENU (SIDEBAR) --- */}
      <div style={{ 
        width: '260px', 
        backgroundColor: '#1a1a1a', 
        color: 'white', 
        padding: '20px',
        position: 'fixed',
        height: '100vh'
      }}>
        <div className="brand mb-4 d-flex align-items-center">
          <img src="/AKMedizostore.png" alt="logo" width="40px" className="me-2" />
          <h5 className="m-0 text-success fw-bold">AKMedizo</h5>
        </div>

        <ul className="nav flex-column mt-4">
          <li className="nav-item mb-3">
             <div className="p-2 border border-secondary rounded bg-dark text-white d-flex align-items-center justify-content-between" onClick={handleShopToggle} style={{cursor:'pointer'}}>
                <span style={{fontSize: '12px'}}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
                <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
             </div>
          </li>
                <li> <Link to="/deshboardpanel" className="btn btn-success mb-2">Admin Dashboard</Link> </li> 
                  {/* <li>Cart</li> */}
                  <li>OrdersPayment</li>
                  <li><Link to="/customerlists" className="btn btn-success mb-2">Customer LIST</Link></li>
                  <li>OrderList</li>
                  <li><Link to="/adminlogin"><i className="fas fa-sign-out-alt"></i> LogOut</Link></li>
                </ul>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 text-white">
          <h2>Medicines Management</h2>
          <Link to="/deshboardpanel/medicines" className="btn btn-success btn-sm">Add Medicine</Link>
        </div>

        <input 
          className="form-control mb-4 bg-dark text-white border-secondary" 
          placeholder="Search medicines..." 
          value={searchTerm} 
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
        />

        <div className="table-responsive bg-dark rounded shadow">
          <table className="table table-dark table-hover mb-0">
            <thead className="table-secondary">
              <tr>
                <th className="ps-3">Medicine Name</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Quantity</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-5">Loading data...</td></tr>
              ) : paginatedMedicines.length > 0 ? (
                paginatedMedicines.map((med) => (
                  <tr key={med.id}>
                    <td className="ps-3 text-info fw-bold">{med.name}</td>
                    <td className="text-white-50">{med.manufacturer}</td>
                    <td>₹{med.unitPrice}</td>
                    <td>
                      <span className={`badge ${med.quantity > 0 ? 'bg-primary' : 'bg-danger'}`}>
                        {med.quantity}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                      <button className="btn btn-sm btn-outline-danger">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center p-5">No medicines found in API.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMedicines.length > pageSize && (
          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-sm btn-outline-success me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span className="text-white align-self-center mx-2">Page {currentPage}</span>
            <button className="btn btn-sm btn-outline-success ms-2" disabled={startIndex + pageSize >= filteredMedicines.length} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
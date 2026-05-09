import "../styles/deshboards.css";
import "../styles/noscroll.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function DeshboardPanel() {
  const navigate = useNavigate();

  // --- Core States ---
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");

  // --- Pagination States (Set to 7 as per your requirement) ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; 

  // --- Edit Modal States (Including All Backend Columns) ---
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
    medicinesType: "" // Match with Backend: MedicinesType
  });

  // --- Shop Toggle Logic ---
  const handleShopToggle = () => {
    const newStatus = isShopOpen ? "OFF" : "ON";
    setIsShopOpen(!isShopOpen);
    localStorage.setItem("shopStatus", newStatus);
    window.dispatchEvent(new Event("storage"));
    alert(`Shop is now ${newStatus === "ON" ? "OPEN" : "CLOSED"}`);
  };

  // --- Fetch Data and Normalize ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct"
      );

      const rawData = res.data?.lsTmedicines || res.data?.listMedicine || [];

      const normalized = rawData.map(m => ({
        id: m.id || m.Id || m._id,
        name: m.Name || m.name || "",
        manufacturer: m.Manufacturer || m.manufacturer || "",
        unitPrice: m.UnitPrice || m.unitPrice || 0,
        discount: m.Discount || m.discount || 0,
        quantity: m.Quantity || m.quantity || 0,
        expiryDate: m.ExpiryDate || m.expiryDate || "",
        image: m.Image || m.image || "", 
        itemMedicine: m.ItemMedicine || m.itemMedicine || "N/A",
        type: m.Type || m.type || "N/A",
        medicinesType: m.MedicinesType || m.medicinesType || "N/A"
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
    setCurrentMed(med);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const updatePayload = {
      Id: parseInt(currentMed.id),
      Name: currentMed.name,
      Manufacturer: currentMed.manufacturer,
      UnitPrice: parseFloat(currentMed.unitPrice || 0),
      Quantity: parseInt(currentMed.quantity || 0),
      ExpiryDate: currentMed.expiryDate,
      Image: currentMed.image,
      ItemMedicine: currentMed.itemMedicine,
      Type: currentMed.type,
      MedicinesType: currentMed.medicinesType, // Backend specific key
      Discount: parseFloat(currentMed.discount || 0),
      Status: 1
    };

    try {
      const apiUrl = "https://ecommerencesite.onrender.com/api/MEDICINE/UpdateMedicine";
      const response = await axios.post(apiUrl, updatePayload);
      if (response.status === 200 || response.status === 204) {
        setMedicines(prev => prev.map(m => m.id === currentMed.id ? { ...currentMed } : m));
        setShowEditModal(false);
        alert("Updated Successfully!");
      }
    } catch (err) {
      alert("Update failed.");
    }
  };

  // --- Logic for 7-7 List ---
  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMedicines.length / pageSize);
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
            <div className="p-2 border border-secondary rounded bg-dark text-white d-flex justify-content-between" onClick={handleShopToggle} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: '11px' }}>SHOP: {isShopOpen ? "OPEN" : "OFF"}</span>
              <i className={`fas ${isShopOpen ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
            </div>
          </li>
           <li><Link to="/deshboardpanel" className="btn btn-outline-success w-100 mb-2 text-start">Dashboard</Link></li> 
                               <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">Customer LIST</Link></li>
                             <li><Link to="/customerlists" className="btn btn-outline-success w-100 mb-2 text-start">OrderPaymentList</Link></li>
         
                        <li><Link to="/" className="btn btn-outline-success w-100 mb-2 text-start">OrderStatusLIST</Link></li>
         
                               <li><Link to="/adminFeedbackcustomerlists" className="btn btn-success w-100 mb-2 text-start">Feedback List</Link></li>
                               <li><Link to="/adminloginlists" className="btn btn-outline-success w-100 mb-2 text-start">Admin Login List</Link></li>
                              <li><Link to="/adminUnavailableMedicines" className="btn btn-outline-success w-100 mb-2 text-start">AdminUnavailableMedicineList</Link></li>
                                         <li><Link to="/adminbankselectdetailss" className="btn btn-outline-success w-100 mb-2 text-start">AdminbankselectMaster </Link></li>
                                         <li><Link to= "/admincreditdetails"  className="btn btn-outline-success w-100 mb-2 text-start">AdminBankCreditAmountDetails </Link></li> 
                                <li><Link to="/adminregisterationform" className="btn btn-outline-success w-100 mb-2 text-start">Admin Registeartion Form  </Link></li>
         
                                                       <li><Link to="/adminCustomerHelpIssueLists" className="btn btn-outline-success w-100 mb-2 text-start">AdminCustomerHelpIssueList </Link></li>
         
                               <li className="mt-3">
                                   <button onClick={() => navigate('/header')} className="btn btn-link text-danger text-decoration-none p-0">
                                       <i className="fas fa-sign-out-alt"></i> LogOut
                                   </button>
                               </li>
       
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: '260px', padding: '30px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 text-white">
          <h2>Medicines Management</h2>
          <Link to="/" className="btn btn-success btn-sm px-2 ">Upload All Medicine <i class="fa-solid fa-download"></i>  </Link>

          <Link to="/deshboardpanel/medicines" className="btn btn-success btn-sm px-4">Add Medicine</Link>
        </div>

        <input
          className="form-control mb-4 bg-dark text-white border-secondary"
          placeholder="Search All Medicines..."
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
                <tr><td colSpan="10" className="text-center p-5">Loading...</td></tr>
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
                    <img src={med.image || "https://placehold.co/40x40"} alt="img" width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEditModal(med)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(med.id, med.name)}>Del</button>
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
            <button className="btn btn-sm btn-outline-success" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            <button className="btn btn-sm btn-success" disabled>{currentPage} / {totalPages || 1}</button>
            <button className="btn btn-sm btn-outline-success" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* FULL COLUMN EDIT MODAL */}
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
                  <input type="number" className="form-control bg-dark text-white border-secondary" value={currentMed.unitPrice} onChange={(e) => setCurrentMed({ ...currentMed, unitPrice: e.target.value })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="small text-white-50">Discount (%)</label>
                  <input type="number" className="form-control bg-dark text-white border-secondary" value={currentMed.discount} onChange={(e) => setCurrentMed({ ...currentMed, discount: e.target.value })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="small text-white-50">Quantity</label>
                  <input type="number" className="form-control bg-dark text-white border-secondary" value={currentMed.quantity} onChange={(e) => setCurrentMed({ ...currentMed, quantity: e.target.value })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small text-white-50">Expiry (DD/MM/YYYY)</label>
                  <input type="text" className="form-control bg-dark text-white border-secondary" value={currentMed.expiryDate} onChange={(e) => setCurrentMed({ ...currentMed, expiryDate: e.target.value })} />
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
                <img src={currentMed.image} width="60" className="rounded border border-secondary" alt="preview" />
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
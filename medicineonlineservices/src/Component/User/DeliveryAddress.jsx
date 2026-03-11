import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/DeliveryAddresss.css";
import { useCart } from "../User/CartContext";
import { 
  ChevronLeft, X, Trash2, Edit, LayoutDashboard, 
  Pill, ShoppingCart, MapPin, LogOut, Plus, CreditCard, User as UserIcon 
} from "lucide-react";

const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

export default function DeliveryAddress() {
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDashboard, setOpenDashboard] = useState(false);
    const[openMasterUpdate, setOpenMasterUpdate] = useState(false);
  
  // Popup States
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", gender: "Male", phoneNumber: "", address: "", 
    customerCity: "", customerState: "", customerZipCode: "", age: "0"
  });

  const { setSelectedAddress, cartItems } = useCart();
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => { 
    if (user?.email) {
        fetchAddresses();
    } else {
        setLoading(false);
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API}/GetAllPatients_Customers`);
      const raw = res.data?.data || res.data || [];
      const filtered = raw.filter(item => item.email === user?.email);
      setAddresses(filtered);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  // Corrected Edit Handler
  const handleEditClick = (e, addr) => {
    e.stopPropagation();
    setEditData({ ...addr });
    setShowEditPopup(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await axios.delete(`${API}/DeletePatient_Customer?id=${id}`);
        fetchAddresses();
      } catch { alert("Delete Failed"); }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/UpdatePatient_Customer`, editData);
      setShowEditPopup(false);
      fetchAddresses();
      alert("Updated Successfully!");
    } catch { alert("Update Failed"); }
  };

  const handleSaveNew = async () => {
    try {
      const payload = { ...formData, email: user.email, patient_CustomerId: 0 };
      await axios.post(`${API}/AddPatient_Customer`, payload);
      setShowAddPopup(false);
      setFormData({ fullName: "", gender: "Male", phoneNumber: "", address: "", customerCity: "", customerState: "", customerZipCode: "", age: "0" });
      fetchAddresses();
      alert("Address Saved!");
    } catch { alert("Save Failed"); }
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-dark text-success fw-bold">
      <div className="spinner-border me-3"></div> Loading...
    </div>
  );

  return (
    <div className="d-flex bg-dark text-white min-vh-100 main-layout">
      
      {/* --- 1. SIDEBAR --- */}
    {/* --- 1. SIDEBAR --- */}
<div className="sidebar">
  <div className="brand">
    <Link to="/dashboards" className="text-decoration-none">
      <img src="/AKMedizostore.png" alt="logo" width="55" />
    </Link>
    <span className="user-name">
      {user ? `${user.firstName} ${user.lastName}` : "User"}
    </span>
  </div>

  <ul className="sidebar-menu">
    {/* DASHBOARD DROPDOWN */}
    <li className="menu-group">
      <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenDashboard(!openDashboard)}>
        <div className="btn-content">
          <LayoutDashboard size={18} /> Dashboard
        </div>
        <span>{openDashboard ? "▾" : "▸"}</span>
      </button>
      {openDashboard && (
        <ul className="submenu">
          <li><Link to="/medication-tracker">Medication Tracker</Link></li>
          <li><Link to="/test-reports">Test Reports</Link></li>
          <li><Link to="/health-history">Health History</Link></li>
          <li><Link to="/monthly-progress">Monthly Progress</Link></li>
          <li><Link to="/prescriptions">Prescriptions</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to="/support">Help & Support</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      )}
    </li>

    {/* MASTER UPDATE DROPDOWN */}
    <li className="menu-group">
      <button className="sidebar-btn dropdown-toggle active-btn" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
        <div className="btn-content">
          <Edit size={18} /> Master Update
        </div>
        <span>{openMasterUpdate ? "▾" : "▸"}</span>
      </button>
      {openMasterUpdate && (
        <ul className="submenu">
          <li>
            <Link to="/deliveryaddress" className="fw-bold text-success">
              <MapPin size={16} className="me-1" /> Delivery Address
            </Link>
          </li>
              <li>
                      <Link to="/CompletePayments" className="sidebar-btn active-btn">
                        <div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div>
                      </Link>
                    </li>
                           <li>
                            <Link to="/">
                              <i className="fas fa-map-marker-alt"></i> Refund Order Amount
                            </Link>
                          </li>
        </ul>
      )}
    </li>

    {/* MEDICINES */}
    <li>
      <Link to="/medicinedisplay" className="sidebar-btn">
        <div className="btn-content"><Pill size={18} /> Medicines</div>
      </Link>
    </li>

    {/* CART */}
    <li>
      <Link to="/carts" className="sidebar-btn">
        <div className="btn-content">
          <ShoppingCart size={18} /> My Cart
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </div>
      </Link>
    </li>

    {/* ORDER PAYMENT */}
    {/* <li>
      <Link to="/CompletePayments" className="sidebar-btn">
        <div className="btn-content"><CreditCard size={18} /> Order Payment</div>
      </Link>
    </li> */}


 <li>
      <Link to="/orders" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i>OrderStatus</div>
      </Link>
    </li>
    {/* <li>
      <Link to="/CompletePayments" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i>CustomerTracking</div>
      </Link>
    </li> */}

    {/* PROFILE */}
    <li>
      <Link to="/profile" className="sidebar-btn">
        <div className="btn-content"><UserIcon size={18} /> Customer Profile</div>
      </Link>
    </li>

    {/* LOGOUT */}
    <li className="logout-item">
      <Link to="/header" className="sidebar-btn logout">
        <div className="btn-content"><LogOut size={18} /> Log Out</div>
      </Link>
    </li>
  </ul>
</div>

      {/* --- 2. MAIN CONTENT AREA --- */}
      <div className="main-content flex-grow-1 p-4">
        <div className="header-container d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <ChevronLeft className="me-3 cursor-pointer text-success back-icon" onClick={() => navigate(-1)} />
            <div>
              <h4 className="fw-bold mb-0">Delivery Address</h4>
              <small className="text-muted">Select or add a location for delivery</small>
            </div>
          </div>
          <button className="btn btn-success fw-bold px-4 rounded-pill" onClick={() => setShowAddPopup(true)}>
            <Plus size={18} className="me-1" /> ADD NEW
          </button>
        </div>

        <div className="address-grid">
          {addresses.length === 0 ? (
            <div className="empty-state text-center p-5 border border-secondary border-dashed rounded-4">
              <MapPin size={40} className="text-muted mb-2" />
              <p>No addresses found. Click "+ ADD NEW" to create one.</p>
            </div>
          ) : (
            addresses.map((addr, index) => (
              <div 
                key={index} 
                className={`address-card p-4 mb-3 border rounded-3 transition-all ${selectedIndex === index ? "selected" : "normal"}`} 
                onClick={() => setSelectedIndex(index)} 
              >
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-3">
                    <div className="radio-circle">
                        {selectedIndex === index && <div className="radio-inner"></div>}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 fs-5 text-white">{addr.fullName} <small className="text-muted">({addr.gender})</small></h6>
                      <p className="text-info small fw-bold mb-1">{addr.phoneNumber}</p>
                      <p className="text-white-50 small mb-0">{addr.address}, {addr.customerCity}, {addr.customerState} - {addr.customerZipCode}</p>
                    </div>
                  </div>
                  <div className="d-flex gap-2 action-btns">
                    <button className="btn btn-link text-info p-0" onClick={(e) => handleEditClick(e, addr)}><Edit size={18} /></button>
                    <button className="btn btn-link text-danger p-0" onClick={(e) => handleDelete(e, addr.patient_CustomerId)}><Trash2 size={18} /></button>
                  </div>
                </div>

                {selectedIndex === index && (
                  <div className="mt-3 animate-fade-in">
                    <button 
                      className="btn btn-warning w-100 fw-bold py-2 shadow-sm" 
                      disabled={cartItems.length === 0}
                      onClick={(e) => { e.stopPropagation(); setSelectedAddress(addr); navigate("/carts"); }}
                    >
                      {cartItems.length > 0 ? "DELIVER TO THIS ADDRESS" : "CART IS EMPTY - ADD MEDICINES"}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- 3. MODAL (Universal) --- */}
      {(showEditPopup || showAddPopup) && (
        <div className="modal-overlay">
          <div className="modal-content-custom bg-dark border border-secondary p-4 rounded-4 shadow-lg">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
              <h5 className="text-success fw-bold mb-0">{showEditPopup ? "Update Address" : "Add New Address"}</h5>
              <X className="cursor-pointer text-muted" onClick={() => { setShowEditPopup(false); setShowAddPopup(false); }} />
            </div>

            <div className="row g-3 text-start">
              <div className="col-12">
                <label className="small text-muted mb-1">Full Name</label>
                <input className="form-control bg-transparent text-white border-secondary" value={showEditPopup ? editData.fullName : formData.fullName} onChange={e => showEditPopup ? setEditData({...editData, fullName: e.target.value}) : setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="small text-muted mb-1">Phone Number</label>
                <input className="form-control bg-transparent text-white border-secondary" value={showEditPopup ? editData.phoneNumber : formData.phoneNumber} onChange={e => showEditPopup ? setEditData({...editData, phoneNumber: e.target.value}) : setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="small text-muted mb-1">Gender</label>
                <select className="form-select bg-dark text-white border-secondary" value={showEditPopup ? editData.gender : formData.gender} onChange={e => showEditPopup ? setEditData({...editData, gender: e.target.value}) : setFormData({...formData, gender: e.target.value})}>
                  <option value="Male">Male</option><option value="Female">Female</option>
                </select>
              </div>
              <div className="col-12">
                <label className="small text-muted mb-1">Detailed Address</label>
                <textarea className="form-control bg-transparent text-white border-secondary" rows="2" value={showEditPopup ? editData.address : formData.address} onChange={e => showEditPopup ? setEditData({...editData, address: e.target.value}) : setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="small text-muted mb-1">City</label>
                <input className="form-control bg-transparent text-white border-secondary" value={showEditPopup ? editData.customerCity : formData.customerCity} onChange={e => showEditPopup ? setEditData({...editData, customerCity: e.target.value}) : setFormData({...formData, customerCity: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="small text-muted mb-1">State</label>
                <input className="form-control bg-transparent text-white border-secondary" value={showEditPopup ? editData.customerState : formData.customerState} onChange={e => showEditPopup ? setEditData({...editData, customerState: e.target.value}) : setFormData({...formData, customerState: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="small text-muted mb-1">Zip Code</label>
                <input className="form-control bg-transparent text-white border-secondary" value={showEditPopup ? editData.customerZipCode : formData.customerZipCode} onChange={e => showEditPopup ? setEditData({...editData, customerZipCode: e.target.value}) : setFormData({...formData, customerZipCode: e.target.value})} />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4 pt-3">
              <button className="btn btn-success flex-grow-1 py-2 fw-bold" onClick={showEditPopup ? handleUpdate : handleSaveNew}>SAVE</button>
              <button className="btn btn-outline-secondary flex-grow-1 py-2" onClick={() => { setShowEditPopup(false); setShowAddPopup(false); }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
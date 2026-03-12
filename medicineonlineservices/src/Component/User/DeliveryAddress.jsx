import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../User/CartContext";
import { 
  X, Trash2, Edit, Plus, MapPin, LogOut, 
  Home, Briefcase, HelpCircle, Phone, Navigation, 
  User as UserIcon, LayoutDashboard, ShoppingBag, ChevronRight, Mail, Globe, Map
} from "lucide-react";

const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

export default function DeliveryAddress() {
  const navigate = useNavigate();
  const { setSelectedAddress, cartItems } = useCart();

  // --- States ---
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(true);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editData, setEditData] = useState(null);

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const initialForm = {
    fullName: "", 
    //gender: "Male", 
    gender: "selectgender",
    email: user?.email || "", //user?.email || 
    phoneNumber: "", 
    address: "", 
    customerCity: "", 
    customerState: "", 
    customerZipCode: "", 
    age: 0, 
    addressType: "Home"  
  };

  const [formData, setFormData] = useState(initialForm);

  // --- Functions ---
  
  const handleTypeChange = (type) => {
    if (showEditPopup) setEditData({ ...editData, addressType: type });
    else setFormData({ ...formData, addressType: type });
  };

  const currentType = showEditPopup ? editData?.addressType : formData.addressType;

  // Automatic Pincode Fetching
  useEffect(() => {
    const zip = showEditPopup ? editData?.customerZipCode : formData.customerZipCode;
    if (zip?.length === 6) {
      const fetchPincodeDetails = async () => {
        try {
          const response = await axios.get(`https://api.postalpincode.in/pincode/${zip}`);
          if (response.data[0].Status === "Success") {
            const postOffice = response.data[0].PostOffice[0];
            const update = { 
              customerCity: postOffice.District, 
              customerState: postOffice.State 
            };
            if (showEditPopup) setEditData(prev => ({ ...prev, ...update }));
            else setFormData(prev => ({ ...prev, ...update }));
          }
        } catch (error) { console.error("Pincode API Error", error); }
      };
      fetchPincodeDetails();
    }
  }, [formData.customerZipCode, editData?.customerZipCode, showEditPopup]);

  const fetchAddresses = async () => {
    if (!user?.email) { setLoading(false); return; }
    try {
      const res = await axios.get(`${API}/GetAllPatients_Customers`);
      const raw = res.data?.data || res.data || [];
      const filtered = raw.filter(item => item.email === user?.email);
      setAddresses(filtered.sort((a, b) => a.patient_CustomerId - b.patient_CustomerId));
    } catch (err) { console.error("Fetch Error:", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, [user]);

  const handleFinalSave = async (isUpdate) => {
    const data = isUpdate ? editData : formData;
    if (data.customerState !== "Bihar") {
      alert("❌ Delivery Service is currently only available in Bihar.");
      return;
    }
    try {
      if (isUpdate) {
        await axios.put(`${API}/UpdatePatient_Customer`, editData);
      } else {
        await axios.post(`${API}/AddPatient_Customer`, { ...formData, patient_CustomerId: 0 });
      }
      setShowEditPopup(false); setShowAddPopup(false);
      setFormData(initialForm);
      fetchAddresses();
      alert("✅ Address Saved Successfully!");
    } catch (err) { alert("Action Failed. Please check connection."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this address?")) {
      try {
        await axios.delete(`${API}/DeletePatient_Customer?id=${id}`);
        fetchAddresses();
      } catch { alert("Failed to delete."); }
    }
  };

  if (loading) return <div className="vh-100 bg-dark d-flex justify-content-center align-items-center text-success fw-bold">Loading...</div>;

  return (
    <div className="d-flex bg-dark text-white min-vh-100 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
     <div className="sidebar">
               <div className="brand">
                 <Link to="/dashboards">
                   <img src="/AKMedizostore.png" alt="logo" width="55" />
                 </Link>
                 <span>
                   {user ? `${user.firstName} ${user.lastName}` : "User"}
                 </span>
               </div>
     
               <ul>
                 <li className="menu-group">
                   <button
                     className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
                     onClick={() => setOpenDashboard(!openDashboard)}
                   >
                     Dashboard <span>{openDashboard ? "▾" : "▸"}</span>
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
             <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
               <div className="btn-content">
                 <i className="fas fa-edit"></i> Master Update
               </div>
               <span>{openMasterUpdate ? "▾" : "▸"}</span>
             </button>
             {openMasterUpdate && (
               <ul className="submenu">
                 <li>
                   <Link to="/deliveryaddress">
                     <i className="fas fa-map-marker-alt"></i> Delivery Address
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
                 <li>
                   <Link to="/medicinedisplay" className="btn btn-success mb-2">
                     Medicines
                   </Link>
                 </li>
     
                 {/* ✅ CART WITH COUNT */}
                  <Link to="/carts" className="nav-link">
                            <i className="fas fa-shopping-cart me-2"></i> My Cart
                            {cartItems.length > 0 && (
                              <span className="cart-count badge bg-danger rounded-pill ms-2">
                                {cartItems.length}
                              </span>
                            )}
                          </Link>
     {/* 
                  <li>
                   <Link to="/deliveryaddress" className="btn btn-success mb-2">
                     Delivery Address
                   </Link>
                 </li> */}
                
                 {/* <li><Link to="/CompletePayments" className="btn btn-success mb-2">
                    ORDER PAYMENT
                   </Link></li> */}
                  <li ><Link to="/orders" className="btn btn-success mb-2">OrderStatus </Link></li>
     
                 {/* <li>CustomerTracking</li> */}
     
                 <Link to="/profile"  className="btn btn-success">CustomerProfile</Link>
     
     
                 <li>
                   <Link to="/header">
                     <i className="fas fa-sign-out-alt"></i>  LogOut
                   </Link>
                 </li>
               </ul>
             </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
          <h4 className="fw-bold m-0 d-flex align-items-center gap-2"><MapPin className="text-success" /> My Delivery Addresses</h4>
          <button className="btn btn-success px-4 rounded-pill fw-bold" onClick={() => { setFormData(initialForm); setShowAddPopup(true); }}><Plus size={18}/> ADD NEW</button>
        </div>

        <div className="row">
          {addresses.map((addr, idx) => (
            <div key={addr.patient_CustomerId} className="col-lg-6 mb-3">
              <div className={`p-4 border rounded-4 cursor-pointer transition-all ${selectedIndex === idx ? "border-success bg-success bg-opacity-10 shadow-lg" : "border-secondary bg-black"}`} onClick={() => setSelectedIndex(idx)}>
                <div className="d-flex justify-content-between">
                  <div className="w-100">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || 'Home'}</span>
                      <span className="badge bg-dark border border-success text-success" style={{fontSize: '10px'}}>{addr.gender}</span>
                    </div>
                    <h6 className="fw-bold text-white mb-1">{addr.fullName}</h6>
                    <div className="small text-white-50 mb-1"><Mail size={14} className="me-2"/>{addr.email}</div>
                    <div className="small text-info mb-1"><Phone size={14} className="me-2"/>{addr.phoneNumber}</div>
                    <div className="small text-white-50 mb-3"><Navigation size={14} className="me-2"/>{addr.address}</div>
                    
                    <div className="pt-2 border-top border-secondary row g-0 text-center">
                        <div className="col-4 border-end border-secondary"><small className="d-block text-muted">CITY</small><span className="text-success small">{addr.customerCity}</span></div>
                        <div className="col-4 border-end border-secondary"><small className="d-block text-muted">STATE</small><span className="text-white small">{addr.customerState}</span></div>
                        <div className="col-4"><small className="d-block text-muted">PIN</small><span className="text-warning small">{addr.customerZipCode}</span></div>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2 ms-3">
                    <button className="btn btn-sm btn-outline-info border-0" onClick={(e) => { e.stopPropagation(); setEditData(addr); setShowEditPopup(true); }}><Edit size={18}/></button>
                    <button className="btn btn-sm btn-outline-danger border-0" onClick={(e) => { e.stopPropagation(); handleDelete(addr.patient_CustomerId); }}><Trash2 size={18}/></button>
                  </div>
                </div>
                {selectedIndex === idx && (
                  <button className="btn btn-warning w-100 mt-3 fw-bold py-2 shadow" onClick={() => { setSelectedAddress(addr); navigate("/carts"); }}>DELIVER HERE <ChevronRight size={16}/></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {(showEditPopup || showAddPopup) && (
        <div className="modal-overlay d-flex justify-content-center align-items-center p-3" style={{position:'fixed', inset:0, background: 'rgba(0,0,0,0.85)', zIndex: 1200}}>
          <div className="bg-dark p-4 rounded-4 border border-secondary shadow-lg overflow-auto" style={{width: '100%', maxWidth: '500px', maxHeight: '90vh'}}>
            <h5 className="text-success fw-bold mb-4">{showEditPopup ? "✏️ Edit Address" : "🏠 Add New Address"}</h5>
            
            <div className="row g-3">
              {/* ADDRESS TYPE SELECTOR */}
              <div className="col-12 mb-2">
                <label className="small text-muted mb-2 d-block">Save Address As:</label>
                <div className="d-flex gap-2">
                  {['Home', 'Office', 'Other'].map(type => (
                    <button 
                      key={type} 
                      type="button"
                      onClick={() => handleTypeChange(type)} 
                      className={`btn flex-grow-1 py-2 fw-bold border d-flex align-items-center justify-content-center gap-2 ${currentType === type ? 'btn-success border-success' : 'btn-outline-secondary'}`}
                    >
                      {type === 'Home' && <Home size={16}/>}
                      {type === 'Office' && <Briefcase size={16}/>}
                      {type === 'Other' && <MapPin size={16}/>}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-12">
                <label className="small text-muted mb-1">Full Name</label>
                <input className="form-control bg-black text-white border-secondary" value={showEditPopup ? editData.fullName : formData.fullName} onChange={e => showEditPopup ? setEditData({...editData, fullName: e.target.value}) : setFormData({...formData, fullName: e.target.value})} />
              </div>

              {/* <div className="col-12"> */}
                <div className="col-md-6">
                <label className="small text-muted mb-1">Gender</label>
                <select className="form-select bg-black text-white border-secondary" value={showEditPopup ? editData.gender : formData.gender} onChange={e => showEditPopup ? setEditData({...editData, gender: e.target.value}) : setFormData({...formData, gender: e.target.value})}>
                 <option value="selectgender">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                <option value="Trigender">Trigender</option>

                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="small text-muted mb-1">Email</label>
                <input className="form-control bg-black text-white border-secondary" value={showEditPopup ? editData.email : formData.email} readOnly />
              </div>
              {/* </div> */}

              <div className="col-md-6">
                <label className="small text-muted mb-1">Mobile</label>
                <input className="form-control bg-black text-white border-secondary" maxLength="10" value={showEditPopup ? editData.phoneNumber : formData.phoneNumber} onChange={e => showEditPopup ? setEditData({...editData, phoneNumber: e.target.value}) : setFormData({...formData, phoneNumber: e.target.value})} />
              </div>

              <div className="col-md-6">
                {/* <label className="small text-success fw-bold mb-1">Pincode</label>
                <input className="form-control bg-black text-white border-success" placeholder="6 digits" maxLength="6" value={showEditPopup ? editData.customerZipCode : formData.customerZipCode} onChange={e => {
                  const val = e.target.value.replace(/\D/g, "");
                  showEditPopup ? setEditData({...editData, customerZipCode: val}) : setFormData({...formData, customerZipCode: val});
                }} /> */}
                 <label className="small text-muted mb-1 font-weight-bold text-success">Zip Code</label>
                    <input className="form-control bg-transparent text-white border-success" maxLength="6" placeholder="845401" value={showEditPopup ? editData.customerZipCode : formData.customerZipCode} onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        showEditPopup ? setEditData({...editData, customerZipCode: val}) : setFormData({...formData, customerZipCode: val});
                    }} />
              </div>

              <div className="col-md-6">
                <label className="small text-muted mb-1">City</label>
                <input className="form-control bg-black text-white border-secondary" value={showEditPopup ? editData.customerCity : formData.customerCity} readOnly />
              </div>

              <div className="col-md-6">
                <label className="small text-muted mb-1">State</label>
                <input className="form-control bg-black text-white border-secondary" value={showEditPopup ? editData.customerState : formData.customerState} readOnly />
              </div>
               {/* Validation Message */}
            {(showEditPopup ? editData.customerState : formData.customerState) && (showEditPopup ? editData.customerState : formData.customerState) !== "Bihar" && (
                <div className="alert alert-danger p-2 small mb-3">
                    ⚠️ Medicine delivery is only available in <strong>Bihar</strong>. 
                </div>
            )}  

              <div className="col-12">
                <label className="small text-muted mb-1">Full Address (House No, Building, Street)</label>
                <textarea className="form-control bg-black text-white border-secondary" rows="2" value={showEditPopup ? editData.address : formData.address} onChange={e => showEditPopup ? setEditData({...editData, address: e.target.value}) : setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            
            <div className="d-flex gap-2 mt-4 pt-3 border-top border-secondary">
              <button className="btn btn-success flex-grow-1 py-2 fw-bold" onClick={() => handleFinalSave(showEditPopup)}>SAVE ADDRESS</button>
              <button className="btn btn-outline-secondary flex-grow-1 py-2" onClick={() => { setShowEditPopup(false); setShowAddPopup(false); }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
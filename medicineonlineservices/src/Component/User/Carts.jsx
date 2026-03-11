import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { Plus, Minus, Trash2, Edit2, ChevronLeft, X, Trash } from "lucide-react";

export default function Carts() {
  // 1. Context se data nikalna
  const { cartItems, removeFromCart, updateQuantity, selectedAddress, setSelectedAddress, addresses } = useCart();
  
  const [user, setUser] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- PRICE CALCULATIONS ---
  // Bina discount wala total (MRP)
  const totalMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
  
  // Discount ke baad wala subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
  
  // Final calculation (Subtotal + Charges - Extra Discount)
  const finalPayableAmount = subtotal + 7 - 8;

  return (
    <div className="d-flex bg-dark min-vh-100 text-white">
      
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar">
        <div className="brand">
          <Link to="/dashboards">
            <img src="/AKMedizostore.png" alt="logo" width="55" />
          </Link>
          <span className="user-name">
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </span>
        </div>
      
        <ul className="sidebar-menu">
          <li className="menu-group">
            <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenDashboard(!openDashboard)}>
              <div className="btn-content">
                <i className="fas fa-th-large"></i> Dashboard
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
      
          <li className="menu-group">
            <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
              <div className="btn-content">
                <i className="fas fa-edit"></i> Master Update
              </div>
              <span>{openMasterUpdate ? "▾" : "▸"}</span>
            </button>
            {openMasterUpdate && (
              <ul className="submenu">
                <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt"></i> Delivery Address</Link></li>
                <li><Link to="/CompletePayments" className="sidebar-btn active-btn"><div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div></Link></li>
                <li><Link to="/"><i className="fas fa-map-marker-alt"></i> Refund Order Amount</Link></li>
              </ul>
            )}
          </li>
      
          <li>
            <Link to="/medicinedisplay" className="sidebar-btn">
              <div className="btn-content"><i className="fas fa-capsules"></i> Medicines</div>
            </Link>
          </li>
      
          <li>
            <Link to="/carts" className="sidebar-btn">
              <div className="btn-content">
                <i className="fas fa-shopping-cart"></i> My Cart
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
              </div>
            </Link>
          </li>

          <li>
            <Link to="/orders" className="sidebar-btn">
              <div className="btn-content"><i className="fas fa-credit-card"></i>OrderStatus</div>
            </Link>
          </li>
        
          <li>
            <Link to="/profile" className="sidebar-btn">
              <div className="btn-content"><i className="fas fa-user"></i> Customer Profile</div>
            </Link>
          </li>
      
          <li className="logout-item">
            <Link to="/header" className="sidebar-btn logout">
              <div className="btn-content"><i className="fas fa-sign-out-alt"></i> Log Out</div>
            </Link>
          </li>
        </ul>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow-1 d-flex flex-column position-relative" style={{ height: '100vh', overflowY: 'auto' }}>
        
        <div className="p-3 bg-dark border-bottom border-secondary d-flex align-items-center sticky-top shadow-sm">
          <ChevronLeft className="me-3 cursor-pointer text-info" onClick={() => navigate(-1)} />
          <h5 className="mb-0 fw-bold">Store Cart ({cartItems.length})</h5>
        </div>

        <div className="p-4" style={{ marginBottom: '180px' }}>
          <h6 className="mb-4 fw-bold">Medicine - Local Store</h6>
          {cartItems.map((item) => (
             <div key={item.id} className="bg-secondary bg-opacity-10 p-3 rounded-3 mb-3 border border-secondary shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="bg-white rounded p-1" style={{width: '60px', height: '60px'}}>
                            <img src={item.image || "/medicine-placeholder.png"} className="w-100 h-100 object-fit-contain" alt="" />
                        </div>
                        <div className="ms-3">
                            <h6 className="mb-0 fw-bold small">{item.name}</h6>
                            <div className="mt-1">
                                <span className="fw-bold me-2">₹{item.unitPrice}</span>
                                <span className="text-muted text-decoration-line-through small">₹{item.unitPrice + 30}</span>
                                <span className="text-success small fw-bold ms-2">15% off</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center border border-secondary rounded-pill px-2 bg-dark" style={{ height: '32px' }}>
                        <button className="btn btn-sm text-primary p-0 border-0" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus size={14} /></button>
                        <span className="mx-3 fw-bold small">{item.quantity}</span>
                        <button className="btn btn-sm text-primary p-0 border-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                    </div>
                </div>
             </div>
          ))}
        </div>

        {/* --- STICKY FOOTER (UPDATED SECTION) --- */}
        <div className="fixed-bottom bg-dark border-top border-secondary shadow-lg" style={{ left: '260px' }}>
          <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
            <div>
              <h6 className="mb-0 small fw-bold">Delivery Address</h6>
              <div className="text-info small fw-bold mt-1">
                {selectedAddress ? `Deliver to: ${selectedAddress.fullName}, ${selectedAddress.customerCity}` : "Please select a delivery address"}
              </div>
            </div>
            <button className="btn btn-outline-info btn-sm rounded-pill px-3 fw-bold" onClick={() => setIsAddressModalOpen(true)}>
              Change
            </button>
          </div>
          
          <div className="p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column">
              {/* Bina Discount wala Total (Cut kiya hua) */}
              <span className="text-muted text-decoration-line-through small mb-0">
                ₹{totalMRP}
              </span>
              {/* Discount ke baad wala Final Payable Amount */}
              <h4 className="mb-0 fw-bold text-white">
                ₹{finalPayableAmount}
              </h4>
            </div>
            
            <button className={`btn btn-lg px-5 fw-bold ${selectedAddress ? 'btn-primary shadow' : 'btn-secondary disabled'}`} onClick={() => navigate("/CompletePayments")}>
              Proceed
            </button>
          </div>
        </div>

        {/* --- ADDRESS POPUP (MODAL) --- */}
        {isAddressModalOpen && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-dark border border-secondary p-4 rounded-3 shadow-lg animate__animated animate__fadeIn" style={{ width: '650px', maxWidth: '95%' }}>
              
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="mb-0 fw-bold text-white">Delivery Address</h5>
                  <small className="text-muted">Select or add a location for delivery</small>
                </div>
                <button className="btn btn-success btn-sm px-3 rounded-pill d-flex align-items-center fw-bold" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
                  <Plus size={16} className="me-1"/> ADD NEW
                </button>
              </div>
              
              <div className="address-list overflow-auto pe-2" style={{ maxHeight: '400px' }}>
                {(addresses && addresses.length > 0 ? addresses : [
                  { id: 1, fullName: 'Gautam Dev', gender: 'Male', mobileNumber: '8409844260', customerAddress: 'JS ROOP HOMES', customerCity: 'NOIDA', customerState: 'UP', customerPincode: '201318' },
                  { id: 2, fullName: 'KISHOR', gender: 'Male', mobileNumber: '7033132629', customerAddress: 'JS ROOP HOMES', customerCity: 'Greater Noida', customerState: 'Uttar Pradesh', customerPincode: '201318' }
                ]).map((addr) => (
                  <div 
                    key={addr.id} 
                    className={`p-3 border rounded-3 mb-3 cursor-pointer transition-all ${selectedAddress?.id === addr.id ? 'border-info' : 'border-secondary'}`}
                    style={{ backgroundColor: '#111' }}
                    onClick={() => { setSelectedAddress(addr); setIsAddressModalOpen(false); }}
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1 fw-bold text-white text-uppercase small" style={{letterSpacing: '0.5px'}}>
                            {addr.fullName} <span className="text-muted fw-normal">({addr.gender || 'Male'})</span>
                        </h6>
                        <div className="text-info fw-bold small mb-2" style={{fontSize: '13px'}}>{addr.mobileNumber}</div>
                        <p className="text-muted mb-0 small" style={{ fontSize: '12px' }}>
                          {addr.customerAddress}, {addr.customerCity}, {addr.customerState} - {addr.customerPincode}
                        </p>
                      </div>
                      <div className="d-flex gap-3">
                         <Edit2 size={16} className="text-info cursor-pointer hover-opacity-50" />
                         <Trash size={16} className="text-danger cursor-pointer hover-opacity-50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2 border-top border-secondary d-flex justify-content-end">
                <button className="btn btn-outline-secondary btn-sm px-4 fw-bold" onClick={() => setIsAddressModalOpen(false)}>CLOSE</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
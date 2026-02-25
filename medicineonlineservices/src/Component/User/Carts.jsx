import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { Plus, Minus, Trash2, Edit2, ChevronLeft } from "lucide-react";

export default function Carts() {
  const { cartItems, removeFromCart, updateQuantity, selectedAddress } = useCart();
  const [user, setUser] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);

  return (
    <div className="d-flex bg-dark min-vh-100 text-white">
      
      {/* 1. SIDEBAR (Left Side) */}
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
               {/* deliveryaddress */}
              {/* <li>Delivery Address</li> */}
                <li>
                 <Link to="/deliveryaddress" className="btn btn-success mb-2">
                   Delivery Address
                 </Link>
               </li>
                 {/* <Link to="/carts" className="nav-link">
                          <i className="fas fa-shopping-cart me-2"></i> My Cart TESTING
                          {cartItems.length > 0 && (
                            <span className="cart-count badge bg-danger rounded-pill ms-2">
                              {cartItems.length}
                            </span>
                          )}
                        </Link> */}
               <li><Link to="/CompletePayments" className="btn btn-success mb-2">
                  ORDER PAYMENT
                 </Link></li>
                <li>OrderItem</li>
     
               <li>CustomerTracking</li>
     
               <Link to="/profile"  className="btn btn-success">CustomerProfile</Link>
     
             {/* <Link to="/medicinelist" className="btn btn-success mb-2" ><li>Medicine List</li></Link> */}
     
               <li>
                 <Link to="/header">
                   <i className="fas fa-sign-out-alt"></i>  LogOut
                 </Link>
               </li>
             </ul>
           </div>
     

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column position-relative">
        
        {/* Top Sticky Header */}
        <div className="p-3 bg-dark border-bottom border-secondary d-flex align-items-center sticky-top">
          <ChevronLeft className="me-3 cursor-pointer" onClick={() => navigate(-1)} />
          <h5 className="mb-0 fw-bold">Store Cart ({cartItems.length})</h5>
        </div>

        {/* --- STORE INFO SECTION (As per your Image) --- */}
        <div className="p-4 flex-grow-1" style={{ marginBottom: '160px' }}>
          <div className="d-flex align-items-center mb-4">
            <img 
              src="/haldirams_logo.png" 
              alt="Haldirams" 
              className="rounded-circle border border-secondary p-1" 
              width="50" height="50" 
              onError={(e) => e.target.src = "https://via.placeholder.com/50"} 
            />
            <div className="ms-3">
              <h6 className="mb-0 fw-bold text-white">Haldirams - Nagpur Store</h6>
              <small className="text-muted">Wardhaman Nagar</small>
            </div>
          </div>

          {/* Cart Items List */}
          {cartItems.map((item) => (
            <div key={item.id} className="bg-secondary bg-opacity-10 p-3 rounded-3 mb-3 border border-secondary shadow-sm">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <img src={item.image || "/medicine-placeholder.png"} className="rounded" width="65" height="65" alt="" />
                  <div className="ms-3">
                    <h6 className="mb-0 fw-bold small text-white">{item.name}</h6>
                    <small className="text-muted d-block">500 gram</small>
                    <div className="mt-2 d-flex align-items-center">
                      <span className="fw-bold me-2">₹{item.unitPrice}</span>
                      <span className="text-muted text-decoration-line-through small me-2">₹{item.unitPrice + 30}</span>
                      <span className="text-success small fw-bold">15% off</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Pill Control */}
                <div className="d-flex align-items-center border border-secondary rounded-pill px-2 bg-dark shadow-sm" style={{ height: '35px' }}>
                  <button className="btn btn-sm text-primary p-0" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus size={14} /></button>
                  <span className="mx-3 fw-bold small">{item.quantity}</span>
                  <button className="btn btn-sm text-primary p-0" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3 pt-2 border-top border-secondary">
                <button className="btn btn-link text-primary text-decoration-none p-0 small" onClick={() => navigate("/medicinedisplay")}>
                  <Edit2 size={14} className="me-1" /> Edit
                </button>
                <Trash2 size={18} className="text-danger cursor-pointer" onClick={() => removeFromCart(item.id)} />
              </div>
            </div>
          ))}

          {/* Missing Something / Add More Section */}
          <div className="border border-secondary rounded-3 p-4 text-center mt-4 cursor-pointer" style={{ borderStyle: 'dashed' }} onClick={() => navigate("/medicinedisplay")}>
            <span className="text-muted small">Missing something? </span>
            <span className="text-info fw-bold small">Add More Items</span>
          </div>
        </div>

        {/* --- STICKY BOTTOM FOOTER --- */}
        <div className="fixed-bottom bg-dark border-top border-secondary" style={{ left: '260px' }}>
          {/* Delivery Address Bar */}
          <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
            <div className="flex-grow-1">
              <h6 className="mb-0 small fw-bold text-white">Delivery Address</h6>
              {selectedAddress ? (
                <div className="text-info small fw-bold mt-1">
                  Deliver to: {selectedAddress.fullName}, {selectedAddress.customerCity}
                </div>
              ) : (
                <small className="text-muted">Please select a delivery address</small>
              )}
            </div>
            <button className="btn btn-outline-info btn-sm rounded-pill px-3 fw-bold" onClick={() => navigate("/deliveryaddress")}>
              {selectedAddress ? "Change" : "Select Address"}
            </button>
          </div>

          {/* Price & Proceed Bar */}
          <div className="p-3 d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-0 fw-bold">₹{subtotal}</h4>
              <small className="text-muted">{cartItems.length} item</small>
            </div>
            <button 
              className={`btn btn-lg px-5 fw-bold ${selectedAddress ? 'btn-primary' : 'btn-secondary opacity-50'}`}
              disabled={!selectedAddress}
              onClick={() => navigate("/CompletePayments")}
            >
              Proceed
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
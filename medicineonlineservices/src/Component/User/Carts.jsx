import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { Plus, Minus, Trash2, Edit2, ChevronLeft, Trash, Check, MapPin } from "lucide-react";
import axios from "axios";

const API = "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI";

export default function Carts() {
  const { cartItems, removeFromCart, updateQuantity, selectedAddress, setSelectedAddress } = useCart();
  
  const [user, setUser] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);

  const navigate = useNavigate();

  // Load User and Fetch Logged-in Customer Addresses from API
  const fetchCustomerAddresses = async (currentUserEmail) => {
    if (!currentUserEmail) return;
    try {
      const res = await axios.get(`${API}/GetAllPatients_Customers`);
      const raw = res.data?.data || res.data || [];
      // Strictly filter addresses matching the logged-in user's email
      const filtered = raw.filter(item => item.email?.toLowerCase() === currentUserEmail.toLowerCase());
      setAllAddresses(filtered);
      
      // Auto-select the first address if none selected yet and addresses exist
      if (!selectedAddress && filtered.length > 0) {
        setSelectedAddress(filtered[0]);
        localStorage.setItem("selectedDeliveryAddress", JSON.stringify(filtered[0]));
      }
    } catch (err) {
      console.error("Error fetching cart addresses:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser?.email) {
          fetchCustomerAddresses(parsedUser.email);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }

    // Fallback sync with localStorage if context address is empty
    if (!selectedAddress) {
      const savedStoredAddr = localStorage.getItem("selectedDeliveryAddress");
      if (savedStoredAddr && savedStoredAddr !== "undefined" && savedStoredAddr !== "null") {
        try {
          setSelectedAddress(JSON.parse(savedStoredAddr));
        } catch (e) {
          console.error("Error parsing stored address", e);
        }
      }
    }
  }, []);

  const handleOpenModal = () => {
    if (user?.email) {
      fetchCustomerAddresses(user.email);
    }
    setIsAddressModalOpen(true);
  };

  // Safe handler to update address globally and in localStorage
  const handleSelectAddressObj = (addr) => {
    setSelectedAddress(addr);
    localStorage.setItem("selectedDeliveryAddress", JSON.stringify(addr));
    setIsAddressModalOpen(false);
  };

  // --- PRICE CALCULATIONS ---
  const totalMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
  const finalPayableAmount = subtotal + 7 - 8;

  const userInitial = user && user.firstName ? user.firstName.charAt(0).toUpperCase() : "U";
  const fullName = user ? `${user.firstName} ${user.lastName || ""}` : "User Account";

  return (
    <>
      <style>{`
        :root {
            --primary-green: #0fa462;
            --hover-bg: #e8f7f0;
            --text-dark: #2d3748;
            --text-gray: #718096;
            --danger-red: #e53e3e;
            --border-color: #edf2f7;
        }

        .custom-sidebar {
            width: 280px;
            height: 100vh;
            background-color: #ffffff;
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 24px 16px;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
            overflow-y: auto;
        }

        .brand-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .brand-logo {
            color: var(--primary-green);
            font-size: 1.4rem;
        }

        .brand-name {
            font-weight: 700;
            color: var(--primary-green);
            font-size: 1.25rem;
            letter-spacing: -0.5px;
            text-decoration: none;
        }

        .nav-menu {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;
        }

        .nav-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            color: var(--text-dark);
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            background: transparent;
            border: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
        }

        .nav-item.active {
            background-color: var(--primary-green);
            color: #ffffff;
        }

        .nav-item:not(.active):hover {
            background-color: var(--hover-bg);
            color: var(--primary-green);
        }

        .nav-link-left {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .nav-item.dropdown-toggle-btn {
            border: 1px solid var(--border-color);
            background-color: #fafafa;
        }

        .submenu-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding-left: 20px;
            margin-top: 4px;
            margin-bottom: 6px;
        }

        .submenu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            color: var(--text-gray);
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .submenu-item:hover {
            background-color: var(--hover-bg);
            color: var(--primary-green);
        }

        .sidebar-footer {
            margin-top: auto;
            border-top: 1px solid var(--border-color);
            padding-top: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .user-profile-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background-color: #f8fafc;
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }

        .user-avatar {
            width: 40px;
            height: 40px;
            background-color: var(--hover-bg);
            color: var(--primary-green);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
            flex-shrink: 0;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .user-name {
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text-dark);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .user-role {
            font-size: 0.75rem;
            color: var(--text-gray);
            font-weight: 500;
        }

        .logout-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            color: var(--danger-red);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            border-radius: 10px;
            transition: background 0.2s;
        }

        .logout-btn:hover {
            background-color: #fff5f5;
        }

        .main-workspace {
            margin-left: 280px;
            width: calc(100% - 280px);
        }
      `}</style>

      <div className="d-flex bg-dark min-vh-100 text-white w-100">
        
        {/* ---------- SIDEBAR ---------- */}
        <div className="custom-sidebar">
          <div>
            <div className="brand-header">
              <i className="fa-solid fa-bag-shopping brand-logo"></i>
              <Link to="/dashboards" className="brand-name">AK Medistore</Link>
            </div>

            <nav className="nav-menu">
              <div>
                <button 
                  className={`nav-item dropdown-toggle-btn ${openDashboard ? 'active' : ''}`} 
                  onClick={() => setOpenDashboard(!openDashboard)}
                >
                  <div className="nav-link-left">
                    <i className="fa-solid fa-chart-pie"></i>
                    <span>Dashboard</span>
                  </div>
                  <i className={`fa-solid fa-chevron-${openDashboard ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
                </button>

                {openDashboard && (
                  <div className="submenu-container">
                    <Link to="/medication-tracker" className="submenu-item"><i className="fa-solid fa-pills"></i> Medication Tracker</Link>
                    <Link to="/test-reports" className="submenu-item"><i className="fa-solid fa-file-medical"></i> Test Reports</Link>
                    <Link to="/health-history" className="submenu-item"><i className="fa-solid fa-heart-pulse"></i> Health History</Link>
                    <Link to="/monthly-progress" className="submenu-item"><i className="fa-solid fa-chart-line"></i> Monthly Progress</Link>
                    <Link to="/prescriptions" className="submenu-item"><i className="fa-solid fa-prescription"></i> Prescriptions</Link>
                    <Link to="/history" className="submenu-item"><i className="fa-solid fa-clock-rotate-left"></i> History</Link>
                    <Link to="/support" className="submenu-item"><i className="fa-solid fa-headset"></i> Help & Support</Link>
                    <Link to="/settings" className="submenu-item"><i className="fa-solid fa-gear"></i> Settings</Link>
                  </div>
                )}
              </div>

              <div>
                <button 
                  className={`nav-item dropdown-toggle-btn ${openMasterUpdate ? 'active' : ''}`} 
                  onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
                >
                  <div className="nav-link-left">
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Master Update</span>
                  </div>
                  <i className={`fa-solid fa-chevron-${openMasterUpdate ? 'down' : 'right'}`} style={{ fontSize: '0.75rem' }}></i>
                </button>

                {openMasterUpdate && (
                  <div className="submenu-container">
                    <Link to="/deliveryaddress" className="submenu-item">
                      <i className="fa-solid fa-map-marker-alt"></i> Delivery Address
                    </Link>
                    <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
                    <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                  </div>
                )}
              </div>

              <Link to="/medicinedisplay" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-pills"></i>
                  <span>Medicines</span>
                </div>
              </Link>

              <Link to="/carts" className="nav-item active">
                <div className="nav-link-left">
                  <i className="fa-solid fa-shopping-cart"></i>
                  <span>My Cart</span>
                </div>
                {cartItems.length > 0 && (
                  <span className="badge bg-danger rounded-pill">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link to="/order" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-truck"></i>
                  <span>Orders</span>
                </div>
              </Link>



              <Link to="/feedbackcustomers" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-comment-dots"></i>
                  <span>Customer Feedback</span>
                </div>
              </Link>

              <Link to="/customeraddmedicines" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>Unavailable Medicines</span>
                </div>
              </Link>

              <Link to="/profile" className="nav-item">
                <div className="nav-link-left">
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </nav>
          </div>

          <div className="sidebar-footer">
            <div className="user-profile-card">
              <div className="user-avatar">{userInitial}</div>
              <div className="user-info">
                <span className="user-name">{fullName}</span>
                <span className="user-role">Customer Account</span>
              </div>
            </div>

            <Link to="/header" className="logout-btn">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Log Out</span>
            </Link>
          </div>
        </div>

        {/* --- MAIN CONTENT WORKSPACE --- */}
        <div className="main-workspace flex-grow-1 d-flex flex-column position-relative" style={{ height: '100vh', overflowY: 'auto' }}>
          
          <div className="p-3 bg-dark border-bottom border-secondary d-flex align-items-center sticky-top shadow-sm">
            <ChevronLeft className="me-3 cursor-pointer text-info" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
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
                        <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}><Minus size={14} /></button>
                        <span className="mx-3 fw-bold small">{item.quantity}</span>
                        <button className="btn btn-sm text-primary p-0 border-0 shadow-none" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                    </div>
                </div>
               </div>
            ))}
          </div>

          {/* --- STICKY FOOTER --- */}
          <div className="fixed-bottom bg-dark border-top border-secondary shadow-lg" style={{ left: '280px' }}>
            <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
              <div>
                <h6 className="mb-0 small fw-bold text-muted">Delivery Address</h6>
                <div className="text-success small fw-bold mt-1">
                  {selectedAddress ? (
                    <span>Deliver to: <strong className="text-white">{selectedAddress.fullName}</strong>, {selectedAddress.customerZipCode || selectedAddress.pincode} ({selectedAddress.addressType || 'Home'})</span>
                  ) : (
                    <span className="text-warning">Please select a delivery address</span>
                  )}
                </div>
              </div>
              <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold shadow-sm" onClick={handleOpenModal}>
                Change
              </button>
            </div>
            
            <div className="p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex flex-column">
                <span className="text-muted text-decoration-line-through small mb-0">₹{totalMRP}</span>
                <h4 className="mb-0 fw-bold text-white">₹{finalPayableAmount}</h4>
              </div>
              
              <button 
                className={`btn btn-lg px-5 fw-bold ${selectedAddress ? 'btn-primary shadow' : 'btn-secondary disabled'}`} 
                onClick={() => {
                  if (selectedAddress) {
                    localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
                    navigate("/CompletePayments", { state: { selectedAddress } });
                  }
                }}
              >
                Proceed
              </button>
            </div>
          </div>

          {/* --- FLIPKART STYLE ADDRESS SELECTION MODAL --- */}
          {isAddressModalOpen && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
              <div className="bg-dark border border-secondary p-4 rounded-4 shadow-lg" style={{ width: '600px', maxWidth: '95%' }}>
                
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
                  <h5 className="mb-0 fw-bold text-white">Select delivery address</h5>
                  <button className="btn btn-outline-light btn-sm rounded-circle" onClick={() => setIsAddressModalOpen(false)}>✕</button>
                </div>

                <div className="mb-3">
                  <button className="btn btn-outline-success w-100 py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
                    <Plus size={18}/> Add New Address
                  </button>
                </div>

                {/* ADDRESS LIST */}
                <div className="overflow-auto pe-2" style={{ maxHeight: '380px' }}>
                  {allAddresses && allAddresses.length > 0 ? (
                    allAddresses.map((addr) => {
                      const isSelected = selectedAddress?.patient_CustomerId === addr.patient_CustomerId || selectedAddress?.id === addr.id;
                      return (
                        <div 
                          key={addr.patient_CustomerId || addr.id || Math.random()} 
                          className={`p-3 border rounded-3 mb-3 cursor-pointer transition-all ${isSelected ? 'border-success bg-success bg-opacity-10' : 'border-secondary bg-black'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleSelectAddressObj(addr)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-secondary text-uppercase" style={{fontSize: '10px'}}>{addr.addressType || 'Home'}</span>
                                {isSelected && <span className="badge bg-success text-white" style={{fontSize: '10px'}}>Selected</span>}
                              </div>
                              <h6 className="mb-1 fw-bold text-white">{addr.fullName} <span className="text-info fw-normal ms-2 small">{addr.phoneNumber || addr.mobileNumber}</span></h6>
                              <p className="text-white-50 mb-2 small">{addr.address}, {addr.customerCity || addr.city}, {addr.customerState || addr.state} - <strong className="text-warning">{addr.customerZipCode || addr.pincode}</strong></p>
                            </div>
                            
                            <div className="form-check">
                              <input 
                                className="form-check-input bg-dark border-secondary" 
                                type="radio" 
                                checked={isSelected} 
                                onChange={() => handleSelectAddressObj(addr)} 
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <p className="mb-3">No delivery address found for your account.</p>
                      <button className="btn btn-sm btn-success fw-bold px-4" onClick={() => { setIsAddressModalOpen(false); navigate("/deliveryaddress"); }}>
                        Add Address Now
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-top border-secondary d-flex justify-content-end">
                  <button className="btn btn-outline-secondary btn-sm px-4 fw-bold" onClick={() => setIsAddressModalOpen(false)}>CLOSE</button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
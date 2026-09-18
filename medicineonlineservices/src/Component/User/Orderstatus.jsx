import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { User, Phone, Circle, X, ArrowLeft, Package } from "lucide-react";
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Swal from 'sweetalert2';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '12px',
  marginBottom: '10px'
};

export default function Orderstatus() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const [selectedAddress, setSelectedAddress] = useState(() => {
    return location.state?.selectedAddress || location.state?.address || JSON.parse(localStorage.getItem("selectedAddress") || JSON.stringify({
      fullName: "Gautam Dev",
      mobileNumber: "7033132629",
      address: "JS ROOP HOMES",
      pincode: "845401",
      city: "Greater Noida",
      state: "Uttar Pradesh",
      addressType: "HOME"
    }));
  });

  const getCoordinatesForAddress = (addr) => {
    const text = (addr?.address || "").toLowerCase();
    const pincode = addr?.pincode || "";
    if (text.includes("js roop") || pincode === "201301" || pincode === "845401") {
      return [28.5355, 77.3910];
    }
    return [28.5000, 77.4000];
  };

  const originCoords = [28.5700, 77.3200]; 
  const [destCoords, setDestCoords] = useState(() => getCoordinatesForAddress(selectedAddress));

  useEffect(() => {
    if (selectedAddress) {
      setDestCoords(getCoordinatesForAddress(selectedAddress));
    }
  }, [selectedAddress]);

  const curveMidPoint = [
    (originCoords[0] + destCoords[0]) / 2 + 0.02,
    (originCoords[1] + destCoords[1]) / 2 + 0.02
  ];
  const routePoints = [originCoords, curveMidPoint, destCoords];

  const [orderId, setOrderId] = useState(() => {
    const rawId = location.state?.orderId || location.state?.orderNumber || "780649";
    const cleanId = String(rawId).replace("#", "").trim();
    return cleanId ? `#${cleanId}` : "#780649";
  });
  
  const orderNumber = orderId.replace("#", "").trim();

  const receiverName = selectedAddress?.fullName || selectedAddress?.name || "Gautam Dev";
  const [receiverPhone] = useState(selectedAddress?.mobileNumber || selectedAddress?.phone || "7033132629");
  
  const addressLine = selectedAddress?.address || "JS ROOP HOMES";
  const addressPincode = selectedAddress?.pincode || "845401";

  const [currentOrderStatus, setCurrentOrderStatus] = useState("Pending"); 
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const isActive = (path) => location.pathname === path;
  const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

  const [apiOrderItems, setApiOrderItems] = useState(null);
  const [apiOrderTotal, setApiOrderTotal] = useState(null);
  const [apiPaymentMode, setApiPaymentMode] = useState(null);

  const getFallbackImage = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("nise")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("paracetamol")) return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
    if (n.includes("telmisartan")) return "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150";
    return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150";
  };

  const rawCartItems = location.state?.cartItems || location.state?.orderItems || location.state?.orderItemss || JSON.parse(localStorage.getItem("cartItems") || "[]");
  const fallbackCartItems = Array.isArray(rawCartItems) ? rawCartItems : [rawCartItems];

  const processedFallbackItems = fallbackCartItems.map(item => {
    const itemName = item.name || item.medicineName || item.title || item.productName || "Medicine Item";
    let img = item.productImage || item.imageUrl || "";
    if (!img) {
      img = getFallbackImage(itemName);
    }
    return {
      ...item,
      name: itemName,
      productImage: img
    };
  });

  const cartItems = (apiOrderItems !== null && apiOrderItems.length > 0) ? apiOrderItems : (processedFallbackItems.length > 0 ? processedFallbackItems : [
    { name: "Nise Tablet", sellingPrice: 225, quantity: 2, mrp: 225, productImage: getFallbackImage("Nise") }
  ]);
  
  const paymentMode = apiPaymentMode || location.state?.paymentMode || "Cash on Delivery (COD)";

  const totalMRP = location.state?.totalMRP ?? cartItems.reduce((acc, item) => {
    const mrpVal = Number(item.mrp || item.price || item.unitPrice || 225);
    const qty = Number(item.quantity || item.qty || 1);
    return acc + (mrpVal * qty);
  }, 450);

  const discountAmount = location.state?.discountAmount ?? 0;
  const platformFee = location.state?.platformFee ?? 0;
  const couponDiscount = location.state?.couponDiscount ?? 0;
  
  const finalPayableAmount = apiOrderTotal !== null 
    ? apiOrderTotal 
    : (location.state?.finalPayableAmount ?? location.state?.orderTotal ?? location.state?.ordertotal ?? 450);

  // Backend Order Sync Guard & Error Diagnostics
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    const registerOrderOnBackend = async () => {
      if (hasSyncedRef.current) return;
      if (cartItems.length > 0) {
        hasSyncedRef.current = true;
        try {
          const payload = {
            id: 0,
            userId: Number(user?.id || user?.userId || 1),
            addressId: 1, 
            storeId: 1,   
            orderNumber: orderNumber || "780649",
            ordertotal: Number(finalPayableAmount),
            orderStatus: currentOrderStatus || "" ,//|| "Pending",
            paymentMode: paymentMode || "", 
            distanceInKm: 5.0,        // Fixed: Defined directly as number/string value
            estimatedTime: "3-5 days", // Fixed: Defined directly as string value
            createdAt: new Date().toISOString(),
            orderItemss: cartItems.map(item => ({
              id: 0,
              orderId: 0,
              medicineId: Number(item.medicineId || item.id || 1),
              unitPrice: Number(item.sellingPrice || item.price || item.unitPrice || 225),
              discount: Number(item.discount || 0),
              quantity: Number(item.quantity || item.qty || 1),
              totalprice: Number(item.sellingPrice || item.price || item.unitPrice || 225) * Number(item.quantity || item.qty || 1)
            }))
          };

          console.log("Sending payload to backend:", payload);

          const response = await axios.post(
           // "http://localhost:5256/api/OrderAPI/CreateOrder", 
           "https://ecommerencesite.onrender.com/api/OrderAPI/CreateOrder",
            payload,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );

          console.log("Backend response received:", response.data);

          if (response.data) {
            const returnedOrderNum = response.data.orderNumber || response.data.ordernum || response.data.id || response.data.orderId;
            if (returnedOrderNum) {
              const cleanNum = String(returnedOrderNum).replace("#", "").trim();
              setOrderId(`#${cleanNum}`);
            }
            Swal.fire({
              icon: 'success',
              title: 'Order Saved!',
              text: 'Order successfully registered in database.',
              background: '#121212',
              color: '#fff',
              confirmButtonColor: '#0fa462',
              timer: 2000
            });
          }
        } catch (err) {
          console.error("Backend order sync error:", err.response?.data || err.message);
          
          const errorMsg = typeof err.response?.data === 'string' 
            ? err.response.data 
            : JSON.stringify(err.response?.data || err.message);

          Swal.fire({
            icon: 'error',
            title: 'Database Sync Failed',
            text: `Backend Error: ${errorMsg}`,
            background: '#121212',
            color: '#fff',
            confirmButtonColor: '#0fa462'
          });

          hasSyncedRef.current = false; 
        }
      }
    };
    registerOrderOnBackend();
  }, [cartItems, finalPayableAmount, paymentMode, selectedAddress, user, orderNumber, currentOrderStatus]);

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Reason Required',
        text: 'Please enter a mandatory reason for cancellation.',
        background: '#121212',
        color: '#fff',
        confirmButtonColor: '#0fa462'
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Cancelled',
      text: 'Order cancelled successfully.',
      background: '#121212',
      color: '#fff',
      confirmButtonColor: '#0fa462'
    });
    setCancelModalOpen(false);
    navigate("/order");
  };

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", width: "100%", overflowX: "hidden" }}>
      <style>{`
        .modern-sidebar { width: 280px; height: 100vh; background-color: #ffffff; border-right: 1px solid #edf2f7; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 16px; position: fixed; left: 0; top: 0; z-index: 1050; box-sizing: border-box; transition: transform 0.3s ease; }
        @media (max-width: 991.98px) {
          .modern-sidebar { transform: translateX(-100%); }
          .modern-sidebar.open { transform: translateX(0); box-shadow: 5px 0 25px rgba(0, 0, 0, 0.5); }
          .modern-main-layout { margin-left: 0 !important; width: 100% !important; }
        }
        @media (min-width: 992px) {
          .modern-sidebar { transform: translateX(0) !important; }
          .modern-main-layout { margin-left: 280px !important; width: calc(100% - 280px) !important; }
        }
        .sidebar-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); z-index: 1040; backdrop-filter: blur(2px); }
        .modern-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid #edf2f7; margin-bottom: 20px; text-decoration: none; }
        .modern-brand span { font-weight: 700; color: #0fa462; font-size: 1.25rem; }
        .modern-nav-menu { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; flex-grow: 1; overflow-y: auto; }
        .modern-nav-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; color: #2d3748; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 0.95rem; background: none; border: none; width: 100%; text-align: left; cursor: pointer; transition: all 0.2s ease; }
        .modern-nav-item:hover { background-color: #e8f7f0; color: #0fa462; }
        .modern-nav-item.active { background-color: #0fa462; color: #ffffff; }
        .modern-link-content { display: flex; align-items: center; gap: 14px; }
        .modern-sidebar-footer { margin-top: auto; border-top: 1px solid #edf2f7; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
        .modern-user-card { display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7; }
        .modern-avatar { width: 40px; height: 40px; background-color: #e8f7f0; color: #0fa462; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
        .modern-user-info { display: flex; flex-direction: column; overflow: hidden; }
        .modern-user-name { font-weight: 600; font-size: 0.9rem; color: #2d3748; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .modern-user-role { font-size: 0.75rem; color: #718096; font-weight: 500; }
        .modern-logout-btn { display: flex; align-items: center; gap: 12px; padding: 12px 14px; color: #e53e3e; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 10px; transition: background 0.2s; }
        .modern-logout-btn:hover { background-color: #fff5f5; }
        .modern-main-layout { height: 100vh; overflow-y: auto; padding: 24px; box-sizing: border-box; background-color: #121212; width: 100%; }
        .tracking-timeline { position: relative; padding-left: 28px; }
        .tracking-timeline::before { content: ''; position: absolute; left: 9px; top: 8px; bottom: 8px; width: 2px; background-color: #4a5568; }
        .timeline-step { position: relative; margin-bottom: 20px; }
        .timeline-step:last-child { margin-bottom: 0; }
        .timeline-icon { position: absolute; left: -28px; top: 0; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #121212; }
      `}</style>

      {isSidebarOpen && window.innerWidth < 992 && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`modern-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div>
          <div className="d-flex align-items-center justify-content-between mb-0">
            <Link to="/dashboards" className="modern-brand mb-0 pb-0 border-0">
              <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
              <span>AK Medistore</span>
            </Link>
            {window.innerWidth < 992 && (
              <button className="btn btn-sm btn-light mb-4" onClick={() => setIsSidebarOpen(false)}>
                <X size={18} />
              </button>
            )}
          </div>
          <ul className="modern-nav-menu">
            <li><Link to="/dashboards" className={`modern-nav-item ${isActive('/dashboards') ? 'active' : ''}`}><div className="modern-link-content"><i className="fa-solid fa-chart-pie"></i><span>Dashboard</span></div></Link></li>
            <li><Link to="/medicinedisplay" className={`modern-nav-item ${isActive('/medicinedisplay') ? 'active' : ''}`}><div className="modern-link-content"><i className="fa-solid fa-pills"></i><span>Medicines</span></div></Link></li>
            <li><Link to="/carts" className={`modern-nav-item ${isActive('/carts') ? 'active' : ''}`}><div className="modern-link-content"><i className="fa-solid fa-shopping-cart"></i><span>My Cart</span></div></Link></li>
            <li><Link to="/order" className={`modern-nav-item ${isActive('/order') ? 'active' : ''}`}><div className="modern-link-content"><i className="fa-solid fa-truck"></i><span>My Orders</span></div></Link></li>
            <li><Link to="/profile" className={`modern-nav-item ${isActive('/profile') ? 'active' : ''}`}><div className="modern-link-content"><i className="fa-solid fa-user"></i><span>Customer Profile</span></div></Link></li>
          </ul>
        </div>

        <div className="modern-sidebar-footer">
          <div className="modern-user-card">
            <div className="modern-avatar">{getInitial()}</div>
            <div className="modern-user-info">
              <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : receiverName}</span>
              <span className="modern-user-role">Customer Account</span>
            </div>
          </div>
          <Link to="/header" className="modern-logout-btn"><i className="fa-solid fa-right-from-bracket"></i><span>Log Out</span></Link>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="modern-main-layout flex-grow-1">
        <div className="container-fluid p-0" style={{ width: "100%", maxWidth: "100%" }}>
          
          <div className="d-flex align-items-center justify-content-between p-3 mb-3 rounded-3" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
            <div className="d-flex align-items-center gap-3">
              <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <ArrowLeft size={22} />
              </button>
              <span className="badge bg-success px-3 py-2 fs-6">Order ID: {orderId}</span>
            </div>
            <div className="text-muted small">
              Payment: <span className="text-white fw-semibold">{paymentMode}</span>
            </div>
          </div>

          <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '15px', border: '1px solid #333', width: '100%', marginBottom: '20px' }}>
            <div className="text-secondary small mb-2">ROUTE: AK MEDISTORE HUB → {addressLine.toUpperCase()}</div>
            <MapContainer center={originCoords} zoom={12} style={containerStyle} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={originCoords}>
                <Popup>AK Medistore Hub</Popup>
              </Marker>
              <Marker position={destCoords}>
                <Popup>{receiverName}'s Location</Popup>
              </Marker>
              <Polyline positions={routePoints} color="#0fa462" weight={4} />
            </MapContainer>
          </div>

          <div className="p-4 rounded-4 mb-4" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
            <h5 className="text-white mb-4 fw-bold fs-6">LIVE DELIVERY PROGRESS STATUS</h5>
            <div className="tracking-timeline">
              <div className="timeline-step">
                <div className="timeline-icon text-success"><Circle size={14} fill="#0fa462" /></div>
                <div className="text-white fw-semibold">Order Confirmed</div>
                <div className="text-muted small">Your order has been placed successfully.</div>
              </div>
              <div className="timeline-step">
                <div className="timeline-icon text-success"><Circle size={14} fill={currentOrderStatus !== 'Pending' ? '#0fa462' : '#444'} /></div>
                <div className="text-white fw-semibold">Shipped / Hub Reached</div>
                <div className="text-muted small">Product has left the dispatch facility.</div>
              </div>
              <div className="timeline-step">
                <div className="timeline-icon text-success"><Circle size={14} fill={currentOrderStatus === 'Delivered' ? '#0fa462' : '#444'} /></div>
                <div className="text-white fw-semibold">Out For Delivery (Expected in 3-5 days)</div>
                <div className="text-muted small">Delivery executive will be assigned shortly.</div>
              </div>
              <div className="timeline-step">
                <div className="timeline-icon text-secondary"><Circle size={14} fill={currentOrderStatus === 'Delivered' ? '#0fa462' : '#444'} /></div>
                <div className="text-muted fw-semibold">Delivered</div>
                <div className="text-muted small">Delivery expected soon at your address.</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-4 mb-4" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-secondary small mb-0">Delivery Address</h6>
              <span className="badge bg-success text-white px-2 py-1" style={{ fontSize: '10px' }}>HOME</span>
            </div>
            <div className="text-white fw-bold">{addressLine} - {addressPincode}</div>
            <div className="mt-3 p-3 rounded-3" style={{ background: '#252525', border: '1px solid #444' }}>
              <div className="text-success small fw-bold mb-1">RECEIVER DETAILS</div>
              <div className="text-white fw-semibold">{receiverName}</div>
              <div className="text-muted small"><Phone size={12} className="me-1" />{receiverPhone}</div>
            </div>
          </div>

          <div className="p-4 rounded-4 mb-4" style={{ background: '#1a1a1a', border: '1px solid #333', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
              <h6 className="text-secondary small mb-0">RECEIPT DETAILS</h6>
              <span className="badge bg-secondary text-light">({cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''})</span>
            </div>
            <div className="text-muted small mb-2" style={{ fontWeight: "600", color: "#0fa462" }}>Items Purchased:</div>
            
            <div className="d-flex flex-column gap-2">
              {cartItems.map((item, index) => {
                const itemName = item.name || item.medicineName || item.title || item.productName || "Medicine Item";
                const itemPrice = item.sellingPrice || item.price || item.unitPrice || item.totalPrice || 225;
                const itemQty = item.quantity || item.qty || 1;
                let itemImg = item.productImage || item.imageUrl || "";
                if (!itemImg) {
                  itemImg = getFallbackImage(itemName);
                }
                
                return (
                  <div key={index} className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ background: '#222', border: '1px solid #333' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: "52px", height: "52px", background: "#252525", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #444", flexShrink: 0 }}>
                        <img 
                          src={itemImg} 
                          alt={itemName} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { 
                            e.target.style.display = 'none'; 
                            if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; 
                          }}
                        />
                        <div style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                          <Package size={22} />
                        </div>
                      </div>
                      <div>
                        <div className="fw-bold text-light" style={{ fontSize: "0.95rem" }}>{itemName}</div>
                        <span className="badge bg-dark border border-secondary text-info mt-1" style={{ fontSize: "0.75rem" }}>Qty: {itemQty}</span>
                      </div>
                    </div>
                    <div className="fw-bold text-light" style={{ fontSize: "1rem" }}>
                      ₹{Number(itemPrice).toFixed(0)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-top border-secondary mt-3 pt-3">
              <div className="d-flex justify-content-between text-light small mb-1">
                <span>Total MRP:</span>
                <span>₹{Number(totalMRP).toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between text-light small mb-1">
                <span>Discount:</span>
                <span className="text-danger">-₹{Number(discountAmount).toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between text-light small mb-1">
                <span>Platform Fee:</span>
                <span>+₹{Number(platformFee).toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between text-light small mb-2">
                <span>Coupon:</span>
                <span className="text-success">-₹{Number(couponDiscount).toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between text-light small mb-3">
                <span>Payment Mode:</span>
                <span className="text-success fw-semibold">{paymentMode}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                <span className="text-white fw-bold fs-6">Total Amount:</span>
                <span className="text-success fw-bold fs-4">₹{Number(finalPayableAmount).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="mb-5" style={{ width: '100%' }}>
            <button 
              className="btn w-100 text-white py-2 fw-semibold mb-3" 
              style={{ background: '#5a1212', border: '1px solid #ff4d4d' }}
              onClick={() => setCancelModalOpen(true)}
            >
              🚫 Cancel Item (Reason Mandatory)
            </button>
            <button 
              className="btn btn-success w-100 py-3 fw-bold shadow"
              style={{ backgroundColor: "#0fa462", border: 'none' }}
              onClick={() => navigate('/medicinedisplay')}
            >
              🛒 Continue Shopping
            </button>
          </div>

          {cancelModalOpen && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="p-4 rounded-4" style={{ background: '#1e1e1e', border: '1px solid #444', width: '90%', maxWidth: '400px' }}>
                <h5 className="text-white mb-3">Cancel Order / Item ({orderId})</h5>
                <p className="text-muted small mb-3">Please provide a mandatory reason for cancellation:</p>
                <textarea 
                  className="form-control bg-dark text-white mb-3" 
                  rows="3" 
                  placeholder="Enter reason here..." 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{ borderColor: '#444' }}
                />
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => setCancelModalOpen(false)}>Close</button>
                  <button className="btn btn-danger btn-sm" onClick={handleCancelOrder}>Confirm Cancellation</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
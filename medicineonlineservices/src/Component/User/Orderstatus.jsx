import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { User, ChevronLeft, Phone, Navigation } from "lucide-react";
import { useCart } from "./CartContext";
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '15px',
  marginBottom: '20px'
};

export default function Orderstatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart ? useCart() : { cartItems: [] };

  // Sidebar Dropdown states
  const [openDashboard, setOpenDashboard] = useState(false);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  
  // Fixed Origin Point: Motihari Shop Coordinates
  const originCoords = [26.6586, 84.9120]; 
  const [destCoords, setDestCoords] = useState([26.6600, 84.9200]); // Default fallback
  const [distanceKm, setDistanceKm] = useState(5.0);

  // Live GPS / SignalR Tracking States
  const [liveDriverCoords, setLiveDriverCoords] = useState(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  
  // Order ID Generation State
  const [orderId, setOrderId] = useState(() => {
    return location.state?.orderId || Math.floor(100000 + Math.random() * 900000);
  });

  const user = { firstName: "Gautam", lastName: "Dev" };
  const isActive = (path) => location.pathname === path;
  const getInitial = () => (user?.firstName ? user.firstName.charAt(0).toUpperCase() : "G");

  // Address Initialization
  const [selectedAddress, setSelectedAddress] = useState(() => {
    if (location.state?.selectedAddress) {
      return location.state.selectedAddress;
    }
    try {
      const stored = localStorage.getItem("selectedDeliveryAddress");
      if (stored && stored !== "undefined" && stored !== "null") {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
    return null;
  });

  // Dynamic Payment Mode Initialization
  const [paymentMode, setPaymentMode] = useState(() => {
    const incomingPayment = location.state?.paymentMode || location.state?.selectedPaymentMode || location.state?.payment;
    if (incomingPayment && incomingPayment !== "undefined" && incomingPayment !== "null") {
      localStorage.setItem("selectedPaymentMode", incomingPayment);
      return incomingPayment;
    }
    try {
      const keysToCheck = ["selectedPaymentMode", "paymentMode", "payment", "selectedPayment"];
      for (let key of keysToCheck) {
        const val = localStorage.getItem(key);
        if (val && val !== "undefined" && val !== "null") {
          return val.replace(/^["'](.+)["']$/, '$1');
        }
      }
    } catch (e) {
      console.error("Error reading payment mode:", e);
    }
    return "Cash on Delivery";
  });

  // Generate/Register Order on Backend if not already created
  useEffect(() => {
    const registerOrderOnBackend = async () => {
      if (!location.state?.orderId && cartItems.length > 0) {
        try {
          const response = await axios.post(
          //  'http://localhost:5256/api/Orders/create',

          "https://ecommerencesite.onrender.com//api/Orders/create",
             {
            items: cartItems,
            totalAmount: subtotal + gstAmount + deliveryCharge,
            paymentMode: paymentMode,
            shippingAddress: selectedAddress
          });
          if (response.data?.orderId) {
            setOrderId(response.data.orderId);
          }
        } catch (err) {
          console.error("Auto order generation API error (using local fallback ID):", err);
        }
      }
    };
    registerOrderOnBackend();
  }, []);

  // SignalR & Live GPS Tracking Listener
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
      //  "http://localhost:5256/trackingHub"
      "https://ecommerencesite.onrender.com/trackingHub"
      )
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("Connected to Tracking Hub");
        connection.invoke("JoinOrderGroup", orderId.toString())
          .catch(err => console.error("Error joining order group:", err));

        connection.on("ReceiveLiveLocation", (lat, lng) => {
          console.log("Live GPS Update received:", lat, lng);
          setLiveDriverCoords([Number(lat), Number(lng)]);
        });
      })
      .catch(err => console.error("SignalR Connection Error: ", err));

    return () => {
      connection.invoke("LeaveOrderGroup", orderId.toString()).catch(() => {});
      connection.stop();
    };
  }, [orderId]);

  // Delivery Boy GPS Location Broadcaster
  const startSharingGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsSharingLocation(true);
    alert("Live GPS sharing started for Order ID: " + orderId);

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          await axios.post(
           // 'http://localhost:5256/api/TrackingAPI/update-location',
           "https://ecommerencesite.onrender.com/api/TrackingAPI/update-location",
           
           {
            orderId: Number(orderId),
            latitude: lat,
            longitude: lng
          });
        } catch (error) {
          console.error("Failed to send GPS location to backend:", error);
        }
      },
      (error) => console.error("GPS Error:", error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    window.deliveryWatchId = watchId;
  };

  // --- CALCULATIONS FOR RECEIPT ---
  const totalMRP = cartItems.reduce((acc, item) => acc + ((item.unitPrice + 30) * (item.quantity || 1)), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * (item.quantity || 1)), 0);
  const totalDiscount = Math.max(0, totalMRP - subtotal);
  
  const gstAmount = cartItems.reduce((acc, item) => {
    const itemSubtotal = item.unitPrice * (item.quantity || 1);
    const rate = item.gstRate !== undefined ? item.gstRate : (item.tax !== undefined ? item.tax : 5);
    return acc + Math.round((itemSubtotal * rate) / 100);
  }, 0);

  const deliveryCharge = distanceKm > 200 ? Math.round((distanceKm - 200) * 10) : 0;
  const finalPayableAmount = subtotal + gstAmount + deliveryCharge;

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212", color: "#ffffff", width: "100%" }}>
      
      {/* ---------- MODERN INLINE SIDEBAR STYLES ---------- */}
      <style>{`
        .modern-sidebar {
          width: 280px;
          height: 100vh;
          background-color: #ffffff;
          border-right: 1px solid #edf2f7;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 16px;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          box-sizing: border-box;
        }
        .modern-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid #edf2f7;
          margin-bottom: 20px;
          text-decoration: none;
        }
        .modern-brand span {
          font-weight: 700;
          color: #0fa462;
          font-size: 1.25rem;
        }
        .modern-nav-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
          overflow-y: auto;
        }
        .modern-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          color: #2d3748;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modern-nav-item:hover {
          background-color: #e8f7f0;
          color: #0fa462;
        }
        .modern-nav-item.active {
          background-color: #0fa462;
          color: #ffffff;
        }
        .modern-link-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .modern-link-content i {
          font-size: 1.15rem;
          width: 20px;
          text-align: center;
        }
        .modern-dropdown-toggle {
          border: 1px solid #edf2f7;
          background-color: #fafafa;
        }
        .modern-submenu {
          list-style: none;
          padding: 4px 0 4px 34px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .modern-submenu a {
          color: #718096;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 8px 12px;
          border-radius: 6px;
          display: block;
          font-weight: 500;
        }
        .modern-submenu a:hover {
          background-color: #f7fafc;
          color: #0fa462;
        }
        .modern-sidebar-footer {
          margin-top: auto;
          border-top: 1px solid #edf2f7;
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .modern-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background-color: #f8fafc;
          border-radius: 12px;
          border: 1px solid #edf2f7;
        }
        .modern-avatar {
          width: 40px;
          height: 40px;
          background-color: #e8f7f0;
          color: #0fa462;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .modern-user-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .modern-user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #2d3748;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .modern-user-role {
          font-size: 0.75rem;
          color: #718096;
          font-weight: 500;
        }
        .modern-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          color: #e53e3e;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .modern-logout-btn:hover {
          background-color: #fff5f5;
        }
        .modern-main-layout {
          margin-left: 280px;
          width: calc(100% - 280px);
          padding: 24px;
          box-sizing: border-box;
          background-color: #121212;
          min-height: 100vh;
        }
      `}</style>

      {/* ---------- SIDEBAR ---------- */}
      <div className="modern-sidebar">
        <div>
          <Link to="/dashboards" className="modern-brand">
            <img src="/AKMedizostore.png" alt="logo" width="40" height="40" style={{ objectFit: 'contain' }} />
            <span>AK Medistore</span>
          </Link>

          <ul className="modern-nav-menu">
            <li>
              <button
                className={`modern-nav-item ${isActive("/dashboards") ? "active" : ""}`}
                onClick={() => setOpenDashboard(!openDashboard)}
              >
                <div className="modern-link-content">
                  <i className="fa-solid fa-chart-pie"></i>
                  <span>Dashboard</span>
                </div>
                <i className={`fa-solid ${openDashboard ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>

              {openDashboard && (
                <ul className="modern-submenu">
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
              <button className="modern-nav-item modern-dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? "fa-chevron-down" : "fa-chevron-right"}`} style={{ fontSize: "0.75rem" }}></i>
              </button>
              {openMasterUpdate && (
                <ul className="modern-submenu">
                  <li><Link to="/deliveryaddress"><i className="fas fa-map-marker-alt me-2"></i>Delivery Address</Link></li>
                  <li><Link to="/addbankrefundableamounts"><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
                  <li><Link to="/bankdetailsrefundlist" style={{ textDecoration: 'none', color: '#0fa462', fontWeight: '600', fontSize: '0.9rem' }}><i className="fas fa-undo me-2"></i>Bankdetailsrefundlist</Link></li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/medicinedisplay" className={`modern-nav-item ${isActive("/medicinedisplay") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-pills"></i>
                  <span>Medicines</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/carts" className={`modern-nav-item ${isActive("/carts") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-shopping-cart"></i>
                  <span>My Cart</span>
                </div>
                {cartItems.length > 0 && (
                  <span className="badge bg-danger rounded-pill">{cartItems.length}</span>
                )}
              </Link>
            </li>

            <li>
              <Link to="/order" className={`modern-nav-item ${isActive("/order") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-truck"></i>
                  <span>Orders</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/feedbackcustomers" className={`modern-nav-item ${isActive("/feedbackcustomers") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-comment-dots"></i>
                  <span>Customer Feedback</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/customeraddmedicines" className={`modern-nav-item ${isActive("/customeraddmedicines") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>Unavailable Medicines</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to="/profile" className={`modern-nav-item ${isActive("/profile") ? "active" : ""}`}>
                <div className="modern-link-content">
                  <i className="fa-solid fa-user"></i>
                  <span>Customer Profile</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="modern-sidebar-footer">
          <div className="modern-user-card">
            <div className="modern-avatar">{getInitial()}</div>
            <div className="modern-user-info">
              <span className="modern-user-name">{user ? `${user.firstName} ${user.lastName}` : "Gautam Dev"}</span>
              <span className="modern-user-role">Customer Account</span>
            </div>
          </div>

          <Link to="/header" className="modern-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* ---------- MAIN CONTENT AREA (FULL WIDTH) ---------- */}
      <div className="modern-main-layout">
        <div className="container-fluid py-4 px-0" style={{ maxWidth: "100%", width: "100%" }}>
          
          {/* Header */}
          <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between bg-dark rounded-3 mb-4 shadow-sm">
            <div className="d-flex align-items-center">
              <ChevronLeft className="me-3 text-info" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
              <h5 className="mb-0 fw-bold">Live GPS Tracking & Receipt Details</h5>
            </div>
            <div className="badge bg-info text-dark px-3 py-2 fw-bold">
              Order ID: #{orderId}
            </div>
          </div>

          {/* Map View using Leaflet (OpenStreetMap) */}
          <div className="mb-4 w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-secondary text-uppercase small mb-0">
                Live Route Track: Motihari Shop ➔ Delivery Address
              </h6>
              <button 
                className={`btn btn-sm ${isSharingLocation ? 'btn-danger' : 'btn-success'} rounded-pill px-3`}
                onClick={startSharingGPS}
              >
                <Navigation size={14} className="me-1" /> {isSharingLocation ? "GPS Sharing Active" : "Start Driver GPS"}
              </button>
            </div>

            <div style={containerStyle} className="overflow-hidden border border-secondary w-100">
              <MapContainer center={originCoords} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={originCoords}>
                  <Popup>Motihari Shop (Origin)</Popup>
                </Marker>
                <Marker position={destCoords}>
                  <Popup>Delivery Address (Home)</Popup>
                </Marker>
                {liveDriverCoords && (
                  <Marker position={liveDriverCoords}>
                    <Popup>Live Delivery Partner</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Delivery Status Banner */}
          <div className="bg-secondary bg-opacity-10 p-3 rounded-4 mb-4 border border-secondary w-100">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-success fw-bold mb-1">
                  {liveDriverCoords ? "Driver is moving live on map!" : "Dispatching from Motihari Shop"}
                </h6>
                <small className="text-muted">
                  {liveDriverCoords ? "Real-time GPS tracking active via SignalR" : "Preparing your order"}
                </small>
              </div>
              <div className="badge border border-danger text-danger px-3 py-2">
                07 MINUTES
              </div>
            </div>
          </div>

          {/* Address and Receipt Card */}
          <div className="bg-black bg-opacity-40 p-4 rounded-4 border border-secondary shadow-lg w-100">
            <div className="fw-bold text-white mb-2">
              Delivery Address ({selectedAddress?.addressType || selectedAddress?.type || "Home"})
            </div>

            <div className="text-light opacity-75 small">
              {selectedAddress ? (
                <>
                  <span className="text-warning fw-bold">{selectedAddress.address || selectedAddress.customerAddress}</span>,<br />
                  {selectedAddress.city || selectedAddress.customerCity}, {selectedAddress.state || selectedAddress.customerState} - <span className="text-info">{selectedAddress.pincode || selectedAddress.customerZipCode || selectedAddress.customerPincode}</span>
                </>
              ) : (
                <span className="text-warning">⚠️ Address details unavailable.</span>
              )}
            </div>

            <hr className="border-secondary opacity-25 my-3" />
            
            {/* Receiver Details */}
            <div className="d-flex align-items-start mb-3">
              <div className="bg-success bg-opacity-20 p-2 rounded-3 me-3">
                <User size={22} className="text-success" />
              </div>
              <div>
                <div className="fw-bold text-white text-uppercase small mb-1">Receiver Details</div>
                <div className="fw-bold text-info">
                  {selectedAddress?.fullName || selectedAddress?.name || "Customer Account"}
                </div>
                <div className="text-white d-flex align-items-center gap-2 mt-1 small">
                  <Phone size={14} className="text-info" />
                  <span className="text-white fw-bold">{selectedAddress?.mobileNumber || selectedAddress?.phoneNumber || selectedAddress?.phone || "N/A"}</span>
                </div>
              </div>
            </div>

            <hr className="border-secondary opacity-25 my-3" />

            {/* Receipt Details Section */}
            <div>
              <div className="fw-bold text-white text-uppercase small mb-2">Receipt Details</div>
              
              <div className="text-light small mb-2">
                <span className="d-block mb-1 text-white opacity-75">Items Purchased:</span>
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((itm, idx) => {
                    const itemGst = itm.gstRate !== undefined ? itm.gstRate : (itm.tax !== undefined ? itm.tax : 5);
                    return (
                      <div key={idx} className="d-flex justify-content-between text-white fw-bold ps-2 mb-1">
                        <span>{itm.name} <small className="text-muted fw-normal">({itemGst}% GST)</small></span>
                        <span>(Qty: {itm.quantity || 1}) - ₹{itm.unitPrice * (itm.quantity || 1)}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-warning fw-bold ps-2 small">No active items found in cart.</div>
                )}
              </div>

              <div className="d-flex justify-content-between text-light small mb-1">
                <span className="text-white opacity-75">Bag Total (MRP):</span>
                <span className="text-white">₹{totalMRP}</span>
              </div>

              <div className="d-flex justify-content-between text-light small mb-1">
                <span className="text-white opacity-75">Total Discount:</span>
                <span className="text-success fw-bold">- ₹{totalDiscount}</span>
              </div>

              <div className="d-flex justify-content-between text-light small mb-1">
                <span className="text-white opacity-75">GST (Item-wise):</span>
                <span className="text-warning">+ ₹{gstAmount}</span>
              </div>

              <div className="d-flex justify-content-between text-light small mb-1">
                <span className="text-white opacity-75">Delivery Charge:</span>
                <span className={deliveryCharge === 0 ? "text-success fw-bold" : "text-info fw-bold"}>
                  {deliveryCharge === 0 ? "FREE (≤ 200 km)" : `+ ₹{deliveryCharge}`}
                </span>
              </div>

              <div className="d-flex justify-content-between text-light small mb-1">
                <span className="text-white opacity-75">Payment Mode:</span>
                <span className="text-success fw-bold">{paymentMode}</span>
              </div>

              <hr className="border-secondary opacity-25 my-2" />

              <div className="d-flex justify-content-between small">
                <span className="fw-bold text-white">Total Bill Amount:</span>
                <span className="text-info fw-bold fs-6">₹{finalPayableAmount}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
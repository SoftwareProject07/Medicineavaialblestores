import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
// Google Maps API Import
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { Home, User, ChevronLeft, Phone, LayoutDashboard, ShoppingCart, Pill, PackageCheck, LogOut } from "lucide-react";
import { useCart } from "./CartContext";

// Map Container Styling
const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '15px',
  marginBottom: '20px'
};

export default function Orderstatus() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(true);
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);

  // Map States
  const [directions, setDirections] = useState(null);
  const selectedAddress = location.state?.selectedAddress;

  // 1. Google Maps Load karein (Apni API Key yahan dalein)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" 
  });

  // 2. Store ka address (Origin) aur Customer ka address (Destination) calculate karein
  useEffect(() => {
    if (isLoaded && selectedAddress) {
      const directionsService = new window.google.maps.DirectionsService();
      
      // Local Store Address (Ise apne store ke real address se replace karein)
      const origin = "Sector 62, Noida, Uttar Pradesh"; 
      
      // Customer Address string banayein
      const destination = `${selectedAddress.customerAddress}, ${selectedAddress.customerCity}`;

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    }
  }, [isLoaded, selectedAddress]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="d-flex bg-dark min-vh-100 text-white overflow-hidden">
      {/* SIDEBAR SECTION (Same as your code) */}
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

      <div className="flex-grow-1 d-flex flex-column" style={{ height: '100vh', overflowY: 'auto' }}>
        <div className="p-3 border-bottom border-secondary d-flex align-items-center bg-dark sticky-top shadow-sm">
          <ChevronLeft className="me-3 cursor-pointer text-info" onClick={() => navigate(-1)} />
          <h5 className="mb-0 fw-bold">Live Order Tracking</h5>
        </div>

        <div className="container py-4">
          
          {/* ---------- LIVE MAP SECTION ---------- */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Live Route Track</h6>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={directions ? null : { lat: 28.6273, lng: 77.3725 }} // Noida default center
                zoom={12}
                options={{
                    disableDefaultUI: true,
                    styles: darkModeStyles // Optional: Map ko dark theme dene ke liye
                }}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            ) : (
              <div className="bg-secondary bg-opacity-10 rounded-4 d-flex align-items-center justify-content-center" style={{height: '300px'}}>
                <span className="text-muted">Map Loading...</span>
              </div>
            )}
          </div>

          {/* Status Alert */}
          <div className="bg-secondary bg-opacity-10 p-3 rounded-4 mb-4 border border-secondary shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-success fw-bold mb-1">
                    {directions ? `Distance: ${directions.routes[0].legs[0].distance.text}` : "Packing with care"}
                </h6>
                <small className="text-muted">
                    {directions ? `Estimated Arrival: ${directions.routes[0].legs[0].duration.text}` : "Preparing your order"}
                </small>
              </div>
              <div className="badge border border-danger text-danger px-3 py-2">
                {directions ? directions.routes[0].legs[0].duration.text.toUpperCase() : "07 MINUTES"}
              </div>
            </div>
          </div>

          {/* DELIVERY DETAILS CARD */}
          <div className="bg-black bg-opacity-40 p-4 rounded-4 border border-secondary shadow-lg">
             {/* ... (Aapka existing Address aur Receiver details code) */}
         <div className="flex-grow-1">
                <div className="fw-bold text-white mb-1">Delivery Address (Home)</div>
                <div className="text-light opacity-75 small">
                  {selectedAddress ? (
                    <>
                      {selectedAddress.customerAddress},<br />
                      {selectedAddress.customerCity}, {selectedAddress.customerState} - {selectedAddress.customerPincode}
                    </>
                  ) : (
                    <span className="text-warning">⚠️ No address selected. Please select from cart.</span>
                  )}
                </div>
              </div>
            </div>
                        <hr className="border-secondary opacity-25" />
 {/* User Row */}
            <div className="d-flex align-items-start mt-4">
              <div className="bg-success bg-opacity-20 p-2 rounded-3 me-3">
                <User size={22} className="text-success" />
              </div>
              <div>
                <div className="fw-bold text-white text-uppercase small mb-1">Receiver Details</div>
                <div className="fw-bold text-info">
                  {selectedAddress ? selectedAddress.fullName : "N/A"}
                </div>
                <div className="text-muted d-flex align-items-center gap-2 mt-1 small">
                  <Phone size={14} />
                  <span>{selectedAddress ? selectedAddress.mobileNumber : "N/A"}</span>
                </div>
              </div>
            </div>
          <button className="btn btn-outline-info w-100 mt-4 rounded-pill py-2 fw-bold" onClick={() => navigate("/medicinedisplay")}>
            Shop More Items
          </button>
        </div>
      </div>
    </div>
  );
}

// Optional: Map Dark Mode Style
const darkModeStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    // ... more styles
];
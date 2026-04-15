import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axios from "axios";
import "../styles/dashboardsprofiles.css";

/* ---------- CATEGORY LIST (From image_36c3fd.png) ---------- */
const categories = [
  "Medicines", "Personal Care", "Health Conditions", 
  "Vitamins & Supplements", "Diabetes Care", 
  "Healthcare Devices", "Homeopathic Medicine", "Health Guide"
];

export default function MedicineDisplay() {
  const { addToCart, cartItems = [] } = useCart();
  const navigate = useNavigate();
  const [openMasterUpdate, setOpenMasterUpdate] = useState(false);
  const [user, setUser] = useState(null);
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDashboard, setOpenDashboard] = useState(false);
  
  // State for active category selection
  const [activeCategory, setActiveCategory] = useState("Medicines");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchMedicines();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct"
      );

      let rawData = [];
      if (Array.isArray(response.data)) {
        rawData = response.data;
      } else if (response.data && response.data.lsTmedicines) {
        rawData = response.data.lsTmedicines;
      }

      // Logic to remove duplicates by name
      const uniqueMedsMap = new Map();
      rawData.forEach((item) => {
        const normalizedName = item.name.trim().toLowerCase();
        if (!uniqueMedsMap.has(normalizedName)) {
          uniqueMedsMap.set(normalizedName, item);
        }
      });

      setMeds(Array.from(uniqueMedsMap.values()));
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyNow = (med) => {
    addToCart(med);
    navigate("/carts");
  };

  return (
    <div className="app-container d-flex">
      {/* ---------- SIDEBAR ---------- */}
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
                <li><Link to="/CompletePayments" className="sidebar-btn active-btn"><i className="fas fa-credit-card"></i> Order Payment</Link></li>
                <li><Link to="/"><i className="fas fa-map-marker-alt"></i> Refund Order Amount</Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/medicinedisplay" className="btn btn-success mb-2">Medicines</Link></li>

          <li>
            <Link to="/carts" className="nav-link">
              <i className="fas fa-shopping-cart me-2"></i> My Cart
              {cartItems.length > 0 && (
                <span className="cart-count badge bg-danger rounded-pill ms-2">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </li>

          <li><Link to="/orders" className="btn btn-success mb-2">OrderStatus</Link></li>
          <li><Link to="/feedbackcustomers" className="btn btn-success mb-2">CustomerFeedback</Link></li>
          <li><Link to="/customeraddmedicines" className="btn btn-success mb-2">UnvailableAddMedicine</Link></li>
          <li><Link to="/profile" className="btn btn-success">CustomerProfile</Link></li>
         <li><Link to="/customerhelpissues" className="btn btn-success">customerhelpissues</Link></li>


          <li className="mt-3">
            <Link to="/header" className="text-danger text-decoration-none">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </Link>
          </li>
        </ul>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="main-content">
        {/* CATEGORY NAVIGATION BAR (Implementation of image_36c3fd.png) */}
        <div className="category-nav-bar" style={{ background: '#121212', padding: '10px 20px', borderBottom: '1px solid #333' }}>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <li 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  color: activeCategory === cat ? '#2874f0' : '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  paddingBottom: '5px',
                  borderBottom: activeCategory === cat ? '3px solid #2874f0' : 'none',
                  whiteSpace: 'nowrap',
                  transition: '0.3s'
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        <header className="content-header d-flex justify-content-between align-items-center p-3">
          <h2 style={{ color: '#fff', margin: 0 }}>Available Medicines</h2>
          <span className="badge-found" style={{ color: '#aaa' }}>{meds.length} Unique Products Found</span>
        </header>
        <hr style={{ borderColor: '#333', margin: '0 1rem 1rem' }} />

        {loading ? (
          <div className="loading-spinner text-center mt-5">
            <div className="spinner-border text-success"></div>
            <p className="mt-2" style={{ color: '#fff' }}>Loading medicines...</p>
          </div>
        ) : (
          <div className="medicine-grid-container p-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {meds.length > 0 ? (
              meds.map((med) => (
                <div className="med-card-modern" key={med.id || med.name} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '15px', position: 'relative' }}>
                  
                  {/* TOP SECTION (Image image_36c6c9.png reference) */}
                  <div className="med-card-top text-center mb-3">
                    {med.discount > 0 && (
                      <span className="discount-pill" style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4d4d', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                        {med.discount}% OFF
                      </span>
                    )}
                    <h4 className="card-brand-name" style={{ color: '#fff', marginTop: '15px', fontWeight: '500' }}>{med.name}</h4>
                  </div>

                  {/* BOTTOM INFO SECTION */}
                  <div className="med-card-bottom" style={{ background: '#222', padding: '12px', borderRadius: '8px' }}>
                    <h3 className="med-title" style={{ fontSize: '15px', color: '#fff', marginBottom: '4px' }}>{med.name}</h3>
                    <p className="med-mfg" style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', marginBottom: '8px' }}>
                      MFG: {med.manufacturer || "Generic"}
                    </p>
                    
                    <div className="price-row d-flex justify-content-between align-items-center mt-2">
                      <span className="med-price" style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '18px' }}>₹{med.unitPrice}</span>
                      <span className="med-stock" style={{ color: '#ff4d4d', fontSize: '10px', background: '#331111', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                        Stock: {med.quantity}
                      </span>
                    </div>

                    <div className="card-buttons d-flex flex-column gap-2 mt-3">
                      <button
                        className="btn-outline-custom"
                        style={{ background: 'transparent', border: '1px solid #28a745', color: '#28a745', padding: '8px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                        onClick={() => med.quantity > 0 ? addToCart(med) : alert("Out of stock")}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn-solid-custom"
                        style={{ background: '#28a745', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                        disabled={med.quantity <= 0}
                        onClick={() => buyNow(med)}
                      >
                        {med.quantity > 0 ? "Buy Now" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state text-center w-100 mt-5" style={{ color: '#777' }}>No medicines found.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
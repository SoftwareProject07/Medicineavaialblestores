import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axios from "axios";
import "../styles/dashboardsprofiles.css";

/* ---------- CATEGORY LIST ---------- */
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

  // Pagination State (1 to 5 pages)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  const getUserInitial = () => {
    if (user && user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return "U";
  };

  // SMART DISTRIBUTIVE & KEYWORD FILTERING LOGIC
  const filteredMeds = meds.filter((med, index) => {
    if (activeCategory === "Medicines") {
      return true;
    }

    const textToCheck = `${med.name || ""} ${med.manufacturer || ""} ${med.category || ""}`.toLowerCase();

    let matchedCategory = "";
    if (textToCheck.includes("toothbrush") || textToCheck.includes("toothpaste") || textToCheck.includes("soap") || textToCheck.includes("shampoo") || textToCheck.includes("cream") || textToCheck.includes("skin") || textToCheck.includes("personal")) {
      matchedCategory = "Personal Care";
    } else if (textToCheck.includes("vitamin") || textToCheck.includes("supplement") || textToCheck.includes("protein") || textToCheck.includes("calcium") || textToCheck.includes("multivitamin")) {
      matchedCategory = "Vitamins & Supplements";
    } else if (textToCheck.includes("diabetes") || textToCheck.includes("insulin") || textToCheck.includes("sugar") || textToCheck.includes("glucometer") || textToCheck.includes("metformin")) {
      matchedCategory = "Diabetes Care";
    } else if (textToCheck.includes("device") || textToCheck.includes("oximeter") || textToCheck.includes("bp") || textToCheck.includes("thermometer") || textToCheck.includes("monitor")) {
      matchedCategory = "Healthcare Devices";
    } else if (textToCheck.includes("homeo") || textToCheck.includes("dilution") || textToCheck.includes("drop")) {
      matchedCategory = "Homeopathic Medicine";
    } else if (textToCheck.includes("pain") || textToCheck.includes("fever") || textToCheck.includes("cold") || textToCheck.includes("cough") || textToCheck.includes("infection") || textToCheck.includes("amlodipine") || textToCheck.includes("telmisartan") || textToCheck.includes("atorvastatin") || textToCheck.includes("paracetamol")) {
      matchedCategory = "Health Conditions";
    } else if (textToCheck.includes("guide") || textToCheck.includes("book") || textToCheck.includes("chart")) {
      matchedCategory = "Health Guide";
    }

    if (matchedCategory === activeCategory) {
      return true;
    }

    const nonMedicineCategories = categories.filter(c => c !== "Medicines");
    const assignedCategoryIndex = index % nonMedicineCategories.length;
    const fallbackCategory = nonMedicineCategories[assignedCategoryIndex];

    if (!matchedCategory && fallbackCategory === activeCategory) {
      return true;
    }

    return false;
  });

  const totalPages = Math.min(5, Math.ceil(filteredMeds.length / itemsPerPage) || 1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeds = filteredMeds.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="app-container d-flex">
      {/* ---------- SIDEBAR ---------- */}
      <div className="sidebar" style={{
        width: '280px', height: '100vh', backgroundColor: '#ffffff',
        borderRight: '1px solid #edf2f7', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '24px 16px', position: 'fixed',
        left: 0, top: 0, zIndex: 1000, overflowY: 'auto'
      }}>
        <div>
          <div className="brand-header" style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            paddingBottom: '20px', borderBottom: '1px solid #edf2f7', marginBottom: '20px'
          }}>
            <Link to="/dashboards" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-bag-shopping" style={{ color: '#0fa462', fontSize: '1.4rem' }}></i>
              <span className="brand-name" style={{ fontWeight: '700', color: '#0fa462', fontSize: '1.25rem' }}>AK Medistore</span>
            </Link>
          </div>

          <nav className="nav-menu" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="menu-group">
              <button
                className={`nav-item w-100 border-0 bg-transparent text-start ${openDashboard ? 'active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', color: openDashboard ? '#ffffff' : '#2d3748',
                  backgroundColor: openDashboard ? '#0fa462' : 'transparent',
                  borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer'
                }}
                onClick={() => setOpenDashboard(!openDashboard)}
              >
                <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <i className="fa-solid fa-chart-pie" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                  <span>Dashboard</span>
                </div>
                <i className={`fa-solid ${openDashboard ? 'fa-chevron-down' : 'fa-chevron-right'}`} style={{ fontSize: '0.75rem' }}></i>
              </button>

              {openDashboard && (
                <ul className="submenu list-unstyled ps-4 mt-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><Link to="/medication-tracker" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>Medication Tracker</Link></li>
                  <li><Link to="/test-reports" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>Test Reports</Link></li>
                  <li><Link to="/health-history" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>Health History</Link></li>
                  <li><Link to="/monthly-progress" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>Monthly Progress</Link></li>
                  <li><Link to="/prescriptions" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>Prescriptions</Link></li>
                  <li><Link to="/history" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>History</Link></li>
                  <li><Link to="/support" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>Help & Support</Link></li>
                  <li><Link to="/settings" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}>Settings</Link></li>
                </ul>
              )}
            </div>

            <div className="menu-group">
              <button 
                className="nav-item dropdown-toggle w-100 border text-start" 
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', color: '#2d3748', backgroundColor: '#fafafa',
                  borderColor: '#edf2f7', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer'
                }}
                onClick={() => setOpenMasterUpdate(!openMasterUpdate)}
              >
                <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <i className="fa-solid fa-pen-to-square" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                  <span>Master Update</span>
                </div>
                <i className={`fa-solid ${openMasterUpdate ? 'fa-chevron-down' : 'fa-chevron-right'}`} style={{ fontSize: '0.75rem' }}></i>
              </button>
              {openMasterUpdate && (
                <ul className="submenu list-unstyled ps-4 mt-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><Link to="/deliveryaddress" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}><i className="fas fa-map-marker-alt me-2"></i>Delivery Address</Link></li>
                  <li><Link to="/addbankrefundableamounts" className="text-decoration-none" style={{ color: '#718096', fontSize: '0.85rem' }}><i className="fas fa-undo me-2"></i>Refund Bank Details</Link></li>
                  <li><Link to="/bankdetailsrefundlist" className="text-decoration-none" style={{ color: '#0fa462', fontSize: '0.85rem', fontWeight: '600' }}><i className="fas fa-undo me-2"></i>Bank Details List</Link></li>
                </ul>
              )}
            </div>

            <Link to="/medicinedisplay" className="nav-item active" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
              backgroundColor: '#0fa462', color: '#ffffff', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none'
            }}>
              <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <i className="fa-solid fa-pills" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                <span>Medicines</span>
              </div>
            </Link>

            <Link to="/carts" className="nav-item" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
              color: '#2d3748', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem'
            }}>
              <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                <span>My Cart</span>
              </div>
              {cartItems.length > 0 && (
                <span className="cart-count badge bg-danger rounded-pill">{cartItems.length}</span>
              )}
            </Link>

            <Link to="/order" className="nav-item" style={{
              display: 'flex', alignItems: 'center', padding: '12px 14px', color: '#2d3748', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem'
            }}>
              <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <i className="fa-solid fa-truck" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                <span>Orders</span>
              </div>
            </Link>

            <Link to="/feedbackcustomers" className="nav-item" style={{
              display: 'flex', alignItems: 'center', padding: '12px 14px', color: '#2d3748', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem'
            }}>
              <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <i className="fa-solid fa-comment-dots" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                <span>Customer Feedback</span>
              </div>
            </Link>

            <Link to="/customeraddmedicines" className="nav-item" style={{
              display: 'flex', alignItems: 'center', padding: '12px 14px', color: '#2d3748', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem'
            }}>
              <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                <span>Unavailable Medicines</span>
              </div>
            </Link>

            <Link to="/profile" className="nav-item" style={{
              display: 'flex', alignItems: 'center', padding: '12px 14px', color: '#2d3748', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '0.95rem'
            }}>
              <div className="nav-link-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <i className="fa-solid fa-user" style={{ fontSize: '1.15rem', width: '20px', textAlign: 'center' }}></i>
                <span>Customer Profile</span>
              </div>
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer" style={{ borderTop: '1px solid #edf2f7', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="user-profile-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #edf2f7' }}>
            <div className="user-avatar" style={{ width: '40px', height: '40px', backgroundColor: '#e8f7f0', color: '#0fa462', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>
              {getUserInitial()}
            </div>
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span className="user-name" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#2d3748', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user ? `${user.firstName} ${user.lastName}` : "User"}
              </span>
              <span className="user-role" style={{ fontSize: '0.75rem', color: '#718096' }}>Customer Account</span>
            </div>
          </div>

          <Link to="/header" className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', color: '#e53e3e', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', borderRadius: '10px' }}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="main-content flex-grow-1" style={{ marginLeft: '280px', width: 'calc(100% - 280px)' }}>
        {/* CATEGORY NAVIGATION BAR */}
        <div className="category-nav-bar" style={{ background: '#121212', padding: '10px 20px', borderBottom: '1px solid #333' }}>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <li 
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  color: activeCategory === cat ? '#2874f0' : '#fff',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
                  paddingBottom: '5px', borderBottom: activeCategory === cat ? '3px solid #2874f0' : 'none',
                  whiteSpace: 'nowrap', transition: '0.3s'
                }}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        <header className="content-header d-flex justify-content-between align-items-center p-3">
          <h2 style={{ color: '#fff', margin: 0 }}>{activeCategory}</h2>
          <span className="badge-found" style={{ color: '#aaa' }}>{filteredMeds.length} Products Found</span>
        </header>
        <hr style={{ borderColor: '#333', margin: '0 1rem 1rem' }} />

        {loading ? (
          <div className="loading-spinner text-center mt-5">
            <div className="spinner-border text-success"></div>
            <p className="mt-2" style={{ color: '#fff' }}>Loading medicines...</p>
          </div>
        ) : (
          <>
            <div className="medicine-grid-container p-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {currentMeds.length > 0 ? (
                currentMeds.map((med) => (
                  <div className="med-card-modern" key={med.id || med.name} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '15px', position: 'relative' }}>
                    
                    {/* TOP SECTION: MEDICINE NAME BACKGROUND + IMAGE OVERLAY */}
                    <div className="med-card-top text-center mb-3" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRadius: '8px', background: '#222' }}>
                      
                      {/* Medicine Name Background Watermark (Peeche show hoga) */}
                      <span style={{ 
                        position: 'absolute', 
                        color: 'rgba(255, 255, 255, 0.25)', 
                        fontSize: '14px', 
                        fontWeight: 'bold', 
                        padding: '0 10px', 
                        zIndex: 1, 
                        textAlign: 'center', 
                        wordBreak: 'break-word',
                        userSelect: 'none'
                      }}>
                        {med.name}
                      </span>

                      {med.discount > 0 && (
                        <span className="discount-pill" style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4d4d', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', zIndex: 3 }}>
                          {med.discount}% OFF
                        </span>
                      )}
                      
                      {/* Medicine Image (Name ke upar show hogi) */}
                      <img 
                        src={med.image || med.imageUrl || med.photo || "https://via.placeholder.com/150?text=No+Image"} 
                        alt={med.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', position: 'relative', zIndex: 2 }}
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>

                    {/* BOTTOM INFO SECTION */}
                    <div className="med-card-bottom" style={{ background: '#222', padding: '12px', borderRadius: '8px' }}>
                      <h3 className="med-title" style={{ fontSize: '15px', color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{med.name}</h3>
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
                <div className="empty-state text-center w-100 mt-5" style={{ color: '#777' }}>No products found in this category.</div>
              )}
            </div>

            {/* ---------- PAGINATION (1 to 5) ---------- */}
            {filteredMeds.length > 0 && (
              <div className="pagination-container d-flex justify-content-center align-items-center gap-2 my-4">
                {[1, 2, 3, 4, 5].map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: '1px solid #333',
                      background: currentPage === pageNumber ? '#0fa462' : '#1a1a1a',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: '0.2s'
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
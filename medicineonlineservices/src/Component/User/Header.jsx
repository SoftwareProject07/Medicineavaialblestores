import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import "../styles/headers.css";
import "../styles/noscroll.css";

export default function Header() {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  
  // Shop status state
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, img: "/uploadimage/capsule_image_scoll.jpg", alt: "Lowest Price Guaranteed" },
    { id: 2, img: "/uploadimage/image.png", alt: "Up to 20% Off" },
    { id: 3, img: "/uploadimage/pexels-pixabay-159211.jpg", alt: "Exclusive Launch" },
    { id: 4, img: "/uploadimage/stock-vector-various-meds-pills-capsules-blisters-glass-bottles-with-liquid-medicine-plastic-tubes-with-1409823341.jpg", alt: "₹500 Cashback" },
  ];

  const [location, setLocation] = useState({ 
    city: "Ghaziabad", 
    pincode: "201011", 
    stateName: "Uttar Pradesh" 
  });
  
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const categories = [
    "Medicines", "Personal Care", "Health Conditions", 
    "Vitamins & Supplements", "Diabetes Care", 
    "Healthcare Devices", "Homeopathic Medicine", "Health Guide"
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  // Fetching medicines
  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct");
      const result = await response.json();
      const dataArray = result.lsTmedicines || result.lstmedicines || [];
      setMedicines(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    fetchMedicines();
    // Shop Status check sync
    const status = localStorage.getItem("shopStatus");
    setIsShopOpen(status !== "OFF");
  }, [fetchMedicines]);

  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, "");
    if (pin.length <= 6) setLocation((prev) => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0]?.Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setLocation({ pincode: pin, city: postOffice.District, stateName: postOffice.State });
        }
      } catch (err) { console.error("Pincode API Error:", err); }
    }
  };

  const handleMedicineOrderClick = (e) => {
    if (e) e.preventDefault();
    const isLoggedIn = localStorage.getItem("user") || localStorage.getItem("token");

    if (!isLoggedIn || isLoggedIn === "null") {
      setSidebarOpen(false);
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Bina login ke aap orders nahi dekh sakte!',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Login Now',
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
    } else {
      setSidebarOpen(false);
      navigate("/orders");
    }
  };

  const filteredMeds = medicines.filter((m) => 
    (m?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // --- CONDITION: IF SHOP IS CLOSED ---
  if (!isShopOpen) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-5 text-center border-0" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/3661/3661841.png" width="100" alt="Closed" className="mb-4 mx-auto" />
          <h1 className="fw-bold text-danger">Shop is Closed</h1>
          <p className="text-muted fs-5">Hum jald hi wapas aayenge. Suvidha ke liye khed hai.</p>
          <hr />
          <div className="mt-3">
             <Link to="/adminlogin" className="btn btn-outline-secondary btn-sm">Admin Portal</Link>
          </div>
        </div>
      </div>
    );
  }

  // --- NORMAL RENDER (ONLY IF SHOP IS OPEN) ---
  return (
    <>
      {/* SIDEBAR */}
      <div className={`side-menu bg-white shadow ${sidebarOpen ? "open" : ""}`} style={{ position: "fixed", top: 0, left: sidebarOpen ? 0 : "-300px", width: "280px", height: "100%", zIndex: 3000, transition: "0.3s ease" }}>
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">AKMedizostore</h5>
            <button className="btn-close" onClick={() => setSidebarOpen(false)}></button>
          </div>
          <ul className="nav flex-column gap-2">
            <li className="nav-item border-bottom pb-2"><Link to="/" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Home</Link></li>
            <li className="nav-item border-bottom pb-2">
              <div className="nav-link text-dark p-0" style={{ cursor: "pointer" }} onClick={handleMedicineOrderClick}>
                Medicine Order
              </div>
            </li>
            <li className="nav-item border-bottom pb-2">
              <Link to="/contact" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2500 }}></div>}

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm px-0 flex-column align-items-stretch" style={{ z_index: 2000 }}>
        <div className="d-flex align-items-center px-3 py-2 w-100">
            <button className="btn border-0 me-2" onClick={() => setSidebarOpen(true)}><i className="fas fa-bars fa-lg"></i></button>
            <Link to="/" className="navbar-brand d-flex align-items-center"><img src="/AKMedizostore.png" width="34" alt="logo" /><span className="ms-2 fw-bold">AKMedizostore</span></Link>
            <div className="ms-auto d-flex gap-3 align-items-center">
              <div onClick={() => setAdminOpen(!adminOpen)} style={{ cursor: "pointer" }} className="position-relative">
                <i className="fas fa-user-circle fa-2x text-secondary"></i>
                {adminOpen && (
                  <div className="admin-dropdown bg-white border shadow p-2 position-absolute" style={{ right: 0, top: "45px", zIndex: 1000, borderRadius: "8px", minWidth: "160px" }}>
                    <Link to="/login" className="d-block p-2 text-decoration-none text-dark">Customer Login</Link>
                    <Link to="/adminlogin" className="btn btn-success btn-sm w-100 mt-2">Admin Login</Link>
                  </div>
                )}
              </div>
              <div className="cart-icon position-relative">
                <span style={{ fontSize: "1.5rem" }}>🛒</span>
                <span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill">{cartItems.length}</span>
              </div>
            </div>
        </div>
        <div className="border-top overflow-hidden">
          <div className="category-bar d-flex justify-content-center align-items-center overflow-auto py-2 gap-4 no-scrollbar" style={{ whiteSpace: "nowrap" }}>
            {categories.map((cat, index) => (<span key={index} className="text-muted fw-medium category-item" style={{ cursor: "pointer", fontSize: "0.85rem" }}>{cat}</span>))}
          </div>
        </div>
      </nav>

      {/* HERO & SEARCH */}
      <div style={{marginTop: "105px"}}>
        <section className={`hero-section text-center ${isSticky ? "sticky-active" : ""}`}>
          <div className="hero-overlay"></div>
          <div className={`hero-content position-relative ${isSticky ? "d-none" : ""}`}>
            <h2 className="fw-bold text-white pt-5">Say Goodbye to high medicine prices</h2>
            <p className="text-white-50 small mb-4">Compare prices and save up to 51% on medicines</p>
          </div>

          <div className={`container search-wrapper position-relative ${isSticky ? "sticky-search-container" : ""}`}>
            <div className="input-group search-bar-group shadow-lg">
              <span className="input-group-text bg-white border-end-0 location-part flex-column align-items-start py-1">
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-marker-alt text-primary me-2"></i>
                  <span className="deliver-label text-primary fw-bold" style={{fontSize: "0.75rem"}}>Deliver to</span>
                  <input type="text" value={location.pincode} onChange={handlePincodeChange} className="pincode-input fw-bold ms-1" style={{width: "60px", border: "none", outline: "none"}} />
                </div>
                <div className="text-muted truncate-text" style={{fontSize: "0.65rem", marginLeft: "25px", maxWidth: "100px"}}>
                  {location.city}, {location.stateName}
                </div>
              </span>
              <input type="text" value={search} className="form-control border-start-0 py-3 ps-4 main-search-input" placeholder="Search for medicines..." onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-primary px-4 search-btn"><i className="fas fa-search me-2"></i><span className="fw-bold">Search</span></button>
            </div>
          </div>

          {/* SLIDER */}
          <div className="container mt-5">
            <hr className="mb-4" />
            <div className="slider-viewport rounded-3 shadow-sm position-relative overflow-hidden">
              <div className="slider-wrapper d-flex" style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: "0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                {slides.map((slide) => (
                  <div className="slide-item flex-shrink-0 w-100" key={slide.id}>
                    <img src={slide.img} alt={slide.alt} className="img-fluid w-100 d-block" style={{ height: "280px", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
              <div className="slider-controls">
                <button className="slider-arrow prev" onClick={prevSlide}>❮</button>
                <button className="slider-arrow next" onClick={nextSlide}>❯</button>
              </div>
            </div>
          </div>
        </section>

        {/* MEDICINE LIST */}
        <div className="container mb-5 pt-4">
          <h4 className="fw-bold mb-4">Available Medicines ({filteredMeds.length})</h4>
          <div className="row g-3">
            {loading ? (
              <div className="text-center py-5 w-100"><div className="spinner-border text-primary"></div></div>
            ) : filteredMeds.length > 0 ? (
              filteredMeds.map((med) => (
                <div className="col-6 col-md-4 col-lg-3" key={med.id}> 
                  <div className="card h-100 border-0 shadow-sm p-3">
                     <h6 className="fw-bold">{med.name}</h6>
                     <p className="small text-muted mb-1">{med.manufacturer}</p>
                     <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="text-success fw-bold">₹{med.unitPrice}</span>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setCartItems([...cartItems, med])}>Add</button>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 w-100">
                <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" width="80" alt="not found" className="mb-3" />
                <p className="text-muted">No medicines found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

     {/* --- FOOTER --- */}
      <footer className="ak-footer">
      {/* Top Navigation Row */}
      <div className="footer-nav-banner">
        <span>Know more about akmedicine</span>
        <span className="chevron-icon">⌄</span>
      </div>

      <div className="footer-main-content">
        {/* Column 1 */}
        <div className="footer-column">
          <h3 className="column-title">Company</h3>
          <ul className="footer-links">
            <li><Link to="/abouts">About Us</Link></li>
            <li>Health Article</li>
            <li>Health Stories</li>
            <li>Health Library</li>
            <li>Diseases & Health Conditions</li>
            <li>Ayurveda</li>
            <li>Understanding Generic Medicines</li>
            <li>All Medicines</li>
            <li>All Brands</li>
            <li>Need Help</li>
            <li>FAQ</li>
            <li>Security</li>
            <li>Savings Calculator</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h3 className="column-title">Social</h3>
          <div className="social-row">
            <div className="social-box ig">IG</div>
            <div className="social-box fb">FB</div>
            <div className="social-box yt">YT</div>
            <div className="social-box in">IN</div>
          </div>

          <h3 className="column-title mt-30">Legal</h3>
          <ul className="footer-links">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Editorial Policy</li>
            <li>Returns & Cancellations</li>
            <li>Lowest Price Guarantee T&C</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h3 className="column-title">Subscribe</h3>
          <p className="description-text">
            Claim your complimentary health and fitness tips subscription and stay updated on our newest promotions.
          </p>
          <div className="subscribe-input-group">
            <input type="email" placeholder="Enter your email ID" />
            <button>Subscribe</button>
          </div>

        
          <h3 className="column-title mt-20">Grievance Officer</h3>
          <div className="address-block">
            <p>Name: Gautam  Dev</p>
            <p>Email: <span className="highlight-blue">grievance-officer@akmedicine.in</span></p>
          </div>
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <h3 className="column-title">Download AK Medicine</h3>
          <p className="bold-desc">Manage your health with ease Download AK Medicine today!</p>
          <p className="description-text">Get easy access to medicine refills, health information, and more. With our app, you'll never have to wait in line again.</p>
          
          <div className="app-download-row">
            <div className="store-badge">Google Play</div>
            <div className="store-badge">App Store</div>
          </div>

          <h3 className="column-title mt-30">Contact Us</h3>
          <p className="description-text">Our customer representative team is available 7 days a week from 8:00 am - 10:00 pm.</p>
          {/* <div className="contact-footer-row">
            <span className="highlight-blue">support@akmedicine.in</span>
            <span className="phone-num">09240250346</span>
          </div> */}
          <p className="version-tag">v4.17.3</p>
        </div>
      </div>

      {/* Copyright Row */}
      <div className="footer-bottom-bar">
        <div className="copyright-info">
          © 2026 - AK Medicine | All rights reserved. Our content is for informational purposes only. 
          <span className="info-link"> See additional information.</span>
        </div>
        <div className="payment-partners">
          <span>Our Payment Partners</span>
          <div className="payment-icons">VISA | MASTERCARD | UPI | PAYTM</div>
        </div>
      </div>
    </footer>
    </>
  );
}
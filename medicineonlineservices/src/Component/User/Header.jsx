import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import "../styles/headers.css";
import "../styles/noscroll.css";
import { red } from "@cloudinary/url-gen/actions/adjust";

export default function Header() {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
  const [location, setLocation] = useState({ city: "Ghaziabad", pincode: "201011" });
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

  // Logic: Handle Scroll for Sticky Search
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logic: Sync Cart and Shop Status
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    const handleSync = () => setIsShopOpen(localStorage.getItem("shopStatus") !== "OFF");
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, [cartItems]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct");
      const data = await response.json();
      setMedicines(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, { headers: { "User-Agent": "AKMedizostore/1.0" } });
          const data = await res.json();
          setLocation({
            city: data.address.city || data.address.town || "Ghaziabad",
            pincode: data.address.postcode || "201011",
          });
        } catch (error) { console.error(error); }
      });
    }
  }, []);

  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, "");
    if (pin.length <= 6) setLocation((prev) => ({ ...prev, pincode: pin }));
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0]?.Status === "Success") setLocation({ pincode: pin, city: data[0].PostOffice[0].District });
      } catch (err) { console.error(err); }
    }
  };

  const handleMedicineOrderClick = (e) => {
    const isLoggedIn = localStorage.getItem("user") || localStorage.getItem("token");
    if (!isLoggedIn) {
      e.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Please login first!',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Login Now',
        showCancelButton: true,
      }).then((result) => { if (result.isConfirmed) { setSidebarOpen(false); navigate("/dashboards"); } });
    } else { setSidebarOpen(false); }
  };

  const filteredMeds = medicines.filter((m) => m.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {/* --- SIDEBAR MENU --- */}
      <div className={`side-menu bg-white shadow ${sidebarOpen ? "open" : ""}`} style={{ position: "fixed", top: 0, left: sidebarOpen ? 0 : "-300px", width: "280px", height: "100%", zIndex: 3000, transition: "0.3s ease" }}>
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">AKMedizostore</h5>
            <button className="btn-close" onClick={() => setSidebarOpen(false)}></button>
          </div>
          <ul className="nav flex-column gap-2">
            <li className="nav-item border-bottom pb-2"><Link to="/" className="nav-link text-dark p-0">Home</Link></li>
            <li className="nav-item border-bottom pb-2"><Link to="/orders" className="nav-link text-dark p-0" onClick={handleMedicineOrderClick}>Medicine Order</Link></li>
 <li className="nav-item border-bottom pb-2">
              <Link to="/contact" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>
                Contact Us
              </Link>
            </li>          </ul>
        </div>
      </div>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2500 }}></div>}

      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm px-0 flex-column align-items-stretch" style={{ zIndex: 2000 }}>
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
              <div className="cart-icon position-relative"><span style={{ fontSize: "1.5rem" }}>🛒</span><span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill">{cartItems.length}</span></div>
            </div>
        </div>
        <div className="border-top overflow-hidden">
          <div className="category-bar d-flex justify-content-center align-items-center overflow-auto py-2 gap-4 no-scrollbar" style={{ whiteSpace: "nowrap" }}>
            {categories.map((cat, index) => (<span key={index} className="text-muted fw-medium category-item" style={{ cursor: "pointer", fontSize: "0.85rem" }}>{cat}</span>))}
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      {!isShopOpen ? (
        <div className="container text-center py-5" style={{marginTop: "120px"}}><h1 className="fw-bold">Shop is Currently Closed</h1></div>
      ) : (
        <div style={{marginTop: "105px"}}>
          {/* HERO SECTION WITH IMAGE BACKGROUND */}
          <section className={`hero-section text-center ${isSticky ? "sticky-active" : ""}`}>
            <div className="hero-overlay"></div>
            
            <div className={`hero-content position-relative ${isSticky ? "d-none" : ""}`}>
              <h2 className="fw-bold text-white pt-5">Say Goodbye to high medicine prices</h2>
              <p className="text-white-50 small mb-4">Compare prices and save up to 51% on medicines</p>
            </div>

            <div className={`container search-wrapper position-relative ${isSticky ? "sticky-search-container" : ""}`}>
              <div className="input-group search-bar-group shadow-lg">
                <span className="input-group-text bg-white border-end-0 location-part">
                  <i className="fas fa-map-marker-alt text-primary me-2"></i>
                  <span className="deliver-label text-primary fw-bold">Deliver to</span>
                  <input type="text" value={location.pincode} onChange={handlePincodeChange} className="pincode-input fw-bold ms-1" />
                </span>
                <input type="text" className="form-control border-start-0 py-3 ps-4 main-search-input" placeholder="Search for medicines, vitamins..." onChange={(e) => setSearch(e.target.value)} />
                <button className="btn btn-primary px-4 search-btn"><i className="fas fa-search me-2"></i><span className="fw-bold">Search</span></button>
              </div>
            </div>
          </section>

    <section className="container text-center my-5">
  {/* Section Header with Lines */}
  <div className="d-flex align-items-center justify-content-center mb-4">
    <hr className="flex-grow-1" />
    <span className="mx-3 fw-bold text-primary text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
      Place Your Order Via
    </span>
    <hr className="flex-grow-1" />
  </div>

  <div className="row g-3 justify-content-center">
    {/* Call Option */}
    <div className="col-md-5">
      <div className="p-3 border rounded-4 d-flex align-items-center justify-content-center bg-light shadow-sm">
        <div className="bg-white p-2 rounded-3 me-3 border">
          <i className="bi bi-telephone-fill text-primary"></i> {/* Requires Bootstrap Icons */}
        </div>
        <p className="mb-0">Call <strong>09240250346</strong> to place order</p>
      </div>
    </div>

    {/* Upload Option */}
    <div className="col-md-5">
      <label htmlFor="prescription-upload" className="w-100" style={{ cursor: 'pointer' }}>
        <div className="p-3 border rounded-4 d-flex align-items-center justify-content-center bg-light shadow-sm">
          <div className="bg-white p-2 rounded-3 me-3 border">
            <i className="bi bi-clipboard2-plus text-primary"></i>
          </div>
          <p className="mb-0">Upload a <strong>prescription</strong></p>
        </div>
        <input type="file" id="prescription-upload" className="d-none" />
      </label>
    </div>
  </div>
</section>
<hr/>
<section className="container my-5">
  {/* Main Card */}
  <div className="card shadow-sm border rounded-4 overflow-hidden">
    <div className="row g-0 align-items-center">
      {/* Left Side: Image */}
      <div className="col-md-4 position-relative">
        <img 
          src="image_b89978.png" 
          alt="Save 51%" 
          className="img-fluid w-100"
          style={{ objectFit: 'cover' }}
        />
        <div className="position-absolute top-50 start-50 translate-middle">
           <div className="bg-dark bg-opacity-50 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-play-fill text-white fs-2"></i>
           </div>
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="col-md-8 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Substitutes are the smarter choice</h5>
          <a href="#" className="text-primary fw-bold text-decoration-none small">Learn more</a>
        </div>

        {/* Info Icons */}
        <div className="row mb-4">
          <div className="col-4 border-end">
            <p className="fw-bold mb-0 small">Safe</p>
            <p className="text-muted small mb-0">FDA and GMP certified</p>
          </div>
          <div className="col-4 border-end">
            <p className="fw-bold mb-0 small">Same</p>
            <p className="text-muted small mb-0">Exact same salt</p>
          </div>
          <div className="col-4">
            <p className="fw-bold mb-0 small">Savings</p>
            <p className="text-muted small mb-0">Up to 51% cheaper</p>
          </div>
        </div>

        {/* Yellow Bar */}
        <div className="rounded-3 p-2 text-center" style={{ backgroundColor: '#fff8e1' }}>
          <p className="mb-0 small fw-medium">All Substitutes are made by <b>top 1% manufacturers</b></p>
        </div>
      </div>
    </div>
  </div>

  {/* FIXED BOTTOM LINK */}
  <div className="mt-4 text-center">
    <p>
      <a href="/viewexampleheader" className="fw-bold text-primary text-decoration-none">
        View Example
      </a> 
      <span className="text-muted"> to compare and understand</span>
    </p>
  </div>
  <hr />
</section>
<section class="offer-slider-container">
    
    <div class="slider-wrapper">

        <div class="slide">
            <div class="banner-content blue-bg">
                <img src="offer1.jpg" alt="Lowest Price Guaranteed" />
                </div>
        </div>

        <div class="slide">
            <div class="banner-content red-bg">
                <img src="offer2.jpg" alt="Up to 20% Off Seven Seas" />
            </div>
        </div>

        <div class="slide">
            <div class="banner-content green-bg">
                <img src="offer3.jpg" alt="Exclusive Launch Offer" />
            </div>
        </div>

        <div class="slide">
            <div class="banner-content orange-bg">
                <img src="offer4.jpg" alt="Get ₹500 Cashback" />
            </div>
        </div>

        <div class="slide">
            <div class="banner-content purple-bg">
                <img src="offer5.jpg" alt="Seasonal Clearance Sale"/>
            </div>
        </div>

    </div>

    <div class="slider-controls">
        <button class="prev-btn">❮</button>
        <button class="next-btn">❯</button>
    </div>

    <div class="slider-dots">
        <span class="dot active"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
    </div>

</section>
          <div className="container mb-5 pt-4">
            <div className="row g-3">
              {loading ? (
                <div className="text-center py-5 w-100"><div className="spinner-border text-primary"></div></div>
              ) : filteredMeds.length > 0 ? (
                filteredMeds.map((med, i) => (
                  <div className="col-6 col-md-4 col-lg-3" key={med._id || i}>
                    <div className="card h-100 border-0 shadow-sm p-3">
                       <h6 className="fw-bold">{med.name}</h6>
                       <p className="small text-muted mb-1">{med.manufacturer}</p>
                       <div className="d-flex justify-content-between align-items-center mt-auto"><span className="text-success fw-bold">₹{med.unitPrice}</span><button className="btn btn-outline-primary btn-sm" onClick={() => setCartItems([...cartItems, med])}>Add</button></div>
                    </div>
                  </div>
                ))
              ) : (<div className="text-center py-5 w-100">No medicines found.</div>)}
            </div>
          </div>
        </div>
      )}
      <hr/>

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

          {/* <h3 className="column-title mt-30">Registered Office Address</h3>
          <div className="address-block">
            <p className="company-name">Intellihealth Solutions Private Limited</p>
            <p>Unit-301 & 304, Lightbridge Tunga Village, Saki Vihar Rd, Chandivali, Powai, Mumbai, Maharashtra, India, 400072.</p>
            <p>CIN: U62099MH2019PTC320566</p>
            <p>Telephone: <span className="highlight-blue">09240250346</span></p>
          </div> */}

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
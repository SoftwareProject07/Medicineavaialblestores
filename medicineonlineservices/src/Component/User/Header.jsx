import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import "../styles/headers.css";
import "../styles/noscroll.css";

export default function Header() {
  const navigate = useNavigate();
  const medicineSectionRef = useRef(null);
  
  const [adminOpen, setAdminOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  
  // --- 1. Nayi State: Selected Category ko track karne ke liye ---
  const [selectedCategory, setSelectedCategory] = useState("Medicines");
  
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

  // --- 2. Corrected Filter Logic: Search + Category Type ---
  const filteredMeds = medicines.filter((m) => {
    const matchesSearch = (m?.name || "").toLowerCase().includes(search.toLowerCase());
    
    // Category match logic: check if product 'type' matches 'selectedCategory'
    const matchesCategory = m?.type?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // --- 3. Click Handler: Category set karega aur scroll karega ---
  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Category update
    if (medicineSectionRef.current) {
      medicineSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  // const handleMedicineOrderClick = (e) => {
  //   if (e) e.preventDefault();
  //   const isLoggedIn = localStorage.getItem("user") || localStorage.getItem("token");
  //   if (!isLoggedIn || isLoggedIn === "null") {
  //     setSidebarOpen(false);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Login Required',
  //       text: 'Bina login ke aap orders nahi dekh sakte!',
  //       confirmButtonColor: '#28a745',
  //       confirmButtonText: 'Login Now',
  //     }).then((result) => {
  //       if (result.isConfirmed) navigate("/login");
  //     });
  //   } else {
  //     setSidebarOpen(false);
  //     navigate("/orders");
  //   }
  // };

  if (!isShopOpen) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-5 text-center border-0" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/3661/3661841.png" width="100" alt="Closed" className="mb-4 mx-auto" />
          <h1 className="fw-bold text-danger">Shop is Closed</h1>
          <p className="text-muted fs-5">Hum jald hi wapas aayenge.</p>
          <hr />
          <Link to="/adminlogin" className="btn btn-outline-secondary btn-sm">Admin Portal</Link>
        </div>
      </div>
    );
  }

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
            {/* <li className="nav-item border-bottom pb-2">
              <div className="nav-link text-dark p-0" style={{ cursor: "pointer" }} onClick={handleMedicineOrderClick}>Medicine Order</div>
            </li> */}
            <li className="nav-item border-bottom pb-2"><Link to="/contact" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Contact Us</Link></li>
          </ul>
        </div>
      </div>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2500 }}></div>}

      {/* NAVBAR */}
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
              <div className="cart-icon position-relative">
                <span style={{ fontSize: "1.5rem" }}>🛒</span>
                <span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill">{cartItems.length}</span>
              </div>
            </div>
        </div>
        <div className="border-top overflow-hidden">
          <div className="category-bar d-flex justify-content-center align-items-center overflow-auto py-2 gap-4 no-scrollbar" style={{ whiteSpace: "nowrap" }}>
            {categories.map((cat, index) => (
              <span key={index} 
                className={`category-item ${selectedCategory === cat ? "text-primary fw-bold" : "text-muted fw-medium"}`} 
                style={{ cursor: "pointer", fontSize: "0.85rem" }}
                onClick={() => handleCategoryClick(cat)}> 
                {cat}
              </span>
            ))}
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
                <div className="text-muted truncate-text" style={{fontSize: "0.65rem", marginLeft: "25px", textAlign: "left", width: "100%"}}>
                  {location.city}, {location.stateName}
                </div>
              </span>
              <input type="text" value={search} className="form-control border-start-0 py-3 ps-4 main-search-input" placeholder={`Search in ${selectedCategory}...`} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-primary px-4 search-btn"><i className="fas fa-search me-2"></i><span className="fw-bold">Search</span></button>
            </div>
          </div>

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

        {/* MEDICINE LIST - Filtered by Category Type */}
        <div className="container mb-5 pt-4" ref={medicineSectionRef}>
          <h4 className="fw-bold mb-4">{selectedCategory} Items ({filteredMeds.length})</h4>
          <div className="row g-3">
            {loading ? (
              <div className="text-center py-5 w-100"><div className="spinner-border text-primary"></div></div>
            ) : filteredMeds.length > 0 ? (
              filteredMeds.map((med) => (
                <div className="col-6 col-md-4 col-lg-3" key={med.id || med._id}> 
                  <div className="card h-100 border-0 shadow-sm p-3">
                     <h6 className="fw-bold">{med.name}</h6>
                     <p className="small text-muted mb-1">{med.manufacturer || med.type}</p>
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
                <p className="text-muted">No items found for {selectedCategory}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="ak-footer">
        {/* Footer Content Same as Original */}
        <div className="footer-bottom-bar text-center py-3">
          © 2026 - AK Medicine | All rights reserved.
        </div>
      </footer>
    </>
  );
}
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 
import "../styles/headers.css";
import "../styles/noscroll.css";

// Full software translation dictionary for English and Hindi
const translations = {
  English: {
    brandName: "AKMedizostore",
    home: "Home",
    contactUs: "Contact Us",
    addTicket: "Add Ticket Raised",
    teamHiring: "Team Hiring Applications",
    customerLogin: "Customer Login",
    adminLogin: "Admin Login",
    loginRequired: "Login Required",
    loginPrompt: "Please login first to view your cart!",
    loginNow: "Login Now",
    deliverTo: "Deliver to",
    searchPlaceholder: "Search in",
    searchBtn: "Search",
    heroTitle: "Say Goodbye to high medicine prices",
    heroSubtitle: "Compare prices and save up to 51% on medicines",
    itemsText: "Items",
    addBtn: "Add",
    mfgText: "MFG",
    notFound: "No items found for",
    footerText: "© 2026 - AK Medicine | All rights reserved.",
    shopClosed: "Shop is Closed",
    shopClosedSub: "We will be back soon!",
    adminPortal: "Admin Portal",
    langChanged: "Language Changed",
    langSwitched: "App language switched to",
    categories: {
      "Medicines": "Medicines",
      "Personal Care": "Personal Care",
      "Health Conditions": "Health Conditions",
      "Vitamins & Supplements": "Vitamins & Supplements",
      "Diabetes Care": "Diabetes Care",
      "Healthcare Devices": "Healthcare Devices",
      "Homeopathic Medicine": "Homeopathic Medicine",
      "Health Guide": "Health Guide"
    }
  },
  Hindi: {
    brandName: "एके मेडिज़ो स्टोर",
    home: "होम",
    contactUs: "संपर्क करें",
    addTicket: "टिकट दर्ज करें",
    teamHiring: "टीम हायरिंग आवेदन",
    customerLogin: "ग्राहक लॉगिन",
    adminLogin: "एडमिन लॉगिन",
    loginRequired: "लॉगिन आवश्यक है",
    loginPrompt: "अपना कार्ट देखने के लिए कृपया पहले लॉगिन करें!",
    loginNow: "अभी लॉगिन करें",
    deliverTo: "यहाँ डिलीवर करें",
    searchPlaceholder: "इसमें खोजें",
    searchBtn: "खोजें",
    heroTitle: "उच्च दवा कीमतों को कहें अलविदा",
    heroSubtitle: "कीमतों की तुलना करें और दवाओं पर 51% तक बचाएं",
    itemsText: "आइटम",
    addBtn: "जोड़ें",
    mfgText: "उत्पादक",
    notFound: "के लिए कोई आइटम नहीं मिला",
    footerText: "© 2026 - एके मेडिसिन | सर्वाधिकार सुरक्षित।",
    shopClosed: "दुकान बंद है",
    shopClosedSub: "हम जल्द ही वापस आएंगे!",
    adminPortal: "एडमिन पोर्टल",
    langChanged: "भाषा बदल गई",
    langSwitched: "ऐप की भाषा बदलकर कर दी गई है",
    categories: {
      "Medicines": "दवाएं",
      "Personal Care": "पर्सनल केयर",
      "Health Conditions": "स्वास्थ्य समस्याएं",
      "Vitamins & Supplements": "विटामिन और सप्लीमेंट्स",
      "Diabetes Care": "डायबिटिक केयर",
      "Healthcare Devices": "हेल्थकेयर डिवाइस",
      "Homeopathic Medicine": "होम्योपैथिक दवा",
      "Health Guide": "हेल्थ गाइड"
    }
  }
};

export default function Header() {
  const navigate = useNavigate();
  const medicineSectionRef = useRef(null);
  
  const [adminOpen, setAdminOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  
  // Language Dropdown states
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [languagesList, setLanguagesList] = useState(["English", "Hindi"]);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "English";
  });

  // Selected Category state
  const [selectedCategory, setSelectedCategory] = useState("Medicines");
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
  
  // Team Hiring Toggle state
  const [isHiringActive, setIsHiringActive] = useState(() => {
    const saved = localStorage.getItem("isHiringActive");
    if (saved !== null) return JSON.parse(saved);
    return localStorage.getItem("hiringStatus") !== "OFF";
  });
  
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

  // Helper text translator based on active language dictionary
  const t = (key) => {
    const langKey = currentLanguage.toLowerCase() === "hindi" ? "Hindi" : "English";
    return translations[langKey]?.[key] || translations["English"][key] || key;
  };

  const tCategory = (cat) => {
    const langKey = currentLanguage.toLowerCase() === "hindi" ? "Hindi" : "English";
    return translations[langKey]?.categories?.[cat] || cat;
  };

  // Fetch languages with strict case-insensitive duplicate filtering
  const fetchLanguagesMaster = useCallback(async () => {
    try {
      const res = await fetch("https://ecommerencesite.onrender.com/api/LanguageAPI/AllCurrentLanguageAsync");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        
        const uniqueMap = new Map();
        list.forEach(item => {
          const rawName = (item.preferredLanguage || item.languageName || item.name || "").trim();
          if (rawName) {
            const lowerKey = rawName.toLowerCase();
            // Capitalize first letter neatly for uniform UI display
            const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
            if (!uniqueMap.has(lowerKey)) {
              uniqueMap.set(lowerKey, formattedName);
            }
          }
        });
        
        const extractedLangs = Array.from(uniqueMap.values());
        
        // Ensure English and Hindi are always present cleanly without duplicates
        const defaultLangs = ["English", "Hindi"];
        const finalSet = new Map();
        
        defaultLangs.forEach(l => finalSet.set(l.toLowerCase(), l));
        extractedLangs.forEach(l => {
          if (!finalSet.has(l.toLowerCase())) {
            finalSet.set(l.toLowerCase(), l);
          }
        });

        setLanguagesList(Array.from(finalSet.values()));
      }
    } catch (err) {
      console.error("Error fetching languages:", err);
      setLanguagesList(["English", "Hindi"]); 
    }
  }, []);

  // Handle language selection change
  const handleLanguageSelect = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
    setLangDropdownOpen(false);
    
    Swal.fire({
      icon: 'success',
      title: t("langChanged"),
      text: `${t("langSwitched")} ${lang}`,
      timer: 1500,
      showConfirmButton: false,
      background: '#16161a',
      color: '#fff'
    });
  };

  // Robust filtering logic ensuring every category displays distinct relevant results
  const filteredMeds = medicines.filter((m) => {
    const matchesSearch = (m?.name || "").toLowerCase().includes(search.toLowerCase());
    
    if (selectedCategory === "Medicines") return matchesSearch; 

    const itemText = `${m?.name || ""} ${m?.manufacturer || ""} ${m?.type || ""} ${m?.category || ""}`.toLowerCase();
    
    let itemCategoryMatch = false;

    if (selectedCategory === "Personal Care") {
      itemCategoryMatch = itemText.includes("soap") || itemText.includes("shampoo") || itemText.includes("paste") || itemText.includes("brush") || itemText.includes("cream") || itemText.includes("oil") || itemText.includes("lotion") || itemText.includes("personal");
    } else if (selectedCategory === "Vitamins & Supplements") {
      itemCategoryMatch = itemText.includes("vitamin") || itemText.includes("supplement") || itemText.includes("protein") || itemText.includes("calcium") || itemText.includes("zinc") || itemText.includes("omega") || itemText.includes("multivitamin");
    } else if (selectedCategory === "Diabetes Care") {
      itemCategoryMatch = itemText.includes("diabetes") || itemText.includes("insulin") || itemText.includes("sugar") || itemText.includes("glucometer") || itemText.includes("strip") || itemText.includes("glimepiride") || itemText.includes("metformin");
    } else if (selectedCategory === "Healthcare Devices") {
      itemCategoryMatch = itemText.includes("device") || itemText.includes("oximeter") || itemText.includes("bp") || itemText.includes("thermometer") || itemText.includes("monitor") || itemText.includes("machine") || itemText.includes("nebulizer");
    } else if (selectedCategory === "Homeopathic Medicine") {
      itemCategoryMatch = itemText.includes("homeo") || itemText.includes("dilution") || itemText.includes("drop") || itemText.includes("globules") || itemText.includes("sbl") || itemText.includes("reckeweg");
    } else if (selectedCategory === "Health Conditions") {
      itemCategoryMatch = itemText.includes("pain") || itemText.includes("fever") || itemText.includes("cold") || itemText.includes("cough") || itemText.includes("paracetamol") || itemText.includes("acidity") || itemText.includes("joint");
    } else if (selectedCategory === "Health Guide") {
      itemCategoryMatch = itemText.includes("guide") || itemText.includes("book") || itemText.includes("chart") || itemText.includes("diet") || itemText.includes("wellness");
    } else {
      itemCategoryMatch = (m?.category || "").toLowerCase() === selectedCategory.toLowerCase();
    }

    return matchesSearch && itemCategoryMatch;
  });

  const handleCartClick = () => {
    Swal.fire({
      icon: 'warning',
      title: t("loginRequired"),
      text: t("loginPrompt"),
      confirmButtonColor: '#28a745',
      confirmButtonText: t("loginNow"),
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); 
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
      
      const uniqueMedsMap = new Map();
      (Array.isArray(dataArray) ? dataArray : []).forEach((item) => {
        if (item && item.name) {
          const normalizedName = item.name.trim().toLowerCase();
          if (!uniqueMedsMap.has(normalizedName)) {
            uniqueMedsMap.set(normalizedName, item);
          }
        }
      });

      setMedicines(Array.from(uniqueMedsMap.values()));
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
    fetchLanguagesMaster();
    const status = localStorage.getItem("shopStatus");
    setIsShopOpen(status !== "OFF");
  }, [fetchMedicines, fetchLanguagesMaster]);

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

  if (!isShopOpen) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-5 text-center border-0" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/3661/3661841.png" width="100" alt="Closed" className="mb-4 mx-auto" />
          <h1 className="fw-bold text-danger">{t("shopClosed")}</h1>
          <p className="text-muted fs-5">{t("shopClosedSub")}</p>
          <hr />
          <Link to="/adminlogin" className="btn btn-outline-secondary btn-sm">{t("adminPortal")}</Link>
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
            <h5 className="fw-bold mb-0">{t("brandName")}</h5>
            <button className="btn-close" onClick={() => setSidebarOpen(false)}></button>
          </div>
          <ul className="nav flex-column gap-2">
            <li className="nav-item border-bottom pb-2"><Link to="/" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>{t("home")}</Link></li>
            <li className="nav-item border-bottom pb-2"><Link to="/contact" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>{t("contactUs")}</Link></li>
            <li className="nav-item border-bottom pb-2"><Link to="/customerticketraised" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>{t("addTicket")}</Link></li>
            {isHiringActive && (
              <li className="nav-item border-bottom pb-2"><Link to="/hiringcandidteapplieds" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>{t("teamHiring")}</Link></li>
            )}
          </ul>
        </div>
      </div>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2500 }}></div>}

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm px-0 flex-column align-items-stretch" style={{ zIndex: 2000 }}>
        <div className="d-flex align-items-center px-3 py-2 w-100">
            <button className="btn border-0 me-2" onClick={() => setSidebarOpen(true)}><i className="fas fa-bars fa-lg"></i></button>
            <Link to="/" className="navbar-brand d-flex align-items-center"><img src="/AKMedizostore.png" width="34" alt="logo" /><span className="ms-2 fw-bold">{t("brandName")}</span></Link>
            
            <div className="ms-auto d-flex gap-3 align-items-center">
              <Link to="/medicinechartai" className="text-decoration-none">
                <div className="cart-icon position-relative">
                    <i className="fa-solid fa-headset"></i>
                </div>
              </Link>

              {/* LANGUAGE DROPDOWN */}
              <div className="position-relative">
                <button 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)} 
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 dropdown-toggle"
                  style={{ fontSize: "0.85rem", borderRadius: "20px", padding: "4px 10px" }}
                >
                  <i className="fas fa-globe"></i> {currentLanguage}
                </button>
                {langDropdownOpen && (
                  <div className="admin-dropdown bg-white border shadow py-1 position-absolute" style={{ right: 0, top: "38px", zIndex: 1000, borderRadius: "8px", minWidth: "140px" }}>
                    {languagesList.map((lang, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`dropdown-item text-start w-100 px-3 py-2 border-0 bg-transparent ${currentLanguage.toLowerCase() === lang.toLowerCase() ? 'fw-bold text-success bg-light' : 'text-dark'}`}
                        style={{ fontSize: "0.85rem", cursor: "pointer" }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div onClick={() => setAdminOpen(!adminOpen)} style={{ cursor: "pointer" }} className="position-relative">
                <i className="fas fa-user-circle fa-2x text-secondary"></i>
                {adminOpen && (
                  <div className="admin-dropdown bg-white border shadow p-2 position-absolute" style={{ right: 0, top: "45px", zIndex: 1000, borderRadius: "8px", minWidth: "160px" }}>
                    <Link to="/login" className="d-block p-2 text-decoration-none text-dark">{t("customerLogin")}</Link>
                    <Link to="/adminlogin" className="btn btn-success btn-sm w-100 mt-2">{t("adminLogin")}</Link>
                  </div>
                )}
              </div>
              <div className="cart-icon position-relative" style={{ cursor: "pointer" }} onClick={handleCartClick}>
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
                {tCategory(cat)}
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
            <h2 className="fw-bold text-white pt-5">
              {t("heroTitle")}
            </h2>
            <p className="text-white-50 small mb-4">
              {t("heroSubtitle")}
            </p>
          </div>

          <div className={`container search-wrapper position-relative ${isSticky ? "sticky-search-container" : ""}`}>
            <div className="input-group search-bar-group shadow-lg">
              <span className="input-group-text bg-white border-end-0 location-part flex-column align-items-start py-1">
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-marker-alt text-primary me-2"></i>
                  <span className="deliver-label text-primary fw-bold" style={{fontSize: "0.75rem"}}>{t("deliverTo")}</span>
                  <input type="text" value={location.pincode} onChange={handlePincodeChange} className="pincode-input fw-bold ms-1" style={{width: "60px", border: "none", outline: "none"}} />
                </div>
                <div className="text-muted truncate-text" style={{fontSize: "0.65rem", marginLeft: "25px", textAlign: "left", width: "100%"}}>
                  {location.city}, {location.stateName}
                </div>
              </span>
              <input type="text" value={search} className="form-control border-start-0 py-3 ps-4 main-search-input" placeholder={`${t("searchPlaceholder")} ${tCategory(selectedCategory)}...`} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-primary px-4 search-btn"><i className="fas fa-search me-2"></i><span className="fw-bold">{t("searchBtn")}</span></button>
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

        {/* MEDICINE LIST */}
        <div className="container mb-5 pt-4" ref={medicineSectionRef}>
          <h4 className="fw-bold mb-4">{tCategory(selectedCategory)} {t("itemsText")} ({filteredMeds.length})</h4>
          <div className="row g-3">
            {loading ? (
              <div className="text-center py-5 w-100"><div className="spinner-border text-primary"></div></div>
            ) : filteredMeds.length > 0 ? (
              filteredMeds.map((med) => (
                <div className="col-6 col-md-4 col-lg-3" key={med.id || med._id || med.name}> 
                  <div className="card h-100 border-0 shadow-sm p-3">
                     <span className="badge bg-light text-dark mb-2 align-self-start" style={{ fontSize: "0.7rem" }}>
                       {tCategory(selectedCategory)}
                     </span>
                     <h6 className="fw-bold">{med.name}</h6>
                     <p className="small text-muted mb-1">{t("mfgText")}: {med.manufacturer || med.type || "Generic"}</p>
                     <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="text-success fw-bold">₹{med.unitPrice}</span>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setCartItems([...cartItems, med])}>{t("addBtn")}</button>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 w-100">
                <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" width="80" alt="not found" className="mb-3" />
                <p className="text-muted">{t("notFound")} {tCategory(selectedCategory)}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="ak-footer">
        <div className="footer-bottom-bar text-center py-3">
          {t("footerText")}
        </div>
      </footer>
    </>
  );
}
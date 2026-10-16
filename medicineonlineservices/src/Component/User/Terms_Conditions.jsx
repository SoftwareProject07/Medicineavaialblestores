// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/term_conditions.css';

// export default function Terms_Conditions() {
//   return (
//     <div className="terms-conditions-page min-vh-100 bg-light" style={{ paddingTop: "145px" }}>
      
//       {/* ----------------- COMPLETE FIXED HEADER & NAVIGATION BAR ----------------- */}
//       <div className="bg-white border-bottom shadow-sm fixed-top" style={{ top: "0" }}>
        
//         {/* Main Header (Logo, Search, Download App, Login, Cart) */}
//         <div className="container py-2">
//           <div className="d-flex align-items-center justify-content-between gap-3">
            
//             {/* Logo */}
//             <Link to="/" className="d-flex align-items-center text-decoration-none">
//               <span className="fs-4 fw-bold text-primary">MedicineOneServices</span>
//             </Link>

//             {/* Deliver to & Search Bar */}
//             <div className="d-flex align-items-center flex-grow-1 mx-3" style={{ maxWidth: "700px" }}>
//               <div className="input-group border rounded-pill overflow-hidden bg-white shadow-sm">
//                 <button className="btn btn-outline-secondary border-0 text-muted px-3 d-none d-md-flex align-items-center gap-1 bg-light" type="button">
//                   📍 Deliver to <span className="text-dark fw-bold">▼</span>
//                 </button>
//                 <input 
//                   type="text" 
//                   className="form-control border-0 shadow-none py-2 px-3" 
//                   placeholder="Search for medicines, health products..." 
//                 />
//                 <button className="btn btn-primary px-4 rounded-pill m-1" type="button">
//                   Search
//                 </button>
//               </div>
//             </div>

//             {/* Right Action Links */}
//             <div className="d-flex align-items-center gap-4 text-nowrap">
//               <Link to="/download-app" className="text-decoration-none text-dark fw-medium small d-none d-lg-block">Download App</Link>
//               <Link to="/login" className="text-decoration-none text-primary fw-semibold">Login / Signup</Link>
//               <Link to="/cart" className="text-decoration-none text-dark d-flex align-items-center gap-1">
//                 🛒 <span className="fw-medium">Cart</span>
//               </Link>
//             </div>

//           </div>
//         </div>

//         {/* Sub-Menu Bar */}
//         <div className="border-top bg-white py-2">
//           <div className="container">
//             <div className="d-flex align-items-center justify-content-between overflow-auto py-1" style={{ whiteSpace: "nowrap", gap: "30px" }}>
//               <Link to="/medicines" className="text-decoration-none text-secondary small fw-medium">Medicines</Link>
//               <Link to="/personal-care" className="text-decoration-none text-secondary small fw-medium">Personal Care</Link>
//               <Link to="/health-conditions" className="text-decoration-none text-secondary small fw-medium">Health Conditions</Link>
//               <Link to="/vitamins-supplements" className="text-decoration-none text-secondary small fw-medium">Vitamins & Supplements</Link>
//               <Link to="/diabetes-care" className="text-decoration-none text-secondary small fw-medium">Diabetes Care</Link>
//               <Link to="/healthcare-devices" className="text-decoration-none text-secondary small fw-medium">Healthcare Devices</Link>
//               <Link to="/homeopathic-medicine" className="text-decoration-none text-secondary small fw-medium">Homeopathic Medicine</Link>
//               <Link to="/health-guide" className="text-decoration-none text-secondary small fw-medium">Health Guide</Link>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* ----------------- MAIN CONTENT AREA ----------------- */}
//       <div className="container mb-5" style={{ marginTop: "20px" }}>
//         <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
//           <h2 className="terms-title mb-4 fw-bold text-dark">Terms And Conditions</h2>
          
//           <p className="terms-text text-secondary" style={{ lineHeight: "1.8" }}>
//             MedicineOneServices Private Limited is in the process of implementing certain business related changes and until the said changes are fully implemented, MedicineOneServices Private Limited’s products and services may be provided to you at the location chosen by you, either by MedicineOneServices Private Limited or by its wholly owned subsidiary i.e. ANKW Pharma Retail Private Limited.
//           </p>

//           <p className="terms-text mt-3 text-secondary" style={{ lineHeight: "1.8" }}>
//             By agreeing to the aforesaid, the Terms & Conditions of MedicineOneServices Private Limited and ANKW Pharma Retail Private Limited will apply accordingly.
//           </p>

//           <div className="link-box mt-4 p-3 bg-light rounded-3 border">
//             <p className="mb-2">
//               <strong>ISPL:</strong>{" "}
//               <a href="#ispl" className="text-primary text-decoration-none ms-1">
//                 https://www.medicineoneservices.in/legal/ispl/terms-and-conditions
//               </a>
//             </p>
//             <p className="mb-0">
//               <strong>ANKW:</strong>{" "}
//               <a href="#ankw" className="text-primary text-decoration-none ms-1">
//                 https://www.medicineoneservices.in/legal/ankw/terms-and-conditions
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ----------------- FOOTER SECTION AT THE BOTTOM ----------------- */}
//       <div className="terms-footer-section bg-white pt-5 pb-3 border-top mt-5">
//         <div className="container">
//           <div className="row g-4 mb-4">
            
//             {/* Company Links */}
//             <div className="col-6 col-md-3">
//               <h5 className="fw-bold mb-3 text-dark">Company</h5>
//               <ul className="list-unstyled">
//                 <li className="mb-2"><Link to="/abouts" className="text-decoration-none text-muted">About Us</Link></li>
//                 <li className="mb-2"><Link to="/health-article" className="text-decoration-none text-muted">Health Article</Link></li>
//                 <li className="mb-2"><Link to="/health-stories" className="text-decoration-none text-muted">Health Stories</Link></li>
//                 <li className="mb-2"><Link to="/health-library" className="text-decoration-none text-muted">Health Library</Link></li>
//                 <li className="mb-2"><Link to="/diseases" className="text-decoration-none text-muted">Diseases & Health Conditions</Link></li>
//                 <li className="mb-2"><Link to="/ayurveda" className="text-decoration-none text-muted">Ayurveda</Link></li>
//                 <li className="mb-2"><Link to="/understanding-generic-medicines" className="text-decoration-none text-muted">Understanding Generic Medicines</Link></li>
//                 <li className="mb-2"><Link to="/all-medicines" className="text-decoration-none text-muted">All Medicines</Link></li>
//                 <li className="mb-2"><Link to="/all-brands" className="text-decoration-none text-muted">All Brands</Link></li>
//                 <li className="mb-2"><Link to="/need-help" className="text-decoration-none text-muted">Need Help</Link></li>
//                 <li className="mb-2"><Link to="/faq" className="text-decoration-none text-muted">FAQ</Link></li>
//                 <li className="mb-2"><Link to="/security" className="text-decoration-none text-muted">Security</Link></li>
//                 <li className="mb-2"><Link to="/savings-calculator" className="text-decoration-none text-muted">Savings Calculator</Link></li>
//                 <li className="mb-2"><Link to="/advertise-with-us" className="text-decoration-none text-muted">Advertise with Us</Link></li>
//               </ul>
//             </div>

//             {/* Social & Legal Links */}
//             <div className="col-6 col-md-3">
//               <h5 className="fw-bold mb-3 text-dark">Social</h5>
//               <div className="d-flex gap-3 mb-4 text-primary">
//                 <span className="fs-4" style={{ cursor: "pointer" }}>📷</span>
//                 <span className="fs-4" style={{ cursor: "pointer" }}>📘</span>
//                 <span className="fs-4" style={{ cursor: "pointer" }}>▶️</span>
//                 <span className="fs-4" style={{ cursor: "pointer" }}>🔗</span>
//               </div>

//               <h5 className="fw-bold mb-3 text-dark">Legal</h5>
//               <ul className="list-unstyled">
//                 <li className="mb-2"><Link to="/termconditions" className="text-decoration-none text-muted">Terms & Conditions</Link></li>
//                 <li className="mb-2"><Link to="/privacy" className="text-decoration-none text-muted">Privacy Policy</Link></li>
//                 <li className="mb-2"><Link to="/editorial-policy" className="text-decoration-none text-muted">Editorial Policy</Link></li>
//                 <li className="mb-2"><Link to="/returns" className="text-decoration-none text-muted">Returns & Cancellations</Link></li>
//                 <li className="mb-2"><Link to="/lowest-price-guarantee" className="text-decoration-none text-muted">Lowest Price Guarantee T&C</Link></li>
//               </ul>
//             </div>

//             {/* Subscribe & Registered Office Address */}
//             <div className="col-md-3">
//               <h5 className="fw-bold mb-3 text-dark">Subscribe</h5>
//               <p className="text-muted small mb-3">Claim your complimentary health and fitness tips subscription and stay updated on our newest promotions.</p>
//               <div className="input-group mb-4">
//                 <input type="email" className="form-control" placeholder="Enter your email ID" />
//                 <button className="btn btn-primary" type="button">Subscribe</button>
//               </div>

//               <h5 className="fw-bold mb-2 text-dark">Registered Office Address</h5>
//               <p className="text-muted small mb-1 fw-semibold">MedicineOneServices Private Limited</p>
//               <p className="text-muted small mb-2" style={{ lineHeight: "1.5" }}>
//                 JS ROOP HOMES ,NEAR BY VIHAN HERITAGE SECTOR -1 GREATER NOIDA EXTENSION ,PINCODE- 201318
//               </p>
//               <p className="text-muted small mb-1"><strong>CIN:</strong> 0000000</p>
//               <p className="text-muted small mb-3"><strong>Telephone:</strong> <span className="text-primary">8409844260</span></p>

//               <h5 className="fw-bold mb-2 text-dark">Grievance Officer</h5>
//                 <p className="text-muted small mb-1"><strong>Name:</strong> Gautam Dev</p>
//               <p className="text-muted small mb-0"><strong>Email:</strong> <a href="mailto:grievance-customersupports01@gmail.com" className="text-decoration-none">grievance-customersupports01@gmail.com</a></p>
//             </div>

//             {/* Download App & Contact Us */}
//             <div className="col-md-3">
//               <h5 className="fw-bold mb-3 text-dark">Download MedicineOneServices</h5>
//               <p className="text-muted small mb-3">
//                 Manage your health with ease Download MedicineOneServices today! Get easy access to medicine refills, health information, and more.
//               </p>
//               <div className="d-flex flex-column gap-2 mb-4">
//                 <span className="badge bg-dark p-2 text-start" style={{ width: "140px", cursor: "pointer" }}>Get it on Google Play</span>
//                 <span className="badge bg-dark p-2 text-start" style={{ width: "140px", cursor: "pointer" }}>Download on App Store</span>
//               </div>

//               <h5 className="fw-bold mb-2 text-dark">Contact Us</h5>
//               <p className="text-muted small mb-2">Our customer representative team is available 7 days a week from 8:00 am - 10:00 pm.</p>
//               <p className="text-muted small mb-1"><strong>Email:</strong> customersupports01@gmail.com</p>
//               <p className="text-muted small mb-1"><strong>Helpline:</strong> <span className="text-primary">8409844260</span></p>
//               <p className="text-muted small mb-0">v4.28.10</p>
//             </div>

//           </div>

//           {/* Bottom Copyright */}
//           <div className="border-top pt-3 text-center text-muted small">
//             <p className="mb-0">2026 - 2028 MedicineOneServices | All rights reserved. Our content is for informational purposes only.</p>
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// }


import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../styles/term_conditions.css';

export default function Terms_Conditions() {
  const navigate = useNavigate();
  const medicineSectionRef = useRef(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Medicines");
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

  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct");
      const result = await response.json();
      
      const dataArray = result.lsTmedicines || result.lstmedicines || result.data || (Array.isArray(result) ? result : []);
       
      const uniqueMedsMap = new Map();
      dataArray.forEach((item) => {
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
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (medicineSectionRef.current) {
      medicineSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCartClick = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please login first to view your cart!',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Login Now',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  const filteredMeds = medicines.filter((m, index) => {
    const matchesSearch = (m?.name || "").toLowerCase().includes(search.toLowerCase());
    if (selectedCategory === "Medicines") return matchesSearch; 

    const textToCheck = `${m?.name || ""} ${m?.manufacturer || ""} ${m?.type || ""} ${m?.category || ""}`.toLowerCase();
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

    let matchesCategory = false;
    if (matchedCategory) {
      matchesCategory = (matchedCategory === selectedCategory);
    } else {
      const nonMedicineCategories = categories.filter(c => c !== "Medicines");
      const assignedCategory = nonMedicineCategories[index % nonMedicineCategories.length];
      matchesCategory = (assignedCategory === selectedCategory);
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="terms-conditions-page min-vh-100 bg-light" style={{ paddingTop: "145px" }}>
      
      {/* ----------------- COMPLETE FIXED HEADER & NAVIGATION BAR ----------------- */}
      <div className="bg-white border-bottom shadow-sm fixed-top" style={{ top: "0" }}>
        
        {/* Main Header (Logo, Search, Download App, Login, Cart) */}
        <div className="container py-2">
          <div className="d-flex align-items-center justify-content-between gap-3">
            
            {/* Logo */}
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <span className="fs-4 fw-bold text-primary">MedicineOneServices</span>
            </Link>

            {/* Deliver to & Search Bar */}
            <div className="d-flex align-items-center flex-grow-1 mx-3" style={{ maxWidth: "700px" }}>
              <div className="input-group border rounded-pill overflow-hidden bg-white shadow-sm">
                <button className="btn btn-outline-secondary border-0 text-muted px-3 d-none d-md-flex align-items-center gap-1 bg-light" type="button">
                  📍 Deliver to <span className="text-dark fw-bold">▼</span>
                </button>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-control border-0 shadow-none py-2 px-3" 
                  placeholder={`Search in ${selectedCategory}...`} 
                />
                <button className="btn btn-primary px-4 rounded-pill m-1" type="button">
                  Search
                </button>
              </div>
            </div>

            {/* Right Action Links */}
            <div className="d-flex align-items-center gap-4 text-nowrap">
              <Link to="/download-app" className="text-decoration-none text-dark fw-medium small d-none d-lg-block">Download App</Link>
              <Link to="/login" className="text-decoration-none text-primary fw-semibold">Login / Signup</Link>
              <div onClick={handleCartClick} className="text-decoration-none text-dark d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
                🛒 <span className="fw-medium">Cart</span> <span className="badge bg-primary rounded-pill">{cartItems.length}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Sub-Menu Bar */}
        <div className="border-top bg-white py-2">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between overflow-auto py-1 no-scrollbar" style={{ whiteSpace: "nowrap", gap: "30px" }}>
              {categories.map((cat, index) => (
                <span 
                  key={index}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-decoration-none small fw-medium ${selectedCategory === cat ? "text-primary fw-bold border-bottom border-primary border-2 pb-1" : "text-secondary"}`}
                  style={{ cursor: "pointer" }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ----------------- DYNAMIC PRODUCTS / MEDICINES SECTION ----------------- */}
      <div className="container mb-4 pt-2" ref={medicineSectionRef}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-dark mb-0">{selectedCategory} Products ({filteredMeds.length})</h4>
          {selectedCategory !== "Medicines" && (
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedCategory("Medicines")}>Show All</button>
          )}
        </div>
        
        <div className="row g-3">
          {loading ? (
            <div className="text-center py-4 w-100"><div className="spinner-border text-primary"></div></div>
          ) : filteredMeds.length > 0 ? (
            filteredMeds.map((med) => (
              <div className="col-6 col-md-4 col-lg-3" key={med.id || med._id || med.name}> 
                <div className="card h-100 border-0 shadow-sm p-3 bg-white rounded-3">
                   <span className="badge bg-light text-dark mb-2 align-self-start" style={{ fontSize: "0.7rem" }}>
                     {selectedCategory}
                   </span>
                   <h6 className="fw-bold text-dark text-truncate">{med.name}</h6>
                   <p className="small text-muted mb-1">MFG: {med.manufacturer || med.type || "Generic"}</p>
                   <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                    <span className="text-success fw-bold">₹{med.unitPrice || med.price || 0}</span>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setCartItems([...cartItems, med])}>Add</button>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 w-100 bg-white rounded-3 shadow-sm p-4">
              <p className="text-muted mb-0">No items found matching "{selectedCategory}".</p>
            </div>
          )}
        </div>
      </div>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="container mb-5" style={{ marginTop: "20px" }}>
        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
          <h2 className="terms-title mb-4 fw-bold text-dark">Terms And Conditions</h2>
          
          <p className="terms-text text-secondary" style={{ lineHeight: "1.8" }}>
            MedicineOneServices Private Limited is in the process of implementing certain business related changes and until the said changes are fully implemented, MedicineOneServices Private Limited’s products and services may be provided to you at the location chosen by you, either by MedicineOneServices Private Limited or by its wholly owned subsidiary i.e. ANKW Pharma Retail Private Limited.
          </p>

          <p className="terms-text mt-3 text-secondary" style={{ lineHeight: "1.8" }}>
            By agreeing to the aforesaid, the Terms & Conditions of MedicineOneServices Private Limited and ANKW Pharma Retail Private Limited will apply accordingly.
          </p>

          <div className="link-box mt-4 p-3 bg-light rounded-3 border">
            <p className="mb-2">
              <strong>ISPL:</strong>{" "}
              <a href="#ispl" className="text-primary text-decoration-none ms-1">
                https://www.medicineoneservices.in/legal/ispl/terms-and-conditions
              </a>
            </p>
            <p className="mb-0">
              <strong>ANKW:</strong>{" "}
              <a href="#ankw" className="text-primary text-decoration-none ms-1">
                https://www.medicineoneservices.in/legal/ankw/terms-and-conditions
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ----------------- FOOTER SECTION AT THE BOTTOM ----------------- */}
      <div className="terms-footer-section bg-white pt-5 pb-3 border-top mt-5">
        <div className="container">
          <div className="row g-4 mb-4">
            
            {/* Company Links */}
            <div className="col-6 col-md-3">
              <h5 className="fw-bold mb-3 text-dark">Company</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/abouts" className="text-decoration-none text-muted">About Us</Link></li>
                <li className="mb-2"><Link to="/health-article" className="text-decoration-none text-muted">Health Article</Link></li>
                <li className="mb-2"><Link to="/health-stories" className="text-decoration-none text-muted">Health Stories</Link></li>
                <li className="mb-2"><Link to="/health-library" className="text-decoration-none text-muted">Health Library</Link></li>
                <li className="mb-2"><Link to="/diseases" className="text-decoration-none text-muted">Diseases & Health Conditions</Link></li>
                <li className="mb-2"><Link to="/ayurveda" className="text-decoration-none text-muted">Ayurveda</Link></li>
                <li className="mb-2"><Link to="/understanding-generic-medicines" className="text-decoration-none text-muted">Understanding Generic Medicines</Link></li>
                <li className="mb-2"><Link to="/header" className="text-decoration-none text-muted">All Medicines</Link></li>
                <li className="mb-2"><Link to="/all-brands" className="text-decoration-none text-muted">All Brands</Link></li>
                <li className="mb-2"><Link to="/need-help" className="text-decoration-none text-muted">Need Help</Link></li>
                <li className="mb-2"><Link to="/faq" className="text-decoration-none text-muted">FAQ</Link></li>
                <li className="mb-2"><Link to="/security" className="text-decoration-none text-muted">Security</Link></li>
                <li className="mb-2"><Link to="/savings-calculator" className="text-decoration-none text-muted">Savings Calculator</Link></li>
                <li className="mb-2"><Link to="/advertise-with-us" className="text-decoration-none text-muted">Advertise with Us</Link></li>
              </ul>
            </div>

            {/* Social & Legal Links */}
            <div className="col-6 col-md-3">
              <h5 className="fw-bold mb-3 text-dark">Social</h5>
              <div className="d-flex gap-3 mb-4 text-primary">
                <span className="fs-4" style={{ cursor: "pointer" }}>📷</span>
                <span className="fs-4" style={{ cursor: "pointer" }}>📘</span>
                <span className="fs-4" style={{ cursor: "pointer" }}>▶️</span>
                <span className="fs-4" style={{ cursor: "pointer" }}>🔗</span>
              </div>

              <h5 className="fw-bold mb-3 text-dark">Legal</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/termconditions" className="text-decoration-none text-muted">Terms & Conditions</Link></li>
                <li className="mb-2"><Link to="/privacy" className="text-decoration-none text-muted">Privacy Policy</Link></li>
                <li className="mb-2"><Link to="/editorial-policy" className="text-decoration-none text-muted">Editorial Policy</Link></li>
                <li className="mb-2"><Link to="/returns" className="text-decoration-none text-muted">Returns & Cancellations</Link></li>
                <li className="mb-2"><Link to="/lowest-price-guarantee" className="text-decoration-none text-muted">Lowest Price Guarantee T&C</Link></li>
              </ul>
            </div>

            {/* Subscribe & Registered Office Address */}
            <div className="col-md-3">
              <h5 className="fw-bold mb-3 text-dark">Subscribe</h5>
              <p className="text-muted small mb-3">Claim your complimentary health and fitness tips subscription and stay updated on our newest promotions.</p>
              <div className="input-group mb-4">
                <input type="email" className="form-control" placeholder="Enter your email ID" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>

              <h5 className="fw-bold mb-2 text-dark">Registered Office Address</h5>
              <p className="text-muted small mb-1 fw-semibold">MedicineOneServices Private Limited</p>
              <p className="text-muted small mb-2" style={{ lineHeight: "1.5" }}>
                JS ROOP HOMES ,NEAR BY VIHAN HERITAGE SECTOR -1 GREATER NOIDA EXTENSION ,PINCODE- 201318
              </p>
              <p className="text-muted small mb-1"><strong>CIN:</strong> 0000000</p>
              <p className="text-muted small mb-3"><strong>Telephone:</strong> <span className="text-primary">8409844260</span></p>

              <h5 className="fw-bold mb-2 text-dark">Grievance Officer</h5>
              <p className="text-muted small mb-1"><strong>Name:</strong> Gautam Dev</p>
              <p className="text-muted small mb-0"><strong>Email:</strong> <a href="mailto:grievance-customersupports01@gmail.com" className="text-decoration-none">grievance-customersupports01@gmail.com</a></p>
            </div>

            {/* Download App & Contact Us */}
            <div className="col-md-3">
              <h5 className="fw-bold mb-3 text-dark">Download MedicineOneServices</h5>
              <p className="text-muted small mb-3">
                Manage your health with ease Download MedicineOneServices today! Get easy access to medicine refills, health information, and more.
              </p>
              <div className="d-flex flex-column gap-2 mb-4">
                <span className="badge bg-dark p-2 text-start" style={{ width: "140px", cursor: "pointer" }}>Get it on Google Play</span>
                <span className="badge bg-dark p-2 text-start" style={{ width: "140px", cursor: "pointer" }}>Download on App Store</span>
              </div>

              <h5 className="fw-bold mb-2 text-dark">Contact Us</h5>
              <p className="text-muted small mb-2">Our customer representative team is available 7 days a week from 8:00 am - 10:00 pm.</p>
              <p className="text-muted small mb-1"><strong>Email:</strong> customersupports01@gmail.com</p>
              <p className="text-muted small mb-1"><strong>Helpline:</strong> <span className="text-primary">8409844260</span></p>
              <p className="text-muted small mb-0">v4.28.10</p>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="border-top pt-3 text-center text-muted small">
            <p className="mb-0">2026 - 2028 MedicineOneServices | All rights reserved. Our content is for informational purposes only.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
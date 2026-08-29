// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2"; 
// import "../styles/headers.css";
// import "../styles/noscroll.css";

// export default function Header() {
//   const navigate = useNavigate();
//   const medicineSectionRef = useRef(null);
   
//   const [adminOpen, setAdminOpen] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [isSticky, setIsSticky] = useState(false);
   
//   // Selected Category state
//   const [selectedCategory, setSelectedCategory] = useState("Medicines");
   
//   const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
   
//   // Team Hiring Toggle state (controlled by Admin preference saved in localStorage)
//   const [isHiringActive, setIsHiringActive] = useState(() => {
//     const saved = localStorage.getItem("isHiringActive");
//     if (saved !== null) return JSON.parse(saved);
//     return localStorage.getItem("hiringStatus") !== "OFF";
//   });
   
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const slides = [
//     { id: 1, img: "/uploadimage/capsule_image_scoll.jpg", alt: "Lowest Price Guaranteed" },
//     { id: 2, img: "/uploadimage/image.png", alt: "Up to 20% Off" },
//     { id: 3, img: "/uploadimage/pexels-pixabay-159211.jpg", alt: "Exclusive Launch" },
//     { id: 4, img: "/uploadimage/stock-vector-various-meds-pills-capsules-blisters-glass-bottles-with-liquid-medicine-plastic-tubes-with-1409823341.jpg", alt: "₹500 Cashback" },
//   ];

//   const [location, setLocation] = useState({ 
//     city: "Ghaziabad", 
//     pincode: "201011", 
//     stateName: "Uttar Pradesh" 
//   });
   
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [cartItems, setCartItems] = useState(() => {
//     const saved = localStorage.getItem("cart");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const categories = [
//     "Medicines", "Personal Care", "Health Conditions", 
//     "Vitamins & Supplements", "Diabetes Care", 
//     "Healthcare Devices", "Homeopathic Medicine", "Health Guide"
//   ];

//   // Candidate Application Form Modal
//   const openCandidateApplicationForm = (defaultJobTitle = '', defaultJobId = 0) => {
//     Swal.fire({
//       title: '<span style="color: #fff;">Candidate Job Application</span>',
//       html: `
//         <form id="candidate-apply-form" style="text-align: left; color: #b1b1c0; font-size: 13px;">
//           <div class="alert alert-success py-2 mb-3" style="font-size: 13px; background-color: #1e3a2f; border-color: #198754; color: #d1e7dd;">
//             <strong>Applying for Position:</strong> <span id="display-selected-job" class="text-white fw-bold">${defaultJobTitle || 'Not Selected'}</span>
//           </div>

//           <input type="hidden" id="swal-jobid" value="${defaultJobId}" />
//           <input type="hidden" id="swal-jobtitle" value="${defaultJobTitle}" />
           
//           <div class="mb-2">
//             <label style="color: #fff;">Full Name *</label>
//             <input type="text" id="swal-fullname" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="Enter full name" />
//           </div>
//           <div class="mb-2">
//             <label style="color: #fff;">Email Address *</label>
//             <input type="email" id="swal-email" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="Enter email address" />
//           </div>
//           <div class="mb-2">
//             <label style="color: #fff;">Phone Number *</label>
//             <input type="text" id="swal-phone" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="Enter phone number" />
//           </div>
//           <div class="mb-2">
//             <label style="color: #fff;">Upload Resume (PDF only) *</label>
//             <input type="file" id="swal-resumefile" accept="application/pdf" class="form-control form-control-sm bg-dark text-white border-secondary" required />
//           </div>
//           <div class="row">
//             <div class="col-6 mb-2">
//               <label style="color: #fff;">Current CTC *</label>
//               <input type="number" id="swal-currentctc" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="e.g. 500000" />
//             </div>
//             <div class="col-6 mb-2">
//               <label style="color: #fff;">Expected CTC *</label>
//               <input type="number" id="swal-expectedctc" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="e.g. 700000" />
//             </div>
//           </div>
//           <div class="mb-2">
//             <label style="color: #fff;">Notice Period *</label>
//             <input type="text" id="swal-noticeperiod" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="e.g. Immediate / 30 Days" />
//           </div>
//         </form>
//       `,
//       background: '#16161a',
//       confirmButtonColor: '#198754',
//       confirmButtonText: 'Submit Application',
//       showCancelButton: true,
//       cancelButtonColor: '#d33',
//       preConfirm: () => {
//         const jobId = Number(document.getElementById('swal-jobid').value) || 0;
//         const fullName = document.getElementById('swal-fullname').value;
//         const email = document.getElementById('swal-email').value;
//         const phoneNo = document.getElementById('swal-phone').value;
//         const resumeFile = document.getElementById('swal-resumefile').files[0];
//         const currentCTC = Number(document.getElementById('swal-currentctc').value) || 0;
//         const expectedCTC = Number(document.getElementById('swal-expectedctc').value) || 0;
//         const noticePeriod = document.getElementById('swal-noticeperiod').value;

//         if (!fullName || !email || !phoneNo || !resumeFile || !noticePeriod) {
//           Swal.showValidationMessage('Please fill out all required fields and upload your PDF resume!');
//           return false;
//         }

//         return {
//           id: 0,
//           jobId: jobId,
//           fullName: fullName,
//           email: email,
//           phoneNo: phoneNo,
//           resumeUrl: resumeFile.name,
//           currentCTC: currentCTC,
//           expectedCTC: expectedCTC,
//           noticePeriod: noticePeriod,
//           status: 'Applied',
//           appliedDate: new Date().toISOString()
//         };
//       }
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const response = await fetch("https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/apply-job", {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(result.value)
//           });

//           if (response.ok || response.status === 200 || response.status === 201) {
//             Swal.fire({
//               icon: 'success',
//               title: 'Hiring Applied',
//               text: 'We have received your application successfully.',
//               background: '#16161a',
//               color: '#fff',
//               confirmButtonColor: '#198754'
//             });
//           } else {
//             throw new Error('Server returned error');
//           }
//         } catch (err) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Hiring Applied',
//             text: 'Your application has been successfully recorded.',
//             background: '#16161a',
//             color: '#fff',
//             confirmButtonColor: '#198754'
//           });
//         }
//       }
//     });
//   };

//   // Trigger Hiring Popup showing open positions with complete date checks
//   const triggerHiringPopup = useCallback(() => {
//     Swal.fire({
//       title: '<span style="color: #fff;">We Are Hiring! Join Our Team</span>',
//       html: `
//         <div style="text-align: left; color: #b1b1c0; font-size: 14px; line-height: 1.6; max-height: 280px; overflow-y: auto;">
//           <p class="text-success fw-bold mb-2">Explore exciting career opportunities at AKMedizostore:</p>
//           <hr style="border-color: #2d2d37;" />
//           <div id="popup-job-list">
//             <div class="text-center py-2 text-white">Loading open positions...</div>
//           </div>
//           <input type="hidden" id="swal-jobid" value="" />
//           <input type="hidden" id="swal-jobtitle" value="" />
//         </div>
//       `,
//       width: '600px',
//       background: '#16161a',
//       confirmButtonColor: '#198754',
//       confirmButtonText: 'Apply Now',
//       showCancelButton: true,
//       cancelButtonText: 'Close',
//       cancelButtonColor: '#6c757d',
//       didOpen: () => {
//         const confirmBtn = Swal.getConfirmButton();
//         if (confirmBtn) {
//           confirmBtn.disabled = true;
//           confirmBtn.style.opacity = '0.5';
//           confirmBtn.style.cursor = 'not-allowed';
//         }

//         const container = Swal.getPopup().querySelector('#popup-job-list');
//         const jobIdInput = document.getElementById('swal-jobid');
//         const jobTitleInput = document.getElementById('swal-jobtitle');
         
//         if(jobIdInput) jobIdInput.value = "";
//         if(jobTitleInput) jobTitleInput.value = "";

//         if (container) {
//           fetch("https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/get-all-jobs")
//             .then(res => res.json())
//             .then(data => {
//               const jobList = Array.isArray(data) ? data : (data.data || data.jobs || []);
               
//               const currentDate = new Date();
//               currentDate.setHours(0, 0, 0, 0);

//               const uniqueJobsMap = new Map();
//               jobList.forEach(j => {
//                 const rawDate = j.closingDate || j.closeDate || j.lastDate || j.expiryDate || j.deadline || j.validTill || j.endDate || j.date;
                 
//                 if (rawDate) {
//                   const jobLastDate = new Date(rawDate);
//                   jobLastDate.setHours(0, 0, 0, 0);
                   
//                   if (!isNaN(jobLastDate.getTime())) {
//                     const removeDate = new Date(jobLastDate);
//                     removeDate.setDate(removeDate.getDate() + 1);

//                     if (currentDate >= removeDate) {
//                       return; // Skip expired job
//                     }
//                   }
//                 }

//                 const title = (j.jobTitle || j.title || "").trim().toLowerCase();
//                 if (title && !uniqueJobsMap.has(title)) {
//                   uniqueJobsMap.set(title, j);
//                 }
//               });
//               const filteredJobList = Array.from(uniqueJobsMap.values());

//               if (filteredJobList.length === 0) {
//                 container.innerHTML = '<p class="text-white-50 small">No active job openings right now.</p>';
//               } else {
//                 container.innerHTML = filteredJobList.map(j => {
//                   const rawDate = j.closingDate || j.closeDate || j.lastDate || j.expiryDate || j.deadline || j.validTill || j.endDate || j.date;
//                   const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

//                   return `
//                     <div class="popup-job-card" data-jobid="${j.id || j.jobId || 0}" data-title="${j.jobTitle || j.title}" style="background: #1e1e24; border: 1px solid #2d2d37; padding: 12px; border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: 0.2s;">
//                       <div style="color: #198754; font-weight: bold; font-size: 15px;">${j.jobTitle || j.title}</div>
//                       <div style="font-size: 12px; color: #fff; margin-top: 2px;">Department: ${j.department || 'N/A'} | Openings: ${j.noOfOpenings || j.openings || 0}</div>
//                       <div style="font-size: 12px; color: #8a8a98;">Package: ₹${j.offeredCTC || j.offeredPackage || 'As per industry standards'}</div>
//                       <div style="font-size: 12px; color: #b1b1c0; margin-top: 4px;"><strong>Description:</strong> ${j.description || j.jobDescription || 'No description provided.'}</div>
//                       <div style="font-size: 12px; color: #17a2b8; margin-top: 3px;"><strong>Company Mail:</strong> ${j.companyEmail || j.email || 'customersupports01@gmail.com'}</div>
//                       <div style="font-size: 12px; color: #ffc107; margin-top: 3px;"><strong>Closing Date:</strong> ${formattedDate}</div>
//                     </div>
//                   `;
//                 }).join('');

//                 container.querySelectorAll('.popup-job-card').forEach(card => {
//                   card.addEventListener('click', () => {
//                     container.querySelectorAll('.popup-job-card').forEach(c => c.style.borderColor = '#2d2d37');
//                     card.style.borderColor = '#198754';
//                     const selectedTitle = card.getAttribute('data-title');
//                     const selectedJobId = card.getAttribute('data-jobid');
                     
//                     if(jobTitleInput) jobTitleInput.value = selectedTitle;
//                     if(jobIdInput) jobIdInput.value = selectedJobId;

//                     if (confirmBtn) {
//                       confirmBtn.disabled = false;
//                       confirmBtn.style.opacity = '1';
//                       confirmBtn.style.cursor = 'pointer';
//                     }
//                   });
//                 });
//               }
//             }).catch(() => {
//               container.innerHTML = '<p class="text-danger small">Could not load job openings.</p>';
//             });
//         }
//       },
//       preConfirm: () => {
//         const selectedJobId = document.getElementById('swal-jobid')?.value;
//         if (!selectedJobId || selectedJobId === "") {
//           Swal.showValidationMessage('Please select a job position first before clicking Apply Now!');
//           return false;
//         }
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const selectedTitle = document.getElementById('swal-jobtitle')?.value || '';
//         const selectedJobId = Number(document.getElementById('swal-jobid')?.value) || 0;
//         openCandidateApplicationForm(selectedTitle, selectedJobId);
//       }
//     });
//   }, []);

//   // Open popup on mount if hiring is active
//   useEffect(() => {
//     if (isHiringActive) {
//       triggerHiringPopup();
//     }
//   }, [isHiringActive, triggerHiringPopup]);

//   const filteredMeds = medicines.filter((m, index) => {
//     const matchesSearch = (m?.name || "").toLowerCase().includes(search.toLowerCase());
//     if (selectedCategory === "Medicines") return matchesSearch; 

//     const textToCheck = `${m?.name || ""} ${m?.manufacturer || ""} ${m?.type || ""} ${m?.category || ""}`.toLowerCase();
//     let matchedCategory = "";
//     if (textToCheck.includes("toothbrush") || textToCheck.includes("toothpaste") || textToCheck.includes("soap") || textToCheck.includes("shampoo") || textToCheck.includes("cream") || textToCheck.includes("skin") || textToCheck.includes("personal")) {
//       matchedCategory = "Personal Care";
//     } else if (textToCheck.includes("vitamin") || textToCheck.includes("supplement") || textToCheck.includes("protein") || textToCheck.includes("calcium") || textToCheck.includes("multivitamin")) {
//       matchedCategory = "Vitamins & Supplements";
//     } else if (textToCheck.includes("diabetes") || textToCheck.includes("insulin") || textToCheck.includes("sugar") || textToCheck.includes("glucometer") || textToCheck.includes("metformin")) {
//       matchedCategory = "Diabetes Care";
//     } else if (textToCheck.includes("device") || textToCheck.includes("oximeter") || textToCheck.includes("bp") || textToCheck.includes("thermometer") || textToCheck.includes("monitor")) {
//       matchedCategory = "Healthcare Devices";
//     } else if (textToCheck.includes("homeo") || textToCheck.includes("dilution") || textToCheck.includes("drop")) {
//       matchedCategory = "Homeopathic Medicine";
//     } else if (textToCheck.includes("pain") || textToCheck.includes("fever") || textToCheck.includes("cold") || textToCheck.includes("cough") || textToCheck.includes("infection") || textToCheck.includes("amlodipine") || textToCheck.includes("telmisartan") || textToCheck.includes("atorvastatin") || textToCheck.includes("paracetamol")) {
//       matchedCategory = "Health Conditions";
//     } else if (textToCheck.includes("guide") || textToCheck.includes("book") || textToCheck.includes("chart")) {
//       matchedCategory = "Health Guide";
//     }

//     let matchesCategory = false;
//     if (matchedCategory) {
//       matchesCategory = (matchedCategory === selectedCategory);
//     } else {
//       const nonMedicineCategories = categories.filter(c => c !== "Medicines");
//       const assignedCategory = nonMedicineCategories[index % nonMedicineCategories.length];
//       matchesCategory = (assignedCategory === selectedCategory);
//     }

//     return matchesSearch && matchesCategory;
//   });

//   const handleCartClick = () => {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Login Required',
//       text: 'Please login first to view your cart.!',
//       confirmButtonColor: '#28a745',
//       confirmButtonText: 'Login Now',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         navigate("/login");
//       }
//     });
//   };

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category); 
//     if (medicineSectionRef.current) {
//       medicineSectionRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const nextSlide = useCallback(() => {
//     setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   }, [slides.length]);

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//   };

//   useEffect(() => {
//     const slideInterval = setInterval(nextSlide, 5000);
//     return () => clearInterval(slideInterval);
//   }, [nextSlide]);

//   const fetchMedicines = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("https://ecommerencesite.onrender.com/api/MEDICINE/AllListMedicineProduct");
//       const result = await response.json();
//       const dataArray = result.lsTmedicines || result.lstmedicines || [];
       
//       const uniqueMedsMap = new Map();
//       (Array.isArray(dataArray) ? dataArray : []).forEach((item) => {
//         if (item && item.name) {
//           const normalizedName = item.name.trim().toLowerCase();
//           if (!uniqueMedsMap.has(normalizedName)) {
//             uniqueMedsMap.set(normalizedName, item);
//           }
//         }
//       });

//       setMedicines(Array.from(uniqueMedsMap.values()));
//     } catch (error) {
//       console.error("Error fetching medicines:", error);
//       setMedicines([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setIsSticky(window.scrollY > 120);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   useEffect(() => {
//     fetchMedicines();
//     const status = localStorage.getItem("shopStatus");
//     setIsShopOpen(status !== "OFF");
 
//     const hiringStatus = localStorage.getItem("isHiringActive");
//     const legacyHiring = localStorage.getItem("hiringStatus");
//     const active = hiringStatus !== null ? JSON.parse(hiringStatus) : (legacyHiring !== "OFF");
//     setIsHiringActive(active);
//   }, [fetchMedicines]);

//   const handlePincodeChange = async (e) => {
//     const pin = e.target.value.replace(/\D/g, "");
//     if (pin.length <= 6) setLocation((prev) => ({ ...prev, pincode: pin }));
//     if (pin.length === 6) {
//       try {
//         const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
//         const data = await res.json();
//         if (data[0]?.Status === "Success") {
//           const postOffice = data[0].PostOffice[0];
//           setLocation({ pincode: pin, city: postOffice.District, stateName: postOffice.State });
//         }
//       } catch (err) { console.error("Pincode API Error:", err); }
//     }
//   };

//   if (!isShopOpen) {
//     return (
//       <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
//         <div className="card shadow-lg p-5 text-center border-0" style={{ maxWidth: "500px", borderRadius: "20px" }}>
//           <img src="https://cdn-icons-png.flaticon.com/512/3661/3661841.png" width="100" alt="Closed" className="mb-4 mx-auto" />
//           <h1 className="fw-bold text-danger">Shop is Closed</h1>
//           <p className="text-muted fs-5">We will be back soon.!..</p>
//           <hr />
//           <Link to="/adminlogin" className="btn btn-outline-secondary btn-sm">Admin Portal</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* SIDEBAR */}
//       <div className={`side-menu bg-white shadow ${sidebarOpen ? "open" : ""}`} style={{ position: "fixed", top: 0, left: sidebarOpen ? 0 : "-300px", width: "280px", height: "100%", zIndex: 3000, transition: "0.3s ease" }}>
//         <div className="p-4">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h5 className="fw-bold mb-0">AKMedizostore</h5>
//             <button className="btn-close" onClick={() => setSidebarOpen(false)}></button>
//           </div>
//           <ul className="nav flex-column gap-2">
//             <li className="nav-item border-bottom pb-2"><Link to="/" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Home</Link></li>
//             <li className="nav-item border-bottom pb-2"><Link to="/contact" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Contact Us</Link></li>
//             <li className="nav-item border-bottom pb-2"><Link to="/customerticketraised" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Add Ticket Raised </Link></li>
//           </ul>
//         </div>
//       </div>
//       {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2500 }}></div>}

//       {/* NAVBAR */}
//       <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm px-0 flex-column align-items-stretch" style={{ zIndex: 2000 }}>
//         <div className="d-flex align-items-center px-3 py-2 w-100">
//             <button className="btn border-0 me-2" onClick={() => setSidebarOpen(true)}><i className="fas fa-bars fa-lg"></i></button>
//             <Link to="/" className="navbar-brand d-flex align-items-center"><img src="/AKMedizostore.png" width="34" alt="logo" /><span className="ms-2 fw-bold">AKMedizostore</span></Link>
//             <div className="ms-auto d-flex gap-3 align-items-center">
//               <Link to="/medicinechartai" className="text-decoration-none">
//                 <div className="cart-icon position-relative">
//                     <i className="fa-solid fa-headset"></i>
//                 </div>
//               </Link>
         
//               <div onClick={() => setAdminOpen(!adminOpen)} style={{ cursor: "pointer" }} className="position-relative">
//                 <i className="fas fa-user-circle fa-2x text-secondary"></i>
//                 {adminOpen && (
//                   <div className="admin-dropdown bg-white border shadow p-2 position-absolute" style={{ right: 0, top: "45px", zIndex: 1000, borderRadius: "8px", minWidth: "160px" }}>
//                     <Link to="/login" className="d-block p-2 text-decoration-none text-dark">Customer Login</Link>
//                     <Link to="/adminlogin" className="btn btn-success btn-sm w-100 mt-2">Admin Login</Link>
//                   </div>
//                 )}
//               </div>
//               <div className="cart-icon position-relative" style={{ cursor: "pointer" }} onClick={handleCartClick}>
//                 <span style={{ fontSize: "1.5rem" }}>🛒</span>
//                 <span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill">{cartItems.length}</span>
//               </div>
//             </div>
//         </div>
//         <div className="border-top overflow-hidden">
//           <div className="category-bar d-flex justify-content-center align-items-center overflow-auto py-2 gap-4 no-scrollbar" style={{ whiteSpace: "nowrap" }}>
//             {categories.map((cat, index) => (
//               <span key={index} 
//                 className={`category-item ${selectedCategory === cat ? "text-primary fw-bold" : "text-muted fw-medium"}`} 
//                 style={{ cursor: "pointer", fontSize: "0.85rem" }}
//                 onClick={() => handleCategoryClick(cat)}> 
//                 {cat}
//               </span>
//             ))}
//           </div>
//         </div>
//       </nav>

//       {/* HERO & SEARCH */}
//       <div style={{marginTop: "105px"}}>
//         <section className={`hero-section text-center ${isSticky ? "sticky-active" : ""}`}>
//           <div className="hero-overlay"></div>
//           <div className={`hero-content position-relative ${isSticky ? "d-none" : ""}`}>
//             <h2 className="fw-bold text-white pt-5">Say Goodbye to high medicine prices</h2>
//             <p className="text-white-50 small mb-4">Compare prices and save up to 51% on medicines</p>
//           </div>

//           <div className={`container search-wrapper position-relative ${isSticky ? "sticky-search-container" : ""}`}>
//             <div className="input-group search-bar-group shadow-lg">
//               <span className="input-group-text bg-white border-end-0 location-part flex-column align-items-start py-1">
//                 <div className="d-flex align-items-center">
//                   <i className="fas fa-map-marker-alt text-primary me-2"></i>
//                   <span className="deliver-label text-primary fw-bold" style={{fontSize: "0.75rem"}}>Deliver to</span>
//                   <input type="text" value={location.pincode} onChange={handlePincodeChange} className="pincode-input fw-bold ms-1" style={{width: "60px", border: "none", outline: "none"}} />
//                 </div>
//                 <div className="text-muted truncate-text" style={{fontSize: "0.65rem", marginLeft: "25px", textAlign: "left", width: "100%"}}>
//                   {location.city}, {location.stateName}
//                 </div>
//               </span>
//               <input type="text" value={search} className="form-control border-start-0 py-3 ps-4 main-search-input" placeholder={`Search in ${selectedCategory}...`} onChange={(e) => setSearch(e.target.value)} />
//               <button className="btn btn-primary px-4 search-btn"><i className="fas fa-search me-2"></i><span className="fw-bold">Search</span></button>
//             </div>
//           </div>

//           <div className="container mt-5">
//             <hr className="mb-4" />
//             <div className="slider-viewport rounded-3 shadow-sm position-relative overflow-hidden">
//               <div className="slider-wrapper d-flex" style={{ transform: `translateX(-${currentSlide * 100}%)`, transition: "0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}>
//                 {slides.map((slide) => (
//                   <div className="slide-item flex-shrink-0 w-100" key={slide.id}>
//                     <img src={slide.img} alt={slide.alt} className="img-fluid w-100 d-block" style={{ height: "280px", objectFit: "cover" }} />
//                   </div>
//                 ))}
//               </div>
//               <div className="slider-controls">
//                 <button className="slider-arrow prev" onClick={prevSlide}>❮</button>
//                 <button className="slider-arrow next" onClick={nextSlide}>❯</button>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* MEDICINE LIST */}
//         <div className="container mb-5 pt-4" ref={medicineSectionRef}>
//           <h4 className="fw-bold mb-4">{selectedCategory} Items ({filteredMeds.length})</h4>
//           <div className="row g-3">
//             {loading ? (
//               <div className="text-center py-5 w-100"><div className="spinner-border text-primary"></div></div>
//             ) : filteredMeds.length > 0 ? (
//               filteredMeds.map((med) => (
//                 <div className="col-6 col-md-4 col-lg-3" key={med.id || med._id || med.name}> 
//                   <div className="card h-100 border-0 shadow-sm p-3">
//                      <span className="badge bg-light text-dark mb-2 align-self-start" style={{ fontSize: "0.7rem" }}>
//                        {selectedCategory}
//                      </span>
//                      <h6 className="fw-bold">{med.name}</h6>
//                      <p className="small text-muted mb-1">MFG: {med.manufacturer || med.type || "Generic"}</p>
//                      <div className="d-flex justify-content-between align-items-center mt-auto">
//                       <span className="text-success fw-bold">₹{med.unitPrice}</span>
//                       <button className="btn btn-outline-primary btn-sm" onClick={() => setCartItems([...cartItems, med])}>Add</button>
//                      </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-5 w-100">
//                 <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" width="80" alt="not found" className="mb-3" />
//                 <p className="text-muted">No items found for {selectedCategory}.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* PROFESSIONAL FOOTER (Truemeds Style) */}
//       <footer className="footer-section bg-light text-dark pt-5 pb-3 border-top mt-5" style={{ fontSize: "14px" }}>
//         <div className="container">
//           <div className="row g-4">
//             {/* Company Column */}
//             <div className="col-6 col-md-3">
//               <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Company</h6>
//               <ul className="list-unstyled d-flex flex-column gap-2">
//                 <li><Link to="/abouts" className="text-decoration-none text-muted">About Us</Link></li>
//                 <li><Link to="/health-article" className="text-decoration-none text-muted">Health Article</Link></li>
//                 <li><Link to="/health-stories" className="text-decoration-none text-muted">Health Stories</Link></li>
//                 <li><Link to="/health-library" className="text-decoration-none text-muted">Health Library</Link></li>
//                 <li><Link to="/diseases" className="text-decoration-none text-muted">Diseases & Health Conditions</Link></li>
//                 <li><Link to="/ayurveda" className="text-decoration-none text-muted">Ayurveda</Link></li>
//                 <li><Link to="/generic-medicines" className="text-decoration-none text-muted">Understanding Generic Medicines</Link></li>
//                 <li><Link to="/" className="text-decoration-none text-muted">All Medicines</Link></li>
//                 <li><Link to="/" className="text-decoration-none text-muted">All Brands</Link></li>
//                 <li><Link to="/contact" className="text-decoration-none text-muted">Need Help</Link></li>
//                 <li><Link to="/faq" className="text-decoration-none text-muted">FAQ</Link></li>
//                 <li><Link to="/security" className="text-decoration-none text-muted">Security</Link></li>
//                 <li><Link to="/savings-calculator" className="text-decoration-none text-muted">Savings Calculator</Link></li>
//                 <li><Link to="/advertise" className="text-decoration-none text-muted">Advertise with Us</Link></li>
//               </ul>
//             </div>

//             {/* Social & Legal Column */}
//             <div className="col-6 col-md-3">
//               <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Social</h6>
//               <div className="d-flex gap-3 mb-4 fs-5">
//                 <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary"><i className="fab fa-instagram"></i></a>
//                 <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-primary"><i className="fab fa-facebook-f"></i></a>
//                 <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-danger"><i className="fab fa-youtube"></i></a>
//                 <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-primary"><i className="fab fa-linkedin-in"></i></a>
//               </div>

//               <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Legal</h6>
//               <ul className="list-unstyled d-flex flex-column gap-2">
//                 <li><Link to="/terms" className="text-decoration-none text-muted">Terms & Conditions</Link></li>
//                 <li><Link to="/privacy" className="text-decoration-none text-muted">Privacy Policy</Link></li>
//                 <li><Link to="/editorial" className="text-decoration-none text-muted">Editorial Policy</Link></li>
//                 <li><Link to="/returns" className="text-decoration-none text-muted">Returns & Cancellations</Link></li>
//                 <li><Link to="/guarantee-tcs" className="text-decoration-none text-muted">Lowest Price Guarantee T&C</Link></li>
//               </ul>
//             </div>

//             {/* Subscribe & Office Address Column */}
//             <div className="col-md-3">
//               <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Subscribe</h6>
//               <p className="text-muted small mb-2">Claim your complimentary health and fitness tips subscription and stay updated on our newest promotions.</p>
//               <div className="input-group mb-4">
//                 <input type="email" className="form-control form-control-sm" placeholder="Enter your email ID" />
//                 <button className="btn btn-primary btn-sm px-3" type="button">Subscribe</button>
//               </div>

//               <h6 className="fw-bold mb-2 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Registered Office Address</h6>
//               <p className="text-muted small mb-1"><strong>AKMedizostore Solutions Private Limited</strong></p>
//               <p className="text-muted small mb-2">Unit-301 & 304, Lightbridge Tunga Village, Saki Vihar Rd, Chandivali, Powai, Mumbai, Maharashtra, India, 400072.</p>
//               <p className="text-muted small mb-1"><strong>CIN:</strong> U62099MH2019PTC320566</p>
//               <p className="text-muted small mb-3"><strong>Telephone:</strong> 09240250346</p>

//               <h6 className="fw-bold mb-1 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Grievance Officer</h6>
//               <p className="text-muted small mb-1"><strong>Name:</strong> Kishor Kumar</p>
//               <p className="text-muted small mb-0"><strong>Email:</strong> grievance-officer@akmedizostore.in</p>
//             </div>

//             {/* Download App & Contact Us Column */}
//             <div className="col-md-3">
//               <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Download AKMedizostore</h6>
//               <p className="text-muted small mb-3">Manage your health with ease Download AKMedizostore today! Get easy access to medicine refills, health information, and more. With our app, you'll never have to wait in line again. Download now and start taking control of your health.</p>
//               <div className="d-flex flex-column gap-2 mb-4">
//                 <a href="#download"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ width: "135px" }} /></a>
//                 <a href="#download"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" style={{ width: "135px" }} /></a>
//               </div>

//               <h6 className="fw-bold mb-2 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Contact Us</h6>
//               <p className="text-muted small mb-2">Our customer representative team is available 7 days a week from 8:00 am - 10:00 pm.</p>
//               <p className="text-muted small mb-1">support@akmedizostore.in</p>
//               <p className="text-muted small fw-bold">09240250346</p>
//               <p className="text-muted small text-end mt-3">v4.28.10</p>
//             </div>
//           </div>

//           <hr className="my-4" />
//           <div className="footer-bottom-bar text-center text-muted small">
//             © 2026-2028 - AK Medicine | All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }



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
   
  // Selected Category state
  const [selectedCategory, setSelectedCategory] = useState("Medicines");
   
  const [isShopOpen, setIsShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");
   
  // Team Hiring Toggle state (controlled by Admin preference saved in localStorage)
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

  // Candidate Application Form Modal
  const openCandidateApplicationForm = (defaultJobTitle = '', defaultJobId = 0) => {
    Swal.fire({
      title: '<span style="color: #fff;">Candidate Job Application</span>',
      html: `
        <form id="candidate-apply-form" style="text-align: left; color: #b1b1c0; font-size: 13px;">
          <div class="alert alert-success py-2 mb-3" style="font-size: 13px; background-color: #1e3a2f; border-color: #198754; color: #d1e7dd;">
            <strong>Applying for Position:</strong> <span id="display-selected-job" class="text-white fw-bold">${defaultJobTitle || 'Not Selected'}</span>
          </div>

          <input type="hidden" id="swal-jobid" value="${defaultJobId}" />
          <input type="hidden" id="swal-jobtitle" value="${defaultJobTitle}" />
           
          <div class="mb-2">
            <label style="color: #fff;">Full Name *</label>
            <input type="text" id="swal-fullname" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="Enter full name" />
          </div>
          <div class="mb-2">
            <label style="color: #fff;">Email Address *</label>
            <input type="email" id="swal-email" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="Enter email address" />
          </div>
          <div class="mb-2">
            <label style="color: #fff;">Phone Number *</label>
            <input type="text" id="swal-phone" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="Enter phone number" />
          </div>
          <div class="mb-2">
            <label style="color: #fff;">Upload Resume (PDF only) *</label>
            <input type="file" id="swal-resumefile" accept="application/pdf" class="form-control form-control-sm bg-dark text-white border-secondary" required />
          </div>
          <div class="row">
            <div class="col-6 mb-2">
              <label style="color: #fff;">Current CTC *</label>
              <input type="number" id="swal-currentctc" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="e.g. 500000" />
            </div>
            <div class="col-6 mb-2">
              <label style="color: #fff;">Expected CTC *</label>
              <input type="number" id="swal-expectedctc" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="e.g. 700000" />
            </div>
          </div>
          <div class="mb-2">
            <label style="color: #fff;">Notice Period *</label>
            <input type="text" id="swal-noticeperiod" class="form-control form-control-sm bg-dark text-white border-secondary" required placeholder="e.g. Immediate / 30 Days" />
          </div>
        </form>
      `,
      background: '#16161a',
      confirmButtonColor: '#198754',
      confirmButtonText: 'Submit Application',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const jobId = Number(document.getElementById('swal-jobid').value) || 0;
        const fullName = document.getElementById('swal-fullname').value;
        const email = document.getElementById('swal-email').value;
        const phoneNo = document.getElementById('swal-phone').value;
        const resumeFile = document.getElementById('swal-resumefile').files[0];
        const currentCTC = Number(document.getElementById('swal-currentctc').value) || 0;
        const expectedCTC = Number(document.getElementById('swal-expectedctc').value) || 0;
        const noticePeriod = document.getElementById('swal-noticeperiod').value;

        if (!fullName || !email || !phoneNo || !resumeFile || !noticePeriod) {
          Swal.showValidationMessage('Please fill out all required fields and upload your PDF resume!');
          return false;
        }

        return {
          id: 0,
          jobId: jobId,
          fullName: fullName,
          email: email,
          phoneNo: phoneNo,
          resumeUrl: resumeFile.name,
          currentCTC: currentCTC,
          expectedCTC: expectedCTC,
          noticePeriod: noticePeriod,
          status: 'Applied',
          appliedDate: new Date().toISOString()
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/apply-job", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.value)
          });

          if (response.ok || response.status === 200 || response.status === 201) {
            Swal.fire({
              icon: 'success',
              title: 'Hiring Applied',
              text: 'We have received your application successfully.',
              background: '#16161a',
              color: '#fff',
              confirmButtonColor: '#198754'
            });
          } else {
            throw new Error('Server returned error');
          }
        } catch (err) {
          Swal.fire({
            icon: 'success',
            title: 'Hiring Applied',
            text: 'Your application has been successfully recorded.',
            background: '#16161a',
            color: '#fff',
            confirmButtonColor: '#198754'
          });
        }
      }
    });
  };

  // Trigger Hiring Popup showing open positions with complete date checks
  const triggerHiringPopup = useCallback(() => {
    Swal.fire({
      title: '<span style="color: #fff;">We Are Hiring! Join Our Team</span>',
      html: `
        <div style="text-align: left; color: #b1b1c0; font-size: 14px; line-height: 1.6; max-height: 280px; overflow-y: auto;">
          <p class="text-success fw-bold mb-2">Explore exciting career opportunities at AKMedizostore:</p>
          <hr style="border-color: #2d2d37;" />
          <div id="popup-job-list">
            <div class="text-center py-2 text-white">Loading open positions...</div>
          </div>
          <input type="hidden" id="swal-jobid" value="" />
          <input type="hidden" id="swal-jobtitle" value="" />
        </div>
      `,
      width: '600px',
      background: '#16161a',
      confirmButtonColor: '#198754',
      confirmButtonText: 'Apply Now',
      showCancelButton: true,
      cancelButtonText: 'Close',
      cancelButtonColor: '#6c757d',
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) {
          confirmBtn.disabled = true;
          confirmBtn.style.opacity = '0.5';
          confirmBtn.style.cursor = 'not-allowed';
        }

        const container = Swal.getPopup().querySelector('#popup-job-list');
        const jobIdInput = document.getElementById('swal-jobid');
        const jobTitleInput = document.getElementById('swal-jobtitle');
         
        if(jobIdInput) jobIdInput.value = "";
        if(jobTitleInput) jobTitleInput.value = "";

        if (container) {
          fetch("https://ecommerencesite.onrender.com/api/Teamhiring_candidateapplyAPI/get-all-jobs")
            .then(res => res.json())
            .then(data => {
              const jobList = Array.isArray(data) ? data : (data.data || data.jobs || []);
               
              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0);

              const uniqueJobsMap = new Map();
              jobList.forEach(j => {
                const rawDate = j.closingDate || j.closeDate || j.lastDate || j.expiryDate || j.deadline || j.validTill || j.endDate || j.date;
                 
                if (rawDate) {
                  const jobLastDate = new Date(rawDate);
                  jobLastDate.setHours(0, 0, 0, 0);
                   
                  if (!isNaN(jobLastDate.getTime())) {
                    const removeDate = new Date(jobLastDate);
                    removeDate.setDate(removeDate.getDate() + 1);

                    if (currentDate >= removeDate) {
                      return; // Skip expired job
                    }
                  }
                }

                const title = (j.jobTitle || j.title || "").trim().toLowerCase();
                if (title && !uniqueJobsMap.has(title)) {
                  uniqueJobsMap.set(title, j);
                }
              });
              const filteredJobList = Array.from(uniqueJobsMap.values());

              if (filteredJobList.length === 0) {
                container.innerHTML = '<p class="text-white-50 small">No active job openings right now.</p>';
              } else {
                container.innerHTML = filteredJobList.map(j => {
                  const rawDate = j.closingDate || j.closeDate || j.lastDate || j.expiryDate || j.deadline || j.validTill || j.endDate || j.date;
                  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

                  return `
                    <div class="popup-job-card" data-jobid="${j.id || j.jobId || 0}" data-title="${j.jobTitle || j.title}" style="background: #1e1e24; border: 1px solid #2d2d37; padding: 12px; border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: 0.2s;">
                      <div style="color: #198754; font-weight: bold; font-size: 15px;">${j.jobTitle || j.title}</div>
                      <div style="font-size: 12px; color: #fff; margin-top: 2px;">Department: ${j.department || 'N/A'} | Openings: ${j.noOfOpenings || j.openings || 0}</div>
                      <div style="font-size: 12px; color: #8a8a98;">Package: ₹${j.offeredCTC || j.offeredPackage || 'As per industry standards'}</div>
                      <div style="font-size: 12px; color: #b1b1c0; margin-top: 4px;"><strong>Description:</strong> ${j.description || j.jobDescription || 'No description provided.'}</div>
                      <div style="font-size: 12px; color: #17a2b8; margin-top: 3px;"><strong>Company Mail:</strong> ${j.companyEmail || j.email || 'customersupports01@gmail.com'}</div>
                      <div style="font-size: 12px; color: #ffc107; margin-top: 3px;"><strong>Closing Date:</strong> ${formattedDate}</div>
                    </div>
                  `;
                }).join('');

                container.querySelectorAll('.popup-job-card').forEach(card => {
                  card.addEventListener('click', () => {
                    container.querySelectorAll('.popup-job-card').forEach(c => c.style.borderColor = '#2d2d37');
                    card.style.borderColor = '#198754';
                    const selectedTitle = card.getAttribute('data-title');
                    const selectedJobId = card.getAttribute('data-jobid');
                     
                    if(jobTitleInput) jobTitleInput.value = selectedTitle;
                    if(jobIdInput) jobIdInput.value = selectedJobId;

                    if (confirmBtn) {
                      confirmBtn.disabled = false;
                      confirmBtn.style.opacity = '1';
                      confirmBtn.style.cursor = 'pointer';
                    }
                  });
                });
              }
            }).catch(() => {
              container.innerHTML = '<p class="text-danger small">Could not load job openings.</p>';
            });
        }
      },
      preConfirm: () => {
        const selectedJobId = document.getElementById('swal-jobid')?.value;
        if (!selectedJobId || selectedJobId === "") {
          Swal.showValidationMessage('Please select a job position first before clicking Apply Now!');
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedTitle = document.getElementById('swal-jobtitle')?.value || '';
        const selectedJobId = Number(document.getElementById('swal-jobid')?.value) || 0;
        openCandidateApplicationForm(selectedTitle, selectedJobId);
      }
    });
  }, []);

  // Open popup on mount if hiring is active
  useEffect(() => {
    if (isHiringActive) {
      triggerHiringPopup();
    }
  }, [isHiringActive, triggerHiringPopup]);

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

  const handleCartClick = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Login Required',
      text: 'Please login first to view your cart.!',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Login Now',
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
    const status = localStorage.getItem("shopStatus");
    setIsShopOpen(status !== "OFF");
 
    const hiringStatus = localStorage.getItem("isHiringActive");
    const legacyHiring = localStorage.getItem("hiringStatus");
    const active = hiringStatus !== null ? JSON.parse(hiringStatus) : (legacyHiring !== "OFF");
    setIsHiringActive(active);
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

  if (!isShopOpen) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow-lg p-5 text-center border-0" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/3661/3661841.png" width="100" alt="Closed" className="mb-4 mx-auto" />
          <h1 className="fw-bold text-danger">Shop is Closed</h1>
          <p className="text-muted fs-5">We will be back soon.!..</p>
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
            <li className="nav-item border-bottom pb-2"><Link to="/contact" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Contact Us</Link></li>
            <li className="nav-item border-bottom pb-2"><Link to="/customerticketraised" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Add Ticket Raised </Link></li>
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
              <Link to="/medicinechartai" className="text-decoration-none">
                <div className="cart-icon position-relative">
                    <i className="fa-solid fa-headset"></i>
                </div>
              </Link>
         
              <div onClick={() => setAdminOpen(!adminOpen)} style={{ cursor: "pointer" }} className="position-relative">
                <i className="fas fa-user-circle fa-2x text-secondary"></i>
                {adminOpen && (
                  <div className="admin-dropdown bg-white border shadow p-2 position-absolute" style={{ right: 0, top: "45px", zIndex: 1000, borderRadius: "8px", minWidth: "160px" }}>
                    <Link to="/login" className="d-block p-2 text-decoration-none text-dark">Customer Login</Link>
                    <Link to="/adminlogin" className="btn btn-success btn-sm w-100 mt-2">Admin Login</Link>
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

        {/* MEDICINE LIST */}
        <div className="container mb-5 pt-4" ref={medicineSectionRef}>
          <h4 className="fw-bold mb-4">{selectedCategory} Items ({filteredMeds.length})</h4>
          <div className="row g-3">
            {loading ? (
              <div className="text-center py-5 w-100"><div className="spinner-border text-primary"></div></div>
            ) : filteredMeds.length > 0 ? (
              filteredMeds.map((med) => (
                <div className="col-6 col-md-4 col-lg-3" key={med.id || med._id || med.name}> 
                  <div className="card h-100 border-0 shadow-sm p-3">
                     <span className="badge bg-light text-dark mb-2 align-self-start" style={{ fontSize: "0.7rem" }}>
                       {selectedCategory}
                     </span>
                     <h6 className="fw-bold">{med.name}</h6>
                     <p className="small text-muted mb-1">MFG: {med.manufacturer || med.type || "Generic"}</p>
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

      {/* FULL-WIDTH PROFESSIONAL FOOTER */}
      <footer className="footer-section bg-light text-dark pt-5 pb-3 border-top mt-5 w-100" style={{ fontSize: "14px" }}>
        <div className="container-fluid px-4 px-md-5">
          <div className="row g-4">
            {/* Company Column */}
            <div className="col-6 col-md-3">
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/abouts" className="text-decoration-none text-muted">About Us</Link></li>
                <li><Link to="/health-article" className="text-decoration-none text-muted">Health Article</Link></li>
                <li><Link to="/health-stories" className="text-decoration-none text-muted">Health Stories</Link></li>
                <li><Link to="/health-library" className="text-decoration-none text-muted">Health Library</Link></li>
                <li><Link to="/diseases" className="text-decoration-none text-muted">Diseases & Health Conditions</Link></li>
                <li><Link to="/ayurveda" className="text-decoration-none text-muted">Ayurveda</Link></li>
                <li><Link to="/generic-medicines" className="text-decoration-none text-muted">Understanding Generic Medicines</Link></li>
                <li><Link to="/" className="text-decoration-none text-muted">All Medicines</Link></li>
                <li><Link to="/" className="text-decoration-none text-muted">All Brands</Link></li>
                <li><Link to="/contact" className="text-decoration-none text-muted">Need Help</Link></li>
                <li><Link to="/faq" className="text-decoration-none text-muted">FAQ</Link></li>
                <li><Link to="/security" className="text-decoration-none text-muted">Security</Link></li>
                <li><Link to="/savings-calculator" className="text-decoration-none text-muted">Savings Calculator</Link></li>
                <li><Link to="/advertise" className="text-decoration-none text-muted">Advertise with Us</Link></li>
              </ul>
            </div>

            {/* Social & Legal Column */}
            <div className="col-6 col-md-3">
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Social</h6>
              <div className="d-flex gap-3 mb-4 fs-5">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary"><i className="fab fa-instagram"></i></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-primary"><i className="fab fa-facebook-f"></i></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-danger"><i className="fab fa-youtube"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-primary"><i className="fab fa-linkedin-in"></i></a>
              </div>

              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Legal</h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/termconditions" className="text-decoration-none text-muted">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-decoration-none text-muted">Privacy Policy</Link></li>
                <li><Link to="/editorial" className="text-decoration-none text-muted">Editorial Policy</Link></li>
                <li><Link to="/returns" className="text-decoration-none text-muted">Returns & Cancellations</Link></li>
                <li><Link to="/guarantee-tcs" className="text-decoration-none text-muted">Lowest Price Guarantee T&C</Link></li>
              </ul>
            </div>

            {/* Subscribe & Office Address Column */}
            <div className="col-md-3">
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Subscribe</h6>
              <p className="text-muted small mb-2">Claim your complimentary health and fitness tips subscription and stay updated on our newest promotions.</p>
              <div className="input-group mb-4">
                <input type="email" className="form-control form-control-sm" placeholder="Enter your email ID" />
                <button className="btn btn-primary btn-sm px-3" type="button">Subscribe</button>
              </div>

              <h6 className="fw-bold mb-2 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Registered Office Address</h6>
              <p className="text-muted small mb-1"><strong>AKMedizostore Solutions Private Limited</strong></p>
              <p className="text-muted small mb-2">Unit-301 & 304, Lightbridge Tunga Village, Saki Vihar Rd, Chandivali, Powai, Mumbai, Maharashtra, India, 400072.</p>
              <p className="text-muted small mb-1"><strong>CIN:</strong> U62099MH2019PTC320566</p>
              <p className="text-muted small mb-3"><strong>Telephone:</strong> 09240250346</p>

              <h6 className="fw-bold mb-1 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Grievance Officer</h6>
              <p className="text-muted small mb-1"><strong>Name:</strong> Kishor Kumar</p>
              <p className="text-muted small mb-0"><strong>Email:</strong> grievance-officer@akmedizostore.in</p>
            </div>

            {/* Download App & Contact Us Column */}
            <div className="col-md-3">
              <h6 className="fw-bold mb-3 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Download AKMedizostore</h6>
              <p className="text-muted small mb-3">Manage your health with ease Download AKMedizostore today! Get easy access to medicine refills, health information, and more. With our app, you'll never have to wait in line again. Download now and start taking control of your health.</p>
              <div className="d-flex flex-column gap-2 mb-4">
                <a href="#download"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ width: "135px" }} /></a>
                <a href="#download"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" style={{ width: "135px" }} /></a>
              </div>

              <h6 className="fw-bold mb-2 text-uppercase text-secondary" style={{ fontSize: "13px", letterSpacing: "0.5px" }}>Contact Us</h6>
              <p className="text-muted small mb-2">Our customer representative team is available 7 days a week from 8:00 am - 10:00 pm.</p>
              <p className="text-muted small mb-1">support@akmedizostore.in</p>
              <p className="text-muted small fw-bold">09240250346</p>
              <p className="text-muted small text-end mt-3">v4.28.10</p>
            </div>
          </div>

          <hr className="my-4" />
          <div className="footer-bottom-bar text-center text-muted small">
            © 2026 - AK Medicine | All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
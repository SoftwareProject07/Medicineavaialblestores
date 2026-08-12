import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function CustomerticketRaise({ 
  cartItems = [], 
  categories = [], 
  selectedCategory, 
  handleCategoryClick, 
  handleMedicineOrderClick 
}) {
  const navigate = useNavigate();

  // State Management for Sidebar and Admin Dropdown
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // --- Dynamic Issue Categories States ---
  const [masterCategories, setMasterCategories] = useState([]);
  const [issueFetchLoading, setIssueFetchLoading] = useState(false);

  // State Management for Ticket Form
  const [ticket, setTicket] = useState({
    customerName: "",
    mobileNo: "",
    email: "",
    customerId: null,
    orderId: null,
    medicineName: null,
    issueCategory: "",
    subject: "",
    description: "",
    departmentoption: "",  
    priority: "Medium",
    attachment: null
  });

  // --- Fetch Dynamic Categories from Master API ---
  useEffect(() => {
    const fetchMasterCategories = async () => {
      setIssueFetchLoading(true);
      try {
        // Localhost URL
        const response = await axios.get(
          //"http://localhost:5256/api/TicketAPI/MasterGetAllIssuecategory"
          // 
          // 
          // 
          "https://ecommerencesite.onrender.com/api/TicketAPI/MasterGetAllIssuecategory" );
        
        // Render Production URL (यदि Localhost पर CORS समस्या आए, तो इसे अनकमेंट करें)
        // const response = await axios.get("https://ecommerencesite.onrender.com/api/TicketAPI/MasterGetAllIssuecategory");

        console.log("Master API Response:", response.data);

        // जांचें कि डेटा सीधा Array है या ऑब्जेक्ट के .data प्रॉपर्टी के अंदर है
        const extractedData = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setMasterCategories(extractedData);
      } catch (error) {
        console.error("Error fetching master issue categories:", error);
      } finally {
        setIssueFetchLoading(false);
      }
    };

    fetchMasterCategories();
  }, []);

  // Universal Handle Change for Form inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      setTicket({
        ...ticket,
        [name]: files[0] ? files[0].name : null
      });
    } else {
      setTicket({
        ...ticket,
        [name]: value
      });
    }
  };

  // API Submit Handler
  const RaiseTicket = async (e) => {
    e.preventDefault();

    const payload = {
      customerName: ticket.customerName,
      mobileNo: ticket.mobileNo,
      email: ticket.email,
      customerId: ticket.customerId || null,
      orderId: ticket.orderId || null,
      medicineName: ticket.medicineName || null,
      issueCategory: ticket.issueCategory,
      departmentoption: ticket.departmentoption || null,
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      attachment: ticket.attachment || null
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/TicketAPI/RaiseTicket",
        // "http://localhost:5256/api/TicketAPI/RaiseTicket",
        payload
      );

      alert(response.data);

      // Form and Inputs reset configuration
      setTicket({
        customerName: "",
        mobileNo: "",
        email: "",
        customerId: null,
        orderId: null,
        medicineName: null,
        issueCategory: "",
        subject: "",
        description: "",
        departmentoption: "",
        priority: "Medium",
        attachment: null
      });
      
      if (document.getElementById("attachmentFile")) {
        document.getElementById("attachmentFile").value = "";
      }

      navigate("/"); 

    } catch (error) {
      console.error("API Validation Failures:", error.response ? error.response.data : error.message);
      
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = Object.keys(error.response.data.errors)
          .map(key => `${key}: ${error.response.data.errors[key].join(', ')}`)
          .join('\n');
        alert(`Backend Validation Failed:\n${validationErrors}`);
      } else {
        alert("Unable to Raise Ticket!.");
      }
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. SIDE MENU (MODERN 2-COLUMN GRID SYSTEM DESIGN)       */}
      {/* ======================================================== */}
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
    

      {/* ======================================================== */}
      {/* 2. MAIN APP GLOBAL FIXED NAVBAR                          */}
      {/* ======================================================== */}
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

      {/* ======================================================== */}
      {/* 3. TICKET RAISING INTERFACE DATA FORM                    */}
      {/* ======================================================== */}
      <div className="container" style={{ marginTop: "120px", marginBottom: "40px" }}>
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white py-3">
            <h3 className="mb-0 fs-4 fw-bold">
              <i className="fas fa-headset me-2"></i>Customer Support Ticket
            </h3>
          </div>

          <div className="card-body p-4">
            <form onSubmit={RaiseTicket}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    className="form-control"
                    value={ticket.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={ticket.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Mobile Number</label>
                  <input
                    type="text"
                    maxLength="10"
                    name="mobileNo"
                    className="form-control"
                    value={ticket.mobileNo}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* --- 100% DYNAMIC DYNAMIC ISSUE NAME DROPDOWN FROM MASTER API --- */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Issue Name</label>
                  <select
                    name="issueCategory"
                    className="form-select"
                    value={ticket.issueCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      {issueFetchLoading ? "Loading Issues..." : "Select Issue"}
                    </option>
                    {masterCategories.length > 0 && masterCategories.map((cat, index) => {
                      // 1. अगर API से सीधा String Array आ रहा हो (जैसे: ["Technical", "Login"])
                      if (typeof cat === "string") {
                        return <option key={index} value={cat}>{cat}</option>;
                      }

                      // 2. अगर API से Object आ रहा है, तो ये सभी संभावित Keys को चेक करेगा (Case-Insensitive fallback)
                      const categoryName = cat.issueCategory || cat.issueCategoryName || cat.issuecategory || cat.name || cat.Name || "";
                      
                      if (!categoryName) return null; // अगर डेटा फ़ॉर्मेट मैच न करे तो स्किप करेगा

                      return (
                        <option key={index} value={categoryName}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Priority</label>
                  <select
                    name="priority"
                    className="form-select"
                    value={ticket.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Login Credential Account (Username/Email/Mobile)</label>
                  <input
                    type="text"
                    name="departmentoption"
                    className="form-control"
                    value={ticket.departmentoption}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    value={ticket.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    rows="4"
                    name="description"
                    className="form-control"
                    value={ticket.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-md-12 mb-4">
                  <label className="form-label fw-semibold">Attachment</label>
                  <input
                    id="attachmentFile"
                    type="file"
                    name="attachment"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 text-center">
                  <button type="submit" className="btn btn-success btn-lg px-5 shadow-sm fw-bold">
                    Add Raise Ticket    
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
import '../styles/aboutuscss.css';
import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div 
      className="about-us-page bg-light min-vh-100" 
      style={{ paddingTop: "145px" }}
    >
      
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
                  className="form-control border-0 shadow-none py-2 px-3" 
                  placeholder="Search for medicines, health products..." 
                />
                <button className="btn btn-primary px-4 rounded-pill m-1" type="button">
                  Search
                </button>
              </div>
            </div>

            {/* Right Action Links */}
            <div className="d-flex align-items-center gap-4 text-nowrap">
              <Link to="/download-app" className="text-decoration-none text-dark fw-medium small d-none lg-block">Download App</Link>
              <Link to="/login" className="text-decoration-none text-primary fw-semibold">Login / Signup</Link>
              <Link to="/cart" className="text-decoration-none text-dark d-flex align-items-center gap-1">
                🛒 <span className="fw-medium">Cart</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Sub-Menu Bar */}
        <div className="border-top bg-white py-2">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between overflow-auto py-1" style={{ whiteSpace: "nowrap", gap: "30px" }}>
              <Link to="/medicines" className="text-decoration-none text-secondary small fw-medium">Medicines</Link>
              <Link to="/personal-care" className="text-decoration-none text-secondary small fw-medium">Personal Care</Link>
              <Link to="/health-conditions" className="text-decoration-none text-secondary small fw-medium">Health Conditions</Link>
              <Link to="/vitamins-supplements" className="text-decoration-none text-secondary small fw-medium">Vitamins & Supplements</Link>
              <Link to="/diabetes-care" className="text-decoration-none text-secondary small fw-medium">Diabetes Care</Link>
              <Link to="/healthcare-devices" className="text-decoration-none text-secondary small fw-medium">Healthcare Devices</Link>
              <Link to="/homeopathic-medicine" className="text-decoration-none text-secondary small fw-medium">Homeopathic Medicine</Link>
              <Link to="/health-guide" className="text-decoration-none text-secondary small fw-medium">Health Guide</Link>
            </div>
          </div>
        </div>

      </div>

      {/* ----------------- PAGE CONTENT ----------------- */}
      <div className="container">
        
        {/* Top Header Banner */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-dark display-5">About MedicineOneServices</h1>
          <p className="text-muted fs-5 mt-2">
            Making essential medicines affordable and accessible through technology & pan-India reach.
          </p>
        </div>

        {/* Introduction Section */}
        <div className="card border-0 shadow-sm p-4 p-md-5 mb-5 rounded-4 bg-white">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <h3 className="fw-bold text-primary mb-3">Redefining Healthcare Affordability</h3>
              <p className="text-secondary" style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
                MedicineOneServices is an e-pharmacy and telehealth platform that focuses on providing affordable substitute medicines. 
                We focus on making essential medicines affordable and accessible through our proprietary algorithm & pan-India reach, 
                reducing monthly medical bills for chronic patients by up to 51%. These affordable alternatives are sourced from top 1% 
                pharmaceutical manufacturers in the country.
              </p>
              <p className="text-secondary mt-3" style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
                Our platform also addresses patients' concerns around information about affordable medicines, the quality, and accessibility 
                of these medicines, and empowers patients to make informed decisions before transitioning to such affordable 'substitute' medicines.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 h-100 rounded-4 text-white" style={{ backgroundColor: "#0d6efd" }}>
              <h3 className="fw-bold mb-3">OUR VISION</h3>
              <h4 className="fw-light mb-3">The vision is to make healthcare affordable and accessible to all</h4>
              <p className="mb-0 text-white-50" style={{ lineHeight: "1.7" }}>
                We are a technology-driven, telehealth platform that aims to reduce healthcare expenses and improve healthcare outcomes 
                by democratising medicine purchase in India.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 h-100 rounded-4 bg-white">
              <h3 className="fw-bold text-dark mb-3">The Challenge We Solve</h3>
              <p className="text-secondary" style={{ lineHeight: "1.7" }}>
                India has over 25 crore chronic patients who require monthly medication. With soaring medical costs pushing many into poverty, 
                it's crucial to offer accessible solutions.
              </p>
              <p className="text-secondary fw-medium mt-2">
                MedicineOneServices bridges affordability and accessibility, making healthcare a right for every Indian.
              </p>
              <div className="mt-3 pt-3 border-top">
                <span className="text-muted small">Founders:</span>
                <h5 className="fw-bold text-dark mb-0">Gautam Dev</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="card border-0 shadow-sm p-4 p-md-5 mb-5 rounded-4 bg-white text-center">
          <h3 className="fw-bold mb-4 text-dark">Our Impact in Numbers</h3>
          <div className="row g-4">
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-primary mb-1">10+</h3>
                <span className="text-muted small">Mobile App Installs</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-success mb-1">10 ++</h3>
                <span className="text-muted small">Unique Users</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-warning mb-1">110Cr+</h3>
                <span className="text-muted small">Savings</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-info mb-1">1L+</h3>
                <span className="text-muted small">Products</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-danger mb-1">10 lakh+</h3>
                <span className="text-muted small">Doctor Consultations</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-primary mb-1">400+</h3>
                <span className="text-muted small">Doctors</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-success mb-1">1000+</h3>
                <span className="text-muted small">Pharmacists</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3 border rounded-3 bg-light h-100">
                <h3 className="fw-bold text-dark mb-1">10K+</h3>
                <span className="text-muted small">Pincodes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Life at MedicineOneServices Section */}
        <div className="card border-0 shadow-sm p-4 p-md-5 mb-5 rounded-4 bg-white">
          <h3 className="fw-bold text-dark mb-3">LIFE AT MEDICINEONESERVICES</h3>
          <p className="text-secondary" style={{ fontSize: "1.05rem", lineHeight: "1.8" }}>
            We're a tight-knit team of process-oriented & agile professionals dedicated to 'Thinking Big'. Our corporate culture values pragmatism, 
            integrity, flexibility, efficiency, innovation & collaboration ensuring every task is done Right-First-Time. Led by dynamic leaders 
            who champion "intrapreneurship," we prioritize quick decision-making that is a well-brewed combination of data, experience, and high-impact deliverables.
          </p>
        </div>

      </div>

      {/* ----------------- BOTTOM FOOTER SECTION ----------------- */}
      <div className="bg-light pt-5 pb-3 border-top mt-5">
        <div className="container">
          <div className="row g-4 mb-4">
            
            {/* Company Links */}
            <div className="col-6 col-md-3">
              <h5 className="fw-bold text-dark mb-3">Company</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/abouts" className="text-decoration-none text-muted">About Us</Link></li>
                <li className="mb-2"><Link to="/health-article" className="text-decoration-none text-muted">Health Article</Link></li>
                <li className="mb-2"><Link to="/health-stories" className="text-decoration-none text-muted">Health Stories</Link></li>
                <li className="mb-2"><Link to="/health-library" className="text-decoration-none text-muted">Health Library</Link></li>
                <li className="mb-2"><Link to="/diseases" className="text-decoration-none text-muted">Diseases & Health Conditions</Link></li>
                <li className="mb-2"><Link to="/ayurveda" className="text-decoration-none text-muted">Ayurveda</Link></li>
                <li className="mb-2"><Link to="/understanding-generic-medicines" className="text-decoration-none text-muted">Understanding Generic Medicines</Link></li>
                <li className="mb-2"><Link to="/all-medicines" className="text-decoration-none text-muted">All Medicines</Link></li>
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
              <h5 className="fw-bold text-dark mb-3">Social</h5>
              <div className="d-flex gap-3 mb-4 text-primary">
                <span className="fs-4">📷</span>
                <span className="fs-4">📘</span>
                <span className="fs-4">▶️</span>
                <span className="fs-4">🔗</span>
              </div>

              <h5 className="fw-bold text-dark mb-3">Legal</h5>
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
              <h5 className="fw-bold text-dark mb-3">Subscribe</h5>
              <p className="text-muted small mb-3">AKMedizostore Solutions Private Limited...</p>
              <div className="input-group mb-4">
                <input type="email" className="form-control" placeholder="Enter your email ID" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>

              <h5 className="fw-bold text-dark mb-2">Registered Office Address</h5>
              <p className="text-muted small mb-1 fw-semibold">MedicineOneServices Private Limited</p>
              <p className="text-muted small mb-2" style={{ lineHeight: "1.5" }}>
                 JS ROOP HOMES ,NEAR BY VIHAN HERITAGE SECTOR -1 GREATER NOIDA EXTENSION ,PINCODE- 201318
              </p>
              <p className="text-muted small mb-1"><strong>CIN:</strong> 0000000</p>
              <p className="text-muted small mb-3"><strong>Telephone:</strong> <span className="text-primary">8409844260</span></p>

              <h5 className="fw-bold text-dark mb-2">Grievance Officer</h5>
              <p className="text-muted small mb-1"><strong>Name:</strong> Gautam Dev</p>
              <p className="text-muted small mb-0"><strong>Email:</strong> <a href="mailto:grievance-customersupports01@gmail.com" className="text-decoration-none">grievance-customersupports01@gmail.com</a></p>
            </div>

            {/* Download App & Contact Us */}
            <div className="col-md-3">
              <h5 className="fw-bold text-dark mb-3">Download MedicineOneServices</h5>
              <p className="text-muted small mb-3">
                Manage your health with ease Download MedicineOneServices today! Get easy access to medicine refills, health information, and more.
              </p>
              <div className="d-flex flex-column gap-2 mb-4">
                <span className="badge bg-dark p-2 text-start" style={{ width: "140px" }}>Get it on Google Play</span>
                <span className="badge bg-dark p-2 text-start" style={{ width: "140px" }}>Download on App Store</span>
              </div>

              <h5 className="fw-bold text-dark mb-2">Contact Us</h5>
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
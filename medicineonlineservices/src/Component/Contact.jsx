import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate ko import kiya
import Swal from "sweetalert2"; // Error popup ke liye import kiya
import "../Component/styles/contacts.css";

export default function Contact() {
  const navigate = useNavigate(); // navigate function initialize kiya
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [cartItems] = useState([]);
  const [isShopOpen] = useState(localStorage.getItem("shopStatus") !== "OFF");

  
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

  return (
    <>
      {/* --- SIDEBAR MENU --- */}
      <div
        className={`side-menu bg-white shadow ${sidebarOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-300px",
          width: "280px",
          height: "100%",
          zIndex: 2000,
          transition: "0.3s ease",
        }}
      >
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">AKMedizostore</h5>
            <button
              className="btn-close"
              onClick={() => setSidebarOpen(false)}
            ></button>
          </div>
          <ul className="nav flex-column gap-2">
            <li className="nav-item border-bottom pb-2">
              <Link to="/" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>
                Home
              </Link>
            </li>

            {/* PROTECTED MEDICINE ORDER LINK */}
            <li className="nav-item border-bottom pb-2">
                         <div className="nav-link text-dark p-0" style={{ cursor: "pointer" }} onClick={handleMedicineOrderClick}><Link to="/orders" className="nav-link text-dark p-0">Medicine Order</Link></div>
                       </li>
                       <li className="nav-item border-bottom pb-2">
                         <Link to="/contact" className="nav-link text-dark p-0" onClick={() => setSidebarOpen(false)}>Contact Us</Link>
                       </li>
          </ul>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1999,
          }}
        ></div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm px-3">
        <button
          className="btn border-0 me-2"
          onClick={() => setSidebarOpen(true)}
        >
          <i className="fas fa-bars fa-lg"></i>
        </button>

        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/AKMedizostore.png" width="34" alt="logo" />
          <span className="ms-2 fw-bold">AKMedizostore</span>
        </Link>

        <div className="ms-auto d-flex gap-3 align-items-center">
          <div className="admin-wrapper position-relative">
            <div onClick={() => setAdminOpen(!adminOpen)} style={{ cursor: "pointer" }}>
              <i className="fas fa-user-circle fa-2x text-secondary"></i>
            </div>
            {adminOpen && (
              <div
                className="admin-dropdown bg-white border shadow p-2 position-absolute"
                style={{
                  right: 0,
                  top: "45px",
                  zIndex: 1000,
                  borderRadius: "8px",
                  minWidth: "160px",
                }}
              >
                <Link
                  to={isShopOpen ? "/login" : "#"}
                  className={`d-block p-2 text-decoration-none ${isShopOpen ? "text-dark" : "text-muted"}`}
                >
                  Customer Login
                </Link>
                <Link to="/adminlogin" className="btn btn-success btn-sm w-100 mt-2">
                  Admin Login
                </Link>
              </div>
            )}
          </div>
          <div className="cart-icon position-relative" style={{ cursor: "pointer" }}>
            <span style={{ fontSize: "1.5rem" }}>🛒</span>
            <span className="badge bg-primary position-absolute top-0 start-100 translate-middle rounded-pill">
              {cartItems.length}
            </span>
          </div>
        </div>
      </nav>

      {/* --- CONTACT CONTENT --- */}
      <div className="contactdesign text-center" style={{ marginTop: "120px" }}>
        <h2 className="fw-bold">AVAILABLE TIMING : 24 × 7</h2>
        <h3 className="text-primary">Contact Person : 7033132629</h3>
        <div className="container mt-4">
          <div className="card shadow-sm p-4 border-0 bg-white mx-auto" style={{ maxWidth: "600px" }}>
            <p className="fw-bold mb-0">CURRENT ADDRESS:</p>
            <p className="text-muted">
              2nd Floor, Flat No. 206, JS Roop Homes,
              <br />
              Near Vihar Heritage Sector-1,
              <br />
              Gautam Buddh Nagar, Greater Noida Extension
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
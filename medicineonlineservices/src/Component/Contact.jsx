import React from "react";
import { Link } from "react-router-dom";
import "./styles/contacts.css";

export default function Contact() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm w-100">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/AKMedizostore.png"
            alt="AKMedizostore"
            className="img-fluid"
            style={{ width: "40px", marginRight: "8px" }}
          />
          AKMedizostore
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/medicine-order">
                Medicine Order
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link active" to="/contact">
                Contact Us
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="btn btn-success">
                       Login / Signup
                     </Link><br></br>
                     {/* <a href="#" className="position-relative">
                         🛒
                         <span className="badge bg-danger text-white cart-badge">0</span>
                       </a> */}
            <div className="position-relative">
              🛒
              <span className="badge bg-danger text-white cart-badge">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTACT CONTENT */}
      <div className="contactdesign text-center mt-5">
        <h2>AVAILABLE TIMING : 24 × 7</h2>
        <h3>Contact Person : 7033132629</h3>
        <p className="fw-bold mt-3">
          CURRENT ADDRESS : 2nd Floor, Flat No. 206, JS Roop Homes,
          Near Vihar Heritage Sector-1,  
          Gautam Buddh Nagar, Greater Noida Extension
        </p>
      </div>
    </>
  );
}

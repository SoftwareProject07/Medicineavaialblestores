import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/headers.css";
import "../styles/noscroll.css";
import { useCart } from "./CartContext";

// import { useState } from "react";

// import   "../User/Header.jsx";

export default function Header() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState({
    city: "Detecting...",
    pincode: "",
  });
//=================Add to cart flow=======
 const handleAddToCart = (med) => {
    setCartItems([...cartItems, med]);
  };
  // =============
  const categories = [
    "Medicines",
    "Personal Care",
    "Health Conditions",
    "Vitamins & Supplements",
    "Diabetes Care",
    "Healthcare Devices",
    "Homeopathic Medicine",
    "Health Guide",
  ];

  const meds = [
    { name: "Paracetamol", price: 25 },
    { name: "Amoxicillin", price: 60 },
    { name: "Vitamin C Tablets", price: 90 },
    { name: "Cough Syrup", price: 80 },
    { name: "Crocin", price: 35 },
    { name: "Skin Ointment", price: 50 },
  ];

  const filteredMeds = meds.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  // 📍 Auto location detect
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              "User-Agent": "AKMedizostore/1.0",
            },
          }
        );

        const data = await res.json();

        setLocation({
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown",
          pincode: data.address.postcode || "",
        });
      } catch {
        setLocation({ city: "Unknown", pincode: "" });
      }
    });
  }, []);

  // 📮 Pincode handler
  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, "");
    setLocation((p) => ({ ...p, pincode: pin }));

    if (pin.length === 6) {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      );
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        setLocation((p) => ({
          ...p,
          city: data[0].PostOffice[0].District,
        }));
      }
    }
  };

  return (
    <>
      {/* 🔹 NAVBAR */}
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm px-3">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/AKMedizostore.png" width="36" alt="logo" />
          <span className="ms-2 fw-bold">AKMedizostore</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a href="#top" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="#medicineOrder" className="nav-link">Medicine Order</a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link">About</a>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact Us</Link>
            </li>
          </ul>

          {/* 🔐 Login & Cart */}
          <div className="d-flex gap-2 align-items-center">
             <Link to="#" >
           <i class="fas fa-toggle-on"></i>
            </Link>
            
        
 <div className="right-icons">
        {/* Admin */}
        <div className="admin-wrapper">
          <div
            className="admin-btn"
            onClick={() => setAdminOpen(!adminOpen)}
          >
            <i className="fas fa-user"></i>
            {/* <span> Admin</span> */}
          </div>

          {adminOpen && (
            <div className="admin-dropdown">
              <Link to="/login">Customer Login</Link>
              {/* className="btn btn-success mb-2" */}
           <Link to="/adminlogin" className="btn btn-success mb-2" >Admin Login</Link>
            </div>
          )}
        </div>
      </div>
      {/* USER ICON*/}
   
          <div className="d-flex justify-content-end mb-3">
        <div className="cart-icon position-relative">
          🛒
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
            {cartItems.length}
          </span>
        </div>
       </div>
      {/* //   <Link to="/carts" className="position-relative">
      //   🛒
      //   <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
      //     {cartItems.reduce((t, i) => t + i.quantity, 0)}
      //   </span>
      // </Link> */}
          </div>
        </div>
      </nav>

      {/* 🔹 HERO */}
      <section className="hero-section text-center mt-5 pt-5" id="top">
        <h1 className="fw-bold">Say Goodbye to high medicine prices</h1>
        <p className="text-muted">
          Compare prices and save up to 51% on medicines
        </p>

        <div className="d-flex flex-wrap justify-content-center mb-3">
          {categories.map((cat, i) => (
            <button key={i} className="btn btn-link text-muted">
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 🔍 SEARCH BAR */}
      <div className="search-wrapper d-flex align-items-center gap-2 p-3 justify-content-center">
        <button className="btn btn-link">
          Deliver to <b>{location.city}</b>
        </button>

        <input
          type="text"
          placeholder="Pincode"
          value={location.pincode}
          maxLength={6}
          onChange={handlePincodeChange}
          className="form-control"
          style={{ width: "120px" }}
        />

        <input
          type="text"
          placeholder="Search medicines"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          style={{ maxWidth: "1200px" }}
        />
      </div>

      {/* 🔍 SEARCH RESULTS */}
      {search && (
        <div className="container mt-4">
          <div className="row">
            {filteredMeds.length ? (
              filteredMeds.map((med, i) => (
                <div className="col-md-4 mb-3" key={i}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src="https://via.placeholder.com/200"
                      className="card-img-top"
                      alt={med.name}
                    />
                    <div className="card-body text-center">
                      <h5>{med.name}</h5>
                      <p>₹{med.price}</p>
                      <button
                  className="btn btn-primary w-100"
                  onClick={() => handleAddToCart(med)}
                >
                  Add to Cart
                </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted fs-5">
                No medicine found
              </p>
            )}
          </div>
        </div>
      )}

      {/* 💊 ALL MEDICINES */}
      {!search && (
        <div className="container mt-4">
          <h3>All Medicines</h3>
          <div className="row">
            {meds.map((med, i) => (
              <div className="col-md-4 mb-3" key={i}>
                <div className="card h-100">
                  <img
                    src="https://via.placeholder.com/200"
                    className="card-img-top"
                    alt={med.name}
                  />
                  <div className="card-body text-center">
                    <h5>{med.name}</h5>
                    <p>₹{med.price}</p>
                    {/* <button className="btn btn-primary w-100">
                      Add to Cart
                    </button> */}
                     <button
                  className="btn btn-primary w-100"
                  onClick={() => handleAddToCart(med)}
                >
                  Add to Cart
                </button>
                  </div>
                </div>
              </div>
            ))}
          </div>


          
      {/* 🔹 ADDED MEDICINE NAMES
      {cartItems.length > 0 && (
        <div className="mt-4">
          <h5>Added to Cart:</h5>
          <ul className="list-group">
            {cartItems.map((item, index) => (
              <li key={index} className="list-group-item">
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}  */}
        </div>
      )}
    </>
  );
}
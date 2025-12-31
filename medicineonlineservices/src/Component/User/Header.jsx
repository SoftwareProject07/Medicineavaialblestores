import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/headers.css";
import "../styles/noscroll.css";

export default function Header() {
  const [search, setSearch] = useState("");

  const [location, setLocation] = useState({
    city: "Detecting...",
    pincode: "",
  });

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

  // 🔍 SEARCH FILTER
  const filteredMeds = meds.filter((med) =>
    med.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  // 📍 Auto detect location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
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

  // 📮 PINCODE → CITY
  const handlePincodeChange = async (e) => {
    const pin = e.target.value.replace(/\D/g, "");
    setLocation((prev) => ({ ...prev, pincode: pin }));

    if (pin.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pin}`
        );
        const data = await res.json();

        if (data[0].Status === "Success") {
          setLocation((prev) => ({
            ...prev,
            city: data[0].PostOffice[0].District,
          }));
        } else {
          setLocation((prev) => ({ ...prev, city: "Invalid Pincode" }));
        }
      } catch {
        setLocation((prev) => ({ ...prev, city: "Error" }));
      }
    }
  };

  return (
    <>
      {/* 🔹 NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top w-100 px-3">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src="/AKMedizostore.png"
            alt="AKMedizostore"
            style={{ width: "40px", marginRight: "8px" }}
          />
          AKMedizostore
        </a>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><a className="nav-link" href="#top">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#medicineOrder">Medicine Order</a></li>
            <li className="nav-item"><a className="nav-link" href="#About">About</a></li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>

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

      {/* 🔍 SEARCH RESULTS (ONLY WHEN SEARCH IS TYPED) */}
      {search && (
        <div className="container mt-4">
          <div className="row">
            {filteredMeds.length > 0 ? (
              filteredMeds.map((med, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src="https://via.placeholder.com/200"
                      className="card-img-top"
                      alt={med.name}
                    />
                    <div className="card-body text-center">
                      <h5>{med.name}</h5>
                      <p>₹{med.price}</p>
                      <button className="btn btn-primary w-100">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted fs-5">No medicine found</p>
              </div>
            )}
          </div>
        </div>
      )}
     {/* 📦 ORDER VIA */}
      <div className="mt-5 text-center">
        <p className="text-uppercase text-muted mb-3">
          Place your order via
        </p>

        <div className="d-flex justify-content-center flex-wrap gap-3">
          <button className="btn btn-light shadow-sm">
            <img
              src="/doctor.png"
              alt="doctor"
              style={{ width: "80px" }}
            />
          </button>

          <button className="btn btn-light shadow-sm">
            📞 Call 08046800924
          </button>

          <button className="btn btn-light shadow-sm">
            ⬆️ Upload prescription
          </button>
        </div>
      </div>
      {/* 💊 ALL MEDICINES (ONLY WHEN SEARCH IS EMPTY) */}
      {!search && (
        <div className="container mt-4">
          <h3>All Medicines</h3>
          <div className="row">
            {meds.map((med, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card h-100">
                  <img
                    src="https://via.placeholder.com/200"
                    className="card-img-top"
                    alt={med.name}
                  />
                  <div className="card-body text-center">
                    <h5>{med.name}</h5>
                    <p>₹{med.price}</p>
                    <button className="btn btn-primary w-100">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

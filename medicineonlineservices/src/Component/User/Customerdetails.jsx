import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../User/CartContext";
import "../styles/CustomerDetailss.css";

export default function Customerdetails() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const[openMasterUpdate, setOpenMasterUpdate] = useState(false);

  const [user, setUser] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);

  const [fullname, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [cityname, setCityname] = useState("");
  const [statename, setStatename] = useState("");
  const [zipcode, setzipcode] = useState("");

  /* ===== USER ===== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullname ||
      !gender ||
      !phoneNumber ||
      !address ||
      !email ||
      !age ||
      !cityname ||
      !statename ||
      !zipcode
    ) {
      Swal.fire("Warning", "All fields are required", "warning");
      return;
    }

    const data = {
      FullName: fullname,
      Gender: gender,
      PhoneNumber: phoneNumber,
      Address: address,
      Email: email,
      Age: age,
      CityName: cityname,
      StateName: statename,
      ZipCode: zipcode,
      CreatedOn: new Date().toISOString(),
    };

 try {
  const response = await axios.post(
    "https://ecommerencesite.onrender.com/api/Patient_CustomerAPI/AddPatient_Customer",
  //  "http://localhost:5256/api/Patient_CustomerAPI/AddPatient_Customer",
    data,
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  // ✅ STATUS BASED SUCCESS CHECK
  if (response.status === 200 || response.status === 201) {
    Swal.fire("Success", "Customer details saved", "success").then(() =>
      navigate("/deliveryaddress")
    );
  } else {
    Swal.fire("Error", "Failed to save data", "error");
  }
} catch (error) {
  Swal.fire("Server Error", "Please try again later", "error");
}
  };

  return (
       <div className="app-container">
         {/* ============ SIDEBAR ============ */}
<div className="sidebar">
  <div className="brand">
    <Link to="/dashboards" className="text-decoration-none">
      <img src="/AKMedizostore.png" alt="logo" width="55" />
    </Link>
    <span className="user-name">
      {user ? `${user.firstName} ${user.lastName}` : "User"}
    </span>
  </div>

  <ul className="sidebar-menu">
    {/* DASHBOARD DROPDOWN */}
    <li className="menu-group">
      <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenDashboard(!openDashboard)}>
        <div className="btn-content">
          <i className="fas fa-th-large"></i> Dashboard
        </div>
        <span>{openDashboard ? "▾" : "▸"}</span>
      </button>

      {openDashboard && (
        <ul className="submenu">
          <li><Link to="/medication-tracker">Medication Tracker</Link></li>
          <li><Link to="/test-reports">Test Reports</Link></li>
          <li><Link to="/health-history">Health History</Link></li>
          <li><Link to="/monthly-progress">Monthly Progress</Link></li>
          <li><Link to="/prescriptions">Prescriptions</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to="/support">Help & Support</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      )}
    </li>

    {/* MASTER UPDATE DROPDOWN */}
    <li className="menu-group">
      <button className="sidebar-btn dropdown-toggle" onClick={() => setOpenMasterUpdate(!openMasterUpdate)}>
        <div className="btn-content">
          <i className="fas fa-edit"></i> Master Update
        </div>
        <span>{openMasterUpdate ? "▾" : "▸"}</span>
      </button>
      {openMasterUpdate && (
        <ul className="submenu">
          <li>
            <Link to="/deliveryaddress">
              <i className="fas fa-map-marker-alt"></i> Delivery Address
            </Link>
          </li>
              <li>
                      <Link to="/CompletePayments" className="sidebar-btn active-btn">
                        <div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div>
                      </Link>
                    </li>
                           <li>
                            <Link to="/">
                              <i className="fas fa-map-marker-alt"></i> Refund Order Amount
                            </Link>
                          </li>
        </ul>
      )}
    </li>

    {/* MEDICINES */}
    <li>
      <Link to="/medicinedisplay" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-capsules"></i> Medicines</div>
      </Link>
    </li>

    {/* CART */}
    <li>
      <Link to="/carts" className="sidebar-btn">
        <div className="btn-content">
          <i className="fas fa-shopping-cart"></i> My Cart
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </div>
      </Link>
    </li>

    {/* ORDER PAYMENT */}
    {/* <li>
      <Link to="/CompletePayments" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i> Order Payment</div>
      </Link>
    </li> */}

 <li>
      <Link to="/orders" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i>OrderStatus</div>
      </Link>
    </li>
    {/* <li>
      <Link to="/CompletePayments" className="sidebar-btn">
        <div className="btn-content"><i className="fas fa-credit-card"></i>CustomerTracking</div>
      </Link>
    </li> */}

   

    {/* PROFILE (ACTIVE) */}
    <li>
      <Link to="/profile" className="sidebar-btn active-btn">
        <div className="btn-content"><i className="fas fa-user-circle"></i> Customer Profile</div>
      </Link>
    </li>

    {/* LOGOUT */}
    <li className="logout-item">
      <Link to="/header" className="sidebar-btn logout">
        <div className="btn-content"><i className="fas fa-sign-out-alt"></i> Log Out</div>
      </Link>
    </li>
  </ul>
</div>
      {/* ========= FORM (UNCHANGED) ========= */}
      <div className="form-wrapper">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Customer Details</h2>

          <div className="form-group">
            <label>Customer Name</label>
            <input value={fullname} onChange={(e) => setFullName(e.target.value)}  autoComplete="off" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input value={phoneNumber} maxLength={10} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input value={age} onChange={(e) => setAge(e.target.value)} />
          </div>

          <div className="form-group">
            <label>ZIP Code</label>
            <input value={zipcode} onChange={(e) => setzipcode(e.target.value)} />
          </div>

          <div className="form-group">
            <label>City</label>
            <input value={cityname} onChange={(e) => setCityname(e.target.value)} />
          </div>

          <div className="form-group">
            <label>State</label>
            <input value={statename} onChange={(e) => setStatename(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <button type="submit">Customer Data Submit</button>
        </form>
      </div>
    </div>
  );
}

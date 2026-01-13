import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DeliveryAddresss.css";

export default function DeliveryAddress() {
    const [openDashboard, setOpenDashboard] = useState(false);
    const { cartItems } = useCart(); // ✅ CART ITEMS
  
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ---------- CART COUNT ---------- */
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ================= FETCH DELIVERY ADDRESSES =================
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        // "http://localhost:5256/api/Patient_CustomerAPI/GetAllPatients_Customers"
        "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI/GetAllPatients_Customers"
      );

      console.log("ADDRESS API 👉", res.data);

      const list =
        res.data?.data ||
        res.data?.addresses ||
        res.data ||
        [];

      setAddresses(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Address API Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeliverHere = (address) => {
    console.log("DELIVER TO 👉", address);
    alert(`Delivering to ${address.FullName || address.fullName}`);
  };

  if (loading) return <p>Loading delivery addresses...</p>;

  return (

    <div className="sidebar">
        <div className="brand">
          <Link to="/dashboards">
            <img src="/AKMedizostore.png" alt="logo" width="55" />
          </Link>
          <span>
            {user ? `${user.firstName} ${user.lastName}` : "User"}
          </span>
        </div>

        <ul>
          <li className="menu-group">
            <button
              className="menu-title btn btn-success mb-2 d-flex justify-content-between align-items-center"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard <span>{openDashboard ? "▾" : "▸"}</span>
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

          <li>
            <Link to="/medicinedisplay" className="btn btn-success mb-2">
              Medicines
            </Link>
          </li>

          {/* ✅ CART WITH COUNT */}
          <li>
            <Link
              to="/carts"
              className="btn btn-success mb-2 d-flex justify-content-between align-items-center"
            >
              <span>Medicine Cart</span>
              {totalQuantity > 0 && (
                <span
                  style={{
                    background: "red",
                    color: "#fff",
                    borderRadius: "50%",
                    padding: "2px 8px",
                    fontSize: "12px"
                  }}
                >
                  {totalQuantity}
                </span>
              )}
            </Link>
          </li>
          {/* deliveryaddress */}
         {/* <li>Delivery Address</li> */}
           <li>
            <Link to="/deliveryaddress" className="btn btn-success mb-2">
              Delivery Address
            </Link>
          </li>
          <li>OrdersPayment</li>
          <li>CustomerTracking</li>
          <li>OrderStatus</li>
          <li>Customer Profile</li>

          <li>
            <Link to="/header">
              <i className="fas fa-sign-out-alt"></i> LogOut
            </Link>
          </li>
        </ul>

         <h2>
          Welcome back, {user ? `${user.firstName} ${user.lastName}` : "User"}
        </h2>

    <div className="delivery-wrapper">
      <h2>DELIVERY ADDRESS</h2>

      {addresses.length === 0 ? (
        <p>No address found</p>
      ) : (
        addresses.map((addr, index) => (
          <div
            key={index}
            className={`address-card ${
              selectedId === index ? "active" : ""
            }`}
          >
            <div className="address-header">
              <input
                type="radio"
                name="address"
                checked={selectedId === index}
                onChange={() => setSelectedId(index)}
              />

              <span className="name">
                {addr.FullName || addr.fullName}
              </span>

              <span className="tag">HOME</span>

              <span className="phone">
                {addr.PhoneNumber || addr.phoneNumber}
              </span>

              <span className="edit">EDIT</span>
            </div>

            <div className="address-body">
              <p>
                {addr.Address || addr.address},{" "}
                {addr.CityName || addr.cityName},{" "}
                {addr.StateName || addr.stateName} -{" "}
                <b>{addr.ZipCode || addr.zipCode}</b>
              </p>
            </div>

            {selectedId === index && (
              <button
                className="deliver-btn"
                onClick={() => handleDeliverHere(addr)}
              >
                DELIVER HERE
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

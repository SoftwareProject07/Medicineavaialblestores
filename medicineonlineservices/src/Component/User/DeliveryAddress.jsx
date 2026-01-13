import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../User/CartContext";
import "../styles/DeliveryAddresss.css";

export default function DeliveryAddress() {
  const [openDashboard, setOpenDashboard] = useState(false);
  const { cartItems } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  /* ---------- CART COUNT ---------- */
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /* ---------- GET LOGGED IN USER ---------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* ---------- FETCH ADDRESSES ---------- */
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI/GetAllPatients_Customers"
        );

        const list =
          res.data?.data ||
          res.data?.addresses ||
          res.data ||
          [];

        // ✅ SHOW ONLY LOGGED IN USER ADDRESS
        if (user?.userId) {
          const filtered = list.filter(
            (a) => a.UserId === user.userId
          );
          setAddresses(filtered);
        } else {
          setAddresses([]);
        }
      } catch (err) {
        console.error("Address API Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleDeliverHere = (address) => {
    alert(
      `Delivering to ${address.FullName} - ${address.Address}`
    );
  };

  if (loading) return <p>Loading delivery addresses...</p>;

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
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
          <li>
            <button
              className="menu-title btn btn-success mb-2"
              onClick={() => setOpenDashboard(!openDashboard)}
            >
              Dashboard {openDashboard ? "▾" : "▸"}
            </button>

            {openDashboard && (
              <ul className="submenu">
                <li><Link to="/medication-tracker">Medication Tracker</Link></li>
                <li><Link to="/test-reports">Test Reports</Link></li>
                <li><Link to="/health-history">Health History</Link></li>
                <li><Link to="/monthly-progress">Monthly Progress</Link></li>
                <li><Link to="/prescriptions">Prescriptions</Link></li>
                <li><Link to="/history">History</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/medicinedisplay" className="btn btn-success mb-2">
              Medicines
            </Link>
          </li>

          {/* CART */}
          <li>
            <Link
              to="/carts"
              className="btn btn-success mb-2 d-flex justify-content-between"
            >
              <span>Medicine Cart</span>
              {totalQuantity > 0 && (
                <span className="cart-count">{totalQuantity}</span>
              )}
            </Link>
          </li>

          <li>
            <Link to="/deliveryaddress" className="btn btn-success mb-2">
              Delivery Address
            </Link>
          </li>

          <li>
            <Link to="/header">Logout</Link>
          </li>
        </ul>
      </div>

      {/* ================= MAIN CONTENT ================= */}
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

                <span className="name">{addr.FullName}</span>
                <span className="tag">HOME</span>
                <span className="phone">{addr.PhoneNumber}</span>
              </div>

              <div className="address-body">
                <p>
                  {addr.Address}, {addr.CityName},{" "}
                  {addr.StateName} - <b>{addr.ZipCode}</b>
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
    </div>
  );
}

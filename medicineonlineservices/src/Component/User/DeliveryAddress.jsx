import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DeliveryAddresss.css";

export default function DeliveryAddressList() {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

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

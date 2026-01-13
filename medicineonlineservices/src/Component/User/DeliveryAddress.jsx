import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CustomerDetailss.css";

export default function DeliveryAddress() {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= API CALL =================
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI/GetAllPatients_Customers"
      );

      console.log("API RESPONSE 👉", res.data);

      // 🔥 HANDLE ALL RESPONSE TYPES
      const list =
        res.data?.data ||
        res.data?.patients ||
        res.data?.result ||
        res.data ||
        [];

      if (Array.isArray(list)) {
        setCustomerList(list);
      } else {
        setCustomerList([]);
      }
    } catch (err) {
      console.error("API ERROR:", err);
      setError("Failed to load patient list (API error)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ================= UI =================
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="list-section">
      <h2>Patient List</h2>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Age</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
          </tr>
        </thead>

        <tbody>
          {customerList.length === 0 ? (
            <tr>
              <td colSpan="8" align="center">
                No Data Found
              </td>
            </tr>
          ) : (
            customerList.map((item, index) => (
              <tr key={index}>
                <td>{item.FullName || item.fullName || "-"}</td>
                <td>{item.Email || item.email || "-"}</td>
                <td>{item.PhoneNumber || item.phoneNumber || "-"}</td>
                <td>{item.Gender || item.gender || "-"}</td>
                <td>{item.Age || item.age || "-"}</td>
                <td>{item.CityName || item.cityName || "-"}</td>
                <td>{item.StateName || item.stateName || "-"}</td>
                <td>{item.ZipCode || item.zipCode || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

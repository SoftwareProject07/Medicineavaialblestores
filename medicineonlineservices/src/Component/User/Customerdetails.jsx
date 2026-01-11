import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/CustomerDetailss.css";

export default function Customerdetails() {
  const [fullname, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (!fullname || !gender || !phoneNumber || !address || !email || !age) {
      Swal.fire({
        icon: "warning",
        title: "All fields required",
        text: "Please fill all details",
      });
      return;
    }

    const data = {
      FullName: fullname,
      Gender: gender,
      PhoneNumber: phoneNumber,
      Address: address,
      Email: email,
      Age: age,
      CreatedOn: new Date().toISOString(),
    };

    try {
      await axios.post(
        "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI/AddPatient_Customer",
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Patient details added successfully",
      });

      // RESET FORM
      setFullName("");
      setGender("");
      setPhoneNumber("");
      setAddress("");
      setEmail("");
      setAge("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
      console.error(error);
    }
  };

  return (
    <div className="form-wrapper">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Patient Details</h2>

        <div className="form-group">
          <label>Patient Name</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
        </div>

        <div className="btn-center">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

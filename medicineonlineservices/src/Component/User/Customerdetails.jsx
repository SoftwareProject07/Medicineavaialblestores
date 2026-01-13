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
  const[cityname,setCityname]=useState("");
  const[statename,setStatename]=useState("");
  const[zipcode,setzipcode]=useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (!fullname || !gender || !phoneNumber || !address || !email || !age || !cityname || !statename || !zipcode) {
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
      CityName:cityname,
      StateName:statename,
      ZipCode:zipcode,
      CreatedOn: new Date().toISOString(),
    };

    try {
      await axios.post(
        "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI/AddPatient_Customer",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
 if (response.data?.isSuccess) {
        Swal.fire("Success", "Patient details Successful", "success")
          .then(() => navigate("/deliveryaddress"));
      } else {
        Swal.fire("Error", response.data?.message || "Failed", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please try again later", "error");
    }
  };
      // Swal.fire({
      //   icon: "success",
      //   title: "Success",
      //   text: "Patient details added successfully",
      // });

      // RESET FORM
  //     setFullName("");
  //     setGender("");
  //     setPhoneNumber("");
  //     setAddress("");
  //     setEmail("");
  //     setAge("");
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Something went wrong",
  //     });
  //     console.error(error);
  //   }
  // };

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
            maxLength={10}
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
          <label>ZIP CODE </label>
          <input
            type="text"
            value={zipcode}
            onChange={(e) => setzipcode(e.target.value)}
            placeholder="Enter Pincode"
          />
        </div>
         <div className="form-group">
          <label>City Name</label>
          <input
            type="text"
            value={cityname}
            onChange={(e) => setCityname(e.target.value)}
            placeholder="Enter CityName"
          />
        </div>
         <div className="form-group">
          <label>State Name</label>
          <input
            type="text"
            value={statename}
            onChange={(e) => setStatename(e.target.value)}
            placeholder="Enter StateName"
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

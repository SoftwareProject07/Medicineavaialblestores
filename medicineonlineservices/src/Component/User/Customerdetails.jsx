import React, {useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Patient details form
export default function CustomerDetails() {
  const [fullname, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

    const [createon,setCreateOn] = useState(null);
  
   
  // const handleChange = (e) => {
  //   setPatient({ ...patient, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async () => {
  const data = {
    FullNmae: fullname,
    Gender: gender,
    PhoneNumber: phoneNumber,
    Address: address,
    Email: email,
   Age:age,
    CreatedOn: new Date().toISOString(), // ✅ VERY IMPORTANT
  };

try {
    const response = await axios.post(
       "https://ecommerencesite-api.onrender.com/api/Patient_CustomerAPI/AddPatient_Customer",
     // "http://localhost:5256/api/Patient_CustomerAPI/AddPatient_Customer",

      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);

    alert("Customer Details Successful");
    navigate("/customerdetails");
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    alert("Customer Details Failed");
  }
};


  return (
    <>
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
        <h2>Patient Details Form</h2>

        <label>Patient Name:</label><br></br>
        <input
          type="text"
          name="fullname"
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
  <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
          <label>Contact:</label>
        <input
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

           <label>Gender:</label><br></br>
        <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)} >
          <option value="Gender">=====Select Gender=====</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
<br></br>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

     
       
<br></br>
        <label>Address:</label><br></br>
        <textarea
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
  <input type="hidden"  value={createon} onChange={(e)=>setCreateOn(e.target.value)}  />
<br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
}

import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

//const API_URL = "http://localhost:5256";

export default function Registeration() {
  const navigate = useNavigate();

  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
 // const [confirmpassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSave = async () => {
    // if (password !== confirmpassword) {
    //   Swal.fire("Error", "Password not matched", "error");
    //   return;
    // }

  //    if (!firstname || !lastname || !password || !email || !mobile) {
  //   Swal.fire("Warning", "Please fill all required fields", "warning");
  //   return;
  // }
    // ✅ MUST USE FormData
    const formData = new FormData();
    formData.append("FirstName", firstname);
    formData.append("MiddleName", middlename || "");
    formData.append("LastName", lastname);
    formData.append("Password", password);
    //formData.append("ConfirmPassword", confirmpassword);
    formData.append("Email", email);
    formData.append("MobileNumber", mobile);
    formData.append("Fund", 0);
    formData.append("Type", "User");
    formData.append("CreateOn", new Date().toISOString());

    if (photo) {
      formData.append("Photo", photo); // 🔥 FILE
    }

    try {
      const response = await axios.post(
      //  "http://localhost:5256/api/USERMEDICINE/CREATERegisterUser",
        "https://ecommerencesite-api.onrender.com/api/USERMEDICINE/CREATERegisterUser",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.isSuccess) {
        Swal.fire("Success", "Registration Successful", "success")
          .then(() => navigate("/login"));
      } else {
        Swal.fire("Error", response.data?.message || "Failed", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please try again later", "error");
    }
  };

  return (
    <Fragment>
      <div className="container mt-5">
        <h3 className="text-center mb-4">Create an account</h3>

        <input className="form-control mb-2" placeholder="First Name"
          value={firstname} onChange={(e) => setFirstName(e.target.value)} />

        <input className="form-control mb-2" placeholder="Middle Name"
          value={middlename} onChange={(e) => setMiddleName(e.target.value)} />

        <input className="form-control mb-2" placeholder="Last Name"
          value={lastname} onChange={(e) => setLastName(e.target.value)} />

        <input type="password" className="form-control mb-2" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

   

        <input type="email" className="form-control mb-2" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input className="form-control mb-2" placeholder="Mobile"
          value={mobile} maxLength={10}
          onChange={(e) => setMobile(e.target.value)} />

        <input type="file" className="form-control mb-3"
          onChange={(e) => setPhoto(e.target.files[0])} />

        <button className="btn btn-success w-100" onClick={handleSave}>
          Register
        </button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </Fragment>
  );
}

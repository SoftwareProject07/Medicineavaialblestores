import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function Registration() {
  const navigate = useNavigate();

  // States
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = async () => {
    if (!firstname || !lastname || !password || !email || !mobile) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("FirstName", firstname);
    formData.append("MiddleName", middlename || "");
    formData.append("LastName", lastname);
    formData.append("Password", password);
    formData.append("Email", email);
    formData.append("MobileNumber", mobile);
    formData.append("Fund", 0);
    formData.append("Type", "User");
    formData.append("CreateOn", new Date().toISOString());

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/USERMEDICINE/CREATERegisterUser",
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

  const handleReset = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setPassword("");
    setEmail("");
    setMobile("");
  };

  return (
    <section className="h-100 bg-dark">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card card-registration my-4">
              <div className="row g-0">
                {/* Image Section */}
                <div className="col-xl-6 d-none d-xl-block">
                  <img 
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                    alt="Registration" 
                    className="img-fluid"
                    style={{ borderTopLeftRadius: ".25rem", borderBottomLeftRadius: ".25rem" }} 
                  />
                </div>

                {/* Form Section */}
                <div className="col-xl-6">
                  <div className="card-body p-md-5 text-black">
                    <h3 className="mb-5 text-uppercase"> Admin Registration Form</h3>

                    {/* Name Fields Row */}
                    <div className="row">
                      <div className="col-md-4 mb-4">
                        <input type="text" className="form-control form-control-lg" placeholder="First Name"
                          value={firstname} onChange={(e) => setFirstName(e.target.value)} autoComplete="off" required />
                      </div>
                      <div className="col-md-4 mb-4">
                        <input type="text" className="form-control form-control-lg" placeholder="Middle Name"
                          value={middlename} onChange={(e) => setMiddleName(e.target.value)} autoComplete="off"/>
                      </div>
                      <div className="col-md-4 mb-4">
                        <input type="text" className="form-control form-control-lg" placeholder="Last Name"
                          value={lastname} onChange={(e) => setLastName(e.target.value)} autoComplete="off" required />
                      </div>
                    </div>

                    {/* Password Field with Show/Hide */}
                    <div className="mb-4">
                      <div className="input-group">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="form-control form-control-lg" 
                          placeholder="Password"
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}  autoComplete="off" required
                        />
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="form-outline mb-4">
                      <input type="email" className="form-control form-control-lg" placeholder="Email ID"
                        value={email} onChange={(e) => setEmail(e.target.value)}  autoComplete="off" required />
                    </div>

                    {/* Mobile Field */}
                    <div className="form-outline mb-4">
                      <input type="text" className="form-control form-control-lg" placeholder="Mobile Number"
                        value={mobile} maxLength={10} onChange={(e) => setMobile(e.target.value)}   autoComplete="off" required/>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end pt-3">
                      <button type="button" className="btn btn-light btn-lg" onClick={handleReset}>Reset all</button>
                      <button type="button" className="btn btn-warning btn-lg ms-2" onClick={handleSave}>Submit form</button>
                    </div>

                    <p className="text-center mt-4">
                      Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
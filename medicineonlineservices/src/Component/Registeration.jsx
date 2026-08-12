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
    <section className="h-100 bg-dark py-5" style={{ minHeight: "100vh", backgroundColor: "#121212" }}>
      <div className="container py-4 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12">
            <div className="card card-registration my-4 shadow-lg border-0 overflow-hidden" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                {/* Image Section with Custom Background Image */}
                <div className="col-xl-6 d-none d-xl-block position-relative">
                  <div 
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "100%",
                      minHeight: "650px",
                      width: "100%"
                    }}
                  />
                  <div 
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.3))"
                    }}
                  />
                </div>

                {/* Form Section */}
                <div className="col-xl-6 bg-white">
                  <div className="card-body p-md-5 text-black">
                    <h3 className="mb-2 text-uppercase font-weight-bold" style={{ fontWeight: 700, letterSpacing: "0.5px" }}>Create Your Account</h3>
                    <p className="text-muted mb-4">JOIN OUR PLATFORM</p>

                    {/* Name Fields Row */}
                    <div className="row">
                      <div className="col-md-4 mb-4">
                        <div className="form-outline">
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder="First Name"
                            value={firstname} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            autoComplete="off" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mb-4">
                        <div className="form-outline">
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder="Middle Name"
                            value={middlename} 
                            onChange={(e) => setMiddleName(e.target.value)} 
                            autoComplete="off"
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mb-4">
                        <div className="form-outline">
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder="Last Name"
                            value={lastname} 
                            onChange={(e) => setLastName(e.target.value)} 
                            autoComplete="off" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="form-outline mb-4">
                      <input 
                        type="email" 
                        className="form-control form-control-lg" 
                        placeholder="Email Address"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        autoComplete="off" 
                        required 
                      />
                    </div>

                    {/* Mobile Field */}
                    <div className="form-outline mb-4">
                      <input 
                        type="text" 
                        className="form-control form-control-lg" 
                        placeholder="Phone Number"
                        value={mobile} 
                        maxLength={10} 
                        onChange={(e) => setMobile(e.target.value)} 
                        autoComplete="off" 
                        required
                      />
                    </div>

                    {/* Password Field with Show/Hide */}
                    <div className="mb-4">
                      <div className="input-group">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="form-control form-control-lg" 
                          placeholder="Password"
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          autoComplete="off" 
                          required
                        />
                        <button 
                          className="btn btn-outline-secondary px-4" 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end pt-3">
                      <button 
                        type="button" 
                        className="btn btn-light btn-lg px-4 border" 
                        onClick={handleReset}
                      >
                        Reset All
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-warning btn-lg ms-2 px-4 text-dark font-weight-bold" 
                        style={{ backgroundColor: "#ffc107", fontWeight: 600 }}
                        onClick={handleSave}
                      >
                        Submit Account
                      </button>
                    </div>

                    <p className="text-center mt-4 text-muted">
                      Already have an account? <Link to="/login" className="text-decoration-none font-weight-bold" style={{ color: "#0d6efd" }}>Log in here</Link>
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
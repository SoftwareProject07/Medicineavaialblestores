import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Adminlogin.css";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const navigate = useNavigate();

  // States for Admin Login Form (Left Side)
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [adminTypes, setAdminTypes] = useState([]); 
  const [selectedType, setSelectedType] = useState(""); 
  const [captchaInput, setCaptchaInput] = useState(""); 
  const [generatedCaptcha, setGeneratedCaptcha] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);

  // States for Doctor Login Form (Right Side)
  const [docUsername, setDocUsername] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docRemark, setDocRemark] = useState(false); 

  // States for Delivery Order Person Login Form (Right Side)
  const [deliveryUsername, setDeliveryUsername] = useState("");
  const [deliveryPassword, setDeliveryPassword] = useState("");
  const [deliveryRemark, setDeliveryRemark] = useState(false); 

  useEffect(() => {
    fetchAdminTypes();
    generateCaptchaCode();
  }, []);

  const fetchAdminTypes = async () => {
    try {
      const response = await axios.get(
        "https://ecommerencesite.onrender.com/api/AdminApi/AllTypeList",
      );
      setAdminTypes(response.data);
    } catch (error) {
      console.error("Error fetching admin types:", error);
    }
  };

  const generateCaptchaCode = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCaptcha(captcha);
  };

  // Forgot Password SweetAlert Function
  const handleForgotPassword = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Reset Password",
      html: `
        <input type="text" id="swal-input-email" class="swal2-input" placeholder="Enter Email or Mobile">
        <input type="password" id="swal-input-password" class="swal2-input" placeholder="Enter New Password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Password",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const email = document.getElementById("swal-input-email").value;
        const newPassword = document.getElementById("swal-input-password").value;
        if (!email || !newPassword) {
          Swal.showValidationMessage("Please enter both Email/Mobile and New Password");
        }
        return { email: email, newPassword: newPassword };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { email } = result.value;
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: `Password for ${email} has been successfully reset!`,
        });
      }
    });
  };

  // Admin Login Handler
  const handleSave = async (e) => {
    e.preventDefault();

    const lowerType = selectedType.trim().toLowerCase();
    if (lowerType.includes("doctor")) {
      Swal.fire("Access Denied", "Please use the Doctor Login form on the right side.", "warning");
      return;
    }
    if (lowerType.includes("delivery")) {
      Swal.fire("Access Denied", "Please use the Delivery Order Person Login form on the right side.", "warning");
      return;
    }

    if (!emailOrMobile.trim() || !password.trim() || !selectedType.trim()) {
      Swal.fire("Warning", "Please enter Email/Mobile, Password, and select Role Type", "warning");
      return;
    }

    if (captchaInput !== generatedCaptcha) {
      Swal.fire("Error", "Invalid Captcha Code. Please try again.", "error");
      generateCaptchaCode();
      return;
    }

    const data = {
      Email: emailOrMobile,
      Password: password,
      ROLE: selectedType,
      Captcha: captchaInput
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/AdminApi/LOGINAdmin", 
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (
        response.data?.isSuccess ||
        response.data?.success ||
        response.data?.status
      ) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        Swal.fire({
          icon: "success",
          title: "Admin Login Successful",
          text: "Welcome to DashboardPanel",
        }).then(() => navigate("/deshboardpanel"));
      } else {
        Swal.fire(
          "Admin Login Failed",
          response.data?.responseMessage ||
            response.data?.message ||
            "Invalid credentials or incorrect Role Type selected.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please check your credentials and selected Role Type.", "error");
    }
  };

  // Secure Doctor Login Handler
  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    if (!docUsername || !docPassword) {
      Swal.fire("Warning", "Please enter Email/Mobile and Password for Doctor Login", "warning");
      return;
    }
    
    const doctorData = {
      Email: docUsername,
      Password: docPassword,
      ROLE: "Doctors Login",
      Remark: docRemark
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/AdminApi/LOGINAdmin", 
        /// "http://localhost:5256/api/AdminApi/LOGINAdmin",  
        doctorData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (
        response.data?.isSuccess ||
        response.data?.success ||
        response.data?.status
      ) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        Swal.fire({
          icon: "success",
          title: "Doctor Login Successful",
          text: "Welcome Doctor!",
        }).then(() => navigate("/doctorpanels"));
      } else {
        Swal.fire(
          "Doctor Login Failed",
          response.data?.responseMessage ||
            response.data?.message ||
            "Invalid Doctor credentials!",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please check your Doctor credentials.", "error");
    }
  };

  // Secure Delivery Order Person Login Handler
  const handleDeliveryLogin = async (e) => {
    e.preventDefault();
    if (!deliveryUsername || !deliveryPassword) {
      Swal.fire("Warning", "Please enter Email/Mobile and Password for Delivery Login", "warning");
      return;
    }

    const deliveryData = {
      Email: deliveryUsername,
      Password: deliveryPassword,
      ROLE: "DeliveryOrderPerson Login",
      Remark: deliveryRemark
    };

    try {
      const response = await axios.post(
        "https://ecommerencesite.onrender.com/api/AdminApi/LOGINAdmin",  
     // "http://localhost:5256/api/AdminApi/LOGINAdmin",  
        deliveryData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (
        response.data?.isSuccess ||
        response.data?.success ||
        response.data?.status
      ) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        Swal.fire({
          icon: "success",
          title: "Delivery Login Successful",
          text: "Welcome Delivery Partner!",
        }).then(() => navigate("/deliveryorderpersonpanel"));
      } else {
        Swal.fire(
          "Delivery Login Failed",
          response.data?.responseMessage ||
            response.data?.message ||
            "Invalid Delivery credentials!",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Please check your Delivery credentials.", "error");
    }
  };

  const trimmedType = selectedType.trim().toLowerCase();
  const isDoctorSelected = trimmedType.includes("doctor");
  const isDeliverySelected = trimmedType.includes("delivery");

  return (
    <section className="vh-100" style={{ height: "100vh", overflow: "hidden" }}>
      <div className="container-fluid h-100">
        <div className="row h-100 m-0">

          {/* LEFT SECTION (Admin Login Form) */}
          <div className="col-sm-6 text-black d-flex flex-column justify-content-between py-3 overflow-auto" style={{ height: "100vh" }}>
            
            <div className="px-5 ms-xl-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <i
                  className="fas fa-crow fa-2x me-3 pt-3 mt-xl-2"
                  style={{ color: "#709085" }}
                ></i>
                <span className="h1 fw-bold mb-0 pt-3">Admin Login</span>
              </div>
            </div>

            <div className="px-5 ms-xl-4 my-auto">
              <form style={{ width: "23rem" }} onSubmit={handleSave}>

                {/* Email / Mobile Field */}
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Email address or Mobile Number"
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                  />
                </div>

                {/* Password Field */}
                <div style={{ position: "relative", width: "100%", marginBottom: "1.5rem" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", paddingRight: "40px" }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                {/* ADMIN TYPE DROPDOWN */}
                <div className="form-outline mb-4">
                  <select
                    className="form-control form-control-lg"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">====Select Login Role Type ===</option>
                    {adminTypes.map((item, index) => {
                      const typeVal = typeof item === 'string' ? item : item.type || item.name || '';
                      return (
                        <option key={index} value={typeVal}>
                          {typeVal}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* CAPTCHA SECTION */}
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div 
                      style={{ 
                        background: "#e9ecef", 
                        padding: "8px 15px", 
                        fontWeight: "bold", 
                        letterSpacing: "3px", 
                        fontSize: "18px",
                        userSelect: "none",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        textAlign: "center",
                        flex: 1
                      }}
                    >
                      {generatedCaptcha}
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={generateCaptchaCode}
                      title="Refresh Captcha"
                    >
                      🔄
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter Captcha Code"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-info btn-lg btn-block w-100 text-white"
                    type="submit"
                  >
                    Admin Login
                  </button>
                </div>

              </form>
            </div>
            
            <div></div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-sm-6 px-0 d-none d-sm-flex align-items-center justify-content-center" style={{ position: "relative", overflow: "hidden" }}>
            
            {/* CLOSE BUTTON */}
            <div 
              onClick={() => navigate("/header")}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#333",
                padding: "5px 10px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "38px",
                height: "38px",
                zIndex: 99,
                transition: "0.2s"
              }}
              title="Close / Go to Header"
            >
              ✕
            </div>

            {isDoctorSelected ? (
              <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center">
                <img
                  src="/uploadimage/Doctorimagelogins.jpg"
                  alt="Doctor Login Visual"
                  className="w-100 h-100"
                  style={{ position: "fixed", right: 0 }}
                />
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.65)", zIndex: 2 }}></div>

                <div style={{ position: "relative", zIndex: 3, width: "80%", maxWidth: "400px", padding: "30px", background: "#ffffff", boxShadow: "0px 0px 20px rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                  <form onSubmit={handleDoctorLogin}>
                    <h4 className="fw-bold mb-1 text-center">Doctors Login</h4>
                    <p className="text-muted small mb-4 text-center">Please enter Email or Mobile & Password</p>

                    <div className="mb-3">
                      <label className="form-label text-muted small">Email or Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email or Mobile Number"
                        value={docUsername}
                        onChange={(e) => setDocUsername(e.target.value)}
                      />
                    </div>

                  

                    <div className="mb-3">
                      <label className="form-label text-muted small">Password</label>
                      <input
                      //  type="password"
                                             type={showPassword ? "text" : "password"}

                        className="form-control"
                        placeholder="Your Password"
                        value={docPassword}
                        onChange={(e) => setDocPassword(e.target.value)}
                                            style={{ width: "100%", paddingRight: "40px" }}

                      />

                       <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="docRemarkCheck"
                        checked={docRemark}
                        onChange={(e) => setDocRemark(e.target.checked)}
                      />
                      <label className="form-check-label text-muted small" htmlFor="docRemarkCheck">
                        Agree / Verify Remark
                      </label>
                    </div>

                    <div className="mb-3 text-end">
                      <a href="#/forgot-password" onClick={handleForgotPassword} className="small text-muted">
                        Forgot password?
                      </a>
                    </div>

                    <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#e67e22", border: "none", padding: "10px" }}>
                      Doctor LogIn
                    </button>
                  </form>
                </div>
              </div>
            ) : isDeliverySelected ? (
              <div className="w-100 h-100 position-relative d-flex align-items-center justify-content-center">
                <img
                  src="/uploadimage/MEDICINEDELIVERY.png"
                  alt="Delivery Login Visual"
                  className="w-100 h-100"
                  style={{ position: "fixed", right: 0 }}
                />
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.65)", zIndex: 2 }}></div>

                <div style={{ position: "relative", zIndex: 3, width: "80%", maxWidth: "400px", padding: "30px", background: "#ffffff", boxShadow: "0px 0px 20px rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                  <form onSubmit={handleDeliveryLogin}>
                    <h4 className="fw-bold mb-1 text-center">Delivery Login</h4>
                    <p className="text-muted small mb-4 text-center">Please enter Email or Mobile & Password</p>

                    <div className="mb-3">
                      <label className="form-label text-muted small">Email or Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email or Mobile Number"
                        value={deliveryUsername}
                        onChange={(e) => setDeliveryUsername(e.target.value)}
                      />
                    </div>


                    <div className="mb-3">
                      <label className="form-label text-muted small">Password</label>
                      <input
                      //  type="password"
                        type={showPassword ? "text" : "password"}

                        className="form-control"
                        placeholder="Your Password"
                        value={deliveryPassword}
                        onChange={(e) => setDeliveryPassword(e.target.value)}
                                            style={{ width: "100%", paddingRight: "40px" }}

                                            

                      />
                      
                       <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="deliveryRemarkCheck"
                        checked={deliveryRemark}
                        onChange={(e) => setDeliveryRemark(e.target.checked)}
                      />
                      <label className="form-check-label text-muted small" htmlFor="deliveryRemarkCheck">
                        Agree / Verify Remark
                      </label>
                    </div>

                    <div className="mb-3 text-end">
                      <a href="#/forgot-password" onClick={handleForgotPassword} className="small text-muted">
                        Forgot password?
                      </a>
                    </div>

                    <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#27ae60", border: "none", padding: "10px" }}>
                      Delivery LogIn
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="w-100 h-100 position-relative">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
                  alt="Login Visual"
                  className="w-100 h-100"
                  style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, objectFit: "cover" }}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}